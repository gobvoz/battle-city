import { Game } from './src/game.js';
import { RenderOption } from './src/config/render.js';

window.onload = () => {
  const canvas = document.getElementById('game');
  canvas.width = canvas.offsetWidth * RenderOption.MULTIPLEXER;
  canvas.height = canvas.offsetHeight * RenderOption.MULTIPLEXER + 100;
  const ctx = canvas.getContext('2d');

  const game = new Game(ctx);
  game.start();
};
