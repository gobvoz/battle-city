import Tank from './tank.js';

export default class Game {
  constructor({ world, view, levels }) {
    this.world = world;
    this.view = view;
    this.levels = levels;

    this.loop = this.loop.bind(this);
  }

  async init() {
    await this.view.init();
  }

  start() {
    requestAnimationFrame(this.loop);
  }

  loop() {
    this.world.update();
    this.view.render(this.world);

    requestAnimationFrame(this.loop);
  }
}
