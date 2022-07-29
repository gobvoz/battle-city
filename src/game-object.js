export default class GameObject {
  constructor({ world, x, y, width, height, sprites }) {
    this.world = world;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.sprites = sprites;
  }

  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
}
