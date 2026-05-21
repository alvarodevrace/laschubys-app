import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = async (_, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.loading()) {
    await auth.initSession();
  }

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/auth/login'], { queryParams: { redirect: state.url, mode: 'admin-only' } });
  }

  return auth.isAdmin() ? true : router.createUrlTree(['/']);
};
