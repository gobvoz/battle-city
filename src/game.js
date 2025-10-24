const DEFAULT_DELAY = 0;

export default class Game {
  debugDelay = DEFAULT_DELAY;

  activeKeys = new Set();

  fps = 0;
  fpsCounter = 0;

  busyTime = 0;
  busyTimeCounter = 0;

  currentMoveState = 'standby'; // "standby", "move"

  constructor({ world, view, stages, audio }) {
    this.world = world;
    this.view = view;
    this.stages = stages;
    this.audio = audio;

    this.currentStage = 3;

    this.player1Tank = null;
    this.player2Tank = null;

    this.player1Lives = 2;
    this.player2Lives = 2;

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

    this.audio.play('player-standby', { loop: true });
    this.audio.play('game-start', { loop: false });

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
    if (this.debugDelay > 0) {
      this.debugDelay--;
      requestAnimationFrame(this.loop);

      return;
    }

    this.debugDelay = DEFAULT_DELAY;

    const now = window.performance.now();
    this.fpsCounter++;

    this.world.update(this.activeKeys);
    this.view.render(this);

    requestAnimationFrame(this.loop);

    const delta = window.performance.now() - now;

    this.busyTimeCounter += delta;
  }

  handleKeyDown(evt) {
    this.activeKeys.add(evt.code);

    let moving = false;

    if (this.player1Tank) {
      switch (evt.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.player1Tank.moveUp();
          moving = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.player1Tank.moveDown();
          moving = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.player1Tank.moveLeft();
          moving = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.player1Tank.moveRight();
          moving = true;
          break;
        case 'Space':
          this.player1Tank.fire();
          break;
      }
    }

    if (moving && this.currentMoveState !== 'move' && this.player1Tank.state === 'active') {
      this.currentMoveState = 'move';
      this.audio.play('player-move', { loop: true });
    }

    evt.preventDefault();
  }

  handleKeyUp(evt) {
    this.activeKeys.delete(evt.code);

    if (this.player1Tank) {
      switch (evt.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.player1Tank.stopUp();
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.player1Tank.stopDown();
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.player1Tank.stopLeft();
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.player1Tank.stopRight();
          break;
      }
    }

    const stillMoving =
      this.activeKeys.has('KeyW') ||
      this.activeKeys.has('ArrowUp') ||
      this.activeKeys.has('KeyS') ||
      this.activeKeys.has('ArrowDown') ||
      this.activeKeys.has('KeyA') ||
      this.activeKeys.has('ArrowLeft') ||
      this.activeKeys.has('KeyD') ||
      this.activeKeys.has('ArrowRight');

    if (
      !stillMoving &&
      this.currentMoveState !== 'standby' &&
      this.player1Tank.state === 'active'
    ) {
      this.currentMoveState = 'standby';
      this.audio.play('player-standby', { loop: true });
    }

    evt.preventDefault();
  }
}
