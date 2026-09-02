import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideUser, lucideLock, lucideMail, lucideEye, lucideEyeOff } from '@ng-icons/lucide';

import { AuthService } from '../../core/auth/auth.service';
import { siteMeta } from '../../core/content/site-content';
import { SeoService } from '../../core/services/seo.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    HlmButtonImports,
    HlmCardImports,
    HlmIconImports,
    HlmInput,
    HlmLabel,
  ],
  providers: [provideIcons({ lucideUser, lucideLock, lucideMail, lucideEye, lucideEyeOff })],
  template: `
    <section class="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <hlm-card class="w-full max-w-md">
        <hlm-card-header class="pt-8 pb-6 text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/[0.12] text-primary inline-flex items-center justify-center"
          >
            <ng-icon hlmIcon name="lucideUser" class="w-8 h-8" />
          </div>
          <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-2">Acceso</p>
          <h1
            class="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-foreground mb-2"
          >
            Entra a Las Chubys.
          </h1>
          <p hlmCardDescription>
            Panel exclusivo para administrar el Media Kit.
          </p>
        </hlm-card-header>

        <div hlmCardContent>
          @if (mode() === 'admin-only') {
            <p
              class="text-center text-sm text-muted-foreground mb-4 bg-surface rounded-xl py-3 px-4"
            >
              Esa ruta está reservada para la mamá de Las Chubys.
            </p>
          }

          <form class="grid gap-4" (submit)="$event.preventDefault(); login()">
            <div class="grid gap-1.5">
              <label hlmLabel for="login-email">Correo electrónico</label>
              <div class="relative">
                <ng-icon
                  hlmIcon
                  name="lucideMail"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                />
                <input
                  hlmInput
                  id="login-email"
                  type="email"
                  class="pl-9"
                  placeholder="adminchuby"
                  [(ngModel)]="email"
                  name="email"
                  autocomplete="email"
                  [disabled]="busy()"
                  required
                  data-testid="auth-login-email"
                />
              </div>
            </div>

            <div class="grid gap-1.5">
              <label hlmLabel for="login-password">Contraseña</label>
              <div class="relative">
                <ng-icon
                  hlmIcon
                  name="lucideLock"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                />
                <input
                  hlmInput
                  id="login-password"
                  [type]="showPassword() ? 'text' : 'password'"
                  class="pl-9 pr-10"
                  placeholder="••••••••"
                  [(ngModel)]="password"
                  name="password"
                  autocomplete="current-password"
                  [disabled]="busy()"
                  required
                  data-testid="auth-login-password"
                />
                <button
                  type="button"
                  hlmBtn
                  variant="ghost"
                  size="icon-sm"
                  class="absolute right-1 top-1/2 -translate-y-1/2"
                  (click)="togglePasswordVisibility()"
                  [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <ng-icon hlmIcon [name]="showPassword() ? 'lucideEyeOff' : 'lucideEye'" class="w-4 h-4" />
                </button>
              </div>
            </div>

            @if (error()) {
              <p class="text-sm text-destructive font-medium">{{ error() }}</p>
            }

            <button
              hlmBtn
              type="submit"
              class="w-full"
              [disabled]="busy() || !canSubmit()"
              data-testid="auth-login-submit"
            >
              {{ busy() ? 'Entrando...' : 'Entrar al panel' }}
            </button>
          </form>

          <ul class="grid gap-2 mt-6 text-sm text-muted-foreground">
            <li class="flex items-start gap-2">
              <span class="text-primary mt-0.5">✦</span>
              <span>Acceso exclusivo para administradoras de Las Chubys.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary mt-0.5">✦</span>
              <span>Sesión segura con cookies httpOnly.</span>
            </li>
          </ul>
        </div>

        <hlm-card-footer class="pt-6 mt-2 flex justify-center">
          <a routerLink="/" hlmBtn variant="link">← Volver al inicio</a>
        </hlm-card-footer>
      </hlm-card>
    </section>
  `,
})
export class AuthLoginComponent {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly showPassword = signal(false);
  protected readonly busy = this.auth.loading;
  protected readonly error = signal('');
  protected readonly canSubmit = computed(() => !!this.email().trim() && this.password().length > 0);
  protected readonly mode = computed(() => this.route.snapshot.queryParamMap.get('mode') ?? '');
  private readonly redirect = computed(
    () => this.route.snapshot.queryParamMap.get('redirect') ?? '/admin',
  );

  constructor() {
    this.seo.setPage(
      'Entrar | Las Chubys',
      `Entrada al panel de ${siteMeta.name}.`,
      '/brand/logo.png',
      '/auth/login',
    );

    if (this.auth.isLoggedIn()) {
      void this.router.navigateByUrl(this.redirect());
    }
  }

  protected async login() {
    this.error.set('');

    if (!this.canSubmit()) {
      this.error.set('Completa correo y contraseña.');
      return;
    }

    try {
      await this.auth.loginWithPassword(this.email().trim(), this.password(), this.redirect());
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
    }
  }

  protected togglePasswordVisibility() {
    this.showPassword.update((value) => !value);
  }
}
