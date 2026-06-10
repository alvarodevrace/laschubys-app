import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="auth-callback">
      <div class="auth-callback__card">
        <p class="auth-callback__brand">Las Chubys</p>
        <div class="auth-callback__dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        @if (error()) {
          <p class="auth-callback__error">{{ error() }}</p>
          <a class="button-primary" routerLink="/auth/login">Intentar de nuevo</a>
        } @else {
          <p class="auth-callback__copy">Completando acceso...</p>
        }
      </div>
    </section>
  `,
})
export class AuthCallbackComponent {
  protected readonly error = () =>
    'Esta ruta ya no procesa la sesión. Vuelve a entrar desde el botón de acceso.';
}
