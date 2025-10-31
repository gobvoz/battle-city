import GameObject from '../core/game-object.js';
import { event } from '../config/events.js';

import { BaseOption, ObjectType } from '../config/constants.js';

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

  hit(object) {
    if (object.type !== ObjectType.PROJECTILE) return false;

    this.emit(event.object.DESTROYED, this);
    this.destroyed = true;
  }
  moveThrough() {
    return true;
  }
}
