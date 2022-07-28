import { WorldOption } from './constants.js';

export default class Base {
  constructor(world, x, y, sprites) {
    this.world = world;
    this.x = x;
    this.y = y;
    this.width = WorldOption.UNIT_SIZE;
    this.height = WorldOption.UNIT_SIZE;
    this.sprites = sprites;

    this.destroyed = false;
  }

  update = () => {
    // do nothing
  };

  getSprite = () => [
    this.sprites[Number(this.destroyed)][0] * this.width,
    this.sprites[Number(this.destroyed)][1] * this.height,
  ];
}
