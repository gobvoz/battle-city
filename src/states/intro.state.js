import { event } from '../config/events.js';

export class IntroState {
  constructor(game) {
    this.game = game;

    this.timer = 0;
    this.duration = 3;
    this.transitionTime = 0.5;
  }

  start() {
    __DEBUG__ && console.log('Entering Intro State');

    this.timer = 0;
  }

  update(deltaTime) {
    this.timer += deltaTime;

    if (this.timer >= this.duration) {
      this.exit();
      this.game.events.emit(event.COMPLETE_INTRO);
    }
  }

  render(ctx) {
    const { width, height } = ctx.canvas;

    // map timer to [0,1]
    const t = Math.min(this.timer / this.duration, 1);

    let shutterHeight = 0;
    const maxHeight = height / 2;

    if (t < this.transitionTime / this.duration) {
      // closing stage
      const progress = t / (this.transitionTime / this.duration);
      shutterHeight = progress * maxHeight;
    } else if (t > 1 - this.transitionTime / this.duration) {
      // opening stage
      const progress = (1 - t) / (this.transitionTime / this.duration);
      shutterHeight = progress * maxHeight;
    } else {
      // fully closed
      shutterHeight = maxHeight;
    }

    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, width, shutterHeight);
    ctx.fillRect(0, height - shutterHeight, width, shutterHeight);

    // Draw level text when shutter is fully closed
    if (t > this.transitionTime / this.duration && t < 1 - this.transitionTime / this.duration) {
      ctx.fillStyle = 'black';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`LEVEL ${this.game.currentLevel}`, width / 2, height / 2);
    }
  }

  exit() {
    __DEBUG__ && console.log('Exiting Intro State');
  }
}
