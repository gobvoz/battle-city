export class GameOverState {
  constructor(game) {
    this.game = game;

    this.exit = this.exit.bind(this);
  }

  start() {
    if (this.game.DEBUG) console.log('Entering Game Over State');
    this.game.events.on('key:Space', this.exit);
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
    ctx.fillText('PRESS SPACE TO RESTART', ctx.canvas.width / 2, ctx.canvas.height / 2 + 110);
  }

  exit() {
    this.game.events.off('key:Space', this.exit);
    if (this.game.DEBUG) console.log('Exiting Game Over State');

    this.game.events.emit('state:change', 'menu');
  }
}
