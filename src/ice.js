import GameObject from './game-object.js';

import { WorldOption, IceOption } from './constants.js';

export default class Ice extends GameObject {
  constructor(coordinates) {
    const options = {
      width: WorldOption.TILE_SIZE,
      height: WorldOption.TILE_SIZE,
      sprites: IceOption.SPRITES,
    };

    super({ ...coordinates, ...options });
  }

  hit() {
    return false;
  }
  moveThrough() {
    return false;
  }

  get sprite() {
    return this.sprites[0];
  }
}
