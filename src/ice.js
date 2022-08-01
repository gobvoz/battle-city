import Wall from './wall.js';

import { WorldOption, IceOption, ObjectType } from './constants.js';

export default class Ice extends Wall {
  constructor({ x, y, ...rest }) {
    const options = {
      x,
      y,
      width: WorldOption.TILE_SIZE,
      height: WorldOption.TILE_SIZE,
      sprites: IceOption.SPRITES,
    };

    super({ ...rest, ...options });
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
