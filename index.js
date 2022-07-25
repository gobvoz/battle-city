import World from './src/world.js';
import View from './src/view.js';
import Game from './src/game.js';

import levels from './src/levels.js';

const canvas = document.querySelector('canvas');

const game = new Game({
  world: new World(),
  view: new View(canvas),
  levels,
});

game.start();
