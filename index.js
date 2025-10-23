import World from './src/world.js';
import View from './src/view.js';
import Game from './src/game.js';
import Sprite from './src/sprite.js';
import AudioPlayer from './src/audio-player.js';

import stages from './src/stages-config.js';
import sounds from './src/sounds-config.js';
import { RenderOption } from './src/constants.js';

const canvas = document.querySelector('canvas');

canvas.width = canvas.offsetWidth * RenderOption.MULTIPLEXER;
canvas.height = canvas.offsetHeight * RenderOption.MULTIPLEXER + 100;

const sprite = new Sprite('./src/sprite/sprite.png');
const world = new World();
const audio = new AudioPlayer(sounds);

const game = new Game({
  world,
  view: new View(canvas, sprite, world),
  stages,
  audio,
});

await game.init();

// to solve autoplay policy
document.body.addEventListener(
  'click',
  () => {
    game.start();
  },
  { once: true },
);

console.log('Click anywhere to start the game');
