import EventManager from './event-emitter.js';

export default class Wall extends EventManager {
  constructor({ terrainType, x, y, width, height, sprites }) {
    super();

    this.terrainType = terrainType;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sprites = sprites;
  }

  get top() {
    return this.y;
  }
  get right() {
    return this.x + this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  get left() {
    return this.x;
  }
}
