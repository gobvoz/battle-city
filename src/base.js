import GameObject from './game-object.js';

import { BaseOption } from './constants.js';

export default class Base extends GameObject {
  constructor({ ...rest }) {
    const options = {
      x: BaseOption.START_X,
      y: BaseOption.START_Y,
      width: BaseOption.WIDTH,
      height: BaseOption.HEIGHT,
      sprites: BaseOption.SPRITES,
    };

    super({ ...rest, ...options });

    this.destroyed = false;
  }

  update() {
    // do nothing
  }

  get sprite() {
    return [
      this.sprites[Number(this.destroyed)][0] * this.width,
      this.sprites[Number(this.destroyed)][1] * this.height,
    ];
  }

  hit() {
    this.destroyed = true;
  }
}
