import { Direction } from '../config/constants.js';
import type { DirectionType } from '../config/constants.type.js';

export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TileRange {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export function computeNextBounds(
  x: number,
  y: number,
  width: number,
  height: number,
  direction: DirectionType,
  speed: number
): Bounds {
  let minX = x;
  let maxX = x + width - 1;
  let minY = y;
  let maxY = y + height - 1;

  switch (direction) {
    case Direction.UP:
      minY -= speed;
      maxY -= speed;
      break;
    case Direction.DOWN:
      minY += speed + 1;
      maxY += speed + 1;
      break;
    case Direction.LEFT:
      minX -= speed;
      maxX -= speed;
      break;
    case Direction.RIGHT:
      minX += speed + 1;
      maxX += speed + 1;
      break;
  }

  return { minX, maxX, minY, maxY };
}

export function isOutOfBounds(
  bounds: Bounds,
  direction: DirectionType,
  worldMinX: number,
  worldMaxX: number,
  worldMinY: number,
  worldMaxY: number
): boolean {
  switch (direction) {
    case Direction.UP:
      return bounds.minY < worldMinY;
    case Direction.DOWN:
      return bounds.maxY >= worldMaxY;
    case Direction.LEFT:
      return bounds.minX < worldMinX;
    case Direction.RIGHT:
      return bounds.maxX >= worldMaxX;
    default:
      return false;
  }
}

export function overlapsRect(bounds: Bounds, rect: Rect): boolean {
  const dMinX = bounds.minX - rect.x;
  const dMaxX = bounds.maxX - rect.x;
  const dMinY = bounds.minY - rect.y;
  const dMaxY = bounds.maxY - rect.y;

  return (
    (dMinX >= 0 && dMinX <= rect.width && dMinY >= 0 && dMinY <= rect.height) ||
    (dMaxX >= 0 && dMaxX <= rect.width && dMaxY >= 0 && dMaxY <= rect.height)
  );
}

export interface TankRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  x: number;
  y: number;
}

export function overlapsDirectional(
  bounds: Bounds,
  direction: DirectionType,
  tank: TankRect,
  objectX: number,
  objectY: number
): boolean {
  if (tank.x === objectX && tank.y === objectY) return false;

  switch (direction) {
    case Direction.UP:
      return (
        tank.bottom > bounds.minY &&
        tank.top < bounds.minY &&
        ((tank.left < bounds.minX && tank.right > bounds.minX) ||
          (tank.left < bounds.maxX && tank.right > bounds.maxX))
      );
    case Direction.LEFT:
      return (
        tank.right > bounds.minX &&
        tank.left < bounds.minX &&
        ((tank.top < bounds.minY && tank.bottom > bounds.minY) ||
          (tank.top < bounds.maxY && tank.bottom > bounds.maxY))
      );
    case Direction.DOWN:
      return (
        tank.top < bounds.maxY &&
        tank.bottom > bounds.maxY &&
        ((tank.left < bounds.minX && tank.right > bounds.minX) ||
          (tank.left < bounds.maxX && tank.right > bounds.maxX))
      );
    case Direction.RIGHT:
      return (
        tank.left < bounds.maxX &&
        tank.right > bounds.maxX &&
        ((tank.top < bounds.minY && tank.bottom > bounds.minY) ||
          (tank.top < bounds.maxY && tank.bottom > bounds.maxY))
      );
    default:
      return false;
  }
}

const TILE_SHIFT = 3; // TILE_SIZE = 8 = 2^3

export function computeTileRange(
  bounds: Bounds,
  direction: DirectionType,
  stageWidth: number,
  stageHeight: number
): TileRange {
  let minX: number;
  let maxX: number;
  let minY: number;
  let maxY: number;

  switch (direction) {
    case Direction.UP:
      minX = bounds.minX >> TILE_SHIFT;
      maxX = bounds.maxX >> TILE_SHIFT;
      minY = bounds.minY >> TILE_SHIFT;
      maxY = bounds.minY >> TILE_SHIFT;
      break;
    case Direction.LEFT:
      minX = bounds.minX >> TILE_SHIFT;
      maxX = bounds.minX >> TILE_SHIFT;
      minY = bounds.minY >> TILE_SHIFT;
      maxY = bounds.maxY >> TILE_SHIFT;
      break;
    case Direction.DOWN:
      minX = bounds.minX >> TILE_SHIFT;
      maxX = bounds.maxX >> TILE_SHIFT;
      minY = bounds.maxY >> TILE_SHIFT;
      maxY = bounds.maxY >> TILE_SHIFT;
      break;
    case Direction.RIGHT:
      minX = bounds.maxX >> TILE_SHIFT;
      maxX = bounds.maxX >> TILE_SHIFT;
      minY = bounds.minY >> TILE_SHIFT;
      maxY = bounds.maxY >> TILE_SHIFT;
      break;
    default:
      minX = 0;
      maxX = 0;
      minY = 0;
      maxY = 0;
  }

  return {
    minX: Math.max(minX, 0),
    maxX: Math.min(maxX, stageWidth - 1),
    minY: Math.max(minY, 0),
    maxY: Math.min(maxY, stageHeight - 1),
  };
}
