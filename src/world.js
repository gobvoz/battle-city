import Tank from './tank.js';
import Base from './base.js';
import Projectile from './projectile.js';
import Explosive from './explosive.js';

import { generateWall } from './utilities.js';
import { Direction, WorldOption, TerrainType, ObjectType } from './constants.js';

export default class World {
  stage = [];
  projectiles = [];
  explosives = [];
  enemyTanks = [];

  minWorldX = 0;
  maxWorldX = 0;
  minWorldY = 0;
  maxWorldY = 0;

  collisionTiles = [];

  player1Index = 0;
  player2Index = 1;

  init(stage) {
    this._addProjectile = this._addProjectile.bind(this);
    this._removeProjectile = this._removeProjectile.bind(this);
    this._removeExplosive = this._removeExplosive.bind(this);
    this._removeWall = this._removeWall.bind(this);

    this.stage = stage.map((row, rowIndex) =>
      row.map((terrainType, columnIndex) => {
        let wall = generateWall({
          x: columnIndex,
          y: rowIndex,
          terrainType,
        });

        if (wall !== null) {
          wall.on('destroy', this._removeWall);
        }

        return wall;
      }),
    );

    this.maxWorldX = this.stage.length * WorldOption.TILE_SIZE;
    this.maxWorldY = this.stage[0].length * WorldOption.TILE_SIZE;

    this.player1Tank = new Tank({
      world: this,
      playerIndex: this.player1Index,
    });

    this.base = new Base({
      world: this,
    });

    this.player1Tank.on('fire', this._addProjectile);
  }

  get objects() {
    return [
      this.base,
      this.player1Tank,
      ...this.enemyTanks,
      ...this.projectiles,
      ...this.explosives,
    ];
  }

  update(activeKeys) {
    this.objects.forEach(gameObject => {
      gameObject.update(activeKeys);
    });
  }

  _addProjectile(tank) {
    const projectile = new Projectile({
      world: this,
      tank: tank,
      direction: tank.direction,
      playerIndex: tank.playerIndex,
    });

    projectile.on('destroy', this._removeProjectile);
    this.projectiles.push(projectile);
  }

  _removeProjectile(projectile) {
    this.projectiles = this.projectiles.filter(p => p !== projectile);

    const explosive = new Explosive({
      world: this,
      projectile: projectile,
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
      if (object.type === ObjectType.PROJECTILE) {
        this.base.hit();
      }

      return true;
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
      //this.collisionTiles[0] = [tileMinX, tileMinY];
      //if (object.type === ObjectType.PROJECTILE) {
      //  tile1.hit(object);
      //}
      //objectHasWallCollision = true;
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
      //this.collisionTiles[1] = [tileMaxX, tileMaxY];
      //if (object.type === ObjectType.PROJECTILE) {
      //  tile2.hit(object);
      //}
      //objectHasWallCollision = true;
    }

    if (objectHasWallCollision) return true;

    this.collisionTileX = null;
    this.collisionTileY = null;
    return false;
  }
}
