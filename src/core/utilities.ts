import BrickWall from '../map/brick-wall.js';
import SteelWall from '../map/steel-wall.js';
import Water from '../map/water.js';
import Tree from '../map/tree.js';
import Ice from '../map/ice.js';

import { TerrainType } from '../config/constants.js';
import type { TerrainTypeValue } from '../config/constants.type.js';
import type { EventEmitter } from './event-emitter.js';

// Minimal interface for map tiles — will be tightened when map/ is migrated
export interface IMapTile extends EventEmitter {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
  sprite: readonly number[];
  hit(object: unknown): boolean;
  moveThrough(object: unknown): boolean;
}

type TileConstructor = new (coords: { x: number; y: number }) => IMapTile;

const TerrainList: Partial<Record<TerrainTypeValue, TileConstructor>> = {
  [TerrainType.BRICK_WALL]: BrickWall,
  [TerrainType.STEEL_WALL]: SteelWall,
  [TerrainType.WATER]: Water,
  [TerrainType.TREE]: Tree,
  [TerrainType.ICE]: Ice,
};

const generateWall = ({
  x,
  y,
  terrainType,
}: {
  x: number;
  y: number;
  terrainType: TerrainTypeValue;
}): IMapTile | null => {
  if (terrainType === TerrainType.EMPTY) return null;

  try {
    const Terrain = TerrainList[terrainType];
    if (!Terrain) throw new Error(`Unknown terrain type: ${terrainType}`);
    return new Terrain({ x, y });
  } catch (e) {
    console.warn(`Unknown terrain type: ${terrainType}`);
    return null;
  }
};

export const generateTerrain = (
  stage: TerrainTypeValue[][],
  removeWallCallBack: (wall: IMapTile) => void,
): (IMapTile | null)[][] =>
  stage.map((row, rowIndex) =>
    row.map((terrainType, columnIndex) => {
      const wall = generateWall({ x: columnIndex, y: rowIndex, terrainType });

      if (wall !== null) {
        wall.on('destroyed', removeWallCallBack as (...args: unknown[]) => void);
      }

      return wall;
    }),
  );
