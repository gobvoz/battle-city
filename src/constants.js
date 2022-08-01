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

// numbers only for sprite.png position
export const Direction = {
  UP: 4,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 1,
};

export const BaseState = {
  LIVE: 0,
  DEAD: 1,
};

export const TerrainType = {
  EMPTY: 0,
  BRICK_WALL: 1,
  STEEL_WALL: 2,
  TREE: 3,
  WATER: 4,
  ICE: 5,
};

export const ObjectType = {
  PLAYER_TANK: 0,
  ENEMY_TANK: 1,
  PROJECTILE: 2,
  ENEMY_PROJECTILE: 3,
  BASE: 4,
};

export const KeyCode = [
  { UP: 'KeyW', LEFT: 'KeyA', DOWN: 'KeyS', RIGHT: 'KeyD', FIRE: 'Space' },
  { UP: 'ArrowUp', LEFT: 'ArrowLeft', DOWN: 'ArrowDown', RIGHT: 'ArrowRight', FIRE: 'Enter' },
];

export const Player1TankOption = {
  START_X: 5 * WorldOption.UNIT_SIZE - WorldOption.UNIT_SIZE,
  START_Y: 13 * WorldOption.UNIT_SIZE - WorldOption.UNIT_SIZE,
  WIDTH: WorldOption.UNIT_SIZE,
  HEIGHT: WorldOption.UNIT_SIZE,
  START_DIRECTION: Direction.UP,
  DEFAULT_SPEED: 1,
  DEFAULT_POWER: 1,
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
  WIDTH: WorldOption.UNIT_SIZE,
  HEIGHT: WorldOption.UNIT_SIZE,
  START_DIRECTION: Direction.UP,
  DEFAULT_SPEED: 1,
  DEFAULT_POWER: 1,
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

export const ProjectileOption = {
  WIDTH: WorldOption.UNIT_SIZE / 4,
  HEIGHT: WorldOption.UNIT_SIZE / 4,
  DEFAULT_SPEED: 2,
  SPRITES: {
    [Direction.UP]: [20, 6.5],
    [Direction.LEFT]: [20.5, 6.5],
    [Direction.DOWN]: [21, 6.5],
    [Direction.RIGHT]: [21.5, 6.5],
  },
};

export const ExplosiveOption = {
  WIDTH: WorldOption.UNIT_SIZE,
  HEIGHT: WorldOption.UNIT_SIZE,
  SPRITES: [
    [16, 8],
    [17, 8],
    [18, 8],
  ],
};

export const BaseOption = {
  START_X: 7 * WorldOption.UNIT_SIZE - WorldOption.UNIT_SIZE,
  START_Y: 13 * WorldOption.UNIT_SIZE - WorldOption.UNIT_SIZE,
  WIDTH: WorldOption.UNIT_SIZE,
  HEIGHT: WorldOption.UNIT_SIZE,
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
export const TreeOption = {
  SPRITES: [[16.5, 4.5]],
  Z_INDEX: 1,
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
