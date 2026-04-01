import type { DirectionType, ObjectTypeValue } from '../config/constants.type.js';
import type { ITankRef } from '../entities/entities.type.js';

export interface ICollidable {
  x: number;
  y: number;
  width: number;
  height: number;
  direction: DirectionType;
  speed: number;
  objectType: ObjectTypeValue;
  power?: number;
  tank?: ITankRef;
}

export interface IWorldObject {
  x: number;
  y: number;
  width: number;
  height: number;
  sprite: readonly number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(...args: any[]): void;
}

export interface IWorld {
  hasCollision(obj: ICollidable): boolean;
}
