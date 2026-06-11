import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { environment } from '../config/environment';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isRelativeApi = req.url.startsWith('/api');
  const isConfiguredApi = req.url.startsWith(environment.apiUrl);

  if (!isRelativeApi && !isConfiguredApi) {
    return next(req);
  }

  const isStateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  const headers: Record<string, string> = {};

  if (isStateChanging && isPlatformBrowser(platformId)) {
    const csrfToken = getCookie('csrf-token');
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  return next(req.clone({ withCredentials: true, setHeaders: headers }));
};
