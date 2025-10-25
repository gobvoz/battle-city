import GameObject from './game-object.js';

import { WorldOption, TreeOption } from './constants.js';

export default class Tree extends GameObject {
  constructor(coordinates) {
    const options = {
      width: WorldOption.TILE_SIZE,
      height: WorldOption.TILE_SIZE,
      sprites: TreeOption.SPRITES,
    };

    super({ ...coordinates, ...options });

    this.zIndex = TreeOption.Z_INDEX;
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
