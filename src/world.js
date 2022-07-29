import Tank from './tank.js';
import Base from './base.js';

import { Direction, Player1TankOption, BaseOption } from './constants.js';

export default class World {
  stage = [];

  minWorldX = 0;
  maxWorldX = 0;
  minWorldY = 0;
  maxWorldY = 0;

  // more for collision detection, delete after all tests are done
  collisionTileX = null;
  collisionTileY = null;

  player1Index = 0;
  player2Index = 1;

  init(stage) {
    this.stage = stage;

    this.maxWorldX = this.stage.length * 8;
    this.maxWorldY = this.stage[0].length * 8;

    this.stage = stage;

    this.player1Tank = new Tank(
      this,
      Player1TankOption.START_X,
      Player1TankOption.START_Y,
      Player1TankOption.START_DIRECTION,
      Player1TankOption.DEFAULT_SPEED,
      Player1TankOption.SPRITES,
      this.player1Index,
    );

    this.base = new Base(this, BaseOption.START_X, BaseOption.START_Y, BaseOption.SPRITES);

    this.enemyTanks = [];
  }

  get objects() {
    return [this.base, this.player1Tank, ...this.enemyTanks];
  }

  update(activeKeys) {
    this.objects.forEach(gameObject => {
      gameObject.update(activeKeys);
    });
  }

  hasCollision(object) {
    const { x, y, direction, speed } = object;

    let nextMinX = x;
    let nextMaxX = x + 15;
    let nextMinY = y;
    let nextMaxY = y + 15;

    let tileMinX = 0;
    let tileMaxX = 0;
    let tileMinY = 0;
    let tileMaxY = 0;

    switch (direction) {
      case Direction.UP:
        nextMinY -= speed;
        nextMaxY -= speed;
        if (nextMinY < this.minWorldY) return true;
        tileMinX = nextMinX >> 3;
        tileMaxX = nextMaxX >> 3;
        tileMinY = nextMinY >> 3;
        tileMaxY = nextMinY >> 3;
        break;
      case Direction.LEFT:
        nextMinX -= speed;
        nextMaxX -= speed;
        if (nextMinX < this.minWorldX) return true;
        tileMinX = nextMinX >> 3;
        tileMaxX = nextMinX >> 3;
        tileMinY = nextMinY >> 3;
        tileMaxY = nextMaxY >> 3;
        break;
      case Direction.DOWN:
        nextMinY += speed;
        nextMaxY += speed;
        if (nextMaxY >= this.maxWorldY) return true;
        tileMinX = nextMinX >> 3;
        tileMaxX = nextMaxX >> 3;
        tileMinY = nextMaxY >> 3;
        tileMaxY = nextMaxY >> 3;
        break;
      case Direction.RIGHT:
        nextMinX += speed;
        nextMaxX += speed;
        if (nextMaxX >= this.maxWorldX) return true;
        tileMinX = nextMaxX >> 3;
        tileMaxX = nextMaxX >> 3;
        tileMinY = nextMinY >> 3;
        tileMaxY = nextMaxY >> 3;
        break;
    }

    // condition to stay in array
    tileMinX = tileMinX < 0 ? 0 : tileMinX;
    tileMaxX = tileMaxX >= this.stage.length ? this.stage.length - 1 : tileMaxX;
    tileMinY = tileMinY < 0 ? 0 : tileMinY;
    tileMaxY = tileMaxY >= this.stage[0].length ? this.stage[0].length - 1 : tileMaxY;

    if (this.stage[tileMinY][tileMinX] !== 0) {
      this.collisionTileX = tileMinX;
      this.collisionTileY = tileMinY;
      return true;
    }
    if (this.stage[tileMaxY][tileMaxX] !== 0) {
      this.collisionTileX = tileMaxX;
      this.collisionTileY = tileMaxY;
      return true;
    }

    this.collisionTileX = null;
    this.collisionTileY = null;
    return false;
  }
}
