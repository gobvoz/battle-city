import Tank from './tank.js';
import { event } from '../config/events.js';

import { Direction } from '../config/constants.js';

export default class EnemyTank extends Tank {
  static createRandom(props) {
    return new EnemyTank(props);
  }

  constructor(props) {
    super(props);

    const { tankOptions } = props;
    this.tankOptions = tankOptions;

    this.actionDelay =
      this.tankOptions.BASE_CHANGE_DIRECTION_DELAY +
      ((Math.random() * this.tankOptions.CHANGE_DIRECTION_DELAY_MULTIPLEXER * 8) >> 0);
    this.shootDelay =
      this.tankOptions.BASE_FIRE_DELAY +
      ((Math.random() * this.tankOptions.FIRE_DELAY_MULTIPLEXER * 8) >> 0);
  }

  update() {
    this.actionDelay--;
    this.shootDelay--;

    if (this.actionDelay <= 0) {
      this.actionDelay =
        this.tankOptions.BASE_CHANGE_DIRECTION_DELAY +
        ((Math.random() * this.tankOptions.CHANGE_DIRECTION_DELAY_MULTIPLEXER * 8) >> 0);

      const changeDirection = Math.floor(Math.random() * 2) - 1;

      let newDirection = this.direction + changeDirection;
      if (newDirection > 4) newDirection = 1;
      if (newDirection < 1) newDirection = 4;

      // this._stickToGrid();

      switch (newDirection) {
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
      this.shootDelay =
        this.tankOptions.BASE_FIRE_DELAY +
        ((Math.random() * this.tankOptions.FIRE_DELAY_MULTIPLEXER * 8) >> 0);

      this.emit(event.object.FIRE, this);
    }

    const speed = this.world.hasCollision(this) ? 0 : this.speed;
    if (!speed) this.actionDelay = this.actionDelay >> 1;
    if (!speed) this.shootDelay = this.shootDelay >> 1;

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
