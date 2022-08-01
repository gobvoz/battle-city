import Wall from './wall.js';

import { WorldOption, BrickWallOption } from './constants.js';

export default class BrickWall extends Wall {
  constructor({ x, y, ...rest }) {
    const options = {
      x,
      y,
      width: WorldOption.TILE_SIZE,
      height: WorldOption.TILE_SIZE,
      sprites: BrickWallOption.SPRITES,
    };

    super({ ...rest, ...options });

    this.currentSprite = 0;
  }

  hit(projectile) {
    if (this.currentSprite !== 0 || projectile.power > 1) {
      this.emit('destroy', this);
      return;
    }

    this.currentSprite = projectile.direction;
  }

  get sprite() {
    return this.sprites[this.currentSprite];
  }
}
