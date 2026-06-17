import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  TemplateRef,
  afterNextRender,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative group">
      <div
        #carouselContainer
        class="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        (mouseenter)="pause()"
        (mouseleave)="resume()"
        (touchstart)="onTouchStart($event)"
        (touchend)="onTouchEnd($event)"
      >
        @for (item of displayItems(); track trackByItem($index, item)) {
          <ng-container
            *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"
          ></ng-container>
        }
      </div>

      <button
        type="button"
        class="hidden lg:grid opacity-0 group-hover:opacity-100 absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 place-items-center rounded-full bg-white/90 text-orange shadow-lg hover:bg-white hover:scale-105 transition-all duration-300"
        (click)="prev()"
        aria-label="Anterior"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        class="hidden lg:grid opacity-0 group-hover:opacity-100 absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 place-items-center rounded-full bg-white/90 text-orange shadow-lg hover:bg-white hover:scale-105 transition-all duration-300"
        (click)="next()"
        aria-label="Siguiente"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  `,
})
export class CarouselComponent<T> {
  items = input.required<T[]>();

  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<{ $implicit: T }>;

  private readonly container = viewChild.required<ElementRef<HTMLElement>>('carouselContainer');
  private readonly destroyRef = inject(DestroyRef);

  protected readonly displayItems = computed(() => {
    const items = this.items();
    return items.length > 1 ? [...items, ...items] : items;
  });

  private autoPlayIntervalId: number | null = null;
  private touchStartX = 0;
  private scrollAmount = 0;

  constructor() {
    afterNextRender(() => {
      this.startAutoPlay();
      this.destroyRef.onDestroy(() => this.stopAutoPlay());
    });
  }

  private get containerEl(): HTMLElement {
    return this.container().nativeElement;
  }

  private get halfScrollWidth(): number {
    return this.containerEl.scrollWidth / 2;
  }

  private updateScrollAmount(): void {
    const first = this.containerEl.firstElementChild as HTMLElement | null;
    if (!first) return;
    const style = getComputedStyle(this.containerEl);
    const gap = parseFloat(style.columnGap || style.gap || '0');
    this.scrollAmount = first.offsetWidth + gap;
  }

  protected next(): void {
    if (this.items().length <= 1) return;
    this.updateScrollAmount();
    this.containerEl.scrollBy({ left: this.scrollAmount, behavior: 'smooth' });
    window.setTimeout(() => this.normalizeScroll(), 350);
  }

  protected prev(): void {
    if (this.items().length <= 1) return;
    this.updateScrollAmount();
    this.containerEl.scrollBy({ left: -this.scrollAmount, behavior: 'smooth' });
    window.setTimeout(() => this.normalizeScroll(), 350);
  }

  private normalizeScroll(): void {
    const el = this.containerEl;
    const half = this.halfScrollWidth;
    if (half <= 0) return;

    if (el.scrollLeft >= half) {
      el.scrollLeft -= half;
    } else if (el.scrollLeft < 0) {
      el.scrollLeft += half;
    }
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  protected onTouchEnd(event: TouchEvent): void {
    const delta = this.touchStartX - event.changedTouches[0].screenX;
    const threshold = 50;
    if (delta > threshold) {
      this.next();
    } else if (delta < -threshold) {
      this.prev();
    }
  }

  protected pause(): void {
    this.stopAutoPlay();
  }

  protected resume(): void {
    this.startAutoPlay();
  }

  private startAutoPlay(): void {
    if (this.autoPlayIntervalId || this.items().length <= 1) return;
    this.autoPlayIntervalId = window.setInterval(() => this.next(), 3000);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayIntervalId) {
      window.clearInterval(this.autoPlayIntervalId);
      this.autoPlayIntervalId = null;
    }
  }

  protected trackByItem(index: number, item: T): string {
    return `${index}-${JSON.stringify(item)}`;
  }
}
