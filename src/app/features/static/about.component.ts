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
    <section class="page-hero" data-reveal>
      <div class="page-hero__inner">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <span>Nosotras</span>
        </nav>
        <h1 class="page-hero__title">Dos gatas. Una mamá. Una marca.</h1>
        <p class="page-hero__sub">
          Las Chubys mezcla blog, tienda y presencia social en una experiencia clara, cálida y muy
          felina.
        </p>
      </div>
    </section>

    <div class="cats-grid" data-reveal>
      <div class="cat-card">
        <img src="/images/cats/iris.jpeg" alt="Iris" loading="lazy" />
        <div class="cat-card__label">
          <p class="cat-card__role">{{ personas[0].role }}</p>
          <p class="cat-card__name">{{ personas[0].name }}</p>
        </div>
      </div>
      <div class="cat-card">
        <img src="/images/cats/rubi.jpeg" alt="Rubi" loading="lazy" />
        <div class="cat-card__label">
          <p class="cat-card__role">{{ personas[1].role }}</p>
          <p class="cat-card__name">{{ personas[1].name }}</p>
        </div>
      </div>
    </div>

    <section class="split split--reverse" data-reveal>
      <div class="split__photo">
        <img src="/images/cats/iris3.jpeg" alt="Las Chubys" loading="lazy" />
      </div>
      <div class="split__content">
        <p class="section-eyebrow">La Historia</p>
        <h2 class="split__title">Una casa editorial felina, con actitud y sin filtros.</h2>
        <p class="split__body">
          Nacimos para compartir historias del día a día con dos gatas de carácter único. Iris pone
          el drama. Rubi pone el caos. Nosotras lo convertimos en contenido que vale la pena leer.
        </p>
        <a class="button-primary" routerLink="/contact">Escríbenos</a>
      </div>
    </section>

    <section class="cta-band" data-reveal>
      <div class="page-wrap">
        <h2 class="cta-band__title">¿Quieres colaborar con nosotras?</h2>
        <p class="cta-band__sub">Marcas, contenido y todo lo que tenga que ver con gatas.</p>
        <a class="button-primary" routerLink="/contact">Contáctanos</a>
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
