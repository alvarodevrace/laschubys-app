import { Routes } from '@angular/router';

import { resolveProductDetail } from './features/shop/product-detail.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./features/blog/blog-list.component').then((m) => m.BlogListComponent),
      },
      {
        path: 'blog/:slug',
        loadComponent: () =>
          import('./features/blog/blog-detail.component').then((m) => m.BlogDetailComponent),
      },
      {
        path: 'tienda',
        loadComponent: () => import('./features/shop/shop.component').then((m) => m.ShopComponent),
      },
      {
        path: 'tienda/:slug',
        loadComponent: () =>
          import('./features/shop/product-detail.component').then((m) => m.ProductDetailComponent),
        resolve: { product: resolveProductDetail },
      },
      {
        path: 'carrito',
        loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/static/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'servicios',
        loadComponent: () =>
          import('./features/static/servicios.component').then((m) => m.ServiciosComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/static/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: 'media-kit',
        loadComponent: () =>
          import('./features/media-kit/media-kit.component').then((m) => m.MediaKitComponent),
      },
      {
        path: 'auth/login',
        loadComponent: () =>
          import('./features/auth/auth-login.component').then((m) => m.AuthLoginComponent),
      },
      {
        path: 'auth/callback',
        loadComponent: () =>
          import('./features/auth/auth-callback.component').then((m) => m.AuthCallbackComponent),
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./features/admin/admin-layout.component').then((m) => m.AdminLayoutComponent),
        children: [
          { path: '', redirectTo: 'posts', pathMatch: 'full' },
          {
            path: 'posts',
            loadComponent: () =>
              import('./features/admin/posts/admin-posts.component').then(
                (m) => m.AdminPostsComponent,
              ),
          },
          {
            path: 'posts/new',
            loadComponent: () =>
              import('./features/admin/posts/admin-post-form.component').then(
                (m) => m.AdminPostFormComponent,
              ),
          },
          {
            path: 'posts/:id/edit',
            loadComponent: () =>
              import('./features/admin/posts/admin-post-form.component').then(
                (m) => m.AdminPostFormComponent,
              ),
          },
          {
            path: 'products',
            loadComponent: () =>
              import('./features/admin/products/admin-products.component').then(
                (m) => m.AdminProductsComponent,
              ),
          },
          {
            path: 'products/new',
            loadComponent: () =>
              import('./features/admin/products/admin-product-form.component').then(
                (m) => m.AdminProductFormComponent,
              ),
          },
          {
            path: 'products/:id/edit',
            loadComponent: () =>
              import('./features/admin/products/admin-product-form.component').then(
                (m) => m.AdminProductFormComponent,
              ),
          },
        ],
      },
      {
        path: 'ui',
        loadComponent: () =>
          import('./features/admin/ui-playground.component').then((m) => m.UiPlaygroundComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
