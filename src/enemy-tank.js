import Tank from './tank.js';
import { Direction } from './constants.js';

export default class EnemyTank extends Tank {
  static createRandom(props) {
    return new EnemyTank(props);
  }

  constructor(props) {
    super(props);

    this.actionDelay = 30;
    this.shootDelay = 120;
  }

  update() {
    this.actionDelay--;
    this.shootDelay--;

    if (this.actionDelay <= 0) {
      this.actionDelay = 60;

      const changeDirection = Math.floor(Math.random() * 2) - 1;

      this.direction = this.direction + changeDirection;
      if (this.direction > 4) this.direction = 1;
      if (this.direction < 1) this.direction = 4;

      this._stickToGrid();

      switch (this.direction) {
        case Direction.UP:
          this.moveUp();
          break;
        case Direction.DOWN:
          this.moveDown();
          break;
        case Direction.LEFT:
          this.moveLeft();
          break;
        case Direction.RIGHT:
          this.moveRight();
          break;
      }
    }

    if (this.shootDelay <= 0) {
      this.shootDelay = 120;

      this.emit('fire', this);
    }

    const speed = this.world.hasCollision(this) ? 0 : this.speed;

    if (this.direction === Direction.UP) {
      this.realY -= speed;
    } else if (this.direction === Direction.DOWN) {
      this.realY += speed;
    } else if (this.direction === Direction.LEFT) {
      this.realX -= speed;
    } else if (this.direction === Direction.RIGHT) {
      this.realX += speed;
    }

    if (this.oldX !== this.x || this.oldY !== this.y) {
      this.oldX = this.x;
      this.oldY = this.y;

      this._changeAnimationFrame();
    }

    this.x = this.realX >> 0;
    this.y = this.realY >> 0;
  }
}
