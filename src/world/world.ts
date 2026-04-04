import { event } from '../config/events.js';

import ShieldEffect from '../effects/shield-effect.js';

import Resurrection from '../entities/resurrection.js';
import Tank from '../entities/tank.js';
import EnemyTank from '../entities/enemy-tank.js';
import Base from '../entities/base.js';
import Projectile from '../entities/projectile.js';
import Explosive from '../entities/explosive.js';
import PowerUp from '../entities/power-up.js';

import BrickWall from '../map/brick-wall.js';
import SteelWall from '../map/steel-wall.js';

import {
  computeNextBounds,
  isOutOfBounds,
  overlapsRect,
  overlapsDirectional,
  computeTileRange,
} from './collision.js';

import { generateTerrain } from '../core/utilities.js';
import type { IMapTile } from '../core/utilities.js';
import type { IGameContext } from '../core/game-context.type.js';
import { ObjectPool } from '../core/object-pool.js';

import {
  WorldOption,
  TankType,
  PowerUpType,
  Player1TankOption,
  Player2TankOption,
  EnemyTankToOption,
  ShieldEffectOptions,
  BONUS_TANK_INDICES,
  PowerUpOption,
  ROUND_END_DELAY,
  CLOCK_DURATION,
  SHOVEL_DURATION,
  HELMET_POWERUP_DURATION,
  FORTRESS_TILES,
} from '../config/constants.js';
import type { EnemyTypeValue, PowerUpTypeValue } from '../config/constants.type.js';
import type { IHittable } from '../map/map.type.js';
import type { IHitObject, PlayerIndex } from '../entities/entities.type.js';
import type { IWorld, ICollidable, IWorldObject } from './world.type.js';

const TANKS_ON_MAP = 4;

type MoveState = 'standby' | 'move';

export class World implements IWorld {
  game: IGameContext;
  stage: (IMapTile | null)[][];
  projectiles: Projectile[];
  explosives: Explosive[];
  enemyTanks: Tank[];
  resurrections: Resurrection[];
  enemyArray: EnemyTypeValue[];
  effects: ShieldEffect[];
  currentMoveState: MoveState;
  currentMoveState2: MoveState;
  player1Tank: Tank | null;
  player2Tank: Tank | null;
  minWorldX: number;
  maxWorldX: number;
  minWorldY: number;
  maxWorldY: number;
  collisionTiles: [number, number][];
  enemyTanksOnMap: number;
  tanksTotal: number;
  enemyFriendlyFire: boolean;
  base!: Base;
  activePowerUp: PowerUp | null;
  frozenTimer: number;

  private _spawnedEnemyCount = 0;
  private _shovelTimer = 0;
  private _grenadeActive = false;
  private _endTimer = 0;
  private _endTargetState: string | null = null;
  private readonly _projectilePool = new ObjectPool(() => new Projectile());
  private readonly _explosivePool = new ObjectPool(() => new Explosive());

  constructor(game: IGameContext) {
    this.game = game;
    this.stage = [];
    this.projectiles = [];
    this.explosives = [];
    this.enemyTanks = [];
    this.resurrections = [];
    this.enemyArray = [];
    this.effects = [];

    this.currentMoveState = 'standby';
    this.currentMoveState2 = 'standby';
    this.player1Tank = null;
    this.player2Tank = null;

    this.minWorldX = 0;
    this.maxWorldX = 0;
    this.minWorldY = 0;
    this.maxWorldY = 0;

    this.collisionTiles = [];
    this.enemyTanksOnMap = 0;
    this.tanksTotal = 0;
    this.enemyFriendlyFire = false;
    this.activePowerUp = null;
    this.frozenTimer = 0;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    this._addProjectile = this._addProjectile.bind(this);
    this._removeProjectile = this._removeProjectile.bind(this);
    this._removeExplosive = this._removeExplosive.bind(this);
    this._removeWall = this._removeWall.bind(this);
    this._removeResurrection = this._removeResurrection.bind(this);
    this._removeTank = this._removeTank.bind(this);
    this._destroyBase = this._destroyBase.bind(this);
    this._removeEffect = this._removeEffect.bind(this);
    this._recordKill = this._recordKill.bind(this);
  }

  start(): void {
    __DEBUG__ && console.log(`Starting world for level ${this.game.currentLevel}`);

    const stage = this.game.currentStage!;

    this.stage = generateTerrain(stage.terrain, this._removeWall);

    this.enemyArray = [...stage.enemies];
    this.enemyTanksOnMap = 0;
    this.tanksTotal = stage.enemies.length;
    this._spawnedEnemyCount = 0;
    this.activePowerUp = null;
    this.frozenTimer = 0;
    this._shovelTimer = 0;

    this.maxWorldX = this.stage.length * WorldOption.TILE_SIZE;
    this.maxWorldY = this.stage[0].length * WorldOption.TILE_SIZE;

    this.enemyFriendlyFire = WorldOption.ENEMY_FRIENDLY_FIRE;

    this._resurrectPlayer1();

    if (this.game.playerCount === 2) {
      this._resurrectPlayer2();
    }

    this.base = new Base({ world: this });
    this.base.on(event.object.DESTROYED, this._destroyBase);

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  update(deltaTime: number): void {
    if (this._endTargetState) {
      this._endTimer -= deltaTime;
      if (this._endTimer <= 0) {
        this.game.events.emit(event.CHANGE_STATE, this._endTargetState);
        return;
      }
    }

    if (!this._endTargetState) {
      if (this.enemyTanksOnMap <= 0 && this.enemyArray.length === 0) {
        __DEBUG__ && console.log('level complete - victory');
        this._scheduleEnd(event.state.RESULTS);
      } else if (this.base.destroyed) {
        __DEBUG__ && console.log('level complete - base destroyed - game over');
        this._scheduleEnd(event.state.GAME_OVER);
      } else if (this.player1Tank === null && this.game.player1.lives === 0) {
        if (
          this.game.playerCount === 1 ||
          (this.player2Tank === null && this.game.player2.lives === 0)
        ) {
          __DEBUG__ && console.log('level complete - all players dead - game over');
          this._scheduleEnd(event.state.GAME_OVER);
        }
      }
    }

    if (this.enemyTanksOnMap < TANKS_ON_MAP && this.enemyArray.length) {
      const enemyType = this.enemyArray.shift()!;
      const isFlashing = BONUS_TANK_INDICES.has(this._spawnedEnemyCount);
      this._spawnedEnemyCount++;

      const enemyResurrection = new Resurrection({
        world: this,
        tankType: TankType.ENEMY,
        options: EnemyTankToOption[enemyType],
        x: Math.floor(Math.random() * 3) * 6 * WorldOption.UNIT_SIZE,
        y: 0,
        isFlashing,
      });
      enemyResurrection.on(event.object.DESTROYED, this._removeResurrection);
      this.resurrections.push(enemyResurrection);
      this.enemyTanksOnMap++;
    }

    if (this.frozenTimer > 0) {
      this.frozenTimer -= deltaTime;
    }

    if (this._shovelTimer > 0) {
      this._shovelTimer -= deltaTime;
      if (this._shovelTimer <= 0) {
        this._fortifyBase(false);
      }
    }

    if (this.activePowerUp) {
      this.activePowerUp.update(deltaTime);
      this._checkPowerUpCollection();
    }

    const activeKeys = this.game.input.activeKeys();
    this.objects.forEach(gameObject => {
      if (this.frozenTimer > 0 && gameObject instanceof EnemyTank) return;
      gameObject?.update(deltaTime, activeKeys);
    });
  }

  handleKeyDown(evt: KeyboardEvent): void {
    let moving = false;

    if (this.player1Tank) {
      switch (evt.code) {
        case 'KeyW':
          this.player1Tank.moveUp();
          moving = true;
          break;
        case 'KeyS':
          this.player1Tank.moveDown();
          moving = true;
          break;
        case 'KeyA':
          this.player1Tank.moveLeft();
          moving = true;
          break;
        case 'KeyD':
          this.player1Tank.moveRight();
          moving = true;
          break;
        case 'Space':
          this.player1Tank.fire();
          break;
      }
    }

    if (moving && this.currentMoveState !== 'move' && this.player1Tank?.state === 'active') {
      this.currentMoveState = 'move';
      this.game.events.emit(event.sound.MOVE_START);
    }

    let moving2 = false;

    if (this.player2Tank) {
      switch (evt.code) {
        case 'ArrowUp':
          this.player2Tank.moveUp();
          moving2 = true;
          break;
        case 'ArrowDown':
          this.player2Tank.moveDown();
          moving2 = true;
          break;
        case 'ArrowLeft':
          this.player2Tank.moveLeft();
          moving2 = true;
          break;
        case 'ArrowRight':
          this.player2Tank.moveRight();
          moving2 = true;
          break;
        case 'Enter':
          this.player2Tank.fire();
          break;
      }
    }

    if (moving2 && this.currentMoveState2 !== 'move' && this.player2Tank?.state === 'active') {
      this.currentMoveState2 = 'move';
      this.game.events.emit(event.sound.MOVE_START);
    }

    if (__DEBUG__ && this.player1Tank) {
      const debugKeys: Record<string, PowerUpTypeValue> = {
        Digit1: PowerUpType.HELMET as PowerUpTypeValue,
        Digit2: PowerUpType.CLOCK as PowerUpTypeValue,
        Digit3: PowerUpType.SHOVEL as PowerUpTypeValue,
        Digit4: PowerUpType.STAR as PowerUpTypeValue,
        Digit5: PowerUpType.GRENADE as PowerUpTypeValue,
        Digit6: PowerUpType.TANK as PowerUpTypeValue,
        Digit7: PowerUpType.PISTOL as PowerUpTypeValue,
      };
      const powerUp = debugKeys[evt.code];
      if (powerUp !== undefined) {
        this._collectPowerUp(this.player1Tank, powerUp);
      }
    }
  }

  handleKeyUp(evt: KeyboardEvent): void {
    if (this.player1Tank) {
      switch (evt.code) {
        case 'KeyW':
          this.player1Tank.stopUp();
          break;
        case 'KeyS':
          this.player1Tank.stopDown();
          break;
        case 'KeyA':
          this.player1Tank.stopLeft();
          break;
        case 'KeyD':
          this.player1Tank.stopRight();
          break;
      }
    }

    const moveKeys1 = ['KeyW', 'KeyS', 'KeyA', 'KeyD'];
    if (moveKeys1.includes(evt.code)) {
      const activeKeys = this.game.input.activeKeys();
      activeKeys.delete(evt.code);
      const stillMoving = moveKeys1.some(k => activeKeys.has(k));

      if (
        !stillMoving &&
        this.currentMoveState !== 'standby' &&
        this.player1Tank?.state === 'active'
      ) {
        this.currentMoveState = 'standby';
        this.game.events.emit(event.sound.MOVE_STOP);
      }
    }

    if (this.player2Tank) {
      switch (evt.code) {
        case 'ArrowUp':
          this.player2Tank.stopUp();
          break;
        case 'ArrowDown':
          this.player2Tank.stopDown();
          break;
        case 'ArrowLeft':
          this.player2Tank.stopLeft();
          break;
        case 'ArrowRight':
          this.player2Tank.stopRight();
          break;
      }
    }

    const moveKeys2 = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (moveKeys2.includes(evt.code)) {
      const activeKeys = this.game.input.activeKeys();
      activeKeys.delete(evt.code);
      const stillMoving = moveKeys2.some(k => activeKeys.has(k));

      if (
        !stillMoving &&
        this.currentMoveState2 !== 'standby' &&
        this.player2Tank?.state === 'active'
      ) {
        this.currentMoveState2 = 'standby';
        this.game.events.emit(event.sound.MOVE_STOP);
      }
    }
  }

  get objects(): IWorldObject[] {
    return [
      this.base,
      ...this.enemyTanks,
      ...this.projectiles,
      ...this.explosives,
      ...this.resurrections,
      ...this.effects,
    ];
  }

  private _resurrectPlayer1(): void {
    const resurrection = new Resurrection({
      world: this,
      tankType: TankType.PLAYER_1,
      options: Player1TankOption,
      x: Player1TankOption.START_X,
      y: Player1TankOption.START_Y,
    });
    resurrection.on(event.object.DESTROYED, this._removeResurrection);
    this.resurrections.push(resurrection);
  }

  private _resurrectPlayer2(): void {
    const resurrection = new Resurrection({
      world: this,
      tankType: TankType.PLAYER_2,
      options: Player2TankOption,
      x: Player2TankOption.START_X,
      y: Player2TankOption.START_Y,
    });
    resurrection.on(event.object.DESTROYED, this._removeResurrection);
    this.resurrections.push(resurrection);
  }

  private _addProjectile(tank: Tank): void {
    if (tank.hasProjectile) return;
    tank.hasProjectile = true;

    if (tank.tankType === TankType.PLAYER_1 || tank.tankType === TankType.PLAYER_2) {
      this.game.events.emit(event.sound.PLAYER_SHOT);
    }

    const projectile = this._projectilePool.acquire();
    projectile.init({ world: this, tank, direction: tank.direction });
    projectile.on(event.object.DESTROYED, this._removeProjectile);
    this.projectiles.push(projectile);
  }

  private _removeResurrection(resurrection: Resurrection): void {
    this.resurrections = this.resurrections.filter(r => r !== resurrection);

    let tank: Tank;

    if (
      resurrection.tankType === TankType.PLAYER_1 ||
      resurrection.tankType === TankType.PLAYER_2
    ) {
      tank = new Tank({
        world: this,
        type: resurrection.tankType,
        tankOptions: resurrection.tankOptions,
        x: resurrection.x,
        y: resurrection.y,
      });

      const savedStars =
        resurrection.tankType === TankType.PLAYER_1
          ? this.game.player1.stars
          : this.game.player2.stars;
      if (savedStars > 0) {
        tank.stars = savedStars;
        if (tank.stars >= 1) tank.projectileSpeed = 1.5;
        if (tank.stars >= 2) tank.maxProjectiles = 2;
        if (tank.stars >= 3) tank.power = 2;
      }

      const shield = new ShieldEffect({
        target: tank,
        effectOptions: ShieldEffectOptions,
      });
      shield.start();
      shield.on(event.object.DESTROYED, this._removeEffect);
      this.effects.push(shield);
    } else {
      tank = EnemyTank.createRandom({
        world: this,
        type: resurrection.tankType,
        tankOptions:
          resurrection.tankOptions as import('../entities/entities.type.js').IEnemyTankOptions,
        x: resurrection.x,
        y: resurrection.y,
        isFlashing: resurrection.isFlashing,
      });
    }

    tank.on(event.object.FIRE, this._addProjectile);
    tank.on(event.object.DESTROYED, this._removeTank);
    tank.on(event.stats.RECORD_KILL, this._recordKill);

    if (tank.tankType === TankType.PLAYER_1) {
      this.player1Tank = tank;
      this.game.events.emit(event.sound.PLAYER_SPAWN);
    }
    if (tank.tankType === TankType.PLAYER_2) {
      this.player2Tank = tank;
      this.game.events.emit(event.sound.PLAYER_SPAWN);
    }

    this.enemyTanks.push(tank);
  }

  private _removeEffect(effect: ShieldEffect): void {
    effect.end();
    this.effects = this.effects.filter(e => e !== effect);
  }

  private _removeTank(tank: Tank): void {
    this.enemyTanks = this.enemyTanks.filter(t => t !== tank);

    this.game.events.emit(event.sound.TANK_EXPLODE);

    const explosive = this._explosivePool.acquire();
    explosive.init({ world: this, tank });
    explosive.on(event.object.DESTROYED, this._removeExplosive);
    this.explosives.push(explosive);

    if (tank.tankType === TankType.ENEMY) {
      this.enemyTanksOnMap--;
      this.tanksTotal--;

      if (tank instanceof EnemyTank && tank.isFlashing && !this._grenadeActive) {
        this._spawnPowerUp();
      }
    }
  }

  private _recordKill(enemyType: EnemyTypeValue, player: PlayerIndex | undefined): void {
    if (player === undefined) return;
    this.game.stats.recordKill(player, enemyType);
  }

  private _removeProjectile(projectile: Projectile): void {
    projectile.tank.hasProjectile = false;
    this.projectiles = this.projectiles.filter(p => p !== projectile);

    const explosive = this._explosivePool.acquire();
    explosive.init({ world: this, projectile });
    explosive.on(event.object.DESTROYED, this._removeExplosive);
    this.explosives.push(explosive);

    projectile.clearListeners();
    this._projectilePool.release(projectile);
  }

  private _removeExplosive(explosive: Explosive): void {
    this.explosives = this.explosives.filter(e => e !== explosive);

    if (explosive.tank?.tankType === TankType.PLAYER_1) {
      this.game.events.emit(event.sound.PLAYER_DEATH);
      this.currentMoveState = 'standby';
      this.game.player1.stars = 0;
      if (this.game.player1.lives) {
        this.game.player1.lives -= 1;
        this._resurrectPlayer1();
      } else {
        this.player1Tank = null;
      }
    }
    if (explosive.tank?.tankType === TankType.PLAYER_2) {
      this.game.events.emit(event.sound.PLAYER_DEATH);
      this.currentMoveState2 = 'standby';
      this.game.player2.stars = 0;
      if (this.game.player2.lives) {
        this.game.player2.lives -= 1;
        this._resurrectPlayer2();
      } else {
        this.player2Tank = null;
      }
    }

    explosive.destroy();
    explosive.clearListeners();
    this._explosivePool.release(explosive);
  }

  private _removeWall(wall: IMapTile): void {
    this.stage = this.stage.map(row => row.map(tile => (tile === wall ? null : tile)));
  }

  private _destroyBase(destroyedBase: Base): void {
    this.game.events.emit(event.sound.BASE_EXPLODE);
    const explosive = this._explosivePool.acquire();
    explosive.init({ world: this, base: destroyedBase });
    explosive.on(event.object.DESTROYED, this._removeExplosive);
    this.explosives.push(explosive);
  }

  // ── Power-up system ──────────────────────────────────────

  private _checkPowerUpCollection(): void {
    if (!this.activePowerUp) return;

    const pu = this.activePowerUp;
    const players = [this.player1Tank, this.player2Tank];

    for (const tank of players) {
      if (!tank) continue;
      if (
        tank.x < pu.x + pu.width &&
        tank.x + tank.width > pu.x &&
        tank.y < pu.y + pu.height &&
        tank.y + tank.height > pu.y
      ) {
        this._collectPowerUp(tank, pu.powerUpType);
        this.activePowerUp = null;
        return;
      }
    }
  }

  private _spawnPowerUp(): void {
    const type = Math.floor(Math.random() * PowerUpOption.TOTAL_TYPES) as PowerUpTypeValue;
    const half = WorldOption.UNIT_SIZE >> 1;
    const maxCell = WorldOption.STAGE_SIZE - 1;
    const cellX = Math.min(Math.floor(Math.random() * WorldOption.STAGE_SIZE), maxCell);
    const cellY = Math.min(Math.floor(Math.random() * WorldOption.STAGE_SIZE), maxCell);
    const x = cellX * WorldOption.UNIT_SIZE + half;
    const y = cellY * WorldOption.UNIT_SIZE + half;

    this.activePowerUp = new PowerUp({ x, y, type });
    this.game.events.emit(event.sound.BONUS_SPAWN);
  }

  private _collectPowerUp(tank: Tank, type: PowerUpTypeValue): void {
    this.game.events.emit(event.sound.BONUS_PICK);

    switch (type) {
      case PowerUpType.STAR:
        this._applyStarEffect(tank);
        break;
      case PowerUpType.HELMET:
        this._applyHelmetEffect(tank);
        break;
      case PowerUpType.CLOCK:
        this._applyClockEffect();
        break;
      case PowerUpType.GRENADE:
        this._applyGrenadeEffect();
        break;
      case PowerUpType.SHOVEL:
        this._applyShovelEffect();
        break;
      case PowerUpType.TANK:
        this._applyTankEffect(tank);
        break;
      case PowerUpType.PISTOL:
        this._applyPistolEffect(tank);
        break;
    }
  }

  private _applyStarEffect(tank: Tank): void {
    tank.stars = Math.min(tank.stars + 1, 3);
    if (tank.stars >= 1) tank.projectileSpeed = 1.5;
    if (tank.stars >= 2) tank.maxProjectiles = 2;
    if (tank.stars >= 3) tank.power = 2;
    this._savePlayerStars(tank);
  }

  private _applyHelmetEffect(tank: Tank): void {
    this.effects = this.effects.filter(e => {
      if (e.target === (tank as unknown as import('../effects/base-effect.js').IEffectTarget)) {
        e.end();
        return false;
      }
      return true;
    });

    const shield = new ShieldEffect({
      target: tank,
      effectOptions: {
        ...ShieldEffectOptions,
        EFFECT_DURATION: HELMET_POWERUP_DURATION,
      },
    });
    shield.start();
    shield.on(event.object.DESTROYED, this._removeEffect);
    this.effects.push(shield);
  }

  private _applyClockEffect(): void {
    this.frozenTimer = CLOCK_DURATION;
  }

  private _applyGrenadeEffect(): void {
    this._grenadeActive = true;
    const enemies = this.enemyTanks.filter(t => t.tankType === TankType.ENEMY);
    for (const enemy of enemies) {
      enemy.state = 'dead';
      enemy.emit(event.object.DESTROYED, enemy);
    }
    this._grenadeActive = false;
  }

  private _applyShovelEffect(): void {
    this._shovelTimer = SHOVEL_DURATION;
    this._fortifyBase(true);
  }

  private _applyTankEffect(tank: Tank): void {
    if (tank.tankType === TankType.PLAYER_1) {
      this.game.player1.lives = Math.min(this.game.player1.lives + 1, 9);
    } else if (tank.tankType === TankType.PLAYER_2) {
      this.game.player2.lives = Math.min(this.game.player2.lives + 1, 9);
    }
    this.game.events.emit(event.sound.LIFE_UP);
  }

  private _applyPistolEffect(tank: Tank): void {
    tank.stars = 3;
    tank.projectileSpeed = 1.5;
    tank.maxProjectiles = 2;
    tank.power = 2;
    this._savePlayerStars(tank);
  }

  private _savePlayerStars(tank: Tank): void {
    if (tank.tankType === TankType.PLAYER_1) {
      this.game.player1.stars = tank.stars;
    } else if (tank.tankType === TankType.PLAYER_2) {
      this.game.player2.stars = tank.stars;
    }
  }

  private _scheduleEnd(targetState: string): void {
    this._endTargetState = targetState;
    this._endTimer = ROUND_END_DELAY;
  }

  private _fortifyBase(steel: boolean): void {
    for (const [y, x] of FORTRESS_TILES) {
      if (y >= this.stage.length || x >= this.stage[0].length) continue;

      if (steel) {
        const wall = new SteelWall({ x, y });
        wall.on(event.object.DESTROYED, this._removeWall);
        this.stage[y][x] = wall;
      } else {
        const wall = new BrickWall({ x, y });
        wall.on(event.object.DESTROYED, this._removeWall);
        this.stage[y][x] = wall;
      }
    }
  }

  hasCollision(object: ICollidable): boolean {
    const isProjectile = object instanceof Projectile;
    const isPlayerProjectile = isProjectile && object.tank?.playerIndex !== undefined;

    const bounds = computeNextBounds(
      object.x,
      object.y,
      object.width,
      object.height,
      object.direction,
      object.speed
    );

    if (
      isOutOfBounds(
        bounds,
        object.direction,
        this.minWorldX,
        this.maxWorldX,
        this.minWorldY,
        this.maxWorldY
      )
    ) {
      if (isPlayerProjectile) this.game.events.emit(event.sound.WALL_HIT);
      return true;
    }

    if (overlapsRect(bounds, this.base)) {
      this.base.hit(object);
      return true;
    }

    for (let i = 0; i < this.enemyTanks.length; i++) {
      const tank = this.enemyTanks[i];

      if (!overlapsDirectional(bounds, object.direction, tank, object.x, object.y)) continue;

      let objectHasWallCollision = false;
      objectHasWallCollision = tank.hit(object as IHitObject) ? true : objectHasWallCollision;
      objectHasWallCollision = tank.moveThrough(object as IHitObject)
        ? true
        : objectHasWallCollision;

      if (objectHasWallCollision) {
        return true;
      }
    }

    const tileRange = computeTileRange(
      bounds,
      object.direction,
      this.stage.length,
      this.stage[0].length
    );

    let objectHasWallCollision = false;

    const tile1 = this.stage[tileRange.minY][tileRange.minX];
    if (tile1) {
      const isItHit = tile1.hit(object as unknown as IHittable);
      objectHasWallCollision = isItHit ? true : objectHasWallCollision;

      if (isItHit && isPlayerProjectile) {
        this.game.events.emit(
          tile1 instanceof BrickWall ? event.sound.BRICK_HIT : event.sound.WALL_HIT
        );
      }

      const isMoveThrough = tile1.moveThrough(object as unknown as IHittable);
      objectHasWallCollision = isMoveThrough ? true : objectHasWallCollision;

      if (isItHit || isMoveThrough) {
        this.collisionTiles[0] = [tileRange.minX, tileRange.minY];
      }
    }

    const tile2 = this.stage[tileRange.maxY][tileRange.maxX];
    if (tile2) {
      const isItHit = tile2.hit(object as unknown as IHittable);
      objectHasWallCollision = isItHit ? true : objectHasWallCollision;

      if (isItHit && isPlayerProjectile) {
        this.game.events.emit(
          tile2 instanceof BrickWall ? event.sound.BRICK_HIT : event.sound.WALL_HIT
        );
      }

      const isMoveThrough = tile2.moveThrough(object as unknown as IHittable);
      objectHasWallCollision = isMoveThrough ? true : objectHasWallCollision;

      if (isItHit || isMoveThrough) {
        this.collisionTiles[1] = [tileRange.maxX, tileRange.maxY];
      }
    }

    if (objectHasWallCollision) return true;

    return false;
  }

  exit(): void {
    __DEBUG__ && console.log(`Exiting world for level ${this.game.currentLevel}`);

    this.game.events.emit(event.sound.STOP_ALL);

    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }
}
