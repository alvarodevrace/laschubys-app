import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, Router, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import {
  LucideAngularModule,
  BookOpen,
  Cat,
  ChevronDown,
  Heart,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  Search,
  ShoppingCart,
  Sparkles,
  Store,
  UserRound,
  Users,
  X,
} from 'lucide-angular';
import * as Sentry from '@sentry/angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { AuthService } from './core/auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAppInitializer(() => inject(AuthService).initSession()),
    importProvidersFrom(
      LucideAngularModule.pick({
        BookOpen,
        Cat,
        ChevronDown,
        Heart,
        LayoutGrid,
        LogOut,
        Mail,
        Menu,
        Search,
        ShoppingCart,
        Sparkles,
        Store,
        UserRound,
        Users,
        X,
      }),
    ),
    { provide: ErrorHandler, useValue: Sentry.createErrorHandler() },
    { provide: Sentry.TraceService, deps: [Router] },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {
        /* Sentry TraceService initializer */
      },
      deps: [Sentry.TraceService],
      multi: true,
    },
  ],
};
