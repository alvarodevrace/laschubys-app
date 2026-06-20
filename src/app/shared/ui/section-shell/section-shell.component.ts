import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SectionVariant = 'white' | 'warm';

@Component({
  selector: 'app-section-shell',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="py-10 md:py-16 transition-colors"
      [class.bg-white]="variant() === 'white'"
      [class.bg-surface]="variant() === 'warm'"
    >
      <div class="max-w-6xl mx-auto px-4">
        <ng-content></ng-content>
      </div>
    </section>
  `,
})
export class SectionShellComponent {
  variant = input<SectionVariant>('white');
}
