export default class Sprite {
  constructor(source, spriteMap) {
    this.source = source;
    this.spriteMap = spriteMap;
    this.image = new Image();
  }

  async load() {
    return new Promise((resolve, reject) => {
      this.image.onload = resolve;
      this.image.onerror = reject;

      this.image.src = this.source;
    });
  }

  getTile(tile) {
    return this.spriteMap[tile];
  }
}
