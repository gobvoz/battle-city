import { event } from '../config/events.js';

export class ResultsState {
  constructor(game) {
    this.game = game;

    this.changeState = this.changeState.bind(this);
  }

  start() {
    if (this.game.DEBUG) console.log('Entering Results State');
    this.game.events.on(event.key.ENTER, this.changeState);
  }

  update(deltaTime, input) {}

  render(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BATTLE CITY', ctx.canvas.width / 2, ctx.canvas.height / 2 - 80);

    ctx.font = '24px monospace';
    ctx.fillText('VICTORY', ctx.canvas.width / 2, ctx.canvas.height / 2 - 10);

    ctx.font = '16px monospace';
    ctx.fillText('PRESS ENTER TO NEXT LEVEL', ctx.canvas.width / 2, ctx.canvas.height / 2 + 110);
  }

  changeState(key) {
    if (key !== event.inputAction.PRESSED) return;
    this.game.events.emit(event.CHANGE_STATE, event.state.MENU);
  }

  exit() {
    this.game.events.off(event.key.ENTER, this.changeState);
    if (this.game.DEBUG) console.log('Exiting Results State');
  }
}
