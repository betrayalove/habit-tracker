import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';
import { randomUUID } from 'node:crypto';

Object.assign(globalThis, { TextDecoder, TextEncoder });
Object.defineProperty(crypto, 'randomUUID', { value: randomUUID, configurable: true });
