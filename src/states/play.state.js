import { IntroState } from './intro.state.js';
import { PauseState } from './pause.state.js';

import { event } from '../config/events.js';

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

    this.game.events.on(event.COMPLETE_INTRO, this.completeIntro);
    this.game.events.on(event.TOGGLE_PAUSE, this.togglePause);
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

    this.game.events.off(event.COMPLETE_INTRO, this.completeIntro);
    this.game.events.off(event.TOGGLE_PAUSE, this.togglePause);

    if (this.subState) this.subState.exit();
    if (this.pause) this.pause.exit();

    this.game.events.emit(event.CHANGE_STATE, event.state.GAME_OVER);
  }

  completeIntro() {
    if (this.game.DEBUG) console.log('Intro complete, starting gameplay');

    this.game.events.off(event.COMPLETE_INTRO, this.completeIntro);
    this.subState = null;

    this.pause.start();
  }

  togglePause() {
    if (this.intro) return;

    this.paused = !this.paused;

    if (this.game.DEBUG) console.log(this.paused ? 'Paused gameplay' : 'Resumed gameplay');
  }
}
