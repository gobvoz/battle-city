import BrickWall from './brick-wall.js';
import SteelWall from './steel-wall.js';

import { TerrainType } from './constants.js';

export function generateWall({ x, y, terrainType }) {
  let wall = null;

  switch (terrainType) {
    case TerrainType.EMPTY:
      return wall;
    case TerrainType.BRICK_WALL:
      wall = new BrickWall({
        x,
        y,
        terrainType,
      });
      return wall;
    case TerrainType.STEEL_WALL:
      wall = new SteelWall({
        x,
        y,
        terrainType,
      });
      return wall;
    case TerrainType.TREE:
      return wall;
    case TerrainType.WATER:
      return wall;
    case TerrainType.ICE:
      return wall;
    default:
      throw new Error(`Unknown terrain type: ${terrainType}`);
  }
}
