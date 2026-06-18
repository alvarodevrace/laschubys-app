import {
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
  booleanAttribute,
  afterNextRender,
  DestroyRef,
  PLATFORM_ID,
} from '@angular/core';
import { MotionService } from './motion.service';
import { isTouchDevice } from './is-touch-device';

/**
 * 3D tilt effect on mouse move.
 *
 * Usage:
 *   <div appTiltCard [max]="10" [perspective]="1000" [scale]="1.02">...</div>
 */
@Directive({
  selector: '[appTiltCard]',
  standalone: true,
})
export class TiltCardDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  /** Maximum rotation in degrees. */
  max = input(10, { transform: numberAttribute });

  /** CSS perspective in px. */
  perspective = input(1000, { transform: numberAttribute });

  /** Scale on hover. */
  scale = input(1.02, { transform: numberAttribute });

  /** Disable tilt (e.g. on touch devices). */
  disabled = input(false, { transform: booleanAttribute });

  private resetAnimation?: ReturnType<typeof this.motion.animate>;
  private listenersAdded = false;

  constructor() {
    afterNextRender(async () => {
      await this.motion.init();
      this.setup();
    });

    this.destroyRef.onDestroy(() => this.cleanup());
  }

  private setup(): void {
    if (this.motion.prefersReducedMotion() || isTouchDevice(this.platformId) || this.disabled()) {
      return;
    }

    const element = this.el.nativeElement;

    const handleMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -this.max();
      const rotateY = ((x - centerX) / centerX) * this.max();

      element.style.transform = `perspective(${this.perspective()}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${this.scale()})`;
      element.style.willChange = 'transform';
    };

    const handleLeave = () => {
      this.resetAnimation = this.motion.animate(
        element,
        {
          transform: `perspective(${this.perspective()}px) rotateX(0deg) rotateY(0deg) scale(1)`,
        },
        {
          duration: 0.4,
          ease: 'easeOut',
        },
      );
    };

    element.addEventListener('mousemove', handleMove);
    element.addEventListener('mouseleave', handleLeave);
    this.listenersAdded = true;

    this.destroyRef.onDestroy(() => {
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseleave', handleLeave);
    });
  }

  private cleanup(): void {
    this.resetAnimation?.stop();

    const element = this.el.nativeElement;
    if (this.listenersAdded) {
      element.style.transform = '';
      element.style.willChange = '';
    }
  }
}
