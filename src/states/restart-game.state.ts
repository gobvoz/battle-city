import { event } from '../config/events.js';
import type { IGameContext } from '../core/game-context.type.js';

export class RestartGameState {
  private game: IGameContext;

  constructor(game: IGameContext) {
    this.game = game;
  }

  start(): void {
    __DEBUG__ && console.log('Entering Restart Game State');

    this.game.currentLevel = 1;
    this.game.player1Lives = 2;
    this.game.player2Lives = 2;

    this.game.events.emit(event.CHANGE_STATE, event.state.MENU);
  }

  update(): void {}

  render(): void {}

  exit(): void {
    __DEBUG__ && console.log('Exiting Restart Game State');
  }
}
