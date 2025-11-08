import { Game } from './src/game.js';
import { RenderOption } from './src/config/render.js';

window.onload = () => {
  const canvas = document.getElementById('game');

  if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Canvas element not found');

  canvas.width = canvas.offsetWidth * RenderOption.MULTIPLEXER;
  canvas.height = canvas.offsetHeight * RenderOption.MULTIPLEXER + 100;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('2D context not supported or canvas already initialized');

  ctx.font = `${RenderOption.FONT_SIZE}px font-7x7`;

  const game = new Game(ctx);
  game.start();
};
