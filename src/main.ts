import { bootstrapApplication } from '@angular/platform-browser';
import * as Sentry from '@sentry/angular';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const sentryDsn = typeof process !== 'undefined' ? process.env?.['SENTRY_DSN'] : undefined;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: isLocalhost ? 'development' : 'production',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: isLocalhost ? 0 : 0.1,
    tracePropagationTargets: [
      'localhost',
      /^https:\/\/laschubys\.com/,
      /^https:\/\/www\.laschubys\.com/,
    ],
    replaysSessionSampleRate: isLocalhost ? 0 : 0.1,
    replaysOnErrorSampleRate: isLocalhost ? 0 : 1.0,
    sendClientReports: !isLocalhost,
    beforeSend(event) {
      // Silenciosamente descartar errores de red bloqueados por ad blockers
      const error = event.exception?.values?.[0];
      if (error?.type === 'Error' && error?.value?.includes('ERR_BLOCKED_BY_CLIENT')) {
        return null;
      }
      return event;
    },
  });
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
