import { IntroState } from './intro.state.js';
import { PauseState } from './pause.state.js';

export class PlayState {
  constructor(game) {
    this.game = game;
    this.paused = false;

    this.subState = new IntroState(this.game);
    this.pause = new PauseState(this.game);

    this.completeIntro = this.completeIntro.bind(this);
    this.exit = this.exit.bind(this);
    this.togglePause = this.togglePause.bind(this);
  }

  start(levelNumber) {
    if (this.game.DEBUG) console.log('Entering Play State');

    this.levelNumber = levelNumber || 1;

    this.subState.start(this.levelNumber);

    this.game.events.on('intro:complete', this.completeIntro);
    this.game.events.on('pause:toggle', this.togglePause);
  }

  update(deltaTime) {
    if (this.subState) this.subState.update(deltaTime);

    if (this.paused) {
      this.pause.update(deltaTime);
      return;
    }
  }

  render(ctx) {
    if (this.subState) this.subState.render(ctx, this.levelNumber);
    this.pause.render(ctx);
  }

  exit() {
    if (this.game.DEBUG) console.log('Exiting Play State');

    this.game.events.off('intro:complete', this.completeIntro);
    this.game.events.off('pause:toggle', this.togglePause);

    if (this.subState) this.subState.exit();
    if (this.pause) this.pause.exit();

    this.game.events.emit('state:change', 'gameover');
  }

  completeIntro() {
    if (this.game.DEBUG) console.log('Intro complete, starting gameplay');

    this.game.events.off('intro:complete', this.completeIntro);
    this.subState = null;

    this.pause.start();
  }

  togglePause() {
    if (this.intro) return;

    this.paused = !this.paused;

    if (this.game.DEBUG) console.log(this.paused ? 'Paused gameplay' : 'Resumed gameplay');
  }
}
