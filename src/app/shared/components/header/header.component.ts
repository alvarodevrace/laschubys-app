import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  PLATFORM_ID,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule } from 'lucide-angular';

import { AuthService } from '../../../core/auth/auth.service';
import { socialChannels } from '../../../core/content/site-content';
import { CartService } from '../../../core/services/cart.service';

interface NavChild {
  label: string;
  href: string;
  icon: string;
  testId: string;
}

interface NavItem {
  label: string;
  href?: string;
  icon?: string;
  testId: string;
  children?: NavChild[];
  featured?: { image: string; title: string; href: string };
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <!-- Header pill flotante estilo Exodus -->
    <header
      class="fixed top-3 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-1.5rem)] max-w-5xl"
      [class.animate-in]="isVisible()"
      data-testid="header-pill"
    >
      <div
        class="rounded-full bg-white/45 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_40px_-12px_rgba(20,19,19,0.18)] px-2 sm:px-3 py-1.5 flex items-center justify-between gap-2 sm:gap-3"
      >
        <!-- Izquierda: hamburger + logo -->
        <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            class="lg:hidden w-9 h-9 inline-flex items-center justify-center rounded-full text-gray-700 hover:text-orange hover:bg-orange-50 transition-colors"
            type="button"
            (click)="toggleMobileMenu()"
            aria-label="Abrir menú"
            [attr.aria-expanded]="isMenuOpen()"
            data-testid="header-menu-toggle"
          >
            <lucide-icon name="menu" class="w-[18px] h-[18px]" />
          </button>

          <a
            routerLink="/"
            aria-label="Inicio Las Chubys"
            class="flex items-center gap-2 px-1.5 py-1 rounded-full hover:bg-white/40 transition-colors"
          >
            <img
              src="/brand/logoTitulo.png?v=4"
              alt="Las Chubys"
              class="h-8 sm:h-9 w-auto"
              loading="eager"
            />
          </a>
        </div>

        <!-- Centro: navegación desktop -->
        <nav class="hidden lg:flex items-center gap-0.5" aria-label="Categorías">
          @for (item of navItems; track item.testId) {
            @if (item.children) {
              <div class="relative group">
                <button
                  class="inline-flex items-center gap-1 px-3.5 py-2 text-sm font-semibold text-gray-700 rounded-full hover:bg-white/50 hover:text-orange transition-colors"
                  type="button"
                  [attr.aria-expanded]="isOpen(item.testId)"
                  (mouseenter)="openDropdown(item.testId)"
                  (mouseleave)="scheduleClose(item.testId)"
                  (click)="toggleDropdown(item.testId)"
                  [attr.data-testid]="item.testId"
                >
                  @if (item.icon) {
                    <lucide-icon [name]="item.icon" class="w-4 h-4" />
                  }
                  <span>{{ item.label }}</span>
                  <lucide-icon name="chevron-down" class="w-3.5 h-3.5 opacity-70" />
                </button>

                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out"
                  (mouseenter)="openDropdown(item.testId)"
                  (mouseleave)="scheduleClose(item.testId)"
                >
                  <div
                    class="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/70 shadow-[0_20px_50px_-15px_rgba(20,19,19,0.2)] p-4 min-w-[280px]"
                    [class.w-[420px]]="item.featured"
                  >
                    <div
                      [class.grid]="item.featured"
                      [class.grid-cols-[1fr,140px]]="item.featured"
                      class="gap-4"
                    >
                      <div class="flex flex-col gap-1">
                        @for (child of item.children; track child.testId) {
                          <a
                            [routerLink]="child.href"
                            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange transition-colors"
                            [attr.data-testid]="child.testId"
                          >
                            <lucide-icon [name]="child.icon" class="w-4 h-4 flex-shrink-0" />
                            <span>{{ child.label }}</span>
                          </a>
                        }
                      </div>

                      @if (item.featured) {
                        <a
                          [routerLink]="item.featured.href"
                          class="relative overflow-hidden rounded-2xl group/feat"
                        >
                          <img
                            [src]="item.featured.image"
                            [alt]="item.featured.title"
                            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/feat:scale-105"
                            loading="lazy"
                          />
                          <div
                            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                          ></div>
                          <span
                            class="absolute bottom-2 left-2 right-2 text-xs font-bold text-white leading-tight"
                          >
                            {{ item.featured.title }}
                          </span>
                        </a>
                      }
                    </div>
                  </div>
                </div>
              </div>
            } @else {
              <a
                [routerLink]="item.href"
                routerLinkActive="is-active"
                class="inline-flex items-center gap-1 px-3.5 py-2 text-sm font-semibold text-gray-700 rounded-full hover:bg-white/50 hover:text-orange transition-colors"
                [attr.data-testid]="item.testId"
              >
                @if (item.icon) {
                  <lucide-icon [name]="item.icon" class="w-4 h-4" />
                }
                <span>{{ item.label }}</span>
              </a>
            }
          }
        </nav>

        <!-- Derecha: búsqueda, usuario, carrito -->
        <div class="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <!-- Buscador desktop -->
          <form
            class="hidden md:flex items-center relative"
            role="search"
            (submit)="submitSearch(); $event.preventDefault()"
            data-testid="header-search-form"
          >
            <input
              #searchInputHeader
              type="search"
              name="q"
              placeholder="Buscar..."
              autocomplete="off"
              aria-label="Buscar productos"
              [value]="searchQuery()"
              (input)="searchQuery.set(searchInputHeader.value)"
              (focus)="isSearchExpanded.set(true)"
              (blur)="isSearchExpanded.set(false)"
              class="w-28 focus:w-44 lg:focus:w-56 h-9 pl-9 pr-3 rounded-full bg-white/50 border border-white/60 text-sm placeholder:text-gray-400 outline-none transition-all duration-200 focus:bg-white/80 focus:border-orange/30"
              data-testid="header-search-input"
            />
            <lucide-icon
              name="search"
              class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
            />
            <button
              type="submit"
              aria-label="Buscar"
              class="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-orange text-white inline-flex items-center justify-center opacity-0 focus:opacity-100 hover:opacity-100 transition-opacity"
            >
              <lucide-icon name="search" class="w-3.5 h-3.5" />
            </button>
          </form>

          <!-- Búsqueda móvil -->
          <button
            class="md:hidden w-9 h-9 inline-flex items-center justify-center rounded-full text-gray-700 hover:text-orange hover:bg-orange-50 transition-colors"
            type="button"
            (click)="toggleMobileSearch()"
            aria-label="Buscar"
          >
            <lucide-icon name="search" class="w-[18px] h-[18px]" />
          </button>

          <!-- Usuario -->
          <div class="relative hidden sm:block">
            @if (user(); as currentUser) {
              <button
                class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-semibold text-gray-700 hover:bg-white/50 hover:text-orange transition-colors"
                type="button"
                (click)="toggleUserMenu()"
                [attr.aria-expanded]="isUserMenuOpen()"
              >
                <lucide-icon name="user-round" class="w-4 h-4" />
                <span class="max-w-[80px] truncate hidden lg:inline">{{ firstName() }}</span>
              </button>
            } @else {
              <a
                class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-semibold text-gray-700 hover:bg-white/50 hover:text-orange transition-colors"
                routerLink="/auth/login"
              >
                <lucide-icon name="user-round" class="w-4 h-4" />
                <span class="hidden lg:inline">Mi Cuenta</span>
              </a>
            }

            <!-- Menú usuario -->
            @if (isUserMenuOpen()) {
              <div
                class="absolute top-full right-0 mt-2 w-52 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/70 shadow-[0_20px_50px_-15px_rgba(20,19,19,0.2)] p-2 origin-top-right"
              >
                @if (user(); as currentUser) {
                  <div class="px-3 py-2 text-sm font-bold text-gray-900 truncate">
                    {{ currentUser.name }}
                  </div>
                  @if (currentUser.role === 'admin') {
                    <a
                      routerLink="/admin"
                      (click)="isUserMenuOpen.set(false)"
                      class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange transition-colors"
                    >
                      <lucide-icon name="layout-grid" class="w-4 h-4" />
                      <span>Panel admin</span>
                    </a>
                  }
                  <button
                    type="button"
                    (click)="logout()"
                    class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange transition-colors text-left"
                  >
                    <lucide-icon name="log-out" class="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                }
              </div>
            }
          </div>

          <!-- Carrito -->
          <button
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-semibold text-gray-700 hover:bg-white/50 hover:text-orange transition-colors relative"
            type="button"
            (click)="openCart()"
            aria-label="Carrito de compras"
          >
            <lucide-icon name="shopping-cart" class="w-[18px] h-[18px]" />
            <span class="hidden sm:inline">Carrito</span>
            @if (count() > 0) {
              <span
                class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-orange text-white text-[10px] font-extrabold"
              >
                {{ count() }}
              </span>
            }
          </button>
        </div>
      </div>

      <!-- Buscador móvil expandido -->
      @if (isMobileSearchOpen()) {
        <div
          class="mt-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg p-2 lg:hidden"
        >
          <form
            class="flex items-center gap-2"
            role="search"
            (submit)="submitSearch(); $event.preventDefault()"
          >
            <lucide-icon name="search" class="w-5 h-5 text-gray-500 ml-2" />
            <input
              #searchInputMobile
              type="search"
              name="q"
              placeholder="Buscar productos para los michis..."
              autocomplete="off"
              aria-label="Buscar productos"
              [value]="searchQuery()"
              (input)="searchQuery.set(searchInputMobile.value)"
              class="flex-1 h-10 bg-transparent border-0 outline-none text-sm placeholder:text-gray-400"
            />
            <button
              type="submit"
              class="px-4 h-10 rounded-full bg-orange text-white text-sm font-semibold"
            >
              Buscar
            </button>
          </form>
        </div>
      }
    </header>

    <!-- Menú móvil drawer -->
    <div
      class="fixed inset-0 z-[3000] lg:hidden transition-[opacity,visibility] duration-200"
      [class.pointer-events-none]="!isMenuOpen()"
      [class.opacity-0]="!isMenuOpen()"
      [class.invisible]="!isMenuOpen()"
      [attr.aria-hidden]="!isMenuOpen()"
    >
      <button
        class="absolute inset-0 border-0 bg-[rgba(14,11,10,0.52)]"
        type="button"
        (click)="closeMobileMenu()"
        aria-label="Cerrar menú"
        data-testid="mobile-menu-backdrop"
      ></button>
      <div
        class="absolute top-0 left-0 bottom-0 w-full max-w-sm bg-white flex flex-col transition-transform duration-200 ease-out"
        [class.-translate-x-full]="!isMenuOpen()"
        [class.translate-x-0]="isMenuOpen()"
      >
        <div class="flex items-center justify-between p-4 border-b border-gray-100">
          <a class="block" routerLink="/" (click)="closeMobileMenu()">
            <img
              src="/brand/logoTitulo.png?v=4"
              alt="Las Chubys"
              width="60"
              height="40"
              class="h-10 w-auto"
            />
          </a>
          <button
            class="min-w-11 min-h-11 inline-flex items-center justify-center text-gray-500 hover:text-orange transition-colors"
            type="button"
            (click)="closeMobileMenu()"
            aria-label="Cerrar menú"
            data-testid="mobile-menu-close"
          >
            <lucide-icon name="x" class="w-5 h-5" />
          </button>
        </div>

        <nav class="flex flex-col p-2 overflow-y-auto">
          @for (item of navItems; track item.testId) {
            @if (item.children) {
              <div class="flex flex-col">
                <button
                  type="button"
                  (click)="toggleMobileChild(item.testId)"
                  class="flex items-center min-h-11 gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-orange transition-colors"
                >
                  @if (item.icon) {
                    <lucide-icon [name]="item.icon" class="w-5 h-5 flex-shrink-0" />
                  }
                  <span>{{ item.label }}</span>
                  <lucide-icon
                    name="chevron-down"
                    class="w-4 h-4 ml-auto transition-transform"
                    [class.rotate-180]="isMobileChildOpen(item.testId)"
                  />
                </button>
                @if (isMobileChildOpen(item.testId)) {
                  <div class="pl-11 pr-2 pb-1 flex flex-col gap-1">
                    @for (child of item.children; track child.testId) {
                      <a
                        [routerLink]="child.href"
                        (click)="closeMobileMenu()"
                        class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-orange transition-colors"
                        [attr.data-testid]="child.testId"
                      >
                        <lucide-icon [name]="child.icon" class="w-4 h-4 flex-shrink-0" />
                        <span>{{ child.label }}</span>
                      </a>
                    }
                  </div>
                }
              </div>
            } @else {
              <a
                class="flex items-center min-h-11 gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-orange transition-colors"
                [routerLink]="item.href"
                (click)="closeMobileMenu()"
                [attr.data-testid]="item.testId"
              >
                @if (item.icon) {
                  <lucide-icon [name]="item.icon" class="w-5 h-5 flex-shrink-0" />
                }
                <span>{{ item.label }}</span>
              </a>
            }
          }
        </nav>

        <div class="mt-auto p-4 border-t border-gray-100">
          @if (user(); as currentUser) {
            <div class="flex flex-col gap-2">
              <span class="text-sm font-bold text-gray-900 px-4 py-2">{{ currentUser.name }}</span>
              @if (currentUser.role === 'admin') {
                <a
                  class="flex items-center min-h-11 gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-orange transition-colors"
                  routerLink="/admin"
                  (click)="closeMobileMenu()"
                  data-testid="mobile-admin-link"
                >
                  <lucide-icon name="layout-grid" class="w-5 h-5 flex-shrink-0" />
                  <span>Panel admin</span>
                </a>
              }
              <button
                class="flex items-center min-h-11 gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-orange transition-colors"
                type="button"
                (click)="logout()"
                data-testid="mobile-logout-btn"
              >
                <lucide-icon name="log-out" class="w-5 h-5 flex-shrink-0" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          } @else {
            <a
              class="flex items-center min-h-11 gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-orange transition-colors"
              routerLink="/auth/login"
              (click)="closeMobileMenu()"
              data-testid="mobile-login-link"
            >
              <lucide-icon name="user-round" class="w-5 h-5 flex-shrink-0" />
              <span>Ingresar</span>
            </a>
          }

          <div class="flex gap-3 mt-4 px-4">
            @for (channel of socialChannels.slice(0, 2); track channel.name) {
              <a
                [href]="channel.href"
                class="text-xs text-gray-500 hover:text-orange transition-colors"
                rel="noreferrer"
                target="_blank"
                >{{ channel.name }}</a
              >
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      header {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      header.animate-in {
        animation: header-in 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      @keyframes header-in {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-12px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      .is-active {
        color: var(--orange, #ff7a1a);
        background-color: rgba(255, 122, 26, 0.08);
      }

      @media (prefers-reduced-motion: reduce) {
        header,
        header.animate-in {
          animation: none;
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `,
  ],
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly cart = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  protected readonly socialChannels = socialChannels;
  protected readonly user = this.auth.user;
  protected readonly count = this.cart.count;
  protected readonly firstName = computed(() => this.user()?.name.split(' ')[0] || '');

  protected readonly isMenuOpen = signal(false);
  protected readonly isUserMenuOpen = signal(false);
  protected readonly isMobileSearchOpen = signal(false);
  protected readonly isSearchExpanded = signal(false);
  protected readonly isVisible = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly currentUrl = signal(this.router.url);

  private readonly openDropdowns = signal<Record<string, boolean>>({});
  private readonly dropdownTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly mobileOpenChildren = signal<Record<string, boolean>>({});

  protected readonly navItems: NavItem[] = [
    {
      label: 'Tienda',
      testId: 'header-nav-tienda',
      icon: 'store',
      children: [
        {
          label: 'Alimentos',
          href: '/tienda?categoria=alimentos',
          icon: 'cat',
          testId: 'header-nav-tienda-alimentos',
        },
        {
          label: 'Arenas',
          href: '/tienda?categoria=arenas',
          icon: 'sparkles',
          testId: 'header-nav-tienda-arenas',
        },
        {
          label: 'Juguetes',
          href: '/tienda?categoria=juguetes',
          icon: 'heart',
          testId: 'header-nav-tienda-juguetes',
        },
        {
          label: 'Accesorios',
          href: '/tienda?categoria=accesorios',
          icon: 'layout-grid',
          testId: 'header-nav-tienda-accesorios',
        },
        {
          label: 'Higiene',
          href: '/tienda?categoria=higiene',
          icon: 'sparkles',
          testId: 'header-nav-tienda-higiene',
        },
        { label: 'Ver todo', href: '/tienda', icon: 'store', testId: 'header-nav-tienda-todo' },
      ],
      featured: {
        image: '/images/cats/iris4.jpeg',
        title: 'Lo mejor para tu michi',
        href: '/tienda',
      },
    },
    { label: 'Servicios', href: '/servicios', icon: 'book-open', testId: 'header-nav-servicios' },
    {
      label: 'Nosotras',
      testId: 'header-nav-about',
      icon: 'users',
      children: [
        {
          label: 'Sobre nosotras',
          href: '/about',
          icon: 'heart',
          testId: 'header-nav-about-nosotras',
        },
        {
          label: 'Nuestro equipo',
          href: '/about#equipo',
          icon: 'users',
          testId: 'header-nav-about-equipo',
        },
        { label: 'Contacto', href: '/contact', icon: 'mail', testId: 'header-nav-about-contact' },
      ],
    },
    { label: 'Blog', href: '/blog', icon: 'book-open', testId: 'header-nav-blog' },
    { label: 'Contacto', href: '/contact', icon: 'mail', testId: 'header-nav-contact' },
    { label: 'Media Kit', href: '/media-kit', icon: 'sparkles', testId: 'header-nav-media-kit' },
  ];

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });

    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        this.isVisible.set(true);
      });

      effect(() => {
        const body = document.body;
        if (this.isMenuOpen()) {
          body.style.overflow = 'hidden';
        } else {
          body.style.overflow = '';
        }
      });
    }
  }

  protected isOpen(testId: string): boolean {
    return this.openDropdowns()[testId] ?? false;
  }

  protected openDropdown(testId: string) {
    const timer = this.dropdownTimers.get(testId);
    if (timer) {
      clearTimeout(timer);
      this.dropdownTimers.delete(testId);
    }
    this.openDropdowns.update((state) => ({ ...state, [testId]: true }));
  }

  protected scheduleClose(testId: string) {
    const timer = setTimeout(() => {
      this.openDropdowns.update((state) => ({ ...state, [testId]: false }));
      this.dropdownTimers.delete(testId);
    }, 120);
    this.dropdownTimers.set(testId, timer);
  }

  protected toggleDropdown(testId: string) {
    this.openDropdowns.update((state) => ({ ...state, [testId]: !state[testId] }));
  }

  protected isMobileChildOpen(testId: string): boolean {
    return this.mobileOpenChildren()[testId] ?? false;
  }

  protected toggleMobileChild(testId: string) {
    this.mobileOpenChildren.update((state) => ({ ...state, [testId]: !state[testId] }));
  }

  protected toggleMobileSearch() {
    this.isMobileSearchOpen.update((open) => !open);
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
    this.isMobileSearchOpen.set(false);
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
    this.isMobileSearchOpen.set(false);
  }
}
