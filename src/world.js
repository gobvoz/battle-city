import Tank from './tank.js';
import Base from './base.js';

import { Direction, Player1TankOption, BaseOption, WorldOption } from './constants.js';

export default class World {
  stage = [];
  projectiles = [];

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

    this.player1Tank = new Tank({
      world: this,
      x: Player1TankOption.START_X,
      y: Player1TankOption.START_Y,
      width: Player1TankOption.WIDTH,
      height: Player1TankOption.HEIGHT,
      direction: Player1TankOption.START_DIRECTION,
      speed: Player1TankOption.DEFAULT_SPEED,
      sprites: Player1TankOption.SPRITES,
      playerIndex: this.player1Index,
    });

    this.base = new Base({
      world: this,
      x: BaseOption.START_X,
      y: BaseOption.START_Y,
      width: BaseOption.WIDTH,
      height: BaseOption.HEIGHT,
      sprites: BaseOption.SPRITES,
    });

    this.enemyTanks = [];
  }

  get objects() {
    return [this.base, this.player1Tank, ...this.enemyTanks, ...this.projectiles];
  }

  update(activeKeys) {
    this.objects.forEach(gameObject => {
      gameObject.update(activeKeys);
    });
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
