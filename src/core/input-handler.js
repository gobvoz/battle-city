export class Input {
  constructor(game) {
    this.keys = new Set();
    this.game = game;

    window.addEventListener('keydown', e => {
      // if (this.game.DEBUG) console.log(e.code + ' pressed');

      this.keys.add(e.code);
      this.game.events.emit('key:' + e.code, 'pressed');

      e.preventDefault();
    });

    window.addEventListener('keyup', e => {
      // if (this.game.DEBUG) console.log(e.code + ' released');

      this.keys.delete(e.code);
      this.game.events.emit('key:' + e.code, 'released');

      e.preventDefault();
    });
  }

  isKeyPressed(keyCode) {
    return this.keys.has(keyCode);
  }

  isKeyReleased(keyCode) {
    return !this.keys.has(keyCode);
  }
}
