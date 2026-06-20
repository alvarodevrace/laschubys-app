import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CartDrawerComponent } from '../components/cart-drawer/cart-drawer.component';
import { FooterComponent } from '../components/footer/footer.component';
import { HeaderComponent } from '../components/header/header.component';
import { WhatsappFloatComponent } from '../components/whatsapp-float/whatsapp-float.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CartDrawerComponent,
    WhatsappFloatComponent,
  ],
  template: `
    <app-header />
    <main class="min-h-[calc(100vh-360px)] pt-20">
      <router-outlet />
    </main>
    <app-footer />
    <app-cart-drawer />
    <app-whatsapp-float />
  `,
})
export class ShellComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private revealObserver: IntersectionObserver | null = null;
  private revealTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    afterNextRender(() => this.bindRevealObserver());

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.scheduleRevealBinding();
      });

    this.destroyRef.onDestroy(() => {
      if (this.revealTimer) {
        clearTimeout(this.revealTimer);
        this.revealTimer = null;
      }
      this.revealObserver?.disconnect();
      this.revealObserver = null;
    });
  }

  private scheduleRevealBinding() {
    if (this.revealTimer) {
      clearTimeout(this.revealTimer);
    }

    this.revealTimer = setTimeout(() => {
      this.revealTimer = null;
      this.bindRevealObserver();
    });
  }

  private bindRevealObserver() {
    const elements = Array.from(this.document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!elements.length) {
      return;
    }

    this.revealObserver?.disconnect();
    this.revealObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      },
    );

    for (const element of elements) {
      if (element.classList.contains('is-visible')) {
        continue;
      }

      this.revealObserver.observe(element);
    }
  }
}
