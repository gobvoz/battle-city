export class PlayState {
  constructor(game) {
    this.game = game;
  }

  start() {
    if (this.game.DEBUG) console.log('Entering Play State');
    // Initialize game entities, level, etc.
  }

  update(deltaTime, input) {
    if (input.isKeyPressed('Escape')) {
      this.exit();
    }
  }

  render(ctx) {
    // Render game entities and level
  }

  exit() {
    if (this.game.DEBUG) console.log('Exiting Play State');

    this.game.events.emit('state:change', 'gameover');
  }
}
