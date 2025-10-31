import GameObject from '../core/game-object.js';

import { WorldOption, WaterOption, ObjectType } from '../config/constants.js';

export default class Water extends GameObject {
  constructor(coordinates) {
    const options = {
      width: WorldOption.TILE_SIZE,
      height: WorldOption.TILE_SIZE,
      sprites: WaterOption.SPRITES,
    };

    super({ ...coordinates, ...options });

    this.currentSprite = 0;

    this._changeAnimationFrame = this._changeAnimationFrame.bind(this);
    this.interval = setInterval(this._changeAnimationFrame, 400);
  }

  _changeAnimationFrame() {
    this.currentSprite =
      this.sprites.length === this.currentSprite + 1 ? 0 : this.currentSprite + 1;
  }

  hit() {
    return false;
  }
  moveThrough(object) {
    if (object.type === ObjectType.PROJECTILE) return false;

    return true;
  }

  get sprite() {
    return this.sprites[this.currentSprite];
  }
}
