import { event } from '../config/events.js';
import { DebugManager } from '../core/debug-manager.js';

export class NextLevelState {
  constructor(game) {
    this.game = game;
  }

  start() {
    DebugManager.log('Entering Next Level State');

    this.game.currentLevel++;

    this.game.events.emit(event.CHANGE_STATE, event.state.PLAY);
  }

  update() {}

  render() {}

  exit() {
    DebugManager.log('Exiting Next Level State');
  }
}
