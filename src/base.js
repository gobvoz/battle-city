import GameObject from './game-object.js';

export default class Base extends GameObject {
  constructor({ ...rest }) {
    super({ ...rest });

    this.destroyed = false;
  }

  update = () => {
    // do nothing
  };

  get sprite() {
    return [
      this.sprites[Number(this.destroyed)][0] * this.width,
      this.sprites[Number(this.destroyed)][1] * this.height,
    ];
  }
}
