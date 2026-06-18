import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { siteMeta } from '../../core/content/site-content';
import { SeoService } from '../../core/services/seo.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-login',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <section class="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div
        class="w-full max-w-md rounded-[2rem] border border-orange/[0.14] bg-white shadow-[0_24px_60px_rgba(32,18,12,0.10)] overflow-hidden"
      >
        <div class="px-7 pt-8 pb-6 text-center bg-gradient-to-b from-white to-[#fff4e8]/[0.6]">
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange/[0.12] text-orange inline-flex items-center justify-center"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-8 h-8"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-2">Acceso</p>
          <h1
            class="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-orange mb-2"
          >
            Entra a Las Chubys.
          </h1>
          <p class="text-gray-500 leading-relaxed text-sm">
            Comenta artículos, guarda tu carrito y sigue el universo de Iris y Rubi.
          </p>
        </div>

        <div class="px-7 pb-8">
          @if (mode() === 'admin-only') {
            <p class="text-center text-sm text-gray-600 mb-4 bg-gray-50 rounded-xl py-3 px-4">
              Esa ruta está reservada para la mamá de Las Chubys.
            </p>
          } @else if (mode() === 'shop') {
            <p class="text-center text-sm text-gray-600 mb-4 bg-gray-50 rounded-xl py-3 px-4">
              Para comprar, entra antes de continuar con tu carrito.
            </p>
          }

          <app-button
            className="w-full justify-center"
            variant="secondary"
            [disabled]="busy()"
            (click)="login()"
            data-testid="auth-login-google-btn"
          >
            <span class="inline-flex items-center justify-center gap-3">
              @if (!busy()) {
                <svg viewBox="0 0 24 24" class="w-5 h-5" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }
              {{ busy() ? 'Redirigiendo...' : 'Entrar con Google' }}
            </span>
          </app-button>

          @if (message()) {
            <p class="text-center text-orange text-sm font-bold mt-4">{{ message() }}</p>
          }

          <ul class="grid gap-2 mt-6 text-sm text-gray-500">
            <li class="flex items-start gap-2">
              <span class="text-orange mt-0.5">✦</span>
              <span>Comentarios con identidad real y control anti-spam.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-orange mt-0.5">✦</span>
              <span>Carrito persistente para retomar compras sin perder selección.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-orange mt-0.5">✦</span>
              <span>Acceso admin separado cuando tu perfil tenga role=admin.</span>
            </li>
          </ul>

          <div class="mt-6 pt-6 border-t border-gray-100 text-center">
            <a
              routerLink="/"
              class="text-sm font-bold text-orange hover:text-orange-dark transition-colors"
            >
              ← Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AuthLoginComponent {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  protected readonly busy = this.auth.loading;
  protected readonly message = computed(() => {
    if (this.route.snapshot.queryParamMap.get('error') === 'oauth') {
      return 'No se pudo completar el acceso con Google.';
    }

    return this.route.snapshot.queryParamMap.get('logged_out') ? 'Sesión cerrada.' : '';
  });
  protected readonly mode = computed(() => this.route.snapshot.queryParamMap.get('mode') ?? '');
  private readonly redirect = computed(
    () => this.route.snapshot.queryParamMap.get('redirect') ?? '/blog',
  );

  constructor() {
    this.seo.setPage(
      'Entrar | Las Chubys',
      `Entrada a la comunidad de ${siteMeta.name}.`,
      '/brand/logo.png',
      '/auth/login',
    );

    if (this.auth.isLoggedIn()) {
      void this.router.navigateByUrl(this.redirect());
    }
  }

  protected async login() {
    await this.auth.loginWithGoogle(this.redirect());
  }
}
