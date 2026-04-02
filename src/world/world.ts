import { event } from '../config/events.js';

import ShieldEffect from '../effects/shield-effect.js';

import Resurrection from '../entities/resurrection.js';
import Tank from '../entities/tank.js';
import EnemyTank from '../entities/enemy-tank.js';
import Base from '../entities/base.js';
import Projectile from '../entities/projectile.js';
import Explosive from '../entities/explosive.js';

import BrickWall from '../map/brick-wall.js';

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
  Player1TankOption,
  Player2TankOption,
  EnemyTankToOption,
  ShieldEffectOptions,
} from '../config/constants.js';
import type { EnemyTypeValue } from '../config/constants.type.js';
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
    if (this.enemyTanksOnMap <= 0 && this.enemyArray.length === 0) {
      __DEBUG__ && console.log('level complete - victory');
      this.game.events.emit(event.CHANGE_STATE, event.state.RESULTS);
    }

    if (this.base.destroyed) {
      __DEBUG__ && console.log('level complete - base destroyed - game over');
      this.game.events.emit(event.CHANGE_STATE, event.state.GAME_OVER);
    }

    if (this.player1Tank === null && this.game.player1Lives === 0) {
      if (
        this.game.playerCount === 1 ||
        (this.player2Tank === null && this.game.player2Lives === 0)
      ) {
        __DEBUG__ && console.log('level complete - all players dead - game over');
        this.game.events.emit(event.CHANGE_STATE, event.state.GAME_OVER);
      }
    }

    if (this.enemyTanksOnMap < TANKS_ON_MAP && this.enemyArray.length) {
      const enemyType = this.enemyArray.shift()!;
      const enemyResurrection = new Resurrection({
        world: this,
        tankType: TankType.ENEMY,
        options: EnemyTankToOption[enemyType],
        x: Math.floor(Math.random() * 3) * 6 * WorldOption.UNIT_SIZE,
        y: 0,
      });
      enemyResurrection.on(event.object.DESTROYED, this._removeResurrection);
      this.resurrections.push(enemyResurrection);
      this.enemyTanksOnMap++;
    }

    const activeKeys = this.game.input.activeKeys();
    this.objects.forEach(gameObject => {
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
      if (this.game.player1Lives) {
        this.game.player1Lives -= 1;
        this._resurrectPlayer1();
      } else {
        this.player1Tank = null;
      }
    }
    if (explosive.tank?.tankType === TankType.PLAYER_2) {
      this.game.events.emit(event.sound.PLAYER_DEATH);
      this.currentMoveState2 = 'standby';
      if (this.game.player2Lives) {
        this.game.player2Lives -= 1;
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
