import { event } from '../config/events.js';
import { keyCode } from '../config/key-codes.js';
import { DebugManager } from '../core/debug-manager.js';

export class MenuState {
  constructor(game) {
    this.game = game;
    this.selection = 0; // 0: 1 PLAYER, 1: 2 PLAYERS

    this.changeState = this.changeState.bind(this);
  }

  start() {
    DebugManager.log('Entering Menu State');
    this.game.events.on(event.key.ENTER, this.changeState);
  }

  update() {
    if (this.game.input.isKeyPressed(keyCode.UP)) this.selection = 0;
    if (this.game.input.isKeyPressed(keyCode.DOWN)) this.selection = 1;
  }

  render(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BATTLE CITY', ctx.canvas.width / 2, ctx.canvas.height / 2 - 80);

    ctx.font = '24px monospace';
    ctx.fillText('MAIN MENU', ctx.canvas.width / 2, ctx.canvas.height / 2 - 10);

    ctx.font = '20px monospace';

    ctx.textAlign = 'left';
    ctx.fillStyle = this.selection === 0 ? 'yellow' : 'white';
    ctx.fillText('1 PLAYER', ctx.canvas.width / 2 - 100, ctx.canvas.height / 2 + 30);
    ctx.fillStyle = this.selection === 1 ? 'yellow' : 'white';
    ctx.fillText('2 PLAYERS', ctx.canvas.width / 2 - 100, ctx.canvas.height / 2 + 60);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.font = '16px monospace';
    ctx.fillText('PRESS ENTER TO START', ctx.canvas.width / 2, ctx.canvas.height / 2 + 110);
  }

  changeState(key) {
    if (key !== event.inputAction.PRESSED) return;
    this.game.events.emit(event.CHANGE_STATE, event.state.PLAY);
  }

  exit() {
    DebugManager.log('Exiting Menu State');
    this.game.events.off(event.key.ENTER, this.changeState);
  }
}
