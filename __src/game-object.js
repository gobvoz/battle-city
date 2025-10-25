import EventEmitter from './event-emitter.js';

export default class GameObject extends EventEmitter {
  constructor({ world, x, y, width, height, sprites }) {
    super();

    this.world = world;

    this.realX = x;
    this.realY = y;
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
  update() {}
  hit() {
    return true;
  }
  moveThrough() {
    return true;
  }
}
