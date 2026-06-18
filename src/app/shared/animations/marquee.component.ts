import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { MotionService } from './motion.service';

/**
 * Marquee component.
 *
 * Renders a continuous scrolling track by duplicating the projected content.
 * Pauses on hover when enabled, adds fade masks on the edges, and becomes
 * static when the user prefers reduced motion.
 */
@Component({
  selector: 'app-marquee',
  standalone: true,
  template: `
    <div class="marquee-track" [class.paused]="pauseOnHover()">
      <div class="marquee-content"><ng-content /></div>
      <div class="marquee-content" aria-hidden="true"><ng-content /></div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      overflow: hidden;
      position: relative;
      width: 100%;
      --marquee-fade-color: white;
    }

    :host.fade-edges::before,
    :host.fade-edges::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 3rem;
      pointer-events: none;
      z-index: 1;
    }

    :host.fade-edges::before {
      left: 0;
      background: linear-gradient(to right, var(--marquee-fade-color), transparent);
    }

    :host.fade-edges::after {
      right: 0;
      background: linear-gradient(to left, var(--marquee-fade-color), transparent);
    }

    .marquee-track {
      display: flex;
      width: max-content;
      animation: marquee var(--marquee-speed, 20s) linear infinite;
    }

    .marquee-track.paused:hover {
      animation-play-state: paused;
    }

    .marquee-content {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .marquee-track {
        animation: none;
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.fade-edges]': 'fadeEdges()',
    '[style.--marquee-speed]': 'speed()',
  },
})
export class MarqueeComponent {
  private readonly motion = inject(MotionService);

  speed = input('20s');
  pauseOnHover = input(true, { transform: booleanAttribute });
  fadeEdges = input(true, { transform: booleanAttribute });

  constructor() {
    afterNextRender(async () => {
      await this.motion.init();
    });
  }
}
