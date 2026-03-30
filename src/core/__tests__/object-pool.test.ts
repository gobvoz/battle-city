import { ObjectPool } from '../object-pool.js';

describe('ObjectPool', () => {
  it('calls factory when pool is empty', () => {
    const factory = vi.fn(() => ({ id: 1 }));
    const pool = new ObjectPool(factory);
    pool.acquire();
    expect(factory).toHaveBeenCalledOnce();
  });

  it('reuses released instance without calling factory again', () => {
    const factory = vi.fn(() => ({}));
    const pool = new ObjectPool(factory);
    const obj = pool.acquire();
    pool.release(obj);
    const reused = pool.acquire();
    expect(reused).toBe(obj);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('calls factory again when pool is empty after reuse', () => {
    const factory = vi.fn(() => ({}));
    const pool = new ObjectPool(factory);
    const obj = pool.acquire();
    pool.release(obj);
    pool.acquire(); // takes obj from pool
    pool.acquire(); // pool empty → factory called again
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('tracks available size correctly', () => {
    const pool = new ObjectPool(() => ({}));
    expect(pool.size).toBe(0);
    const a = pool.acquire();
    const b = pool.acquire();
    pool.release(a);
    expect(pool.size).toBe(1);
    pool.release(b);
    expect(pool.size).toBe(2);
    pool.acquire();
    expect(pool.size).toBe(1);
  });

  it('acts as a stack — last released is first acquired', () => {
    const pool = new ObjectPool(() => ({}));
    const a = pool.acquire();
    const b = pool.acquire();
    pool.release(a);
    pool.release(b);
    expect(pool.acquire()).toBe(b);
    expect(pool.acquire()).toBe(a);
  });
});
