import EnemyTank from '../enemy-tank.js';
import { TankType, Enemy1TankOption, Direction } from '../../config/constants.js';
import type { IWorld } from '../../world/world.type.js';

const freeWorld = { hasCollision: () => false } as unknown as IWorld;
const blockedWorld = { hasCollision: () => true } as unknown as IWorld;

function makeEnemy(world: IWorld = freeWorld): EnemyTank {
  return new EnemyTank({
    type: TankType.ENEMY,
    tankOptions: Enemy1TankOption,
    world,
    x: 0,
    y: 0,
  });
}

describe('EnemyTank', () => {
  it('starts with direction DOWN (from Enemy1TankOption)', () => {
    expect(makeEnemy().direction).toBe(Direction.DOWN);
  });

  it('initializes actionDelay >= BASE_CHANGE_DIRECTION_DELAY', () => {
    const tank = makeEnemy();
    expect(tank.actionDelay).toBeGreaterThanOrEqual(Enemy1TankOption.BASE_CHANGE_DIRECTION_DELAY);
  });

  it('initializes shootDelay >= BASE_FIRE_DELAY', () => {
    const tank = makeEnemy();
    expect(tank.shootDelay).toBeGreaterThanOrEqual(Enemy1TankOption.BASE_FIRE_DELAY);
  });

  it('emits FIRE when shootDelay hits 0', () => {
    const tank = makeEnemy();
    const listener = vi.fn();
    tank.on('fire', listener);

    // Force both delays to fire immediately on next update
    tank.actionDelay = 1;
    tank.shootDelay = 1;
    tank.update();

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(tank);
  });

  it('does NOT move when world has collision (speed = 0)', () => {
    const tank = makeEnemy(blockedWorld);
    const xBefore = tank.realX;
    const yBefore = tank.realY;

    // Bypass direction change
    tank.actionDelay = 999;
    tank.shootDelay = 999;
    tank.update();

    expect(tank.realX).toBe(xBefore);
    expect(tank.realY).toBe(yBefore);
  });

  it('moves DOWN when world is free (default direction)', () => {
    const tank = makeEnemy(freeWorld);
    const yBefore = tank.realY;

    tank.direction = Direction.DOWN;
    tank.actionDelay = 999;
    tank.shootDelay = 999;
    tank.update();

    expect(tank.realY).toBeGreaterThan(yBefore);
  });

  it('halves actionDelay when blocked', () => {
    const tank = makeEnemy(blockedWorld);
    tank.actionDelay = 100;
    tank.shootDelay = 999;
    tank.update();
    // update() decrements first (→ 99), then halves on block (→ 49)
    expect(tank.actionDelay).toBe(49);
  });

  it('createRandom() returns an EnemyTank instance', () => {
    const tank = EnemyTank.createRandom({
      type: TankType.ENEMY,
      tankOptions: Enemy1TankOption,
      world: freeWorld,
      x: 0,
      y: 0,
    });
    expect(tank).toBeInstanceOf(EnemyTank);
  });
});
