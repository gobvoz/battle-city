import { IntroState } from './intro.state.js';
import { PauseState } from './pause.state.js';

export class PlayState {
  constructor(game) {
    this.game = game;

    this.subState = new IntroState(this.game);

    this.completeIntro = this.completeIntro.bind(this);
    this.exit = this.exit.bind(this);
  }

  start(levelNumber) {
    if (this.game.DEBUG) console.log('Entering Play State');

    this.levelNumber = levelNumber || 1;

    this.subState.start(this.levelNumber);

    this.game.events.on('intro:complete', this.completeIntro);
    // FIXME switch to pause state on Escape key
    this.game.events.on('key:Escape', this.exit);
  }

  update(deltaTime) {
    if (this.subState) this.subState.update(deltaTime);
  }

  render(ctx) {
    if (this.subState) this.subState.render(ctx, this.levelNumber);
  }

  exit() {
    if (this.game.DEBUG) console.log('Exiting Play State');

    this.game.events.off('key:Escape', this.exit);
    this.game.events.off('intro:complete', this.completeIntro);

    if (this.subState) this.subState.exit();

    this.game.events.emit('state:change', 'gameover');
  }

  completeIntro() {
    if (this.game.DEBUG) console.log('Intro complete, starting gameplay');

    this.game.events.off('intro:complete', this.completeIntro);
    this.subState = null;
  }
}
