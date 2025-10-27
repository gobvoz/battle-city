import { Input } from './core/input-handler.js';
import { AudioManager } from './core/audio-manager.js';
import { keyCode } from './config/key-codes.js';
import { event } from './config/events.js';

import { EventEmitter } from './core/event-emitter.js';
import { MenuState } from './states/menu.state.js';
import { PlayState } from './states/play.state.js';
import { GameOverState } from './states/game-over.state.js';
import { ResultsState } from './states/results.state.js';

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.DEBUG = false;

    const game = this;

    this.context = {};
    Object.defineProperties(this.context, {
      DEBUG: { get: () => game.DEBUG },
      events: { get: () => game.events },
      input: { get: () => game.input },
    });

    this.events = new EventEmitter(this.context);
    this.audio = new AudioManager();

    this.input = new Input(this.context);
    this.state = new MenuState(this.context);

    this.lastTime = 0;

    this.running = false;

    this.loop = this.loop.bind(this);
    this.changeState = this.changeState.bind(this);
    this.toggleDebug = this.toggleDebug.bind(this);
  }

  start() {
    this.events.on(event.CHANGE_STATE, this.changeState);
    this.events.on(event.key.D, this.toggleDebug);

    this.lastTime = performance.now();
    this.running = true;

    this.state.start();
    requestAnimationFrame(this.loop);
  }

  loop(currentTime) {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

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
      default:
        console.warn(`Unknown state: ${stateName}`);
    }

    this.state.start();
    this.events.on(event.CHANGE_STATE, this.changeState);
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
