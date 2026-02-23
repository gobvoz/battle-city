export class Sprite {
  source: string;
  image: HTMLImageElement;

  constructor(source: string) {
    this.source = source;
    this.image = new Image();
  }

  async load(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.image.onload = () => resolve();
      this.image.onerror = reject;
      this.image.src = this.source;
    });
  }
}
