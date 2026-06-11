import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { siteMeta } from '../../core/content/site-content';
import { SeoService } from '../../core/services/seo.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-login',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <section class="py-10 pb-8 text-center">
      <div class="max-w-6xl mx-auto px-4">
        <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-2">Acceso</p>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 mb-2"
        >
          Entra a Las Chubys.
        </h1>
        <p class="text-gray-500 max-w-2xl">
          Comenta artículos, guarda tu carrito y sigue el universo de Iris y Rubi desde una sola
          sesión.
        </p>

        @if (mode() === 'admin-only') {
          <p class="text-gray-500 text-sm mb-3">
            Esa ruta está reservada para la mamá de Las Chubys.
          </p>
        } @else if (mode() === 'shop') {
          <p class="text-gray-500 text-sm mb-3">
            Para comprar, entra antes de continuar con tu carrito.
          </p>
        }

        <div class="flex justify-center gap-3 my-5">
          <app-button
            variant="primary"
            [disabled]="busy()"
            (click)="login()"
            data-testid="auth-login-google-btn"
          >
            {{ busy() ? 'Redirigiendo...' : 'Entrar con Google' }}
          </app-button>
        </div>

        @if (message()) {
          <p class="text-orange text-sm font-bold my-2">{{ message() }}</p>
        }

        <ul class="grid gap-2 max-w-xs mx-auto mt-4 p-0 list-none text-sm text-gray-500">
          <li class="before:content-['✦_'] before:text-orange">
            Comentarios con identidad real y control anti-spam.
          </li>
          <li class="before:content-['✦_'] before:text-orange">
            Carrito persistente para retomar compras sin perder selección.
          </li>
          <li class="before:content-['✦_'] before:text-orange">
            Acceso admin separado cuando tu perfil tenga role=admin.
          </li>
        </ul>
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
