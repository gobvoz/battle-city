const TILE_SIZE = 8;
const UNIT_SIZE = 16;
const MULTIPLEXER = 2.5;
const STAGE_SIZE = 13;

export const WorldOption = {
  TILE_SIZE,
  STAGE_SIZE,
  STEP_SIZE: TILE_SIZE / 2,

  SIZE: STAGE_SIZE * UNIT_SIZE,
  UNIT_SIZE,
  MULTIPLEXER,
};
