import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { provideIcons } from '@ng-icons/core';
import { lucideConstruction } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
  selector: 'app-under-construction',
  standalone: true,
  imports: [HlmIconImports],
  providers: [provideIcons({ lucideConstruction })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main
      class="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center"
      aria-labelledby="uc-title"
    >
      <ng-icon
        name="lucideConstruction"
        hlmIcon
        class="size-40 md:size-56 text-primary mb-8"
        aria-hidden="true"
      />
      <h1 id="uc-title" class="text-4xl md:text-6xl font-extrabold text-foreground mb-4">
        En construcción
      </h1>
      <p class="text-lg md:text-xl text-muted-foreground max-w-md">
        Estamos preparando algo especial. Volvemos pronto.
      </p>
    </main>
  `,
})
export class UnderConstructionComponent {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  constructor() {
    this.title.setTitle('En construcción | Las Chubys');
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }
}
