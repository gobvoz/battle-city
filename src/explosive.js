import GameObject from './game-object.js';

import { Direction, ExplosiveOption } from './constants.js';

export default class Explosive extends GameObject {
  constructor({ projectile, ...rest }) {
    const options = {
      x: 0,
      y: 0,
      width: ExplosiveOption.WIDTH,
      height: ExplosiveOption.HEIGHT,
      sprites: ExplosiveOption.SPRITES,
    };

    super({ ...rest, ...options });

    this.projectile = projectile;

    this.x = this._getStartX(projectile);
    this.y = this._getStartY(projectile);

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

  update() {}

  get sprite() {
    return [
      this.sprites[this.animationFrame][0] * this.width,
      this.sprites[this.animationFrame][1] * this.height,
    ];
  }
}
