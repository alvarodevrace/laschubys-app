import { bootstrapApplication } from '@angular/platform-browser';
import WebSocket from 'ws';

import { App } from './app/app';
import { config } from './app/app.config.server';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = WebSocket as unknown as typeof globalThis.WebSocket;
}

// context es el BootstrapContext que pasa @angular/ssr en Angular 21
const bootstrap = (context?: Parameters<typeof bootstrapApplication>[2]) =>
  bootstrapApplication(App, config, context);

export default bootstrap;
