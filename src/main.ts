import { bootstrapApplication } from '@angular/platform-browser';
import * as Sentry from '@sentry/angular';
import { appConfig } from './app/app.config';
import { App } from './app/app';

Sentry.init({
  dsn: 'https://782c6ea9772b815593821fbefb852c77@o4511020887638016.ingest.us.sentry.io/4511434539073536',
  environment: 'production',
  sendDefaultPii: false,
});

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
