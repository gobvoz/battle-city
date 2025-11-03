import { keyCode } from './key-codes.js';

export const event = {
  CHANGE_STATE: 'state:change',
  state: {
    MENU: 'menu',
    PLAY: 'play',
    GAME_OVER: 'gameover',
    RESULTS: 'results',
    NEXT_LEVEL: 'nextlevel',
    RESTART: 'restart',
  },
  key: {
    ESCAPE: 'key:' + keyCode.ESCAPE,
    SPACE: 'key:' + keyCode.SPACE,
    ENTER: 'key:' + keyCode.ENTER,
    A: 'key:' + keyCode.A,
    S: 'key:' + keyCode.S,
    D: 'key:' + keyCode.D,
    W: 'key:' + keyCode.W,
    UP: 'key:' + keyCode.ArrowUp,
    DOWN: 'key:' + keyCode.ArrowDown,
    LEFT: 'key:' + keyCode.ArrowLeft,
    RIGHT: 'key:' + keyCode.ArrowRight,
  },
  inputAction: {
    PRESSED: 'pressed',
    RELEASED: 'released',
  },
  COMPLETE_INTRO: 'intro:complete',
  TOGGLE_PAUSE: 'pause:toggle',
  pauseAction: {
    ON: 'on',
    OFF: 'off',
  },
  object: {
    DESTROYED: 'destroyed',
    FIRE: 'fire',
  },
  stats: {
    RECORD_KILL: 'stats:recordkill',
  },
};
