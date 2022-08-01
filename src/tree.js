import Wall from './wall.js';

import { WorldOption, TreeOption } from './constants.js';

export default class Tree extends Wall {
  constructor({ x, y, ...rest }) {
    const options = {
      x,
      y,
      width: WorldOption.TILE_SIZE,
      height: WorldOption.TILE_SIZE,
      sprites: TreeOption.SPRITES,
    };

    super({ ...rest, ...options });

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
