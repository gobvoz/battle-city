import {
  Direction,
  TerrainType,
  ObjectType,
  TankType,
  EnemyType,
  PowerUpType,
} from './constants.js';

export type DirectionType = (typeof Direction)[keyof typeof Direction];
export type TerrainTypeValue = (typeof TerrainType)[keyof typeof TerrainType];
export type ObjectTypeValue = (typeof ObjectType)[keyof typeof ObjectType];
export type TankTypeValue = (typeof TankType)[keyof typeof TankType];
export type EnemyTypeValue = (typeof EnemyType)[keyof typeof EnemyType];
export type PowerUpTypeValue = (typeof PowerUpType)[keyof typeof PowerUpType];

export interface StageConfig {
  terrain: TerrainTypeValue[][];
  enemies: EnemyTypeValue[];
}
