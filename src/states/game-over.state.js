import { event } from '../config/events.js';

export class GameOverState {
  constructor(game) {
    this.game = game;

    this.changeState = this.changeState.bind(this);
  }

  start() {
    if (this.game.DEBUG) console.log('Entering Game Over State');
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
    ctx.fillText('GAME OVER', ctx.canvas.width / 2, ctx.canvas.height / 2 - 10);

    ctx.font = '16px monospace';
    ctx.fillText('PRESS ENTER TO RESTART', ctx.canvas.width / 2, ctx.canvas.height / 2 + 110);
  }

  changeState(key) {
    if (key !== event.inputAction.PRESSED) return;
    this.game.events.emit(event.CHANGE_STATE, event.state.RESTART);
  }

  exit() {
    this.game.events.off(event.key.ENTER, this.changeState);
    if (this.game.DEBUG) console.log('Exiting Game Over State');
  }
}
