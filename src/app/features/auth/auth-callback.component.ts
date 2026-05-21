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
  styles: [`
    .auth-callback {
      min-height: calc(100vh - 280px);
      display: grid;
      place-items: center;
      padding: 2rem 1rem;
      background: linear-gradient(180deg, #1f1713 0%, #2a1d15 100%);
    }

    .auth-callback__card {
      display: grid;
      gap: 1rem;
      justify-items: center;
      text-align: center;
      color: #fffaf6;
    }

    .auth-callback__brand {
      margin: 0;
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: rgba(255, 250, 246, 0.7);
    }

    .auth-callback__dots {
      display: flex;
      gap: 0.45rem;
    }

    .auth-callback__dots span {
      width: 0.45rem;
      height: 0.45rem;
      border-radius: 999px;
      background: var(--orange);
      animation: authPulse 1.2s ease-in-out infinite;
    }

    .auth-callback__dots span:nth-child(2) { animation-delay: 0.2s; }
    .auth-callback__dots span:nth-child(3) { animation-delay: 0.4s; }

    .auth-callback__copy,
    .auth-callback__error {
      margin: 0;
      max-width: 28rem;
      line-height: 1.6;
    }

    .auth-callback__error {
      color: rgba(255, 235, 228, 0.92);
    }

    @keyframes authPulse {
      0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1); }
    }
  `],
})
export class AuthCallbackComponent {
  protected readonly error = () => 'Esta ruta ya no procesa la sesión. Vuelve a entrar desde el botón de acceso.';
}
