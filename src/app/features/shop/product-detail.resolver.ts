import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';

import { ProductPick } from '../../core/models/content.model';
import { ContentService } from '../../core/services/content.service';

export const resolveProductDetail: ResolveFn<ProductPick | null> = async (
  route: ActivatedRouteSnapshot,
) => {
  const content = inject(ContentService);
  const router = inject(Router);
  const slug = route.paramMap.get('slug');

  if (!slug) {
    return new RedirectCommand(router.createUrlTree(['/tienda']));
  }

  try {
    const product = await content.getProduct(slug);
    if (!product) {
      return new RedirectCommand(router.createUrlTree(['/tienda']));
    }
    return product;
  } catch (error) {
    console.error(`[resolveProductDetail] failed for slug "${slug}":`, error);
    return new RedirectCommand(router.createUrlTree(['/tienda']));
  }
};
