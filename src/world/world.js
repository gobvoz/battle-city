import stages from '../config/stages/index.js';

export class World {
  constructor(game) {
    this.game = game;
    this.objects = [];
    this.entities = [];
    this.collisionTiles = [];
    this.stage = null;

    // his.tiles = this._buildTiles(levelData.terrain);
    // this.enemies = this._spawnEnemies(levelData.enemies);
    // this.player = this._createPlayer();
    // this.base = this._createBase();
  }

  start(levelNumber = 1) {
    if (this.game.DEBUG) console.log(`Starting world for level ${levelNumber}`);
    this.stage = stages[levelNumber].terrain;
  }

  update(deltaTime) {
    //this.player.update(deltaTime);
    //this.enemies.forEach(e => e.update(deltaTime));
  }

  render(ctx) {
    // not used. see renderer.js
  }

  exit() {
    if (this.game.DEBUG) console.log(`Exiting world for level ${levelNumber}`);
    this.entities = [];
  }
}
