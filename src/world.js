import Resurrection from './resurrection.js';
import Tank from './tank.js';
import EnemyTank from './enemy-tank.js';
import Base from './base.js';
import Projectile from './projectile.js';
import Explosive from './explosive.js';

import { generateTerrain } from './utilities.js';
import {
  Direction,
  WorldOption,
  TankType,
  Player1TankOption,
  Player2TankOption,
  EnemyTankToOption,
} from './constants.js';

export default class World {
  stage = [];
  projectiles = [];
  explosives = [];
  enemyTanks = [];
  resurrections = [];

  minWorldX = 0;
  maxWorldX = 0;
  minWorldY = 0;
  maxWorldY = 0;

  collisionTiles = [];

  init(stage, game) {
    this._addProjectile = this._addProjectile.bind(this);
    this._removeProjectile = this._removeProjectile.bind(this);
    this._removeExplosive = this._removeExplosive.bind(this);
    this._removeWall = this._removeWall.bind(this);
    this._removeResurrection = this._removeResurrection.bind(this);
    this._removeTank = this._removeTank.bind(this);
    this._destroyBase = this._destroyBase.bind(this);

    this.game = game;
    this.stage = generateTerrain(stage.terrain, this._removeWall);

    this.enemyArray = stage.enemies;
    this.enemyTanksOnMap = 0;

    this.maxWorldX = this.stage.length * WorldOption.TILE_SIZE;
    this.maxWorldY = this.stage[0].length * WorldOption.TILE_SIZE;

    this.enemyFriendlyFire = WorldOption.ENEMY_FRIENDLY_FIRE;

    const resurrectionFor1Player = new Resurrection({
      world: this,
      tankType: TankType.PLAYER_1,
      options: Player1TankOption,
      x: Player1TankOption.START_X,
      y: Player1TankOption.START_Y,
    });
    resurrectionFor1Player.on('destroy', this._removeResurrection);
    this.resurrections.push(resurrectionFor1Player);

    this.base = new Base({
      world: this,
    });
    this.base.on('destroy', this._destroyBase);
  }

  get objects() {
    return [
      this.base,
      ...this.enemyTanks,
      ...this.projectiles,
      ...this.explosives,
      ...this.resurrections,
    ];
  }

  update(activeKeys) {
    if (this.enemyTanksOnMap < 6 && this.enemyArray.length) {
      const enemyResurrection = new Resurrection({
        world: this,
        tankType: TankType.ENEMY,
        options: EnemyTankToOption[this.enemyArray.shift()],
        x: Math.floor(Math.random() * 3) * 6 * WorldOption.UNIT_SIZE,
        y: 0,
      });
      enemyResurrection.on('destroy', this._removeResurrection);
      this.resurrections.push(enemyResurrection);
      this.enemyTanksOnMap++;
    }

    this.objects.forEach(gameObject => {
      gameObject && gameObject.update(activeKeys);
    });
  }

  _addProjectile(tank) {
    const projectile = new Projectile({
      world: this,
      tank: tank,
      direction: tank.direction,
      tankType: tank.type,
    });

    projectile.on('destroy', this._removeProjectile);
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
    } else {
      tank = EnemyTank.createRandom({
        world: this,
        type: resurrection.tankType,
        tankOptions: resurrection.tankOptions,
        x: resurrection.x,
        y: resurrection.y,
      });
    }

    tank.on('fire', this._addProjectile);
    tank.on('destroy', this._removeTank);

    if (tank.type === TankType.PLAYER_1) {
      this.game.player1Tank = tank;
    }
    if (tank.type === TankType.PLAYER_2) {
      this.game.player2Tank = tank;
    }

    this.enemyTanks.push(tank);
  }

  _removeTank(tank) {
    this.enemyTanks = this.enemyTanks.filter(t => t !== tank);

    const explosive = new Explosive({
      world: this,
      tank,
    });

    explosive.on('destroy', this._removeExplosive);
    this.explosives.push(explosive);

    this.enemyTanksOnMap--;
  }

  _removeProjectile(projectile) {
    this.projectiles = this.projectiles.filter(p => p !== projectile);

    const explosive = new Explosive({
      world: this,
      projectile,
    });

    explosive.on('destroy', this._removeExplosive);
    this.explosives.push(explosive);
  }

  _removeExplosive(explosive) {
    this.explosives = this.explosives.filter(e => e !== explosive);
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

    explosive.on('destroy', this._removeExplosive);
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
        nextMinY += object.speed;
        nextMaxY += object.speed;
        if (nextMaxY >= this.maxWorldY) return true;
        tileMinX = nextMinX >> 3;
        tileMaxX = nextMaxX >> 3;
        tileMinY = nextMaxY >> 3;
        tileMaxY = nextMaxY >> 3;
        break;
      case Direction.RIGHT:
        nextMinX += object.speed;
        nextMaxX += object.speed;
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
}
