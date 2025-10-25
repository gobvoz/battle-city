import GameObject from './game-object.js';

import { WorldOption, SteelWallOption, ObjectType } from './constants.js';

export default class SteelWal extends GameObject {
  constructor(coordinates) {
    const options = {
      width: WorldOption.TILE_SIZE,
      height: WorldOption.TILE_SIZE,
      sprites: SteelWallOption.SPRITES,
    };

    super({ ...coordinates, ...options });

    this.currentSprite = 0;
  }

  hit(object) {
    if (object.type !== ObjectType.PROJECTILE) return false;

    if (object.power > 1) {
      this.emit('destroy', this);
    }
    return true;
  }
  moveThrough() {
    return true;
  }

  get sprite() {
    return this.sprites[0];
  }
}
