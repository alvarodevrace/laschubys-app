import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  booleanAttribute,
} from '@angular/core';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ScrollRevealDirective } from '../../animations';

/**
 * Card wrapper with scroll-reveal and optional 3D tilt.
 *
 * `appScrollReveal` is applied to the outer wrapper, while `appTiltCard` is
 * applied to an inner container to avoid transform conflicts between the two
 * directives.
 */
@Component({
  selector: 'app-animated-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollRevealDirective],
  template: `
    @if (reveal()) {
      <div appScrollReveal [class]="computedClass()">
        <ng-content />
      </div>
    } @else {
      <div [class]="computedClass()">
        <ng-content />
      </div>
    }
  `,
})
export class AnimatedCardComponent {
  readonly className = input<string>('');
  readonly tilt = input(true, { transform: booleanAttribute });
  readonly reveal = input(true, { transform: booleanAttribute });

  protected readonly computedClass = computed(() =>
    twMerge(
      clsx(
        'bg-surface rounded-2xl motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-2xl',
        this.className(),
      ),
    ),
  );
}
