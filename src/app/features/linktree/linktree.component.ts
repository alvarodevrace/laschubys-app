import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideFacebook,
  lucideFileText,
  lucideInstagram,
  lucideMail,
  lucidePhone,
  lucideYoutube,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { socialChannels } from '../../core/content/site-content';
import { SeoService } from '../../core/services/seo.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-linktree',
  standalone: true,
  imports: [HlmButtonImports, HlmDialogImports, HlmIconImports, NgIcon],
  providers: [
    provideIcons({
      lucideFacebook,
      lucideFileText,
      lucideInstagram,
      lucideMail,
      lucidePhone,
      lucideYoutube,
    }),
  ],
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

      <main class="relative z-10 mx-auto flex min-h-screen max-w-md flex-col px-6 pt-8 pb-1">
        <!-- Hero image -->
        <div class="flex flex-col items-center">
          <div
            class="aspect-square w-32 overflow-hidden rounded-full border-4 border-white shadow-2xl"
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
        </div>

        <!-- Logo + tagline -->
        <div class="mt-5 flex flex-col items-center px-4">
          <img
            src="/brand/logoLasChubys.png?v=1"
            alt="Las Chubys"
            width="300"
            height="100"
            class="h-auto w-64 max-w-full drop-shadow-[0_0_12px_rgba(255,255,255,0.95),0_0_28px_rgba(255,255,255,0.7),0_0_50px_rgba(255,255,255,0.5)]"
            loading="eager"
          />
          <p class="mt-3 text-center text-sm font-medium text-stone-600">
            Reality Show felino protagonizado por Iris Lourdes y Rubí Lucrecia.
          </p>
        </div>

        <!-- Sections slider -->
        <div class="relative mt-6 flex-1 w-full overflow-hidden">
          <div
            class="flex w-[200%] transition-transform duration-300 ease-out"
            (touchstart)="onTouchStart($event)"
            (touchend)="onTouchEnd($event)"
            [class.-translate-x-1/2]="showCourses()"
          >
            <!-- Panel 1: social + affiliates -->
            <div class="w-1/2 shrink-0 px-1">
              <!-- Redes Sociales -->
              <section aria-labelledby="social-heading">
                <h2
                  id="social-heading"
                  class="text-center text-xl font-bold text-orange-500 drop-shadow-sm"
                >
                  Síguenos en:
                </h2>
                <nav
                  class="mt-4 flex w-full flex-col gap-2"
                  aria-label="Redes sociales de Las Chubys"
                >
                  @for (channel of socialChannels; track channel.href) {
                    <a
                      [href]="channel.href"
                      target="_blank"
                      rel="noreferrer"
                      hlmBtn
                      variant="outline"
                      class="grid h-12 w-full grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-full border-stone-100 bg-white px-5 text-base font-semibold text-stone-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                      [attr.aria-label]="'Visitar ' + channel.name"
                    >
                      @switch (channel.name) {
                        @case ('Instagram') {
                          <ng-icon
                            hlmIcon
                            name="lucideInstagram"
                            class="h-6 w-6 justify-self-center text-pink-600"
                          />
                        }
                        @case ('TikTok') {
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
                        }
                        @case ('Facebook') {
                          <ng-icon
                            hlmIcon
                            name="lucideFacebook"
                            class="h-6 w-6 justify-self-center text-blue-600"
                          />
                        }
                        @case ('Comunidad Oficial') {
                          <svg
                            class="h-6 w-6 shrink-0 justify-self-center text-green-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                            />
                          </svg>
                        }
                        @case ('YouTube') {
                          <ng-icon
                            hlmIcon
                            name="lucideYoutube"
                            class="h-6 w-6 justify-self-center text-red-600"
                          />
                        }
                      }
                      <span class="text-center">{{ channel.name }}</span>
                      <span aria-hidden="true" class="h-6 w-6"></span>
                    </a>
                  }

                  <!-- Contáctanos -->
                  <button
                    type="button"
                    (click)="contactDialogOpen.set(true)"
                    hlmBtn
                    variant="outline"
                    class="grid h-12 w-full grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-full border-stone-100 bg-white px-5 text-base font-semibold text-stone-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                    aria-label="Abrir opciones de contacto"
                  >
                    <ng-icon
                      hlmIcon
                      name="lucideMail"
                      class="h-6 w-6 justify-self-center text-orange-500"
                    />
                    <span class="text-center">Contáctanos</span>
                    <span aria-hidden="true" class="h-6 w-6"></span>
                  </button>
                </nav>

                <!-- Contact dialog -->
                <hlm-dialog
                  [state]="contactDialogOpen() ? 'open' : 'closed'"
                  (stateChanged)="contactDialogOpen.set($event === 'open')"
                >
                  <hlm-dialog-content
                    *hlmDialogPortal
                    class="sm:max-w-sm rounded-2xl"
                    [showCloseButton]="false"
                  >
                    <hlm-dialog-header>
                      <h3 hlmDialogTitle class="text-center text-xl font-bold text-orange-500">
                        Contáctanos
                      </h3>
                      <p hlmDialogDescription class="text-center">
                        Elige cómo quieres comunicarte con Las Chubys
                      </p>
                    </hlm-dialog-header>
                    <div class="flex flex-col gap-3 py-2">
                      <a
                        href="https://wa.me/593992131011"
                        target="_blank"
                        rel="noreferrer"
                        hlmBtn
                        variant="outline"
                        class="grid h-12 w-full grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-full border-stone-100 bg-white px-5 text-base font-semibold text-stone-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                        aria-label="Contactar por WhatsApp"
                      >
                        <svg
                          class="h-6 w-6 shrink-0 justify-self-center text-green-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                          />
                        </svg>
                        <span class="text-center">WhatsApp</span>
                        <span aria-hidden="true" class="h-6 w-6"></span>
                      </a>
                      <a
                        href="mailto:laschubys.oficial@gmail.com"
                        hlmBtn
                        variant="outline"
                        class="grid h-12 w-full grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-full border-stone-100 bg-white px-5 text-base font-semibold text-stone-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                        aria-label="Enviar correo a Las Chubys"
                      >
                        <ng-icon
                          hlmIcon
                          name="lucideMail"
                          class="h-6 w-6 justify-self-center text-orange-500"
                        />
                        <span class="text-center">Correo</span>
                        <span aria-hidden="true" class="h-6 w-6"></span>
                      </a>
                    </div>
                    <hlm-dialog-footer class="sm:justify-center">
                      <button
                        hlmBtn
                        variant="outline"
                        class="rounded-full border-orange-500 px-6 text-orange-500 hover:bg-orange-50"
                        (click)="contactDialogOpen.set(false)"
                      >
                        Cerrar
                      </button>
                    </hlm-dialog-footer>
                  </hlm-dialog-content>
                </hlm-dialog>
              </section>

              <!-- Colabora con nosotras -->
              <section class="mt-6" aria-labelledby="collab-heading">
                <h2
                  id="collab-heading"
                  class="text-center text-xl font-bold text-orange-500 drop-shadow-sm"
                >
                  Colabora con nosotras
                </h2>
                <nav
                  class="mt-4 flex w-full flex-col gap-2"
                  aria-label="Descargar media kit de Las Chubys"
                >
                  <a
                    [href]="mediaKitUrl"
                    target="_blank"
                    rel="noreferrer"
                    hlmBtn
                    variant="outline"
                    class="grid h-12 w-full grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-full border-stone-100 bg-white px-5 text-base font-semibold text-stone-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                    aria-label="Descargar media kit de Las Chubys"
                  >
                    <ng-icon
                      hlmIcon
                      name="lucideFileText"
                      class="h-6 w-6 justify-self-center text-red-500"
                    />
                    <span class="text-center">Media Kit</span>
                    <span aria-hidden="true" class="h-6 w-6"></span>
                  </a>
                </nav>
              </section>

              <!-- Códigos de Afiliados -->
              <section class="mt-6" aria-labelledby="affiliates-heading">
                <h2
                  id="affiliates-heading"
                  class="text-center text-xl font-bold text-orange-500 drop-shadow-sm"
                >
                  Códigos de Afiliados
                </h2>
                <nav
                  class="mt-4 flex w-full flex-col gap-2"
                  aria-label="Códigos de afiliados de Las Chubys"
                >
                  <button
                    type="button"
                    (click)="showCourses.set(true)"
                    hlmBtn
                    variant="outline"
                    class="grid h-12 w-full grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-full border-stone-100 bg-white px-5 text-base font-semibold text-stone-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                    aria-label="Ver cursos de Huellas de Paz"
                  >
                    <img
                      src="/images/huellas-de-paz-icon.png"
                      alt="Huellas de Paz"
                      width="24"
                      height="24"
                      class="h-10 w-10 justify-self-center object-contain"
                      loading="eager"
                    />
                    <span class="text-center">Huellas de Paz</span>
                    <span aria-hidden="true" class="h-6 w-6"></span>
                  </button>
                </nav>
              </section>
            </div>

            <!-- Panel 2: Huellas de Paz -->
            <div class="w-1/2 shrink-0 px-1">
              <img
                src="/images/huellas-de-paz.jpeg"
                alt="Huellas de Paz"
                width="407"
                height="125"
                class="w-full rounded-xl object-contain"
                loading="lazy"
              />
              <p class="mt-2 text-center text-sm font-bold text-stone-700">Código descuento</p>
              <p class="mt-1 text-center text-lg font-bold tracking-widest text-purple-700">
                LASCHUBYS50
              </p>
              <p class="mt-2 text-center text-sm font-bold text-stone-600">
                Obtén 50% con nuestro código
              </p>
              <nav class="mt-4 flex w-full flex-col gap-2" aria-label="Cursos Huellas de Paz">
                @for (course of courses; track course.href) {
                  <a
                    [href]="course.href"
                    target="_blank"
                    rel="noreferrer"
                    hlmBtn
                    variant="outline"
                    class="grid h-auto min-h-12 w-full grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-full border-stone-100 bg-white px-5 py-2 text-sm font-semibold text-stone-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                  >
                    <span
                      class="h-6 w-6 justify-self-center rounded-full bg-purple-100 text-center text-sm leading-6 text-purple-700"
                      aria-hidden="true"
                    >
                      {{ $index + 1 }}
                    </span>
                    <span class="whitespace-normal text-center leading-snug">{{
                      course.label
                    }}</span>
                    <span aria-hidden="true" class="h-6 w-6"></span>
                  </a>
                }
              </nav>
              <button
                type="button"
                (click)="showCourses.set(false)"
                class="mx-auto mt-5 block text-sm font-medium text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline"
              >
                ← Volver a los enlaces
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="mt-auto pt-6 text-center" [class.hidden]="showCourses()">
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
  protected readonly showCourses = signal(false);
  protected readonly contactDialogOpen = signal(false);
  protected readonly mediaKitUrl =
    'https://db.alvarodevrace.tech/storage/v1/object/public/media-kit/media-kit-las-chubys-general.pdf';
  private touchStartX = 0;

  protected onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  protected onTouchEnd(event: TouchEvent) {
    const delta = this.touchStartX - event.changedTouches[0].screenX;
    const threshold = 50;
    if (delta > threshold && !this.showCourses()) {
      this.showCourses.set(true);
    } else if (delta < -threshold && this.showCourses()) {
      this.showCourses.set(false);
    }
  }

  protected readonly courses = [
    { label: 'Curso Virtual - Huellas de Paz', href: 'https://go.hotmart.com/T106786930X' },
    { label: 'Meditaciones - Ecos de Amor', href: 'https://go.hotmart.com/S106786928J' },
    { label: 'Ebook Colorea y sana - Niños', href: 'https://go.hotmart.com/C106786927S' },
    { label: 'Ebook 21 días sin ti - Adultos', href: 'https://go.hotmart.com/G106786924Q' },
    {
      label: 'Programa Renacer - Acompañamiento Terapéutico y Círculo de sanación.',
      href: 'https://seraslibreacademia.kpages.online/renacer',
    },
  ];

  constructor() {
    this.seo.setPage(
      'Las Chubys | Links',
      'Todos los enlaces oficiales de Las Chubys: Instagram, TikTok, Facebook, YouTube y más.',
      '/brand/logoLasChubys.png?v=1',
      '/linktree',
    );
  }
}
