import { event } from '../config/events.js';

export class RestartGameState {
  constructor(game) {
    this.game = game;
  }

  start() {
    __DEBUG__ && console.log('Entering Restart Game State');

    this.game.currentLevel = 1;

    this.game.player1Lives = 2;
    this.game.player2Lives = 2;

    this.game.events.emit(event.CHANGE_STATE, event.state.MENU);
  }

  update() {}

  render() {}

  exit() {
    __DEBUG__ && console.log('Exiting Restart Game State');
  }
}
