import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-callback',
  standalone: true,
  imports: [RouterLink, HlmAlertImports, HlmButtonImports, HlmSpinnerImports],
  template: `
    <section
      class="min-h-[calc(100vh-280px)] grid place-items-center p-8 bg-gradient-to-b from-stone-900 to-stone-950"
    >
      <div class="grid gap-4 justify-items-center text-center text-white">
        <p class="text-sm font-extrabold tracking-widest uppercase text-white/70">Las Chubys</p>
        @if (error()) {
          <div hlmAlert variant="destructive">
            <div hlmAlertDescription>{{ error() }}</div>
          </div>
          <a hlmBtn routerLink="/auth/login">Intentar de nuevo</a>
        } @else {
          <hlm-spinner />
          <p class="m-0 max-w-md leading-relaxed">Completando acceso...</p>
        }
      </div>
    </section>
  `,
})
export class AuthCallbackComponent {
  protected readonly error = () =>
    'Esta ruta ya no procesa la sesión. Vuelve a entrar desde el botón de acceso.';
}
