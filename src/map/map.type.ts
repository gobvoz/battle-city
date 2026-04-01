import type { ObjectTypeValue, DirectionType } from '../config/constants.type.js';

export interface IHittable {
  objectType: ObjectTypeValue;
  power: number;
  direction: DirectionType;
}
