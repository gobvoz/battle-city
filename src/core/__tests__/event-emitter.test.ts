import { EventEmitter } from '../event-emitter.js';

describe('EventEmitter', () => {
  it('calls listener on emit', () => {
    const ee = new EventEmitter();
    const listener = vi.fn();
    ee.on('test', listener);
    ee.emit('test');
    expect(listener).toHaveBeenCalledOnce();
  });

  it('passes arguments to listener', () => {
    const ee = new EventEmitter();
    const listener = vi.fn();
    ee.on('data', listener);
    ee.emit('data', 42, 'hello');
    expect(listener).toHaveBeenCalledWith(42, 'hello');
  });

  it('does not call listener after off()', () => {
    const ee = new EventEmitter();
    const listener = vi.fn();
    ee.on('test', listener);
    ee.off('test', listener);
    ee.emit('test');
    expect(listener).not.toHaveBeenCalled();
  });

  it('keeps other listeners when one is removed', () => {
    const ee = new EventEmitter();
    const a = vi.fn();
    const b = vi.fn();
    ee.on('test', a);
    ee.on('test', b);
    ee.off('test', a);
    ee.emit('test');
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledOnce();
  });

  it('calls all listeners for the same event', () => {
    const ee = new EventEmitter();
    const a = vi.fn();
    const b = vi.fn();
    ee.on('e', a);
    ee.on('e', b);
    ee.emit('e');
    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
  });

  it('does not throw when emitting unknown event', () => {
    const ee = new EventEmitter();
    expect(() => ee.emit('ghost')).not.toThrow();
  });

  it('does not throw when calling off() for unknown event', () => {
    const ee = new EventEmitter();
    expect(() => ee.off('ghost', vi.fn())).not.toThrow();
  });

  it('clearListeners() removes all listeners', () => {
    const ee = new EventEmitter();
    const a = vi.fn();
    const b = vi.fn();
    ee.on('foo', a);
    ee.on('bar', b);
    ee.clearListeners();
    ee.emit('foo');
    ee.emit('bar');
    expect(a).not.toHaveBeenCalled();
    expect(b).not.toHaveBeenCalled();
  });
});
