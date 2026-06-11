import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { personas } from '../../core/content/site-content';
import { SeoService } from '../../core/services/seo.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="py-10 pb-8" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        <nav class="flex items-center gap-2 mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <span>Nosotras</span>
        </nav>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 mb-2"
        >
          Dos gatas. Una mamá. Una marca.
        </h1>
        <p class="text-gray-500 max-w-2xl">
          Las Chubys mezcla blog, tienda y presencia social en una experiencia clara, cálida y muy
          felina.
        </p>
      </div>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 py-8" data-reveal>
      <div class="relative rounded-2xl overflow-hidden aspect-[3/4]">
        <img
          src="/images/cats/iris.jpeg"
          alt="Iris"
          loading="lazy"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute bottom-0 left-0 right-0 p-5 text-white bg-gradient-to-t from-black/60 to-transparent"
        >
          <p class="text-xs font-extrabold uppercase tracking-widest opacity-90 mb-0.5">
            {{ personas[0].role }}
          </p>
          <p class="text-lg font-extrabold">{{ personas[0].name }}</p>
        </div>
      </div>
      <div class="relative rounded-2xl overflow-hidden aspect-[3/4]">
        <img
          src="/images/cats/rubi.jpeg"
          alt="Rubi"
          loading="lazy"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute bottom-0 left-0 right-0 p-5 text-white bg-gradient-to-t from-black/60 to-transparent"
        >
          <p class="text-xs font-extrabold uppercase tracking-widest opacity-90 mb-0.5">
            {{ personas[1].role }}
          </p>
          <p class="text-lg font-extrabold">{{ personas[1].name }}</p>
        </div>
      </div>
    </div>

    <section
      class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12 direction-rtl"
      data-reveal
    >
      <div class="direction-ltr">
        <img
          src="/images/cats/iris3.jpeg"
          alt="Las Chubys"
          loading="lazy"
          class="w-full rounded-2xl object-cover"
        />
      </div>
      <div class="direction-ltr">
        <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">La Historia</p>
        <h2 class="text-xl md:text-2xl font-extrabold leading-tight text-gray-900 mb-3">
          Una casa editorial felina, con actitud y sin filtros.
        </h2>
        <p class="text-gray-500 leading-relaxed text-sm mb-5">
          Nacimos para compartir historias del día a día con dos gatas de carácter único. Iris pone
          el drama. Rubi pone el caos. Nosotras lo convertimos en contenido que vale la pena leer.
        </p>
        <a
          class="inline-flex items-center justify-center min-h-12 px-6 rounded-full font-extrabold text-sm tracking-wide border border-transparent bg-orange text-white cursor-pointer transition-all duration-200 hover:bg-orange-dark hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(255,122,26,0.3)]"
          routerLink="/contact"
          >Escríbenos</a
        >
      </div>
    </section>

    <section class="py-12 text-center bg-[#fff4e8]" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
          ¿Quieres colaborar con nosotras?
        </h2>
        <p class="text-gray-500 mb-5">Marcas, contenido y todo lo que tenga que ver con gatas.</p>
        <a
          class="inline-flex items-center justify-center min-h-12 px-6 rounded-full font-extrabold text-sm tracking-wide border border-transparent bg-orange text-white cursor-pointer transition-all duration-200 hover:bg-orange-dark hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(255,122,26,0.3)]"
          routerLink="/contact"
          >Contáctanos</a
        >
      </div>
    </section>
  `,
})
export class AboutComponent {
  private readonly seo = inject(SeoService);
  protected readonly personas = personas;

  constructor() {
    this.seo.setPage(
      'Nosotras | Las Chubys',
      'Conoce a Iris, Rubi y el universo de Las Chubys.',
      '/images/cats/iris.jpeg',
      '/about',
    );
  }
}
