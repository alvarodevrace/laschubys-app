import { environment as buildTimeEnvironment } from '../../../environments/environment';

const isServer = typeof process !== 'undefined' && typeof window === 'undefined';

export const environment = {
  ...buildTimeEnvironment,
  apiServerUrl: isServer ? `${process.env['API_URL'] || 'https://api.laschubys.com'}/api` : '/api',
};
