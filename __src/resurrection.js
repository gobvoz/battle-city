import GameObject from './game-object.js';

import { WorldOption, ResurrectionOption, KeyCode } from './constants.js';

export default class Resurrection extends GameObject {
  constructor({ x, y, tankType, options: tankOptions, ...rest }) {
    const options = {
      x,
      y,
      width: ResurrectionOption.WIDTH,
      height: ResurrectionOption.HEIGHT,
      sprites: ResurrectionOption.SPRITES,
    };

    super({ ...rest, ...options });

    this.tankType = tankType;
    this.tankOptions = tankOptions;

    this.animationFrame = 0;

    this._changeAnimationFrame = this._changeAnimationFrame.bind(this);
    this._removeResurrection = this._removeResurrection.bind(this);

    this.interval = setInterval(this._changeAnimationFrame, ResurrectionOption.ANIMATION_INTERVAL);
    setTimeout(this._removeResurrection, ResurrectionOption.ANIMATION_TIME);
  }

  _changeAnimationFrame() {
    this.animationFrame = this.animationFrame + 1;

    if (this.animationFrame === this.sprites.length) {
      this.animationFrame = 0;
    }
  }

  _removeResurrection() {
    clearInterval(this.interval);
    this.emit('destroy', this);
  }

  get sprite() {
    return [
      this.sprites[this.animationFrame][0] * this.width,
      this.sprites[this.animationFrame][1] * this.height,
    ];
  }
}
