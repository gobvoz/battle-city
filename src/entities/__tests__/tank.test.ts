import Tank from '../tank.js';
import { Direction, TankType, ObjectType, Player1TankOption } from '../../config/constants.js';
import type { IWorld } from '../../world/world.type.js';
import type { IHitObject } from '../entities.type.js';

// Stub world that never blocks movement
const freeWorld = { hasCollision: () => false } as unknown as IWorld;
// Stub world that always blocks
const blockedWorld = { hasCollision: () => true } as unknown as IWorld;

function makePlayer1(world: IWorld = freeWorld): Tank {
  return new Tank({
    type: TankType.PLAYER_1,
    tankOptions: Player1TankOption,
    world,
    x: 64,
    y: 64,
  });
}

function makeProjectileHit(_tank: Tank, power = 1): IHitObject {
  return {
    objectType: ObjectType.PROJECTILE,
    power,
    tank: { tankType: TankType.ENEMY, playerIndex: undefined } as never,
    direction: Direction.UP,
  } as IHitObject;
}

describe('Tank', () => {
  describe('construction', () => {
    it('starts as "dead" state', () => {
      expect(makePlayer1().state).toBe('dead');
    });

    it('sets direction from tankOptions', () => {
      expect(makePlayer1().direction).toBe(Player1TankOption.START_DIRECTION);
    });
    it('sets power from tankOptions', () => {
      expect(makePlayer1().power).toBe(Player1TankOption.DEFAULT_POWER);
    });
  });

  describe('direction control', () => {
    it('moveUp() sets direction to UP', () => {
      const tank = makePlayer1();
      tank.moveDown(); // set opposing direction first
      tank.moveUp();
      expect(tank.direction).toBe(Direction.UP);
    });

    it('moveDown() sets direction to DOWN', () => {
      const tank = makePlayer1();
      tank.moveDown();
      expect(tank.direction).toBe(Direction.DOWN);
    });

    it('moveLeft() sets direction to LEFT', () => {
      const tank = makePlayer1();
      tank.moveLeft();
      expect(tank.direction).toBe(Direction.LEFT);
    });

    it('moveRight() sets direction to RIGHT', () => {
      const tank = makePlayer1();
      tank.moveRight();
      expect(tank.direction).toBe(Direction.RIGHT);
    });
  });

  describe('fire()', () => {
    it('does not emit FIRE when state is "dead"', () => {
      const tank = makePlayer1();
      const listener = vi.fn();
      tank.on('fire', listener);
      tank.fire();
      expect(listener).not.toHaveBeenCalled();
    });

    it('emits FIRE when state is "active"', () => {
      const tank = makePlayer1();
      // activate via update with no keys pressed (sets state to active)
      tank.update(16, new Set());
      const listener = vi.fn();
      tank.on('fire', listener);
      tank.fire();
      expect(listener).toHaveBeenCalledOnce();
      expect(listener).toHaveBeenCalledWith(tank);
    });
  });

  describe('hit()', () => {
    it('returns false for non-projectile', () => {
      const tank = makePlayer1();
      const nonProjectile = { objectType: ObjectType.PLAYER_TANK } as IHitObject;
      expect(tank.hit(nonProjectile)).toBe(false);
    });

    it('returns false when invulnerable', () => {
      const tank = makePlayer1();
      tank.invulnerable = true;
      expect(tank.hit(makeProjectileHit(tank))).toBe(false);
    });

    it('returns false when hit by own projectile', () => {
      const tank = makePlayer1();
      const ownProjectile: IHitObject = {
        objectType: ObjectType.PROJECTILE,
        power: 1,
        tank: tank as never,
        direction: Direction.UP,
      } as IHitObject;
      expect(tank.hit(ownProjectile)).toBe(false);
    });

    it('returns false when hit by friendly projectile (same tank type)', () => {
      const tank = makePlayer1();
      const friendlyProjectile: IHitObject = {
        objectType: ObjectType.PROJECTILE,
        power: 1,
        tank: { tankType: TankType.PLAYER_1, playerIndex: undefined } as never,
        direction: Direction.UP,
      } as IHitObject;
      expect(tank.hit(friendlyProjectile)).toBe(false);
    });

    it('emits "destroyed" and sets state "dead" on valid hit', () => {
      const tank = makePlayer1();
      const listener = vi.fn();
      tank.on('destroyed', listener);
      tank.hit(makeProjectileHit(tank));
      expect(tank.state).toBe('dead');
      expect(listener).toHaveBeenCalledOnce();
      expect(listener).toHaveBeenCalledWith(tank);
    });
  });

  describe('update()', () => {
    it('sets state to "active" after first update', () => {
      const tank = makePlayer1();
      tank.update(16, new Set());
      expect(tank.state).toBe('active');
    });

    it('moves UP when UP key pressed and world is free', () => {
      const tank = makePlayer1(freeWorld);
      tank.update(16, new Set()); // activate
      const yBefore = tank.realY;
      const activeKeys = new Set(['KeyW']);
      tank.update(16, activeKeys);
      expect(tank.realY).toBeLessThan(yBefore);
    });

    it('does not move when world has collision', () => {
      const tank = makePlayer1(blockedWorld);
      tank.update(16, new Set()); // activate (state change)
      const yBefore = tank.realY;
      tank.update(16, new Set(['KeyW']));
      expect(tank.realY).toBe(yBefore);
    });
  });
});
