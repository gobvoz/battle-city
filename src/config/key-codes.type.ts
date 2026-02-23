import type { keyCode } from './key-codes.js';

export type KeyCodeValue = (typeof keyCode)[keyof typeof keyCode];
