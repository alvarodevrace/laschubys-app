import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  TemplateRef,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { SwiperContainer } from 'swiper/element/bundle';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="-mx-4 md:-mx-0">
      <swiper-container
        #swiperRef
        init="false"
        class="block pb-4"
        style="--swiper-navigation-color: var(--color-orange-700); --swiper-navigation-size: 14px;"
      >
        @for (item of items(); track $index) {
          <swiper-slide>
            <ng-container
              *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"
            ></ng-container>
          </swiper-slide>
        }
      </swiper-container>
    </div>
  `,
})
export class CarouselComponent<T> {
  items = input.required<T[]>();

  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<{ $implicit: T }>;

  private readonly swiperRef = viewChild.required<ElementRef<SwiperContainer>>('swiperRef');

  constructor() {
    afterNextRender(() => {
      const swiper = this.swiperRef().nativeElement;
      const params = {
        slidesPerView: 1.2,
        spaceBetween: 16,
        loop: true,
        navigation: true,
        autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
        breakpoints: {
          640: { slidesPerView: 2.2, spaceBetween: 16 },
          1024: { slidesPerView: 3.5, spaceBetween: 20 },
        },
      };
      Object.assign(swiper, params);
      swiper.initialize();
    });
  }
}
