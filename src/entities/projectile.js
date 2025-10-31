import GameObject from '../core/game-object.js';
import { event } from '../config/events.js';

import { Direction, WorldOption, ProjectileOption, ObjectType } from '../config/constants.js';

export default class Projectile extends GameObject {
  constructor({ tank, direction, ...rest }) {
    const options = {
      x: 0,
      y: 0,
      width: ProjectileOption.WIDTH,
      height: ProjectileOption.HEIGHT,
      sprites: ProjectileOption.SPRITES,
    };

    super({ ...rest, ...options });

    this.tank = tank;
    this.power = tank.power;

    this.realX = this._getStartX(tank);
    this.realY = this._getStartY(tank);
    this.x = this._getStartX(tank);
    this.y = this._getStartY(tank);

    this.direction = direction;
    this.speed = tank.projectileSpeed;
    this.type = ObjectType.PROJECTILE;
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
      this.emit(event.object.DESTROYED, this);
    }

    const speed = hasCollision ? 0 : this.speed;

    if (this.direction === Direction.UP) {
      this.realY -= speed;
    } else if (this.direction === Direction.DOWN) {
      this.realY += speed;
    } else if (this.direction === Direction.LEFT) {
      this.realX -= speed;
    } else if (this.direction === Direction.RIGHT) {
      this.realX += speed;
    }
    this.x = this.realX >> 0;
    this.y = this.realY >> 0;
  }
}
