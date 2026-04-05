import Tank from './tank.js';
import { event } from '../config/events.js';
import { Direction, EnemyType, WorldOption } from '../config/constants.js';
import type { TankTypeValue } from '../config/constants.type.js';
import type { IEnemyTankOptions } from './entities.type.js';
import type { IWorld } from '../world/world.type.js';

export interface EnemyTankProps {
  type: TankTypeValue;
  tankOptions: IEnemyTankOptions;
  world: IWorld;
  x: number;
  y: number;
  isFlashing?: boolean;
}

export default class EnemyTank extends Tank {
  declare protected readonly tankOptions: IEnemyTankOptions;

  actionDelay: number;
  shootDelay: number;
  isFlashing: boolean;

  private _flashTimer = 0;
  private _flashFrame = false;

  static createRandom(props: EnemyTankProps): EnemyTank {
    return new EnemyTank(props);
  }

  constructor(props: EnemyTankProps) {
    super(props);

    this.actionDelay =
      this.tankOptions.BASE_CHANGE_DIRECTION_DELAY +
      ((Math.random() * this.tankOptions.CHANGE_DIRECTION_DELAY_MULTIPLEXER * 8) >> 0);
    this.shootDelay =
      this.tankOptions.BASE_FIRE_DELAY +
      ((Math.random() * this.tankOptions.FIRE_DELAY_MULTIPLEXER * 8) >> 0);

    this.isFlashing = props.isFlashing ?? false;
  }

  override get sprite(): [number, number] {
    let xOffset = 0;
    let yOffset = 0;

    if (this.isFlashing && this._flashFrame) {
      // Red flash (X=8-15, Y+8) — same for all enemy types
      yOffset = 8;
    } else if (this.tankOptions.ENEMY_TYPE === EnemyType.ARMOR) {
      // Armor damage colors (base is gray: X=8-15, Y=7)
      if (this.health >= 3) {
        // Green: X=0-7, Y=15
        xOffset = -8;
        yOffset = 8;
      } else if (this.health === 2) {
        // Yellow: X=0-7, Y=7
        xOffset = -8;
      }
      // 1 HP: Gray (base) — no offset
    }

    return [
      (this.sprites[this.direction][this.animationFrame][0] + xOffset) * WorldOption.UNIT_SIZE,
      (this.sprites[this.direction][this.animationFrame][1] + yOffset) * WorldOption.UNIT_SIZE,
    ];
  }

  update(): void {
    if (this.isFlashing) {
      this._flashTimer++;
      if (this._flashTimer >= 12) {
        this._flashTimer = 0;
        this._flashFrame = !this._flashFrame;
      }
    }

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

    const speed = (this.world as import('../world/world.type.js').IWorld).hasCollision(this)
      ? 0
      : this.speed;
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
