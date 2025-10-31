import BrickWall from '../map/brick-wall.js';
import SteelWall from '../map/steel-wall.js';
import Water from '../map/water.js';
import Tree from '../map/tree.js';
import Ice from '../map/ice.js';

import { TerrainType } from '../config/constants.js';

const TerrainList = [];
TerrainList[TerrainType.BRICK_WALL] = BrickWall;
TerrainList[TerrainType.STEEL_WALL] = SteelWall;
TerrainList[TerrainType.WATER] = Water;
TerrainList[TerrainType.TREE] = Tree;
TerrainList[TerrainType.ICE] = Ice;

const generateWall = ({ x, y, terrainType }) => {
  if (terrainType === TerrainType.EMPTY) return null;

  try {
    const Terrain = TerrainList[terrainType];
    return new Terrain({ x, y });
  } catch (e) {
    console.log(`Unknown terrain type: ${terrainType}`);
    return null;
  }
};

export const generateTerrain = (stage, removeWallCallBack) =>
  stage.map((row, rowIndex) =>
    row.map((terrainType, columnIndex) => {
      let wall = generateWall({
        x: columnIndex,
        y: rowIndex,
        terrainType,
      });

      if (wall !== null) {
        wall.on('destroyed', removeWallCallBack);
      }

      return wall;
    }),
  );
