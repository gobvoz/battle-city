import Projectile from '../projectile.js';
import { Direction, ProjectileOption, TankType } from '../../config/constants.js';
import type { IWorld } from '../../world/world.type.js';
import type { ITankForProjectile } from '../projectile.js';

const mockWorld = {} as IWorld;

const PW = ProjectileOption.WIDTH;
const PH = ProjectileOption.HEIGHT;

function makeTank(direction: ITankForProjectile['direction']): ITankForProjectile {
  return {
    x: 100,
    y: 200,
    width: 32,
    height: 32,
    direction,
    power: 1,
    projectileSpeed: 2,
    tankType: TankType.PLAYER_1,
    playerIndex: 0,
    hasProjectile: false,
  };
}

describe('Projectile.init()', () => {
  it('sets power, speed and direction from tank', () => {
    const p = new Projectile();
    const tank = makeTank(Direction.UP);
    p.init({ tank, direction: Direction.UP, world: mockWorld });
    expect(p.power).toBe(1);
    expect(p.speed).toBe(2);
    expect(p.direction).toBe(Direction.UP);
  });

  it('positions correctly when firing UP', () => {
    const p = new Projectile();
    const tank = makeTank(Direction.UP);
    p.init({ tank, direction: Direction.UP, world: mockWorld });
    expect(p.x).toBe(tank.x + (tank.width >> 1) - (PW >> 1));
    expect(p.y).toBe(tank.y);
  });

  it('positions correctly when firing DOWN', () => {
    const p = new Projectile();
    const tank = makeTank(Direction.DOWN);
    p.init({ tank, direction: Direction.DOWN, world: mockWorld });
    expect(p.x).toBe(tank.x + (tank.width >> 1) - (PW >> 1));
    expect(p.y).toBe(tank.y + tank.height);
  });

  it('positions correctly when firing LEFT', () => {
    const p = new Projectile();
    const tank = makeTank(Direction.LEFT);
    p.init({ tank, direction: Direction.LEFT, world: mockWorld });
    expect(p.x).toBe(tank.x);
    expect(p.y).toBe(tank.y + (tank.height >> 1) - (PH >> 1));
  });

  it('positions correctly when firing RIGHT', () => {
    const p = new Projectile();
    const tank = makeTank(Direction.RIGHT);
    p.init({ tank, direction: Direction.RIGHT, world: mockWorld });
    expect(p.x).toBe(tank.x + tank.width);
    expect(p.y).toBe(tank.y + (tank.height >> 1) - (PH >> 1));
  });

  it('syncs realX/realY with x/y after init', () => {
    const p = new Projectile();
    const tank = makeTank(Direction.UP);
    p.init({ tank, direction: Direction.UP, world: mockWorld });
    expect(p.realX).toBe(p.x);
    expect(p.realY).toBe(p.y);
  });

  it('sets world reference', () => {
    const p = new Projectile();
    const tank = makeTank(Direction.UP);
    p.init({ tank, direction: Direction.UP, world: mockWorld });
    expect(p.world).toBe(mockWorld);
  });
});
