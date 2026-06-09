import { Component, DestroyRef, HostListener, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../../core/auth/auth.service';
import { socialChannels } from '../../../core/content/site-content';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly cart = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  protected readonly socialChannels = socialChannels;
  protected readonly isMenuOpen = signal(false);
  protected readonly isUserMenuOpen = signal(false);
  protected readonly isPinned = signal(false);
  protected readonly currentUrl = signal(this.router.url);
  protected readonly searchQuery = signal('');
  protected readonly user = this.auth.user;
  protected readonly count = this.cart.count;
  protected readonly firstName = computed(() => this.user()?.name.split(' ')[0] || '');
  protected readonly isHome = computed(() => this.currentUrl() === '/');

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  @HostListener('window:scroll')
  protected syncPinnedHeader() {
    if (typeof window === 'undefined') {
      return;
    }

    this.isPinned.set(window.scrollY > 8);
  }

  protected openCart() {
    this.cart.open();
    this.closeMobileMenu();
    this.isUserMenuOpen.set(false);
  }

  protected toggleMobileMenu() {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu() {
    this.isMenuOpen.set(false);
  }

  protected toggleUserMenu() {
    this.isUserMenuOpen.update((open) => !open);
  }

  protected async logout() {
    await this.auth.logout();
    this.isUserMenuOpen.set(false);
    this.isMenuOpen.set(false);
  }

  protected async submitSearch() {
    const q = this.searchQuery().trim();
    await this.router.navigate(['/tienda'], {
      queryParams: q ? { q } : {},
    });

    this.closeMobileMenu();
    this.isUserMenuOpen.set(false);
  }
}
