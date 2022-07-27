import Tank from './tank.js';
import { Direction, Tank as player1Tank } from './constants.js';

export default class World {
  level = [];

  minWorldX = 0;
  maxWorldX = 0;
  minWorldY = 0;
  maxWorldY = 0;

  // more for collision detection, delete after all tests are done
  collisionTileX = null;
  collisionTileY = null;

  init(level) {
    this.level = level;

    this.maxWorldX = this.level.length * 8;
    this.maxWorldY = this.level[0].length * 8;
  }

  player1Tank = new Tank(
    this,
    player1Tank.START_X,
    player1Tank.START_Y,
    player1Tank.START_DIRECTION,
    player1Tank.DEFAULT_SPEED,
  );
  //player2Tank = new Tank();

  enemyTankList = [];

  update() {
    this.player1Tank.update();
  }

  canIMove(tank) {
    const { x, y, direction, speed } = tank;

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
        if (nextMinY < this.minWorldY) return false;
        tileMinX = Math.floor(nextMinX / 8);
        tileMaxX = Math.floor(nextMaxX / 8);
        tileMinY = Math.floor(nextMinY / 8);
        tileMaxY = Math.floor(nextMinY / 8);
        break;
      case Direction.LEFT:
        nextMinX -= speed;
        nextMaxX -= speed;
        if (nextMinX < this.minWorldX) return false;
        tileMinX = Math.floor(nextMinX / 8);
        tileMaxX = Math.floor(nextMinX / 8);
        tileMinY = Math.floor(nextMinY / 8);
        tileMaxY = Math.floor(nextMaxY / 8);
        break;
      case Direction.DOWN:
        nextMinY += speed;
        nextMaxY += speed;
        if (nextMaxY >= this.maxWorldY) return false;
        tileMinX = Math.floor(nextMinX / 8);
        tileMaxX = Math.floor(nextMaxX / 8);
        tileMinY = Math.floor(nextMaxY / 8);
        tileMaxY = Math.floor(nextMaxY / 8);
        break;
      case Direction.RIGHT:
        nextMinX += speed;
        nextMaxX += speed;
        if (nextMaxX >= this.maxWorldX) return false;
        tileMinX = Math.floor(nextMaxX / 8);
        tileMaxX = Math.floor(nextMaxX / 8);
        tileMinY = Math.floor(nextMinY / 8);
        tileMaxY = Math.floor(nextMaxY / 8);
        break;
    }

    // condition to stay in array
    tileMinX = tileMinX < 0 ? 0 : tileMinX;
    tileMaxX = tileMaxX >= this.level.length ? this.level.length - 1 : tileMaxX;
    tileMinY = tileMinY < 0 ? 0 : tileMinY;
    tileMaxY = tileMaxY >= this.level[0].length ? this.level[0].length - 1 : tileMaxY;

    if (this.level[tileMinY][tileMinX] !== 0) {
      this.collisionTileX = tileMinX;
      this.collisionTileY = tileMinY;
      return false;
    }
    if (this.level[tileMaxY][tileMaxX] !== 0) {
      this.collisionTileX = tileMaxX;
      this.collisionTileY = tileMaxY;
      return false;
    }

    this.collisionTileX = null;
    this.collisionTileY = null;
    return true;
  }
}
