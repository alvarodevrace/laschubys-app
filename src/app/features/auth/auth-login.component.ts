import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { siteMeta } from '../../core/content/site-content';
import { SeoService } from '../../core/services/seo.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-login',
  standalone: true,
  template: `
    <section class="page-hero page-hero--glow auth-hero">
      <div class="page-hero__inner">
        <p class="page-hero__eyebrow">Acceso</p>
        <h1 class="page-hero__title">Entra a Las Chubys.</h1>
        <p class="page-hero__sub">
          Comenta artículos, guarda tu carrito y sigue el universo de Iris y Rubi desde una sola
          sesión.
        </p>

        @if (mode() === 'admin-only') {
          <p class="auth-note">Esa ruta está reservada para la mamá de Las Chubys.</p>
        } @else if (mode() === 'shop') {
          <p class="auth-note">Para comprar, entra antes de continuar con tu carrito.</p>
        }

        <div class="auth-btns">
          <button
            class="button-primary"
            type="button"
            [disabled]="busy()"
            (click)="login()"
            data-testid="auth-login-google-btn"
          >
            {{ busy() ? 'Redirigiendo...' : 'Entrar con Google' }}
          </button>
        </div>

        @if (message()) {
          <p class="auth-status">{{ message() }}</p>
        }

        <ul class="auth-perks">
          <li>Comentarios con identidad real y control anti-spam.</li>
          <li>Carrito persistente para retomar compras sin perder selección.</li>
          <li>Acceso admin separado cuando tu perfil tenga role=admin.</li>
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
