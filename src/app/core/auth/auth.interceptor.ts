import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../config/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isRelativeApi = req.url.startsWith('/api');
  const isConfiguredApi = req.url.startsWith(environment.apiUrl);

  if (!isRelativeApi && !isConfiguredApi) {
    return next(req);
  }

  return next(req.clone({ withCredentials: true }));
};
