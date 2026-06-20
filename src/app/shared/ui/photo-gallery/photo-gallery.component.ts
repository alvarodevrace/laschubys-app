import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type PhotoSize = 'normal' | 'wide' | 'large';

export interface GalleryPhoto {
  src: string;
  alt: string;
  size: PhotoSize;
}

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-12 md:py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="mb-8 md:mb-10">
          <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-2">Galería</p>
          <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Momentos Las Chubys
          </h2>
        </div>

        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[220px]"
        >
          @for (photo of photos; track photo.src) {
            <div
              class="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-muted shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1"
              [class.col-span-2]="photo.size === 'wide' || photo.size === 'large'"
              [class.row-span-2]="photo.size === 'large'"
            >
              <img
                [src]="photo.src"
                [alt]="photo.alt"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class PhotoGalleryComponent {
  protected readonly photos: GalleryPhoto[] = [
    { src: '/images/cats/iris.jpeg', alt: 'Iris descansando', size: 'large' },
    { src: '/images/cats/rubi.jpeg', alt: 'Rubi atenta', size: 'large' },
    { src: '/images/cats/iris2.jpeg', alt: 'Iris en casa', size: 'normal' },
    { src: '/images/cats/rubi2.jpeg', alt: 'Rubi jugando', size: 'normal' },
    { src: '/images/cats/iris3.jpeg', alt: 'Iris curiosa', size: 'normal' },
    { src: '/images/cats/rubi3.jpeg', alt: 'Rubi relajada', size: 'normal' },
    { src: '/images/cats/iris4.jpeg', alt: 'Iris posando', size: 'wide' },
    { src: '/images/cats/rubi4.jpeg', alt: 'Rubi en su momento', size: 'wide' },
  ];
}
