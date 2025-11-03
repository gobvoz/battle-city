const TILE_SIZE = 8;
const UNIT_SIZE = 16;
const MULTIPLEXER = 2.5;
const STAGE_SIZE = 13;

const BASE_CHANGE_DIRECTION_DELAY = 32;
const BASE_FIRE_DELAY = 32;

export const WorldOption = {
  TILE_SIZE,
  STAGE_SIZE,
  STEP_SIZE: TILE_SIZE / 2,

  SIZE: STAGE_SIZE * UNIT_SIZE,
  UNIT_SIZE,
};

export const RenderOption = {
  PADDING_LEFT: 10 * MULTIPLEXER,
  PADDING_TOP: 8 * MULTIPLEXER,
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
  {},
  { UP: 'KeyW', LEFT: 'KeyA', DOWN: 'KeyS', RIGHT: 'KeyD', FIRE: 'Space' },
  { UP: 'ArrowUp', LEFT: 'ArrowLeft', DOWN: 'ArrowDown', RIGHT: 'ArrowRight', FIRE: 'Enter' },
];

export const TankType = {
  ENEMY: 0,
  PLAYER_1: 1,
  PLAYER_2: 2,
};

export const ResurrectionOption = {
  ANIMATION_TIME: 3000,
  ANIMATION_INTERVAL: 200,
  WIDTH: WorldOption.UNIT_SIZE,
  HEIGHT: WorldOption.UNIT_SIZE,
  SPRITES: [
    [16, 6],
    [17, 6],
    [18, 6],
    [19, 6],
    [18, 6],
    [17, 6],
    [16, 6],
  ],
};

export const Player1TankOption = {
  START_X: 5 * WorldOption.UNIT_SIZE - WorldOption.UNIT_SIZE,
  START_Y: 13 * WorldOption.UNIT_SIZE - WorldOption.UNIT_SIZE,
  WIDTH: WorldOption.UNIT_SIZE,
  HEIGHT: WorldOption.UNIT_SIZE,
  START_DIRECTION: Direction.UP,
  HEALTH: 1,
  MOVEMENT_SPEED: 3 / 4,
  PROJECTILE_SPEED: 1,
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
  HEALTH: 1,
  MOVEMENT_SPEED: 3 / 4,
  PROJECTILE_SPEED: 1,
  DEFAULT_POWER: 1,
  SPRITES: {
    [Direction.UP]: [
      [0, 8],
      [1, 8],
    ],
    [Direction.LEFT]: [
      [2, 8],
      [3, 8],
    ],
    [Direction.DOWN]: [
      [4, 8],
      [5, 8],
    ],
    [Direction.RIGHT]: [
      [6, 8],
      [7, 8],
    ],
  },
};

// common tank
export const Enemy1TankOption = {
  WIDTH: WorldOption.UNIT_SIZE,
  HEIGHT: WorldOption.UNIT_SIZE,
  START_DIRECTION: Direction.DOWN,
  POINTS: 100,
  HEALTH: 1,
  MOVEMENT_SPEED: 2 / 4,
  PROJECTILE_SPEED: 1,
  BASE_CHANGE_DIRECTION_DELAY: BASE_CHANGE_DIRECTION_DELAY,
  BASE_FIRE_DELAY: BASE_FIRE_DELAY,
  CHANGE_DIRECTION_DELAY_MULTIPLEXER: BASE_CHANGE_DIRECTION_DELAY,
  FIRE_DELAY_MULTIPLEXER: BASE_FIRE_DELAY,
  SPRITES: {
    [Direction.UP]: [
      [8, 4],
      [9, 4],
    ],
    [Direction.LEFT]: [
      [10, 4],
      [11, 4],
    ],
    [Direction.DOWN]: [
      [12, 4],
      [13, 4],
    ],
    [Direction.RIGHT]: [
      [14, 4],
      [15, 4],
    ],
  },
};

// fast tank
export const Enemy2TankOption = {
  WIDTH: WorldOption.UNIT_SIZE,
  HEIGHT: WorldOption.UNIT_SIZE,
  START_DIRECTION: Direction.DOWN,
  POINTS: 200,
  HEALTH: 1,
  MOVEMENT_SPEED: 4 / 4,
  PROJECTILE_SPEED: 1.5,
  BASE_CHANGE_DIRECTION_DELAY: BASE_CHANGE_DIRECTION_DELAY,
  BASE_FIRE_DELAY: BASE_FIRE_DELAY,
  CHANGE_DIRECTION_DELAY_MULTIPLEXER: BASE_CHANGE_DIRECTION_DELAY,
  FIRE_DELAY_MULTIPLEXER: BASE_FIRE_DELAY,
  SPRITES: {
    [Direction.UP]: [
      [8, 5],
      [9, 5],
    ],
    [Direction.LEFT]: [
      [10, 5],
      [11, 5],
    ],
    [Direction.DOWN]: [
      [12, 5],
      [13, 5],
    ],
    [Direction.RIGHT]: [
      [14, 5],
      [15, 5],
    ],
  },
};

// power tank
export const Enemy3TankOption = {
  WIDTH: WorldOption.UNIT_SIZE,
  HEIGHT: WorldOption.UNIT_SIZE,
  START_DIRECTION: Direction.DOWN,
  POINTS: 300,
  HEALTH: 1,
  MOVEMENT_SPEED: 2 / 4,
  PROJECTILE_SPEED: 1.5,
  BASE_CHANGE_DIRECTION_DELAY: BASE_CHANGE_DIRECTION_DELAY,
  BASE_FIRE_DELAY: BASE_FIRE_DELAY,
  CHANGE_DIRECTION_DELAY_MULTIPLEXER: BASE_CHANGE_DIRECTION_DELAY,
  FIRE_DELAY_MULTIPLEXER: BASE_FIRE_DELAY,
  SPRITES: {
    [Direction.UP]: [
      [8, 6],
      [9, 6],
    ],
    [Direction.LEFT]: [
      [10, 6],
      [11, 6],
    ],
    [Direction.DOWN]: [
      [12, 6],
      [13, 6],
    ],
    [Direction.RIGHT]: [
      [14, 6],
      [15, 6],
    ],
  },
};

// armor tank
export const Enemy4TankOption = {
  WIDTH: WorldOption.UNIT_SIZE,
  HEIGHT: WorldOption.UNIT_SIZE,
  START_DIRECTION: Direction.DOWN,
  POINTS: 400,
  HEALTH: 4,
  MOVEMENT_SPEED: 2 / 4,
  PROJECTILE_SPEED: 1,
  BASE_CHANGE_DIRECTION_DELAY: BASE_CHANGE_DIRECTION_DELAY,
  BASE_FIRE_DELAY: BASE_FIRE_DELAY,
  CHANGE_DIRECTION_DELAY_MULTIPLEXER: BASE_CHANGE_DIRECTION_DELAY,
  FIRE_DELAY_MULTIPLEXER: BASE_FIRE_DELAY,
  SPRITES: {
    [Direction.UP]: [
      [8, 7],
      [9, 7],
    ],
    [Direction.LEFT]: [
      [10, 7],
      [11, 7],
    ],
    [Direction.DOWN]: [
      [12, 7],
      [13, 7],
    ],
    [Direction.RIGHT]: [
      [14, 7],
      [15, 7],
    ],
  },
};

export const EnemyTankToOption = {
  [1]: Enemy1TankOption,
  [2]: Enemy2TankOption,
  [3]: Enemy3TankOption,
  [4]: Enemy4TankOption,
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
  SMALL_WIDTH: WorldOption.UNIT_SIZE,
  SMALL_HEIGHT: WorldOption.UNIT_SIZE,
  BIG_WIDTH: WorldOption.UNIT_SIZE * 2,
  BIG_HEIGHT: WorldOption.UNIT_SIZE * 2,
  SPRITES: [
    [
      [16, 8],
      [17, 8],
      [18, 8],
    ],
    [
      [19, 8],
      [21, 8],
    ],
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

export const ShieldEffectOptions = {
  WIDTH: WorldOption.UNIT_SIZE,
  HEIGHT: WorldOption.UNIT_SIZE,
  EFFECT_DURATION: 5,
  ANIMATION_INTERVAL: 0.04,
  SPRITES: [
    [16, 9],
    [17, 9],
  ],
};

export const SidePanelOption = {
  TANK: {
    OFFSET_X: 228 * MULTIPLEXER,
    OFFSET_Y: 20 * MULTIPLEXER,
    WIDTH: WorldOption.UNIT_SIZE / 2,
    HEIGHT: WorldOption.UNIT_SIZE / 2,
    SPRITES: [20 * WorldOption.UNIT_SIZE, 12 * WorldOption.UNIT_SIZE],
  },
  PLAYER_1: {
    OFFSET_X: 228 * MULTIPLEXER,
    OFFSET_Y: 120 * MULTIPLEXER,
    WIDTH: WorldOption.UNIT_SIZE,
    HEIGHT: WorldOption.UNIT_SIZE,
    SPRITES: [23.5 * WorldOption.UNIT_SIZE, 8.5 * WorldOption.UNIT_SIZE],
  },
  PLAYER_2: {
    OFFSET_X: 228 * MULTIPLEXER,
    OFFSET_Y: 145 * MULTIPLEXER,
    WIDTH: WorldOption.UNIT_SIZE,
    HEIGHT: WorldOption.UNIT_SIZE,
    SPRITES: [23.5 * WorldOption.UNIT_SIZE, 10 * WorldOption.UNIT_SIZE],
  },
  STAGE: {
    OFFSET_X: 228 * MULTIPLEXER,
    OFFSET_Y: 170 * MULTIPLEXER,
    WIDTH: WorldOption.UNIT_SIZE,
    HEIGHT: WorldOption.UNIT_SIZE,
    SPRITES: [23.5 * WorldOption.UNIT_SIZE, 11.5 * WorldOption.UNIT_SIZE],
  },
  NUMBER: [
    {
      // 0
      WIDTH: WorldOption.UNIT_SIZE / 2,
      HEIGHT: WorldOption.UNIT_SIZE / 2,
      SPRITES: [20.5 * WorldOption.UNIT_SIZE, 11.5 * WorldOption.UNIT_SIZE],
    },
    {
      // 1
      WIDTH: WorldOption.UNIT_SIZE / 2,
      HEIGHT: WorldOption.UNIT_SIZE / 2,
      SPRITES: [21 * WorldOption.UNIT_SIZE, 11.5 * WorldOption.UNIT_SIZE],
    },
    {
      // 2
      WIDTH: WorldOption.UNIT_SIZE / 2,
      HEIGHT: WorldOption.UNIT_SIZE / 2,
      SPRITES: [21.5 * WorldOption.UNIT_SIZE, 11.5 * WorldOption.UNIT_SIZE],
    },
    {
      // 3
      WIDTH: WorldOption.UNIT_SIZE / 2,
      HEIGHT: WorldOption.UNIT_SIZE / 2,
      SPRITES: [22 * WorldOption.UNIT_SIZE, 11.5 * WorldOption.UNIT_SIZE],
    },
    {
      // 4
      WIDTH: WorldOption.UNIT_SIZE / 2,
      HEIGHT: WorldOption.UNIT_SIZE / 2,
      SPRITES: [22.5 * WorldOption.UNIT_SIZE, 11.5 * WorldOption.UNIT_SIZE],
    },
    {
      // 5
      WIDTH: WorldOption.UNIT_SIZE / 2,
      HEIGHT: WorldOption.UNIT_SIZE / 2,
      SPRITES: [20.5 * WorldOption.UNIT_SIZE, 12 * WorldOption.UNIT_SIZE],
    },
    {
      // 6
      WIDTH: WorldOption.UNIT_SIZE / 2,
      HEIGHT: WorldOption.UNIT_SIZE / 2,
      SPRITES: [21 * WorldOption.UNIT_SIZE, 12 * WorldOption.UNIT_SIZE],
    },
    {
      // 7
      WIDTH: WorldOption.UNIT_SIZE / 2,
      HEIGHT: WorldOption.UNIT_SIZE / 2,
      SPRITES: [21.5 * WorldOption.UNIT_SIZE, 12 * WorldOption.UNIT_SIZE],
    },
    {
      // 8
      WIDTH: WorldOption.UNIT_SIZE / 2,
      HEIGHT: WorldOption.UNIT_SIZE / 2,
      SPRITES: [22 * WorldOption.UNIT_SIZE, 12 * WorldOption.UNIT_SIZE],
    },
    {
      // 9
      WIDTH: WorldOption.UNIT_SIZE / 2,
      HEIGHT: WorldOption.UNIT_SIZE / 2,
      SPRITES: [22.5 * WorldOption.UNIT_SIZE, 12 * WorldOption.UNIT_SIZE],
    },
  ],
};
