import { World } from '../world.js';
import {
  computeNextBounds,
  isOutOfBounds,
  overlapsRect,
  overlapsDirectional,
  computeTileRange,
} from '../collision.js';
import { Direction, ObjectType, WorldOption } from '../../config/constants.js';
import { EventEmitter } from '../../core/event-emitter.js';
import BrickWall from '../../map/brick-wall.js';
import SteelWall from '../../map/steel-wall.js';
import type { IGameContext } from '../../core/game-context.type.js';
import type { ICollidable } from '../world.type.js';
import type { IMapTile } from '../../core/utilities.js';
import type Base from '../../entities/base.js';
import type { Bounds, TankRect } from '../collision.js';

const STAGE_TILES = 26;
const WORLD_SIZE = STAGE_TILES * WorldOption.TILE_SIZE;

function createMockGameContext(): IGameContext {
  return {
    events: new EventEmitter(),
    input: {
      activeKeys: () => new Set<string>(),
      isKeyPressed: () => false,
      isKeyReleased: () => true,
    },
    sprite: { image: new Image(), load: vi.fn() },
    audio: {
      playSound: vi.fn(),
      playLoop: vi.fn(),
      stopLoop: vi.fn(),
      stopAll: vi.fn(),
      loadSound: vi.fn(),
    },
    stats: {
      scores: { 1: [0, 0], 2: [0, 0], 3: [0, 0], 4: [0, 0], total: [0, 0], hiScore: 0 },
      recordKill: vi.fn(),
      nextLevel: vi.fn(),
    },
    player1Lives: 3,
    player2Lives: 0,
    currentLevel: 1,
    currentStage: { terrain: [], enemies: [] },
    fps: 0,
    busyTime: 0,
  } as unknown as IGameContext;
}

function createEmptyStage(): (IMapTile | null)[][] {
  return Array.from({ length: STAGE_TILES }, () =>
    Array.from<IMapTile | null>({ length: STAGE_TILES }).fill(null)
  );
}

function setupWorld(game?: IGameContext): World {
  const g = game ?? createMockGameContext();
  const world = new World(g);
  world.minWorldX = 0;
  world.maxWorldX = WORLD_SIZE;
  world.minWorldY = 0;
  world.maxWorldY = WORLD_SIZE;
  world.stage = createEmptyStage();
  world.enemyTanks = [];
  world.collisionTiles = [];
  world.base = {
    x: 96,
    y: 192,
    width: 16,
    height: 16,
    hit: vi.fn(() => false),
    destroyed: false,
  } as unknown as Base;
  return world;
}

function createCollidable(overrides: Partial<ICollidable> = {}): ICollidable {
  return {
    x: 100,
    y: 100,
    width: 16,
    height: 16,
    direction: Direction.UP,
    speed: 2,
    objectType: ObjectType.PLAYER_TANK,
    ...overrides,
  };
}

describe('World.hasCollision', () => {
  describe('boundary collisions', () => {
    it('detects collision at top boundary (UP)', () => {
      const world = setupWorld();
      const obj = createCollidable({ y: 1, direction: Direction.UP, speed: 2 });
      expect(world.hasCollision(obj)).toBe(true);
    });

    it('detects collision at bottom boundary (DOWN)', () => {
      const world = setupWorld();
      const obj = createCollidable({
        y: WORLD_SIZE - 16 - 2,
        direction: Direction.DOWN,
        speed: 2,
      });
      expect(world.hasCollision(obj)).toBe(true);
    });

    it('detects collision at left boundary (LEFT)', () => {
      const world = setupWorld();
      const obj = createCollidable({ x: 1, direction: Direction.LEFT, speed: 2 });
      expect(world.hasCollision(obj)).toBe(true);
    });

    it('detects collision at right boundary (RIGHT)', () => {
      const world = setupWorld();
      const obj = createCollidable({
        x: WORLD_SIZE - 16 - 2,
        direction: Direction.RIGHT,
        speed: 2,
      });
      expect(world.hasCollision(obj)).toBe(true);
    });
  });

  it('returns false when no obstacle in path', () => {
    const world = setupWorld();
    const obj = createCollidable({ x: 100, y: 100, direction: Direction.UP, speed: 2 });
    expect(world.hasCollision(obj)).toBe(false);
  });

  describe('tile collisions', () => {
    it('blocks movement through BrickWall', () => {
      const world = setupWorld();
      world.stage[3][3] = new BrickWall({ x: 24, y: 24 });

      const obj = createCollidable({
        x: 24,
        y: 27,
        width: 4,
        height: 4,
        direction: Direction.UP,
        speed: 2,
        objectType: ObjectType.PLAYER_TANK,
      });
      expect(world.hasCollision(obj)).toBe(true);
    });

    it('blocks movement through SteelWall', () => {
      const world = setupWorld();
      world.stage[3][3] = new SteelWall({ x: 24, y: 24 });

      const obj = createCollidable({
        x: 24,
        y: 27,
        width: 4,
        height: 4,
        direction: Direction.UP,
        speed: 2,
        objectType: ObjectType.PLAYER_TANK,
      });
      expect(world.hasCollision(obj)).toBe(true);
    });

    it('damages BrickWall when hit by projectile', () => {
      const world = setupWorld();
      const brick = new BrickWall({ x: 24, y: 24 });
      world.stage[3][3] = brick;

      const obj = createCollidable({
        x: 22,
        y: 27,
        width: 4,
        height: 4,
        direction: Direction.UP,
        speed: 2,
        objectType: ObjectType.PROJECTILE,
        power: 1,
      });

      expect(world.hasCollision(obj)).toBe(true);
      expect(brick.currentSprite).toBe(Direction.UP);
    });

    it('does not destroy SteelWall with low power projectile', () => {
      const world = setupWorld();
      const steel = new SteelWall({ x: 24, y: 24 });
      world.stage[3][3] = steel;

      const destroySpy = vi.fn();
      steel.on('destroyed', destroySpy);

      const obj = createCollidable({
        x: 22,
        y: 27,
        width: 4,
        height: 4,
        direction: Direction.UP,
        speed: 2,
        objectType: ObjectType.PROJECTILE,
        power: 1,
      });

      expect(world.hasCollision(obj)).toBe(true);
      expect(destroySpy).not.toHaveBeenCalled();
    });
  });
});

describe('computeNextBounds', () => {
  it('moves bounds upward', () => {
    const b = computeNextBounds(10, 20, 16, 16, Direction.UP, 2);
    expect(b).toEqual({ minX: 10, maxX: 25, minY: 18, maxY: 33 });
  });

  it('moves bounds downward', () => {
    const b = computeNextBounds(10, 20, 16, 16, Direction.DOWN, 2);
    expect(b).toEqual({ minX: 10, maxX: 25, minY: 23, maxY: 38 });
  });

  it('moves bounds left', () => {
    const b = computeNextBounds(10, 20, 16, 16, Direction.LEFT, 3);
    expect(b).toEqual({ minX: 7, maxX: 22, minY: 20, maxY: 35 });
  });

  it('moves bounds right', () => {
    const b = computeNextBounds(10, 20, 16, 16, Direction.RIGHT, 3);
    expect(b).toEqual({ minX: 14, maxX: 29, minY: 20, maxY: 35 });
  });
});

describe('isOutOfBounds', () => {
  const bounds: Bounds = { minX: -1, maxX: 14, minY: 5, maxY: 20 };

  it('detects out of bounds LEFT', () => {
    expect(isOutOfBounds(bounds, Direction.LEFT, 0, 200, 0, 200)).toBe(true);
  });

  it('returns false when within bounds LEFT', () => {
    expect(isOutOfBounds({ ...bounds, minX: 0 }, Direction.LEFT, 0, 200, 0, 200)).toBe(false);
  });

  it('detects out of bounds UP', () => {
    expect(isOutOfBounds({ ...bounds, minY: -1 }, Direction.UP, 0, 200, 0, 200)).toBe(true);
  });

  it('detects out of bounds DOWN', () => {
    expect(isOutOfBounds({ ...bounds, maxY: 200 }, Direction.DOWN, 0, 200, 0, 200)).toBe(true);
  });

  it('detects out of bounds RIGHT', () => {
    expect(isOutOfBounds({ ...bounds, maxX: 200 }, Direction.RIGHT, 0, 200, 0, 200)).toBe(true);
  });
});

describe('overlapsRect', () => {
  it('returns true when min corner overlaps', () => {
    const bounds: Bounds = { minX: 5, maxX: 20, minY: 5, maxY: 20 };
    expect(overlapsRect(bounds, { x: 0, y: 0, width: 10, height: 10 })).toBe(true);
  });

  it('returns true when max corner overlaps', () => {
    const bounds: Bounds = { minX: -5, maxX: 5, minY: -5, maxY: 5 };
    expect(overlapsRect(bounds, { x: 0, y: 0, width: 10, height: 10 })).toBe(true);
  });

  it('returns false when no overlap', () => {
    const bounds: Bounds = { minX: 50, maxX: 65, minY: 50, maxY: 65 };
    expect(overlapsRect(bounds, { x: 0, y: 0, width: 10, height: 10 })).toBe(false);
  });
});

describe('overlapsDirectional', () => {
  const tank: TankRect = { top: 40, bottom: 56, left: 40, right: 56, x: 40, y: 40 };

  it('detects collision moving UP into tank', () => {
    const bounds: Bounds = { minX: 42, maxX: 52, minY: 50, maxY: 60 };
    expect(overlapsDirectional(bounds, Direction.UP, tank, 42, 62)).toBe(true);
  });

  it('returns false when same position', () => {
    const bounds: Bounds = { minX: 40, maxX: 55, minY: 38, maxY: 53 };
    expect(overlapsDirectional(bounds, Direction.UP, tank, 40, 40)).toBe(false);
  });

  it('returns false when no overlap', () => {
    const bounds: Bounds = { minX: 100, maxX: 115, minY: 38, maxY: 53 };
    expect(overlapsDirectional(bounds, Direction.UP, tank, 100, 55)).toBe(false);
  });

  it('detects collision moving LEFT into tank', () => {
    const bounds: Bounds = { minX: 50, maxX: 60, minY: 42, maxY: 52 };
    expect(overlapsDirectional(bounds, Direction.LEFT, tank, 62, 42)).toBe(true);
  });

  it('detects collision moving DOWN into tank', () => {
    const bounds: Bounds = { minX: 42, maxX: 52, minY: 30, maxY: 42 };
    expect(overlapsDirectional(bounds, Direction.DOWN, tank, 42, 20)).toBe(true);
  });

  it('detects collision moving RIGHT into tank', () => {
    const bounds: Bounds = { minX: 38, maxX: 42, minY: 42, maxY: 52 };
    expect(overlapsDirectional(bounds, Direction.RIGHT, tank, 20, 42)).toBe(true);
  });
});

describe('computeTileRange', () => {
  it('computes tile range moving UP', () => {
    const bounds: Bounds = { minX: 16, maxX: 31, minY: 20, maxY: 35 };
    const range = computeTileRange(bounds, Direction.UP, 26, 26);
    expect(range).toEqual({ minX: 2, maxX: 3, minY: 2, maxY: 2 });
  });

  it('computes tile range moving RIGHT', () => {
    const bounds: Bounds = { minX: 16, maxX: 31, minY: 16, maxY: 31 };
    const range = computeTileRange(bounds, Direction.RIGHT, 26, 26);
    expect(range).toEqual({ minX: 3, maxX: 3, minY: 2, maxY: 3 });
  });

  it('clamps negative indices to 0', () => {
    const bounds: Bounds = { minX: -5, maxX: 10, minY: -5, maxY: 10 };
    const range = computeTileRange(bounds, Direction.UP, 26, 26);
    expect(range.minX).toBe(0);
    expect(range.minY).toBe(0);
  });

  it('clamps indices to stage size', () => {
    const bounds: Bounds = { minX: 300, maxX: 315, minY: 300, maxY: 315 };
    const range = computeTileRange(bounds, Direction.DOWN, 26, 26);
    expect(range.maxX).toBe(25);
    expect(range.maxY).toBe(25);
  });
});
