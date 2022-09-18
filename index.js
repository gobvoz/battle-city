import World from './src/world.js';
import View from './src/view.js';
import Game from './src/game.js';
import Sprite from './src/sprite.js';

import stages from './src/stages.js';

const canvas = document.querySelector('canvas');
const log = document.querySelector('log');

const sprite = new Sprite('./src/sprite/sprite.png');
const world = new World();

const game = new Game({
  world,
  view: new View(canvas, sprite, world),
  stages,
});

await game.init();
game.start();
