export default class Game {
  activeKeys = new Set();

  fps = 0;
  fpsCounter = 0;

  busyTime = 0;
  busyTimeCounter = 0;

  constructor({ world, view, stages }) {
    this.world = world;
    this.view = view;
    this.stages = stages;
    this.currentStage = 0;

    this.player1Tank = null;
    this.player2Tank = null;

    this.loop = this.loop.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  async init() {
    this.world.init(this.stages[this.currentStage], this);
    await this.view.init();

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  start() {
    requestAnimationFrame(this.loop);

    setInterval(() => {
      this.fps = this.fpsCounter * 2;
      this.fpsCounter = 0;

      this.busyTime = String(this.busyTimeCounter / this.fps)
        .padEnd(5, ' ')
        .slice(0, 5);
      this.busyTimeCounter = 0;
    }, 500);
  }

  loop() {
    const now = window.performance.now();
    this.fpsCounter++;

    this.world.update(this.activeKeys);
    this.view.render(this.fps, this.busyTime);

    requestAnimationFrame(this.loop);

    const delta = window.performance.now() - now;

    this.busyTimeCounter += delta;
  }

  handleKeyDown(evt) {
    this.activeKeys.add(evt.code);

    switch (evt.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.player1Tank && this.player1Tank.moveUp();
        evt.preventDefault();
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.player1Tank && this.player1Tank.moveDown();
        evt.preventDefault();
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.player1Tank && this.player1Tank.moveLeft();
        evt.preventDefault();
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.player1Tank && this.player1Tank.moveRight();
        evt.preventDefault();
        break;
      case 'Space':
        this.player1Tank && this.player1Tank.fire();
        evt.preventDefault();
        break;
      case 'Enter':
        evt.preventDefault();
        break;
      default:
        break;
    }
  }
  handleKeyUp(evt) {
    this.activeKeys.delete(evt.code);

    switch (evt.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.player1Tank && this.player1Tank.stopUp();
        evt.preventDefault();
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.player1Tank && this.player1Tank.stopDown();
        evt.preventDefault();
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.player1Tank && this.player1Tank.stopLeft();
        evt.preventDefault();
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.player1Tank && this.player1Tank.stopRight();
        evt.preventDefault();
        break;
      case 'Space':
        evt.preventDefault();
        break;
      case 'Enter':
        evt.preventDefault();
        break;
      default:
        break;
    }
  }
}
