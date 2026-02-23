import type { ObjectTypeValue, DirectionType } from '../config/constants.type.js';

export interface IHittable {
  type: ObjectTypeValue;
  power: number;
  direction: DirectionType;
}
