import { event } from '../config/events.js';
import { keyCode } from '../config/key-codes.js';
import type { IGameContext } from '../core/game-context.type.js';
import type { InputAction } from '../config/events.type.js';

export class MenuState {
  private game: IGameContext;
  private selection: 0 | 1;
  private _offEnter: (() => void) | null = null;

  constructor(game: IGameContext) {
    this.game = game;
    this.selection = 0;

    this.changeState = this.changeState.bind(this);
  }

  start(): void {
    __DEBUG__ && console.log('Entering Menu State');
    this._offEnter = this.game.events.on(event.key.ENTER, this.changeState);
  }

  update(): void {
    if (this.game.input.isKeyPressed(keyCode.UP)) this.selection = 0;
    if (this.game.input.isKeyPressed(keyCode.DOWN)) this.selection = 1;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('BATTLE CITY', ctx.canvas.width / 2, ctx.canvas.height / 2 - 80);
    ctx.fillText('MAIN MENU', ctx.canvas.width / 2, ctx.canvas.height / 2 - 10);

    ctx.textAlign = 'left';
    ctx.fillStyle = this.selection === 0 ? 'yellow' : 'white';
    ctx.fillText('1 PLAYER', ctx.canvas.width / 2 - 100, ctx.canvas.height / 2 + 30);
    ctx.fillStyle = this.selection === 1 ? 'yellow' : 'white';
    ctx.fillText('2 PLAYERS', ctx.canvas.width / 2 - 100, ctx.canvas.height / 2 + 60);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('PRESS ENTER TO START', ctx.canvas.width / 2, ctx.canvas.height / 2 + 110);
  }

  changeState(key: InputAction): void {
    if (key !== event.inputAction.PRESSED) return;
    this.game.playerCount = (this.selection + 1) as 1 | 2;
    this.game.events.emit(event.CHANGE_STATE, event.state.NEXT_LEVEL);
  }

  exit(): void {
    __DEBUG__ && console.log('Exiting Menu State');
    this._offEnter?.();
    this._offEnter = null;
  }
}
