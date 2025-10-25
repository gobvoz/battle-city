export default class Sprite {
  constructor(source) {
    this.source = source;
    this.image = new Image();
  }

  async load() {
    return new Promise((resolve, reject) => {
      this.image.onload = resolve;
      this.image.onerror = reject;

      this.image.src = this.source;
    });
  }
}
