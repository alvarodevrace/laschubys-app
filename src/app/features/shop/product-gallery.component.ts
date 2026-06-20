import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';

import { ParallaxDirective, StaggerChildrenDirective } from '../../shared/animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-gallery',
  standalone: true,
  imports: [ParallaxDirective, StaggerChildrenDirective],
  template: `
    <div class="grid gap-4">
      <div
        class="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-3xl bg-muted border border-border"
      >
        <img
          class="w-full h-full object-cover"
          [src]="images()[selectedIndex()] || '/images/cats/iris4.jpeg'"
          [alt]="'Imagen ' + (selectedIndex() + 1) + ' del producto'"
          loading="eager"
          appParallax
          [speed]="0.15"
        />
        @if (images().length <= 0) {
          <div
            class="absolute inset-0 grid place-items-center text-muted-foreground text-sm font-medium"
          >
            Sin imágenes
          </div>
        }
      </div>

      @if (images().length > 1) {
        <div
          class="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          appStaggerChildren
          childSelector="button"
          [staggerDelay]="0.06"
        >
          @for (image of images(); track image + $index) {
            <button
              type="button"
              class="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 p-0 transition-all"
              [class.border-primary]="selectedIndex() === $index"
              [class.border-border]="selectedIndex() !== $index"
              [class.ring-2]="selectedIndex() === $index"
              [class.ring-primary/20]="selectedIndex() === $index"
              [class.opacity-70]="selectedIndex() !== $index"
              (click)="selectedIndex.set($index)"
              [attr.aria-label]="'Ver imagen ' + ($index + 1)"
            >
              <img class="w-full h-full object-cover" [src]="image" alt="" loading="lazy" />
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class ProductGalleryComponent {
  readonly images = input.required<string[]>();
  protected readonly selectedIndex = signal(0);
}
