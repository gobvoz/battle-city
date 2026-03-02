import { event } from '../config/events.js';
import type { IGameContext } from '../core/game-context.type.js';

export class NextLevelState {
  private game: IGameContext;

  constructor(game: IGameContext) {
    this.game = game;
  }

  start(): void {
    __DEBUG__ && console.log('Entering Next Level State');

    this.game.currentLevel++;
    this.game.stats.nextLevel();

    this.game.events.emit(event.CHANGE_STATE, event.state.PLAY);
  }

  update(): void {}

  render(): void {}

  exit(): void {
    __DEBUG__ && console.log('Exiting Next Level State');
  }
}
