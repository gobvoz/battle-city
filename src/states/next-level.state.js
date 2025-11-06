import { event } from '../config/events.js';

export class NextLevelState {
  constructor(game) {
    this.game = game;
  }

  start() {
    __DEBUG__ && console.log('Entering Next Level State');

    this.game.currentLevel++;
    this.game.stats.nextLevel();

    this.game.events.emit(event.CHANGE_STATE, event.state.PLAY);
  }

  update() {}

  render() {}

  exit() {
    __DEBUG__ && console.log('Exiting Next Level State');
  }
}
