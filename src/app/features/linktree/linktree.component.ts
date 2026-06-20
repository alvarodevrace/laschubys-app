import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFacebook, lucideInstagram, lucideMail } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { socialChannels } from '../../core/content/site-content';
import { SeoService } from '../../core/services/seo.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-linktree',
  standalone: true,
  imports: [HlmButtonImports, HlmIconImports, NgIcon],
  providers: [provideIcons({ lucideFacebook, lucideInstagram, lucideMail })],
  template: `
    <div
      class="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-orange-50 via-white to-stone-100"
    >
      <!-- Decorative blurred shapes -->
      <div
        class="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        class="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-stone-300/40 blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        class="pointer-events-none absolute left-1/3 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-orange-200/20 blur-3xl"
        aria-hidden="true"
      ></div>

      <main class="relative z-10 mx-auto flex max-w-md flex-col px-6 pt-10 pb-4">
        <!-- Hero image -->
        <div class="flex flex-col items-center">
          <div
            class="aspect-square w-36 overflow-hidden rounded-full border-4 border-white shadow-2xl"
          >
            <img
              src="/images/cats/iris-rubi-linktree.jpeg"
              alt="Iris y Rubi, Las Chubys"
              width="1086"
              height="1448"
              class="h-full w-full object-cover"
              loading="eager"
            />
          </div>

          <!-- Logo below image -->
          <div class="mt-3 flex justify-center px-4">
            <img
              src="/brand/logoLasChubys.png?v=1"
              alt="Las Chubys"
              width="300"
              height="100"
              class="h-auto w-80 max-w-full drop-shadow-[0_0_12px_rgba(255,255,255,0.95),0_0_28px_rgba(255,255,255,0.7),0_0_50px_rgba(255,255,255,0.5)]"
              loading="eager"
            />
          </div>
        </div>

        <!-- Main links -->
        <p class="mt-2 text-center text-base font-medium text-stone-700">
          Reality y parodias felinas.
        </p>
        <h1 class="mt-6 text-center text-xl font-bold tracking-tight text-stone-900">
          Encuéntranos en
        </h1>
        <nav class="mt-4 flex w-full flex-col gap-2.5" aria-label="Enlaces principales">
          <!-- Instagram -->
          <a
            [href]="socialChannels[0].href"
            target="_blank"
            rel="noreferrer"
            hlmBtn
            variant="outline"
            class="grid h-12 w-full grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-full border-stone-100 bg-white px-5 text-base font-semibold text-stone-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
          >
            <ng-icon
              hlmIcon
              name="lucideInstagram"
              class="h-6 w-6 justify-self-center text-pink-600"
            />
            <span class="text-center">Instagram</span>
            <span aria-hidden="true" class="h-6 w-6"></span>
          </a>

          <!-- TikTok -->
          <a
            [href]="socialChannels[1].href"
            target="_blank"
            rel="noreferrer"
            hlmBtn
            variant="outline"
            class="grid h-12 w-full grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-full border-stone-100 bg-white px-5 text-base font-semibold text-stone-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
          >
            <svg
              class="h-6 w-6 shrink-0 justify-self-center text-stone-900"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M14 3c1 2.2 2.5 3.7 5 4v3.1c-1.8-.1-3.3-.7-4.8-1.8v6.5a5.2 5.2 0 1 1-5.2-5.2c.4 0 .8 0 1.2.1v3.2a2.6 2.6 0 1 0 1.4 2.3V3H14z"
              />
            </svg>
            <span class="text-center">TikTok</span>
            <span aria-hidden="true" class="h-6 w-6"></span>
          </a>

          <!-- Facebook -->
          <a
            [href]="socialChannels[2].href"
            target="_blank"
            rel="noreferrer"
            hlmBtn
            variant="outline"
            class="grid h-12 w-full grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-full border-stone-100 bg-white px-5 text-base font-semibold text-stone-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
          >
            <ng-icon
              hlmIcon
              name="lucideFacebook"
              class="h-6 w-6 justify-self-center text-blue-600"
            />
            <span class="text-center">Facebook</span>
            <span aria-hidden="true" class="h-6 w-6"></span>
          </a>

          <!-- YouTube -->
          <a
            href="https://www.youtube.com/@laschubys"
            target="_blank"
            rel="noreferrer"
            hlmBtn
            variant="outline"
            class="grid h-12 w-full grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-full border-stone-100 bg-white px-5 text-base font-semibold text-stone-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
          >
            <svg
              class="h-6 w-6 shrink-0 justify-self-center text-red-600"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
            <span class="text-center">YouTube</span>
            <span aria-hidden="true" class="h-6 w-6"></span>
          </a>

          <!-- Email -->
          <a
            href="mailto:laschubys.oficial@gmail.com"
            hlmBtn
            variant="outline"
            class="grid h-12 w-full grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-full border-stone-100 bg-white px-5 text-base font-semibold text-stone-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
          >
            <ng-icon
              hlmIcon
              name="lucideMail"
              class="h-6 w-6 justify-self-center text-orange-500"
            />
            <span class="text-center">laschubys.oficial@gmail.com</span>
            <span aria-hidden="true" class="h-6 w-6"></span>
          </a>
        </nav>

        <!-- Footer -->
        <footer class="mt-20 pt-0 text-center">
          <p class="text-base font-medium text-stone-700">
            Gracias por formar parte de la
            <span class="font-semibold text-orange-500">Casa Chuby</span>.
          </p>
          <p class="mt-1.5 text-sm text-stone-600">
            Creado con <span class="mx-1">❤️</span> por Iris y Rubi.
          </p>
        </footer>
      </main>
    </div>
  `,
})
export class LinktreeComponent {
  private readonly seo = inject(SeoService);

  protected readonly socialChannels = socialChannels;

  constructor() {
    this.seo.setPage(
      'Las Chubys | Links',
      'Todos los enlaces oficiales de Las Chubys: Instagram, TikTok, Facebook, YouTube y más.',
      '/brand/logoLasChubys.png?v=1',
      '/linktree',
    );
  }
}
