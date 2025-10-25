import GameObject from './game-object.js';

import { Direction, ExplosiveOption, WorldOption } from './constants.js';

export default class Explosive extends GameObject {
  constructor({ projectile, tank, base, ...rest }) {
    let options = {};

    if (projectile) {
      options = {
        x: 0,
        y: 0,
        width: ExplosiveOption.SMALL_WIDTH,
        height: ExplosiveOption.SMALL_HEIGHT,
        sprites: ExplosiveOption.SPRITES[0],
      };
    }

    if (tank) {
      options = {
        x: 0,
        y: 0,
        width: ExplosiveOption.BIG_WIDTH,
        height: ExplosiveOption.BIG_HEIGHT,
        sprites: ExplosiveOption.SPRITES[1],
      };
    }

    if (base) {
      options = {
        x: 0,
        y: 0,
        width: ExplosiveOption.BIG_WIDTH,
        height: ExplosiveOption.BIG_HEIGHT,
        sprites: ExplosiveOption.SPRITES[1],
      };
    }

    super({ ...rest, ...options });

    this.projectile = projectile;
    this.tank = tank;
    this.base = base;

    if (projectile) {
      this.x = this._getStartX(projectile);
      this.y = this._getStartY(projectile);
    }
    if (tank) {
      this.x = tank.x - (this.width >> 1) + (tank.width >> 1);
      this.y = tank.y - (this.height >> 1) + (tank.height >> 1);
    }
    if (base) {
      this.x = base.x - (this.width >> 1) + (base.width >> 1);
      this.y = base.y - (this.height >> 1) + (base.height >> 1);
    }

    this.animationFrame = 0;

    this._changeAnimationFrame = this._changeAnimationFrame.bind(this);
    this._removeExplosive = this._removeExplosive.bind(this);

    this.interval = setInterval(this._changeAnimationFrame, 150);
    setTimeout(this._removeExplosive, 450);
  }

  _getStartX(projectile) {
    switch (projectile.direction) {
      case Direction.UP:
        return projectile.x + (projectile.width >> 1) - (this.width >> 1);
      case Direction.DOWN:
        return projectile.x + (projectile.width >> 1) - (this.width >> 1);
      case Direction.LEFT:
        return projectile.x - (this.width >> 1);
      case Direction.RIGHT:
        return projectile.x + projectile.width - (this.width >> 1);
    }
  }
  _getStartY(projectile) {
    switch (projectile.direction) {
      case Direction.UP:
        return projectile.y - (this.height >> 1);
      case Direction.DOWN:
        return projectile.y + projectile.height - (this.height >> 1);
      case Direction.LEFT:
        return projectile.y + (projectile.height >> 1) - (this.height >> 1);
      case Direction.RIGHT:
        return projectile.y + (projectile.height >> 1) - (this.height >> 1);
    }
  }

  _changeAnimationFrame() {
    this.animationFrame = (this.animationFrame + 1) % this.sprites.length;
  }

  _removeExplosive() {
    clearInterval(this.interval);
    this.emit('destroy', this);
  }

  get sprite() {
    return [
      this.sprites[this.animationFrame][0] * WorldOption.UNIT_SIZE,
      this.sprites[this.animationFrame][1] * WorldOption.UNIT_SIZE,
    ];
  }
}
