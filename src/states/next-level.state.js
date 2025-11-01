import { event } from '../config/events.js';

export class NextLevelState {
  constructor(game) {
    this.game = game;
  }

  start() {
    if (this.game.DEBUG) console.log('Entering Next Level State');

    this.game.currentLevel++;

    this.game.events.emit(event.CHANGE_STATE, event.state.PLAY);
  }

  update() {}

  render() {}

  exit() {
    if (this.game.DEBUG) console.log('Exiting Next Level State');
  }
}
