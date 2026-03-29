/**
 * Generic object pool that reuses instances instead of creating new ones.
 *
 * Usage:
 *   const pool = new ObjectPool(() => new Projectile());
 *   const obj = pool.acquire();   // gets from pool or creates new
 *   obj.init(...);                // re-initialise before use
 *   pool.release(obj);            // return when done (after cleanup)
 */
export class ObjectPool<T> {
  private readonly available: T[] = [];
  private readonly factory: () => T;

  constructor(factory: () => T) {
    this.factory = factory;
  }

  acquire(): T {
    return this.available.pop() ?? this.factory();
  }

  release(obj: T): void {
    this.available.push(obj);
  }

  get size(): number {
    return this.available.length;
  }
}
