import { Input } from '../input-handler.js';
import { keyCode } from '../../config/key-codes.js';
import { event } from '../../config/events.js';
import type { IGameContext } from '../game-context.type.js';
import { EventEmitter } from '../event-emitter.js';

function makeGame(): IGameContext {
  return { events: new EventEmitter() } as unknown as IGameContext;
}

describe('Input', () => {
  let game: IGameContext;
  let input: Input;

  beforeEach(() => {
    game = makeGame();
    input = new Input(game);
  });

  it('activeKeys() is empty initially', () => {
    expect(input.activeKeys().size).toBe(0);
  });

  it('isKeyPressed() returns false for unpressed key', () => {
    expect(input.isKeyPressed(keyCode.SPACE)).toBe(false);
  });

  it('isKeyReleased() returns true for unpressed key', () => {
    expect(input.isKeyReleased(keyCode.SPACE)).toBe(true);
  });

  it('keydown adds key to activeKeys()', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: keyCode.SPACE, bubbles: true }));
    expect(input.activeKeys().has(keyCode.SPACE)).toBe(true);
  });

  it('keyup removes key from activeKeys()', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: keyCode.SPACE, bubbles: true }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code: keyCode.SPACE, bubbles: true }));
    expect(input.activeKeys().has(keyCode.SPACE)).toBe(false);
  });

  it('isKeyPressed() returns true after keydown', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: keyCode.SPACE, bubbles: true }));
    expect(input.isKeyPressed(keyCode.SPACE)).toBe(true);
  });

  it('isKeyReleased() returns true after keyup', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: keyCode.SPACE, bubbles: true }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code: keyCode.SPACE, bubbles: true }));
    expect(input.isKeyReleased(keyCode.SPACE)).toBe(true);
  });

  it('unknown key code is ignored (not added to activeKeys)', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'F12', bubbles: true }));
    expect(input.activeKeys().has('F12')).toBe(false);
  });

  it('keydown emits game event for allowed key', () => {
    const listener = vi.fn();
    game.events.on(event.key.SPACE, listener);
    window.dispatchEvent(new KeyboardEvent('keydown', { code: keyCode.SPACE, bubbles: true }));
    expect(listener).toHaveBeenCalledWith(event.inputAction.PRESSED);
  });

  it('keyup emits game event for allowed key', () => {
    const listener = vi.fn();
    game.events.on(event.key.SPACE, listener);
    window.dispatchEvent(new KeyboardEvent('keyup', { code: keyCode.SPACE, bubbles: true }));
    expect(listener).toHaveBeenCalledWith(event.inputAction.RELEASED);
  });

  it('activeKeys() returns a copy — mutations do not affect internal state', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: keyCode.SPACE, bubbles: true }));
    const keys = input.activeKeys();
    keys.clear();
    expect(input.isKeyPressed(keyCode.SPACE)).toBe(true);
  });
});
