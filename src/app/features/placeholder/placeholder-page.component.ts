import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-placeholder-page',
  standalone: true,
  template: `
    <section class="page-wrap placeholder-page">
      <p class="placeholder-page__eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p>{{ copy }}</p>
    </section>
  `,
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
