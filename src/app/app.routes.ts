import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent) },
      { path: 'blog', loadComponent: () => import('./features/blog/blog-list.component').then((m) => m.BlogListComponent) },
      { path: 'blog/:slug', loadComponent: () => import('./features/blog/blog-detail.component').then((m) => m.BlogDetailComponent) },
      { path: 'tienda', loadComponent: () => import('./features/tienda/tienda.component').then((m) => m.TiendaComponent) },
      { path: 'carrito', loadComponent: () => import('./features/carrito/carrito.component').then((m) => m.CarritoComponent) },
      { path: 'checkout', loadComponent: () => import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent) },
      { path: 'about', loadComponent: () => import('./features/static/about.component').then((m) => m.AboutComponent) },
      { path: 'servicios', loadComponent: () => import('./features/static/servicios.component').then((m) => m.ServiciosComponent) },
      { path: 'contact', loadComponent: () => import('./features/static/contact.component').then((m) => m.ContactComponent) },
      { path: 'auth/login', loadComponent: () => import('./features/auth/auth-login.component').then((m) => m.AuthLoginComponent) },
      { path: 'auth/callback', loadComponent: () => import('./features/auth/auth-callback.component').then((m) => m.AuthCallbackComponent) },
      { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./features/admin/admin-dashboard.component').then((m) => m.AdminDashboardComponent) },
    ],
  },
  { path: '**', redirectTo: '' }
];
