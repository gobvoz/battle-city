import { event } from '../config/events.js';
import { keyCode } from '../config/key-codes.js';
import type { IGameContext } from '../core/game-context.type.js';
import type { InputAction } from '../config/events.type.js';
import { getCustomStageLevels } from '../core/custom-stages.js';

export class MenuState {
  private game: IGameContext;
  private selection: 0 | 1 | 2;
  private customCount: number;
  private _offEnter: (() => void) | null = null;

  constructor(game: IGameContext) {
    this.game = game;
    this.selection = 0;
    this.customCount = getCustomStageLevels().length;

    this.changeState = this.changeState.bind(this);
  }

  start(): void {
    __DEBUG__ && console.log('Entering Menu State');
    this._offEnter = this.game.events.on(event.key.ENTER, this.changeState);
  }

  update(): void {
    if (this.game.input.isKeyPressed(keyCode.UP)) {
      this.selection = (this.selection === 0 ? 2 : this.selection - 1) as 0 | 1 | 2;
    }
    if (this.game.input.isKeyPressed(keyCode.DOWN)) {
      this.selection = (this.selection === 2 ? 0 : this.selection + 1) as 0 | 1 | 2;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('BATTLE CITY', ctx.canvas.width / 2, ctx.canvas.height / 2 - 80);
    ctx.fillText('MAIN MENU', ctx.canvas.width / 2, ctx.canvas.height / 2 - 10);

    ctx.textAlign = 'left';
    const x = ctx.canvas.width / 2 - 100;

    ctx.fillStyle = this.selection === 0 ? 'yellow' : 'white';
    ctx.fillText('1 PLAYER', x, ctx.canvas.height / 2 + 30);
    ctx.fillStyle = this.selection === 1 ? 'yellow' : 'white';
    ctx.fillText('2 PLAYERS', x, ctx.canvas.height / 2 + 60);

    ctx.fillStyle = this.selection === 2
      ? (this.customCount > 0 ? 'yellow' : '#886600')
      : (this.customCount > 0 ? 'white' : '#555');
    ctx.fillText(`CUSTOM (${this.customCount})`, x, ctx.canvas.height / 2 + 90);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('PRESS ENTER TO START', ctx.canvas.width / 2, ctx.canvas.height / 2 + 140);
  }

  changeState(key: InputAction): void {
    if (key !== event.inputAction.PRESSED) return;

    if (this.selection === 2) {
      // Custom campaign
      if (this.customCount === 0) return; // no custom stages available
      const levels = getCustomStageLevels();
      this.game.campaignMode = 'custom';
      this.game.customStageLevels = levels;
      this.game.playerCount = 1;
      this.game.events.emit(event.CHANGE_STATE, event.state.NEXT_LEVEL);
      return;
    }

    this.game.campaignMode = 'standard';
    this.game.customStageLevels = [];
    this.game.playerCount = (this.selection + 1) as 1 | 2;
    this.game.events.emit(event.CHANGE_STATE, event.state.NEXT_LEVEL);
  }

  exit(): void {
    __DEBUG__ && console.log('Exiting Menu State');
    this._offEnter?.();
    this._offEnter = null;
  }
}
