import World from './src/world.js';
import View from './src/view.js';
import Game from './src/game.js';
import Sprite from './src/sprite.js';

import levels from './src/levels.js';
import spriteMap from './src/sprite-map.js';

const canvas = document.querySelector('canvas');

const sprite = new Sprite('./src/sprite/sprite.png', spriteMap);
const world = new World();

const game = new Game({
  world,
  view: new View(canvas, sprite, world),
  levels,
});

await game.init();
game.start();
