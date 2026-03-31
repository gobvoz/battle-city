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
    UP: 'key:' + keyCode.UP,
    DOWN: 'key:' + keyCode.DOWN,
    LEFT: 'key:' + keyCode.LEFT,
    RIGHT: 'key:' + keyCode.RIGHT,
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
  sound: {
    PLAYER_SHOT: 'sound:player-shot',
    TANK_EXPLODE: 'sound:tank-explode',
    BASE_EXPLODE: 'sound:base-explode',
    BRICK_HIT: 'sound:brick-hit',
    WALL_HIT: 'sound:wall-hit',
    PLAYER_SPAWN: 'sound:player-spawn',
    PLAYER_DEATH: 'sound:player-death',
    MOVE_START: 'sound:move-start',
    MOVE_STOP: 'sound:move-stop',
    GAME_OVER: 'sound:game-over',
    PAUSE: 'sound:pause',
    INTRO: 'sound:intro',
    SCORE_TICK: 'sound:score-tick',
    STOP_ALL: 'sound:stop-all',
  },
} as const;
