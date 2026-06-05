import { bootstrapApplication } from '@angular/platform-browser';
import * as Sentry from '@sentry/angular';
import { appConfig } from './app/app.config';
import { App } from './app/app';

Sentry.init({
  dsn: 'https://782c6ea9772b815593821fbefb852c77@o4511020887638016.ingest.us.sentry.io/4511434539073536',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  environment: 'production',
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', /^https:\/\/laschubys\.com/, /^https:\/\/www\.laschubys\.com/],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
