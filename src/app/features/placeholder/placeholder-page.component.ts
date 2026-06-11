import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-placeholder-page',
  standalone: true,
  template: `
    <section class="max-w-6xl mx-auto px-4 py-16 pb-20 grid gap-4">
      <p class="text-orange font-extrabold uppercase tracking-wide">{{ eyebrow }}</p>
      <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900">{{ title }}</h1>
      <p class="max-w-xl text-gray-500">{{ copy }}</p>
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
