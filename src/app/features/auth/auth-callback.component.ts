import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-callback',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section
      class="min-h-[calc(100vh-280px)] grid place-items-center p-8 bg-gradient-to-b from-[#2a1a10] to-[#141313]"
    >
      <div class="grid gap-4 justify-items-center text-center text-white">
        <p class="text-sm font-extrabold tracking-widest uppercase text-white/70">Las Chubys</p>
        <div class="flex gap-2" aria-hidden="true">
          <span class="w-1.5 h-1.5 rounded-full bg-orange animate-auth-pulse"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-orange animate-auth-pulse"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-orange animate-auth-pulse"></span>
        </div>
        @if (error()) {
          <p class="m-0 max-w-md leading-relaxed text-white/90">{{ error() }}</p>
          <a
            class="inline-flex items-center justify-center min-h-12 px-6 rounded-full font-extrabold text-sm tracking-wide border border-transparent bg-orange text-white cursor-pointer transition-all duration-200 hover:bg-orange-dark hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(255,122,26,0.3)]"
            routerLink="/auth/login"
            >Intentar de nuevo</a
          >
        } @else {
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
