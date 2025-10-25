import { Input } from './core/input-handler.js';
import { AudioManager } from './core/audio-manager.js';

import { EventEmitter } from './core/event-emitter.js';
import { MenuState } from './states/menu.state.js';
import { PlayState } from './states/play.state.js';
import { GameOverState } from './states/game-over.state.js';

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.DEBUG = false;

    const game = this;

    // this.context = {
    //   get DEBUG() {
    //     return game.DEBUG;
    //   },
    //   get events() {
    //     return game.events;
    //   },
    //   get input() {
    //     return game.input;
    //   },
    // };
    // this.context = {
    //   DEBUG: () => game.DEBUG,
    //   events: () => game.events,
    //   input: () => game.input,
    // };
    this.context = {};
    Object.defineProperties(this.context, {
      DEBUG: { get: () => game.DEBUG },
      events: { get: () => game.events },
      input: { get: () => game.input },
    });

    this.events = new EventEmitter();
    this.audio = new AudioManager();

    this.input = new Input(this.context);
    this.state = new MenuState(this.context);

    this.lastTime = 0;
    this.entities = [];

    this.running = false;

    this.loop = this.loop.bind(this);
    this.changeState = this.changeState.bind(this);
    this.toggleDebug = this.toggleDebug.bind(this);
  }

  start() {
    this.events.on('state:change', this.changeState);
    this.events.on('key:KeyD', this.toggleDebug);
    // this.level.load().then(() => {
    //   this.lastTime = performance.now();
    //   requestAnimationFrame(this.gameLoop.bind(this));
    // });
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
    this.state.update(deltaTime, this.input);

    for (const entity of this.entities) {
      entity.update(deltaTime, this.input, this.level);
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.state.render(this.ctx);
    for (const entity of this.entities) {
      entity.render(this.ctx);
    }
  }

  changeState(stateName) {
    this.events.off('state:change', this.changeState);

    switch (stateName) {
      case 'menu':
        this.state = new MenuState(this.context);
        break;
      case 'play':
        this.state = new PlayState(this.context);
        break;
      case 'pause':
        break;
      case 'gameover':
        this.state = new GameOverState(this.context);
        break;
      case 'victory':
        this.state = new VictoryState(this.context);
        break;
      default:
        console.warn(`Unknown state: ${stateName}`);
    }

    this.state.start();
    this.events.on('state:change', this.changeState);
  }

  toggleDebug(key) {
    if (key !== 'pressed') return;
    if (!this.input.isKeyPressed('ControlLeft') && !this.input.isKeyPressed('ControlRight')) return;

    this.DEBUG = !this.DEBUG;
    console.log(`Debug mode: ${this.DEBUG}`);
  }
}
