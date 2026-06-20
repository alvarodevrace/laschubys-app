import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, Router, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideAlertCircle,
  lucideArrowLeft,
  lucideBookOpen,
  lucideBriefcase,
  lucideCat,
  lucideCheck,
  lucideChevronDown,
  lucideChevronLeft,
  lucideChevronRight,
  lucideDownload,
  lucideExternalLink,
  lucideFileText,
  lucideHeart,
  lucideImage,
  lucideLayoutGrid,
  lucideLogOut,
  lucideMail,
  lucideMenu,
  lucideMessageCircle,
  lucideMinus,
  lucidePencil,
  lucidePhone,
  lucidePlus,
  lucideSearch,
  lucideShoppingCart,
  lucideSparkles,
  lucideStore,
  lucideTrash,
  lucideTrash2,
  lucideUpload,
  lucideUser,
  lucideUserRound,
  lucideUsers,
  lucideX,
} from '@ng-icons/lucide';
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
    provideIcons({
      lucideAlertCircle,
      lucideArrowLeft,
      lucideBookOpen,
      lucideBriefcase,
      lucideCat,
      lucideCheck,
      lucideChevronDown,
      lucideChevronLeft,
      lucideChevronRight,
      lucideDownload,
      lucideExternalLink,
      lucideFileText,
      lucideHeart,
      lucideImage,
      lucideLayoutGrid,
      lucideLogOut,
      lucideMail,
      lucideMenu,
      lucideMessageCircle,
      lucideMinus,
      lucidePencil,
      lucidePhone,
      lucidePlus,
      lucideSearch,
      lucideShoppingCart,
      lucideSparkles,
      lucideStore,
      lucideTrash,
      lucideTrash2,
      lucideUpload,
      lucideUser,
      lucideUserRound,
      lucideUsers,
      lucideX,
    }),
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
