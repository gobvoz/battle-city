import type { event } from './events.js';

export type StateEvent = (typeof event.state)[keyof typeof event.state];
export type InputAction = (typeof event.inputAction)[keyof typeof event.inputAction];
