import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  booleanAttribute,
} from '@angular/core';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ScrollRevealDirective, TiltCardDirective } from '../../animations';

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
  imports: [ScrollRevealDirective, TiltCardDirective],
  template: `
    @if (reveal()) {
      <div appScrollReveal [class]="computedClass()">
        <div class="h-full w-full" appTiltCard [disabled]="!tilt()">
          <ng-content />
        </div>
      </div>
    } @else {
      <div [class]="computedClass()">
        <div class="h-full w-full" appTiltCard [disabled]="!tilt()">
          <ng-content />
        </div>
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
        'bg-surface rounded-2xl motion-safe:transition-shadow motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:shadow-2xl',
        this.className(),
      ),
    ),
  );
}
