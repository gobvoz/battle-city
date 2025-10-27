export const event = {
  CHANGE_STATE: 'state:change',
  state: {
    MENU: 'menu',
    PLAY: 'play',
    GAME_OVER: 'gameover',
    RESULTS: 'results',
  },
  key: {
    ESCAPE: 'key:Escape',
    SPACE: 'key:Space',
    ENTER: 'key:Enter',
    A: 'key:KeyA',
    S: 'key:KeyS',
    D: 'key:KeyD',
    W: 'key:KeyW',
    UP: 'key:ArrowUp',
    DOWN: 'key:ArrowDown',
    LEFT: 'key:ArrowLeft',
    RIGHT: 'key:ArrowRight',
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
};
