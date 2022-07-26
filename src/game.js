import Tank from './tank.js';

export default class Game {
  constructor({ world, view, levels }) {
    this.world = world;
    this.view = view;
    this.levels = levels;

    this.loop = this.loop.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  async init() {
    await this.view.init();

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  start() {
    requestAnimationFrame(this.loop);
  }

  loop() {
    this.world.update();
    this.view.render(this.world);

    requestAnimationFrame(this.loop);
  }

  handleKeyDown({ code }) {
    switch (code) {
      case 'KeyW':
      case 'ArrowUp':
        this.world.player1Tank.moveUp();
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.world.player1Tank.moveDown();
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.world.player1Tank.moveLeft();
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.world.player1Tank.moveRight();
        break;
      case 'Space':
        this.world.player1Tank.fire();
        break;
      case 'Enter':
        break;
      default:
        break;
    }
  }
  handleKeyUp({ code }) {
    switch (code) {
      case 'KeyW':
      case 'ArrowUp':
        this.world.player1Tank.stopUp();
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.world.player1Tank.stopDown();
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.world.player1Tank.stopLeft();
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.world.player1Tank.stopRight();
        break;
      case 'Space':
        break;
      case 'Enter':
        break;
      default:
        break;
    }
  }
}
