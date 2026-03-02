import { event } from '../config/events.js';
import type { IGameContext } from '../core/game-context.type.js';
import type { InputAction } from '../config/events.type.js';

export class GameOverState {
  private game: IGameContext;

  constructor(game: IGameContext) {
    this.game = game;

    this.changeState = this.changeState.bind(this);
  }

  start(): void {
    __DEBUG__ && console.log('Entering Game Over State');
    this.game.events.on(event.key.ENTER, this.changeState);
  }

  update(_deltaTime?: number): void {}

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'white';

    ctx.textAlign = 'center';
    ctx.fillText('BATTLE CITY', ctx.canvas.width / 2, ctx.canvas.height / 2 - 80);
    ctx.fillText('GAME OVER', ctx.canvas.width / 2, ctx.canvas.height / 2 - 10);
    ctx.fillText('PRESS ENTER TO RESTART', ctx.canvas.width / 2, ctx.canvas.height / 2 + 110);
  }

  changeState(key: InputAction): void {
    if (key !== event.inputAction.PRESSED) return;
    this.game.events.emit(event.CHANGE_STATE, event.state.RESTART);
  }

  exit(): void {
    this.game.events.off(event.key.ENTER, this.changeState);
    __DEBUG__ && console.log('Exiting Game Over State');
  }
}
