export const DEBUG = true;

const TILE_SIZE = 8;
const UNIT_SIZE = 16;
const MULTIPLEXER = 1;
const STAGE_SIZE = 13;

export const WorldOption = {
  TILE_SIZE,
  STAGE_SIZE,
  STEP_SIZE: TILE_SIZE / 2,

  SIZE: STAGE_SIZE * UNIT_SIZE,
  UNIT_SIZE,
};

export const RenderOption = {
  PADDING_LEFT: 64,
  PADDING_TOP: 64,
  TILE_SIZE,
  UNIT_SIZE,
  MULTIPLEXER,
};

export const Direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};

export const BaseState = {
  LIVE: 0,
  DEAD: 1,
};

export const TerrainType = {
  EMPTY: 0,
  BRICK_WALL: 1,
  STEEL_WALL: 2,
  BUSH: 3,
  WATER: 4,
  ICE: 5,
};

export const ObjectType = {
  TANK: 0,
  ENEMY_TANK: 1,
  BULLET: 2,
  ENEMY_BULLET: 3,
  BASE: 4,
};

export const KeyCode = [
  { UP: 'KeyW', LEFT: 'KeyA', DOWN: 'KeyS', RIGHT: 'KeyD', FIRE: 'Space' },
  { UP: 'ArrowUp', LEFT: 'ArrowLeft', DOWN: 'ArrowDown', RIGHT: 'ArrowRight', FIRE: 'Enter' },
];

export const Player1TankOption = {
  START_X: 5 * WorldOption.UNIT_SIZE - WorldOption.UNIT_SIZE,
  START_Y: 13 * WorldOption.UNIT_SIZE - WorldOption.UNIT_SIZE,
  START_DIRECTION: Direction.UP,
  DEFAULT_SPEED: 1,
  SPRITES: {
    [Direction.UP]: [
      [0, 0],
      [1, 0],
    ],
    [Direction.LEFT]: [
      [2, 0],
      [3, 0],
    ],
    [Direction.DOWN]: [
      [4, 0],
      [5, 0],
    ],
    [Direction.RIGHT]: [
      [6, 0],
      [7, 0],
    ],
  },
};

export const Player2TankOption = {
  START_X: 9 * WorldOption.UNIT_SIZE - WorldOption.UNIT_SIZE,
  START_Y: 13 * WorldOption.UNIT_SIZE - WorldOption.UNIT_SIZE,
  START_DIRECTION: Direction.UP,
  DEFAULT_SPEED: 1,
  SPRITES: {
    [Direction.UP]: [
      [0, 9],
      [1, 9],
    ],
    [Direction.LEFT]: [
      [2, 9],
      [3, 9],
    ],
    [Direction.DOWN]: [
      [4, 9],
      [5, 9],
    ],
    [Direction.RIGHT]: [
      [6, 9],
      [7, 9],
    ],
  },
};

export const BaseOption = {
  START_X: 7 * WorldOption.UNIT_SIZE - WorldOption.UNIT_SIZE,
  START_Y: 13 * WorldOption.UNIT_SIZE - WorldOption.UNIT_SIZE,
  WIDTH: WorldOption.UNIT_SIZE * 2,
  HEIGHT: WorldOption.UNIT_SIZE * 2,
  SPRITES: {
    [BaseState.LIVE]: [19, 2],
    [BaseState.DEAD]: [20, 2],
  },
};

export const BrickWallOption = {
  SPRITES: [
    [16, 4],
    [16.5, 4],
    [17, 4],
    [17.5, 4],
    [18, 4],
  ],
};
export const SteelWallOption = {
  SPRITES: [[16, 4.5]],
};
export const BushOption = {
  SPRITES: [[16.5, 4.5]],
};
export const WaterOption = {
  SPRITES: [
    [16, 5],
    [16.5, 5],
    [17, 5],
  ],
};
export const IceOption = {
  SPRITES: [[17, 4.5]],
};
