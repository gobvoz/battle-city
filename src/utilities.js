import BrickWall from './brick-wall.js';
import SteelWall from './steel-wall.js';
import Water from './water.js';
import Tree from './tree.js';
import Ice from './ice.js';

import { TerrainType } from './constants.js';

const TerrainList = [];
TerrainList[TerrainType.BRICK_WALL] = BrickWall;
TerrainList[TerrainType.STEEL_WALL] = SteelWall;
TerrainList[TerrainType.WATER] = Water;
TerrainList[TerrainType.TREE] = Tree;
TerrainList[TerrainType.ICE] = Ice;

export function generateWall({ x, y, terrainType }) {
  if (terrainType === TerrainType.EMPTY) return null;

  try {
    const Terrain = TerrainList[terrainType];
    return new Terrain({ x, y, terrainType });
  } catch (e) {
    console.log(`Unknown terrain type: ${terrainType}`);
    return null;
  }
}
