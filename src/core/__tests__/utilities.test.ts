import { generateTerrain } from '../utilities.js';
import { TerrainType } from '../../config/constants.js';
import BrickWall from '../../map/brick-wall.js';
import SteelWall from '../../map/steel-wall.js';
import Water from '../../map/water.js';
import Tree from '../../map/tree.js';
import Ice from '../../map/ice.js';

const noop = () => {};

describe('generateTerrain', () => {
  it('returns a 2D array with same dimensions as input', () => {
    const stage = [
      [0, 1, 2],
      [3, 4, 5],
    ] as const;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const terrain = generateTerrain(stage as any, noop);
    expect(terrain).toHaveLength(2);
    expect(terrain[0]).toHaveLength(3);
  });

  it('returns null for EMPTY tiles', () => {
    const stage = [[TerrainType.EMPTY]];
    const terrain = generateTerrain(stage, noop);
    expect(terrain[0][0]).toBeNull();
  });

  it('creates BrickWall for BRICK_WALL type', () => {
    const stage = [[TerrainType.BRICK_WALL]];
    const terrain = generateTerrain(stage, noop);
    expect(terrain[0][0]).toBeInstanceOf(BrickWall);
  });

  it('creates SteelWall for STEEL_WALL type', () => {
    const stage = [[TerrainType.STEEL_WALL]];
    const terrain = generateTerrain(stage, noop);
    expect(terrain[0][0]).toBeInstanceOf(SteelWall);
  });

  it('creates Water for WATER type', () => {
    vi.useFakeTimers();
    const stage = [[TerrainType.WATER]];
    const terrain = generateTerrain(stage, noop);
    expect(terrain[0][0]).toBeInstanceOf(Water);
    // cleanup
    (terrain[0][0] as Water).destroy();
    vi.useRealTimers();
  });

  it('creates Tree for TREE type', () => {
    const stage = [[TerrainType.TREE]];
    const terrain = generateTerrain(stage, noop);
    expect(terrain[0][0]).toBeInstanceOf(Tree);
  });

  it('creates Ice for ICE type', () => {
    const stage = [[TerrainType.ICE]];
    const terrain = generateTerrain(stage, noop);
    expect(terrain[0][0]).toBeInstanceOf(Ice);
  });

  it('wires "destroyed" listener to callback on walls', () => {
    const callback = vi.fn();
    const stage = [[TerrainType.BRICK_WALL]];
    const terrain = generateTerrain(stage, callback);
    const wall = terrain[0][0]!;
    wall.emit('destroyed', wall);
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(wall);
  });

  it('does not wire "destroyed" listener to empty tiles', () => {
    const callback = vi.fn();
    const stage = [[TerrainType.EMPTY]];
    generateTerrain(stage, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('uses row index as y and column index as x', () => {
    const stage = [
      [TerrainType.EMPTY, TerrainType.BRICK_WALL],
      [TerrainType.BRICK_WALL, TerrainType.EMPTY],
    ];
    const terrain = generateTerrain(stage, noop);
    // row=0, col=1 → x=1, y=0
    expect(terrain[0][1]?.x).toBe(1);
    expect(terrain[0][1]?.y).toBe(0);
    // row=1, col=0 → x=0, y=1
    expect(terrain[1][0]?.x).toBe(0);
    expect(terrain[1][0]?.y).toBe(1);
  });
});
