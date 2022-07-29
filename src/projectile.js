import GameObject from './game-object.js';

import { Direction, WorldOption } from './constants.js';

export default class Projectile extends GameObject {
  constructor({ tank, direction, speed, playerIndex, ...rest }) {
    super({ ...rest });

    this.tank = tank;
    this.x = this._getStartX(tank);
    this.y = this._getStartY(tank);
    this.direction = direction;
    this.speed = speed;
    this.playerIndex = playerIndex;
  }

  _getStartX(tank) {
    switch (tank.direction) {
      case Direction.UP:
        return tank.x + (tank.width >> 1) - (this.width >> 1);
      case Direction.DOWN:
        return tank.x + (tank.width >> 1) - (this.width >> 1);
      case Direction.LEFT:
        return tank.x;
      case Direction.RIGHT:
        return tank.x + tank.width;
    }
  }
  _getStartY(tank) {
    switch (tank.direction) {
      case Direction.UP:
        return tank.y;
      case Direction.DOWN:
        return tank.y + tank.height;
      case Direction.LEFT:
        return tank.y + (tank.height >> 1) - (this.height >> 1);
      case Direction.RIGHT:
        return tank.y + (tank.height >> 1) - (this.height >> 1);
    }
  }

  get sprite() {
    return [
      this.sprites[this.direction][0] * WorldOption.UNIT_SIZE,
      this.sprites[this.direction][1] * WorldOption.UNIT_SIZE,
    ];
  }

  update() {
    const hasCollision = this.world.hasCollision(this);

    if (hasCollision) {
      this.world.removeProjectile(this);
    }

    const speed = hasCollision ? 0 : this.speed;

    if (this.direction === Direction.UP) {
      this.y -= speed;
    } else if (this.direction === Direction.DOWN) {
      this.y += speed;
    } else if (this.direction === Direction.LEFT) {
      this.x -= speed;
    } else if (this.direction === Direction.RIGHT) {
      this.x += speed;
    }
  }
}
