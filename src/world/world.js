import { event } from '../config/events.js';
import stages from '../config/stages/index.js';

import ShieldEffect from '../effects/shield-effect.js';

import Resurrection from '../entities/resurrection.js';
import Tank from '../entities/tank.js';
import EnemyTank from '../entities/enemy-tank.js';
import Base from '../entities/base.js';
import Projectile from '../entities/projectile.js';
import Explosive from '../entities/explosive.js';

import { generateTerrain } from '../core/utilities.js';
import { DebugManager } from '../core/debug-manager.js';

import {
  Direction,
  WorldOption,
  TankType,
  Player1TankOption,
  Player2TankOption,
  EnemyTankToOption,
  ShieldEffectOptions,
} from '../config/constants.js';

const TANKS_ON_MAP = 4;

export class World {
  constructor(game) {
    this.game = game;
    this.stage = [];
    this.projectiles = [];
    this.explosives = [];
    this.enemyTanks = [];
    this.resurrections = [];
    this.enemyArray = [];
    this.effects = [];

    this.currentMoveState = 'standby'; // "standby", "move"
    this.player1Tank = null;
    this.player2Tank = null;

    this.minWorldX = 0;
    this.maxWorldX = 0;
    this.minWorldY = 0;
    this.maxWorldY = 0;

    this.collisionTiles = [];

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
  }

  start() {
    DebugManager.log(`Starting world for level ${this.game.currentLevel}`);

    this.stage = generateTerrain(stages[this.game.currentLevel - 1].terrain, this._removeWall);

    this.enemyArray = [...stages[this.game.currentLevel - 1].enemies];
    this.enemyTanksOnMap = 0;
    this.tanksTotal = stages[this.game.currentLevel - 1].enemies.length;

    this.maxWorldX = this.stage.length * WorldOption.TILE_SIZE;
    this.maxWorldY = this.stage[0].length * WorldOption.TILE_SIZE;

    this.enemyFriendlyFire = WorldOption.ENEMY_FRIENDLY_FIRE;

    this._resurrectPlayer1();
    // this._resurrectPlayer2();

    this.base = new Base({
      world: this,
    });

    this.base.on(event.object.DESTROYED, this._destroyBase);

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  update(deltaTime) {
    //this.player.update(deltaTime);
    //this.enemies.forEach(e => e.update(deltaTime));
    if (this.enemyTanksOnMap <= 0 && this.enemyArray.length === 0) {
      DebugManager.log('level complete - victory');
      this.game.events.emit(event.CHANGE_STATE, event.state.RESULTS);
    }

    if (this.base.destroyed) {
      DebugManager.log('level complete - base destroyed - game over');
      this.game.events.emit(event.CHANGE_STATE, event.state.GAME_OVER);
    }

    if (this.player1Tank === null && this.game.player1Lives === 0) {
      DebugManager.log('level complete - player 1 dead - game over');
      this.game.events.emit(event.CHANGE_STATE, event.state.GAME_OVER);
    }

    if (this.enemyTanksOnMap < TANKS_ON_MAP && this.enemyArray.length) {
      const enemyResurrection = new Resurrection({
        world: this,
        tankType: TankType.ENEMY,
        options: EnemyTankToOption[this.enemyArray.shift()],
        x: Math.floor(Math.random() * 3) * 6 * WorldOption.UNIT_SIZE,
        y: 0,
      });
      enemyResurrection.on(event.object.DESTROYED, this._removeResurrection);
      this.resurrections.push(enemyResurrection);
      this.enemyTanksOnMap++;
    }

    const activeKeys = this.game.input.activeKeys();
    this.objects.forEach(gameObject => {
      gameObject && gameObject.update(deltaTime, activeKeys);
    });
  }

  handleKeyDown(evt) {
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

    if (moving && this.currentMoveState !== 'move' && this.player1Tank.state === 'active') {
      this.currentMoveState = 'move';
      // this.audio.play('player-move', { loop: true });
    }

    // evt.preventDefault();
  }

  handleKeyUp(evt) {
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

    const activeKeys = this.game.input.activeKeys();

    const stillMoving =
      activeKeys.has('KeyW') ||
      activeKeys.has('KeyS') ||
      activeKeys.has('KeyA') ||
      activeKeys.has('KeyD');

    if (
      !stillMoving &&
      this.currentMoveState !== 'standby' &&
      this.player1Tank?.state === 'active'
    ) {
      this.currentMoveState = 'standby';
      //this.audio.play('player-standby', { loop: true });
    }

    // evt.preventDefault();
  }

  get objects() {
    return [
      this.base,
      ...this.enemyTanks,
      ...this.projectiles,
      ...this.explosives,
      ...this.resurrections,
      ...this.effects,
    ];
  }

  _resurrectPlayer1() {
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

  _resurrectPlayer2() {
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

  _addProjectile(tank) {
    if (tank.hasProjectile) return;
    tank.hasProjectile = true;

    const projectile = new Projectile({
      world: this,
      tank: tank,
      direction: tank.direction,
      tankType: tank.type,
    });

    if (tank.type === TankType.PLAYER_1 && tank.state !== 'dead') {
      // this.game.audio.play('player-shoot', { loop: false, isEffect: true });
    }

    projectile.on(event.object.DESTROYED, this._removeProjectile);
    this.projectiles.push(projectile);
  }

  _removeResurrection(resurrection) {
    this.resurrections = this.resurrections.filter(r => r !== resurrection);

    let tank = null;

    if (resurrection.tankType === TankType.PLAYER_1) {
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

      // this.game.audio.play('player-standby', { loop: false });
    } else {
      tank = EnemyTank.createRandom({
        world: this,
        type: resurrection.tankType,
        tankOptions: resurrection.tankOptions,
        x: resurrection.x,
        y: resurrection.y,
      });
    }

    tank.on(event.object.FIRE, this._addProjectile);
    tank.on(event.object.DESTROYED, this._removeTank);

    if (tank.type === TankType.PLAYER_1) {
      this.player1Tank = tank;
    }
    if (tank.type === TankType.PLAYER_2) {
      this.player2Tank = tank;
    }

    this.enemyTanks.push(tank);
  }

  _removeEffect(effect) {
    effect.end();
    this.effects = this.effects.filter(e => e !== effect);
  }

  _removeTank(tank) {
    this.enemyTanks = this.enemyTanks.filter(t => t !== tank);

    const explosive = new Explosive({
      world: this,
      tank,
    });

    explosive.on(event.object.DESTROYED, this._removeExplosive);
    this.explosives.push(explosive);

    if (tank.type === TankType.ENEMY) {
      this.enemyTanksOnMap--;
      this.tanksTotal--;
    } else if (tank.type === TankType.PLAYER_1) {
      //this.game.audio.stop('player-move');
      //this.game.audio.stop('player-standby');
    }
  }

  _removeProjectile(projectile) {
    projectile.tank.hasProjectile = false;
    this.projectiles = this.projectiles.filter(p => p !== projectile);

    const explosive = new Explosive({
      world: this,
      projectile,
    });

    explosive.on(event.object.DESTROYED, this._removeExplosive);
    this.explosives.push(explosive);
  }

  _removeExplosive(explosive) {
    this.explosives = this.explosives.filter(e => e !== explosive);

    if (explosive.tank?.type === TankType.PLAYER_1) {
      if (this.game.player1Lives) {
        this.game.player1Lives -= 1;
        this._resurrectPlayer1();
      } else {
        this.player1Tank = null;
      }
    }
    if (explosive.tank?.type === TankType.PLAYER_2) {
      if (this.game.player2Lives) {
        this.game.player2Lives -= 1;
        this.game._resurrectPlayer2();
      } else {
        this.player2Tank = null;
      }
    }
  }

  _removeWall(wall) {
    this.stage = this.stage.map(row =>
      row.map(tile => {
        if (tile === wall) {
          return null;
        }
        return tile;
      }),
    );
  }

  _destroyBase(base) {
    const explosive = new Explosive({
      world: this,
      base,
    });

    explosive.on(event.object.DESTROYED, this._removeExplosive);
    this.explosives.push(explosive);
  }

  hasCollision(object) {
    let nextMinX = object.x;
    let nextMaxX = object.x + object.width - 1;
    let nextMinY = object.y;
    let nextMaxY = object.y + object.height - 1;

    let tileMinX = 0;
    let tileMaxX = 0;
    let tileMinY = 0;
    let tileMaxY = 0;

    let objectHasWallCollision = false;

    switch (object.direction) {
      case Direction.UP:
        nextMinY -= object.speed;
        nextMaxY -= object.speed;
        if (nextMinY < this.minWorldY) return true;
        tileMinX = nextMinX >> 3;
        tileMaxX = nextMaxX >> 3;
        tileMinY = nextMinY >> 3;
        tileMaxY = nextMinY >> 3;
        break;
      case Direction.LEFT:
        nextMinX -= object.speed;
        nextMaxX -= object.speed;
        if (nextMinX < this.minWorldX) return true;
        tileMinX = nextMinX >> 3;
        tileMaxX = nextMinX >> 3;
        tileMinY = nextMinY >> 3;
        tileMaxY = nextMaxY >> 3;
        break;
      case Direction.DOWN:
        nextMinY += object.speed + 1; // speed might be less than 1. So we add 1 to make sure we don't get a collision
        nextMaxY += object.speed + 1;
        if (nextMaxY >= this.maxWorldY) return true;
        tileMinX = nextMinX >> 3;
        tileMaxX = nextMaxX >> 3;
        tileMinY = nextMaxY >> 3;
        tileMaxY = nextMaxY >> 3;
        break;
      case Direction.RIGHT:
        nextMinX += object.speed + 1; // speed might be less than 1. So we add 1 to make sure we don't get a collision
        nextMaxX += object.speed + 1;
        if (nextMaxX >= this.maxWorldX) return true;
        tileMinX = nextMaxX >> 3;
        tileMaxX = nextMaxX >> 3;
        tileMinY = nextMinY >> 3;
        tileMaxY = nextMaxY >> 3;
        break;
    }

    const deltaMinX = nextMinX - this.base.x;
    const deltaMaxX = nextMaxX - this.base.x;
    const deltaMinY = nextMinY - this.base.y;
    const deltaMaxY = nextMaxY - this.base.y;

    if (
      (deltaMinX >= 0 &&
        deltaMinX <= this.base.width &&
        deltaMinY >= 0 &&
        deltaMinY <= this.base.height) ||
      (deltaMaxX >= 0 &&
        deltaMaxX <= this.base.width &&
        deltaMaxY >= 0 &&
        deltaMaxY <= this.base.height)
    ) {
      this.base.hit(object);

      return true;
    }

    for (let i = 0; i < this.enemyTanks.length; i++) {
      const tank = this.enemyTanks[i];

      switch (object.direction) {
        case Direction.UP:
          if (
            !(
              tank.bottom > nextMinY &&
              tank.top < nextMinY &&
              ((tank.left < nextMinX && tank.right > nextMinX) ||
                (tank.left < nextMaxX && tank.right > nextMaxX))
            )
          )
            continue;
          break;
        case Direction.LEFT:
          if (
            !(
              tank.right > nextMinX &&
              tank.left < nextMinX &&
              ((tank.top < nextMinY && tank.bottom > nextMinY) ||
                (tank.top < nextMaxY && tank.bottom > nextMaxY))
            )
          )
            continue;
          break;
        case Direction.DOWN:
          if (
            !(
              tank.top < nextMaxY &&
              tank.bottom > nextMaxY &&
              ((tank.left < nextMinX && tank.right > nextMinX) ||
                (tank.left < nextMaxX && tank.right > nextMaxX))
            )
          )
            continue;
          break;
        case Direction.RIGHT:
          if (
            !(
              tank.left < nextMaxX &&
              tank.right > nextMaxX &&
              ((tank.top < nextMinY && tank.bottom > nextMinY) ||
                (tank.top < nextMaxY && tank.bottom > nextMaxY))
            )
          )
            continue;
          break;
      }

      // When tank respawn it's possible that it collides with another tank. In this case ignore collision
      if (object.x === tank.x && object.y === tank.y) continue;

      objectHasWallCollision = tank.hit(object) ? true : objectHasWallCollision;
      objectHasWallCollision = tank.moveThrough(object) ? true : objectHasWallCollision;

      if (objectHasWallCollision) {
        return true;
      }
    }

    // condition to stay in array
    tileMinX = tileMinX < 0 ? 0 : tileMinX;
    tileMaxX = tileMaxX >= this.stage.length ? this.stage.length - 1 : tileMaxX;
    tileMinY = tileMinY < 0 ? 0 : tileMinY;
    tileMaxY = tileMaxY >= this.stage[0].length ? this.stage[0].length - 1 : tileMaxY;

    const tile1 = this.stage[tileMinY][tileMinX];
    if (tile1) {
      const isItHit = tile1.hit(object);
      objectHasWallCollision = isItHit ? true : objectHasWallCollision;

      const isMoveThrough = tile1.moveThrough(object);
      objectHasWallCollision = isMoveThrough ? true : objectHasWallCollision;

      if (isItHit || isMoveThrough);
      {
        this.collisionTiles[0] = [tileMinX, tileMinY];
      }
    }

    const tile2 = this.stage[tileMaxY][tileMaxX];
    if (tile2) {
      const isItHit = tile2.hit(object);
      objectHasWallCollision = isItHit ? true : objectHasWallCollision;

      const isMoveThrough = tile2.moveThrough(object);
      objectHasWallCollision = isMoveThrough ? true : objectHasWallCollision;

      if (isItHit || isMoveThrough);
      {
        this.collisionTiles[1] = [tileMaxX, tileMaxY];
      }
    }

    if (objectHasWallCollision) return true;

    this.collisionTileX = null;
    this.collisionTileY = null;
    return false;
  }

  exit() {
    DebugManager.log(`Exiting world for level ${this.game.currentLevel}`);
    this.entities = [];

    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }
}
