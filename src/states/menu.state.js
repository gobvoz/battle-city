export class MenuState {
  constructor(game) {
    this.game = game;
    this.selection = 0; // 0: 1 PLAYER, 1: 2 PLAYERS

    this.exit = this.exit.bind(this);
  }

  start() {
    if (this.game.DEBUG) console.log('Entering Menu State');
    this.game.events.on('key:Enter', this.exit);
  }

  update() {
    //console.log(input);
    if (this.game.input.isKeyPressed('ArrowUp')) this.selection = 0;
    if (this.game.input.isKeyPressed('ArrowDown')) this.selection = 1;

    //if (input.isKeyPressed('Enter')) {
    //  this.exit();
    //}
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

  exit() {
    if (this.game.DEBUG) console.log('Exiting Menu State');
    this.game.events.off('key:Enter', this.exit);

    this.game.events.emit('state:change', 'play');
  }
}
