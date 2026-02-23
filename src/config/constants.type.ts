import { Direction, TerrainType, ObjectType, TankType, EnemyType } from './constants.js';

export type DirectionType = (typeof Direction)[keyof typeof Direction];
export type TerrainTypeValue = (typeof TerrainType)[keyof typeof TerrainType];
export type ObjectTypeValue = (typeof ObjectType)[keyof typeof ObjectType];
export type TankTypeValue = (typeof TankType)[keyof typeof TankType];
export type EnemyTypeValue = (typeof EnemyType)[keyof typeof EnemyType];

export interface StageConfig {
  terrain: TerrainTypeValue[][];
  enemies: EnemyTypeValue[];
}
