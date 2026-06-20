import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes, RenderMode, ServerRoute } from '@angular/ssr';

import { appConfig } from './app.config';
import { environment } from './core/config/environment';

const constructionServerRoutes: ServerRoute[] = [
  { path: 'linktree', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];

const fullServerRoutes: ServerRoute[] = [
  { path: 'blog/:slug', renderMode: RenderMode.Server },
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'auth/callback', renderMode: RenderMode.Client },
  { path: 'checkout', renderMode: RenderMode.Client },
  { path: 'carrito', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server },
];

const serverRoutes: ServerRoute[] = environment.underConstruction
  ? constructionServerRoutes
  : fullServerRoutes;

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes))],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
