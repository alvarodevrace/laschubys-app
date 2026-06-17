import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-gallery',
  standalone: true,
  imports: [],
  template: `
    <div class="grid gap-4">
      <div
        class="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-3xl bg-gray-100 border border-gray-200"
      >
        <img
          class="w-full h-full object-cover"
          [src]="images()[selectedIndex()] || '/images/cats/iris4.jpeg'"
          [alt]="'Imagen ' + (selectedIndex() + 1) + ' del producto'"
          loading="eager"
        />
        @if (images().length <= 0) {
          <div class="absolute inset-0 grid place-items-center text-gray-400 text-sm font-medium">
            Sin imágenes
          </div>
        }
      </div>

      @if (images().length > 1) {
        <div
          class="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          @for (image of images(); track image + $index) {
            <button
              type="button"
              class="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all"
              [class.border-orange]="selectedIndex() === $index"
              [class.border-gray-200]="selectedIndex() !== $index"
              [class.ring-2]="selectedIndex() === $index"
              [class.ring-orange/20]="selectedIndex() === $index"
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
