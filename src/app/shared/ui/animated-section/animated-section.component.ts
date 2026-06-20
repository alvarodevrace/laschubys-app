import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ScrollRevealDirective, StaggerChildrenDirective } from '../../animations';

/**
 * Section wrapper with scroll-reveal and optional staggered children.
 *
 * Supports a title slot via `<ng-content select="[title]">` and a default
 * content slot.
 */
@Component({
  selector: 'app-animated-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollRevealDirective, StaggerChildrenDirective],
  template: `
    @if (stagger()) {
      <section
        appScrollReveal
        appStaggerChildren
        [staggerDelay]="staggerDelay()"
        [childSelector]="childSelector()"
        [class]="computedClass()"
      >
        <ng-content select="[title]"></ng-content>
        <ng-content></ng-content>
      </section>
    } @else {
      <section appScrollReveal [class]="computedClass()">
        <ng-content select="[title]"></ng-content>
        <ng-content></ng-content>
      </section>
    }
  `,
})
export class AnimatedSectionComponent {
  readonly className = input<string>('');
  readonly stagger = input(false, { transform: booleanAttribute });
  readonly staggerDelay = input(0.1, { transform: numberAttribute });
  readonly childSelector = input<string>('*');

  protected readonly computedClass = computed(() => twMerge(clsx('relative', this.className())));
}
