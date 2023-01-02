import { EventEmitter } from 'node:events';

export class RealtimeBus extends EventEmitter {}

export const realtimeBus = new RealtimeBus();
