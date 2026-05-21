import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  template: `
    <section class="page-wrap placeholder-page">
      <p class="placeholder-page__eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p>{{ copy }}</p>
    </section>
  `,
  styles: [`
    .placeholder-page {
      padding: 4rem 0 5rem;
      display: grid;
      gap: 1rem;
    }

    .placeholder-page__eyebrow {
      margin: 0;
      color: var(--orange);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 5vw, 3.6rem);
      color: var(--text);
    }

    p {
      max-width: 56ch;
      margin: 0;
      color: var(--text-muted);
    }
  `],
})
export class PlaceholderPageComponent {
  protected eyebrow = 'Las Chubys';
  protected title = 'Migración Angular 21';
  protected copy = 'Sección en migración desde Astro.';

  constructor(route: ActivatedRoute) {
    const path = route.snapshot.routeConfig?.path || '';
    this.title = path || this.title;
  }
}
