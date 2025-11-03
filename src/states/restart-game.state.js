import { event } from '../config/events.js';
import { DebugManager } from '../core/debug-manager.js';

export class RestartGameState {
  constructor(game) {
    this.game = game;
  }

  start() {
    DebugManager.log('Entering Restart Game State');

    this.game.currentLevel = 1;

    this.game.player1Lives = 2;
    this.game.player2Lives = 2;

    this.game.events.emit(event.CHANGE_STATE, event.state.MENU);
  }

  update() {}

  render() {}

  exit() {
    DebugManager.log('Exiting Restart Game State');
  }
}
