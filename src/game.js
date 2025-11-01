import { EventEmitter } from './core/event-emitter.js';
import { Input } from './core/input-handler.js';
import { AudioManager } from './core/audio-manager.js';
import { Sprite } from './core/sprite.js';

import { keyCode } from './config/key-codes.js';
import { event } from './config/events.js';

import { MenuState } from './states/menu.state.js';
import { PlayState } from './states/play.state.js';
import { GameOverState } from './states/game-over.state.js';
import { ResultsState } from './states/results.state.js';
import { NextLevelState } from './states/next-level.state.js';
import { RestartGameState } from './states/restart-game.state.js';

const DEFAULT_DELAY = 0;

export class Game {
  fps = 0;
  fpsCounter = 0;

  busyTime = 0;
  busyTimeCounter = 0;

  constructor(ctx) {
    this.ctx = ctx;
    this.DEBUG = false;

    this.currentLevel = 1;

    this.player1Lives = 2;
    this.player2Lives = 2;

    const game = this;

    this.context = {};
    Object.defineProperties(this.context, {
      DEBUG: { get: () => game.DEBUG }, // need to remove (switch to vite)
      events: { get: () => game.events },
      input: { get: () => game.input },
      sprite: { get: () => game.sprite },
      currentLevel: {
        get: () => game.currentLevel,
        set: level => (game.currentLevel = level),
      },
      player1Lives: {
        get: () => game.player1Lives,
        set: lives => (game.player1Lives = lives),
      },
      player2Lives: {
        get: () => game.player2Lives,
        set: lives => (game.player2Lives = lives),
      },
      fps: { get: () => game.fps },
      busyTime: { get: () => game.busyTime },
    });

    this.events = new EventEmitter(this.context);
    this.audio = new AudioManager();
    this.sprite = new Sprite('./src/assets/sprites/sprite.png');

    this.input = new Input(this.context);
    this.state = new MenuState(this.context);

    this.lastTime = 0;

    this.running = false;

    this.loop = this.loop.bind(this);
    this.changeState = this.changeState.bind(this);
    this.toggleDebug = this.toggleDebug.bind(this);
  }

  async start() {
    this.events.on(event.CHANGE_STATE, this.changeState);
    this.events.on(event.key.D, this.toggleDebug);

    this.lastTime = performance.now();
    this.running = true;

    await this.sprite.load();
    this.state.start();
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

  loop(currentTime) {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (this.debugDelay > 0) {
      this.debugDelay--;
      requestAnimationFrame(this.loop);

      return;
    }

    this.debugDelay = DEFAULT_DELAY;

    this.update(deltaTime);
    this.render();

    const now = window.performance.now();
    this.fpsCounter++;

    if (this.running) requestAnimationFrame(this.loop);
  }

  update(deltaTime) {
    this.state.update(deltaTime);
  }

  render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.state.render(this.ctx);
  }

  changeState(newStateName) {
    this.events.off(event.CHANGE_STATE, this.changeState);
    this.state.exit();

    switch (newStateName) {
      case event.state.MENU:
        this.state = new MenuState(this.context);
        break;
      case event.state.PLAY:
        this.state = new PlayState(this.context);
        break;
      case event.state.GAME_OVER:
        this.state = new GameOverState(this.context);
        break;
      case event.state.RESULTS:
        this.state = new ResultsState(this.context);
        break;
      case event.state.NEXT_LEVEL:
        this.state = new NextLevelState(this.context);
        break;
      case event.state.RESTART:
        this.state = new RestartGameState(this.context);
        break;
      default:
        console.warn(`Unknown state: ${newStateName}`);
    }

    this.events.on(event.CHANGE_STATE, this.changeState);
    this.state.start();
  }

  toggleDebug(key) {
    if (key !== 'pressed') return;

    if (
      !this.input.isKeyPressed(keyCode.CONTROL_LEFT) &&
      !this.input.isKeyPressed(keyCode.CONTROL_RIGHT)
    )
      return;

    this.DEBUG = !this.DEBUG;
    console.log(`Debug mode: ${this.DEBUG}`);
  }
}
