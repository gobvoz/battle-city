import { event } from '../config/events.js';

export class PauseState {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.timer = 0;
    this.textVisible = true;

    this.toggle = this.toggle.bind(this);
  }

  start() {
    if (this.game.DEBUG) console.log('Entering Pause State');

    this.timer = 0;
    this.textVisible = true;

    this.game.events.on(event.key.ESCAPE, this.toggle);
  }

  update(deltaTime) {
    if (!this.active) return;

    this.timer += deltaTime;

    if (this.timer >= 0.5) {
      this.textVisible = !this.textVisible;
      this.timer = 0;
    }
  }

  render(ctx) {
    if (!this.active) return;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (this.textVisible) {
      ctx.fillStyle = 'white';
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSE', ctx.canvas.width / 2, ctx.canvas.height / 2);
    }

    ctx.restore();
  }

  toggle(key) {
    if (key !== event.inputAction.PRESSED) return;
    this.active = !this.active;
    this.timer = 0;

    if (this.game.DEBUG) console.log(this.active ? 'Game paused' : 'Game resumed');

    this.active
      ? this.game.events.emit(event.TOGGLE_PAUSE, event.pauseAction.ON)
      : this.game.events.emit(event.TOGGLE_PAUSE, event.pauseAction.OFF);
  }

  exit() {
    if (this.game.DEBUG) console.log('Exiting Pause State');

    this.game.events.off(event.key.ESCAPE, this.exit);
  }
}
