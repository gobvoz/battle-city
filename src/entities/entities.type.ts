import type {
  DirectionType,
  TankTypeValue,
  EnemyTypeValue,
  ObjectTypeValue,
} from '../config/constants.type.js';
import type { PlayerIndex } from '../core/stats-manager.js';

export type { PlayerIndex };

export type TankSprites = Record<
  DirectionType,
  readonly [readonly [number, number], readonly [number, number]]
>;

export interface IPlayerTankOptions {
  PLAYER_INDEX: PlayerIndex;
  WIDTH: number;
  HEIGHT: number;
  START_DIRECTION: DirectionType;
  MOVEMENT_SPEED: number;
  PROJECTILE_SPEED: number;
  DEFAULT_POWER: number;
  SPRITES: TankSprites;
}

export interface IEnemyTankOptions {
  ENEMY_TYPE: EnemyTypeValue;
  WIDTH: number;
  HEIGHT: number;
  START_DIRECTION: DirectionType;
  MOVEMENT_SPEED: number;
  PROJECTILE_SPEED: number;
  DEFAULT_POWER?: number;
  BASE_CHANGE_DIRECTION_DELAY: number;
  BASE_FIRE_DELAY: number;
  CHANGE_DIRECTION_DELAY_MULTIPLEXER: number;
  FIRE_DELAY_MULTIPLEXER: number;
  SPRITES: TankSprites;
}

export type TankOptions = IPlayerTankOptions | IEnemyTankOptions;

export interface ITankRef {
  tankType: TankTypeValue;
  playerIndex: PlayerIndex | undefined;
}

export interface IHitObject {
  objectType: ObjectTypeValue;
  tank: ITankRef;
}
