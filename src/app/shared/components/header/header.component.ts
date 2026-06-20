import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideBookOpen,
  lucideCat,
  lucideChevronDown,
  lucideHeart,
  lucideLayoutGrid,
  lucideLogOut,
  lucideMail,
  lucideMenu,
  lucideSearch,
  lucideShoppingCart,
  lucideSparkles,
  lucideStore,
  lucideUserRound,
  lucideUsers,
  lucideX,
} from '@ng-icons/lucide';

import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';

import { AuthService } from '../../../core/auth/auth.service';
import { socialChannels } from '../../../core/content/site-content';
import { CartService } from '../../../core/services/cart.service';

interface NavChild {
  label: string;
  href: string;
  icon: string;
  testId: string;
  queryParams?: Record<string, string>;
  fragment?: string;
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
  imports: [
    RouterLink,
    RouterLinkActive,
    HlmNavigationMenuImports,
    HlmButtonImports,
    HlmIconImports,
    HlmInputGroupImports,
    HlmBadgeImports,
    HlmSheetImports,
    HlmDropdownMenuImports,
    HlmAccordionImports,
  ],
  providers: [
    provideIcons({
      lucideBookOpen,
      lucideCat,
      lucideChevronDown,
      lucideHeart,
      lucideLayoutGrid,
      lucideLogOut,
      lucideMail,
      lucideMenu,
      lucideSearch,
      lucideShoppingCart,
      lucideSparkles,
      lucideStore,
      lucideUserRound,
      lucideUsers,
      lucideX,
    }),
  ],
  template: `
    <header
      class="fixed top-3 left-0 right-0 mx-auto z-50 w-[calc(100%-1.5rem)] max-w-6xl"
      [class.animate-in]="isVisible()"
      data-testid="header-pill"
    >
      <div
        class="rounded-full border px-3 py-1 shadow-lg transition-colors duration-300 backdrop-blur-xl"
        [class.bg-background/80]="!isScrolled()"
        [class.bg-background]="isScrolled()"
      >
        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center justify-start ml-15 mt-3">
            <img
              src="/brand/logoLasChubys.png?v=1"
              alt="Las Chubys"
              width="120"
              height="80"
              loading="eager"
              class="h-20 w-auto scale-[1.9] origin-center drop-shadow-sm"
            />
          </a>

          <!-- Desktop nav -->
          <nav hlmNavigationMenu class="hidden lg:flex justify-center">
            <ul hlmNavigationMenuList>
              @for (item of navItems; track item.testId) {
                <li hlmNavigationMenuItem>
                  @if (item.children) {
                    <button hlmNavigationMenuTrigger [attr.data-testid]="item.testId">
                      @if (item.icon) {
                        <ng-icon [name]="iconName(item.icon)" hlmIcon />
                      }
                      <span>{{ item.label }}</span>
                    </button>

                    <ng-template hlmNavigationMenuPortal>
                      <hlm-navigation-menu-content>
                        <div class="grid gap-4 p-2" [class.grid-cols-[1fr_140px]]="item.featured">
                          <ul class="flex flex-col gap-1 min-w-[200px]">
                            @for (child of item.children; track child.testId) {
                              <li>
                                <a
                                  hlmNavigationMenuLink
                                  [routerLink]="[child.href]"
                                  [queryParams]="child.queryParams ?? null"
                                  [fragment]="child.fragment"
                                  [attr.data-testid]="child.testId"
                                >
                                  <ng-icon [name]="iconName(child.icon)" hlmIcon />
                                  <span>{{ child.label }}</span>
                                </a>
                              </li>
                            }
                          </ul>

                          @if (item.featured) {
                            <a
                              [routerLink]="item.featured.href"
                              class="relative overflow-hidden rounded-lg group/feat"
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
                      </hlm-navigation-menu-content>
                    </ng-template>
                  } @else {
                    <a
                      hlmNavigationMenuLink
                      [routerLink]="item.href"
                      routerLinkActive
                      #rla="routerLinkActive"
                      [active]="rla.isActive"
                      [attr.data-testid]="item.testId"
                    >
                      @if (item.icon) {
                        <ng-icon [name]="iconName(item.icon)" hlmIcon />
                      }
                      <span>{{ item.label }}</span>
                    </a>
                  }
                </li>
              }
            </ul>
          </nav>

          <!-- Right actions: account, cart -->
          <div class="flex items-center justify-end gap-1">
            <div class="hidden sm:block">
              @if (user(); as currentUser) {
                <button
                  hlmBtn
                  variant="ghost"
                  size="sm"
                  type="button"
                  [hlmDropdownMenuTrigger]="userMenuTpl"
                >
                  <ng-icon hlmIcon name="lucideUserRound" />
                  <span class="max-w-[80px] truncate hidden lg:inline">
                    {{ firstName() }}
                  </span>
                  <ng-icon hlmIcon name="lucideChevronDown" />
                </button>

                <ng-template #userMenuTpl>
                  <hlm-dropdown-menu class="w-52">
                    <div hlmDropdownMenuLabel>{{ currentUser.name }}</div>
                    @if (currentUser.role === 'admin') {
                      <a hlmDropdownMenuItem routerLink="/admin">
                        <ng-icon hlmIcon name="lucideLayoutGrid" />
                        <span>Panel admin</span>
                      </a>
                    }
                    <button hlmDropdownMenuItem (click)="logout()">
                      <ng-icon hlmIcon name="lucideLogOut" />
                      <span>Cerrar sesión</span>
                    </button>
                  </hlm-dropdown-menu>
                </ng-template>
              } @else {
                <a
                  hlmBtn
                  variant="ghost"
                  size="icon"
                  routerLink="/auth/login"
                  aria-label="Mi cuenta"
                >
                  <ng-icon hlmIcon name="lucideUserRound" />
                </a>
              }
            </div>

            <button
              hlmBtn
              variant="ghost"
              class="relative"
              type="button"
              (click)="openCart()"
              aria-label="Carrito de compras"
            >
              <ng-icon hlmIcon name="lucideShoppingCart" />
              <span class="hidden sm:inline">Carrito</span>
              @if (count() > 0) {
                <span
                  hlmBadge
                  class="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center"
                >
                  {{ count() }}
                </span>
              }
            </button>

            <button
              hlmBtn
              variant="ghost"
              size="icon"
              class="lg:hidden"
              type="button"
              (click)="openMobileMenu()"
              aria-label="Abrir menú"
              [attr.aria-expanded]="isMenuOpen()"
              data-testid="header-menu-toggle"
            >
              <ng-icon hlmIcon name="lucideMenu" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Menú móvil drawer -->
    <hlm-sheet [state]="isMenuOpen() ? 'open' : 'closed'" (closed)="closeMobileMenu()" side="left">
      <ng-template hlmSheetPortal>
        <hlm-sheet-content side="left" class="w-full max-w-sm p-0">
          <div class="flex items-center justify-between p-4 border-b">
            <a routerLink="/" (click)="closeMobileMenu()">
              <img
                src="/brand/logoLasChubys.png?v=1"
                alt="Las Chubys"
                width="100"
                height="67"
                class="h-16 w-auto scale-[1.6] origin-center drop-shadow-sm"
              />
            </a>
            <button
              hlmBtn
              variant="ghost"
              size="icon"
              type="button"
              hlmSheetClose
              aria-label="Cerrar menú"
              data-testid="mobile-menu-close"
            >
              <ng-icon hlmIcon name="lucideX" />
            </button>
          </div>

          <nav class="flex flex-col p-2 overflow-y-auto">
            <hlm-accordion type="single">
              @for (item of navItems; track item.testId) {
                @if (item.children) {
                  <hlm-accordion-item>
                    <hlm-accordion-trigger>
                      <span class="flex items-center gap-3">
                        @if (item.icon) {
                          <ng-icon [name]="iconName(item.icon)" hlmIcon />
                        }
                        <span>{{ item.label }}</span>
                      </span>
                    </hlm-accordion-trigger>
                    <hlm-accordion-content>
                      <div class="flex flex-col gap-1 pl-8">
                        @for (child of item.children; track child.testId) {
                          <a
                            hlmBtn
                            variant="ghost"
                            class="justify-start"
                            [routerLink]="[child.href]"
                            [queryParams]="child.queryParams ?? null"
                            [fragment]="child.fragment"
                            (click)="closeMobileMenu()"
                            [attr.data-testid]="child.testId"
                          >
                            <ng-icon [name]="iconName(child.icon)" hlmIcon />
                            <span>{{ child.label }}</span>
                          </a>
                        }
                      </div>
                    </hlm-accordion-content>
                  </hlm-accordion-item>
                } @else {
                  <a
                    hlmBtn
                    variant="ghost"
                    class="justify-start"
                    [routerLink]="item.href"
                    (click)="closeMobileMenu()"
                    [attr.data-testid]="item.testId"
                  >
                    @if (item.icon) {
                      <ng-icon [name]="iconName(item.icon)" hlmIcon />
                    }
                    <span>{{ item.label }}</span>
                  </a>
                }
              }
            </hlm-accordion>
          </nav>

          <div class="mt-auto p-4 border-t">
            @if (user(); as currentUser) {
              <div class="flex flex-col gap-2">
                <span class="text-sm font-bold px-4 py-2">
                  {{ currentUser.name }}
                </span>
                @if (currentUser.role === 'admin') {
                  <a
                    hlmBtn
                    variant="ghost"
                    class="justify-start"
                    routerLink="/admin"
                    (click)="closeMobileMenu()"
                    data-testid="mobile-admin-link"
                  >
                    <ng-icon hlmIcon name="lucideLayoutGrid" />
                    <span>Panel admin</span>
                  </a>
                }
                <button
                  hlmBtn
                  variant="ghost"
                  class="justify-start"
                  type="button"
                  (click)="logout()"
                  data-testid="mobile-logout-btn"
                >
                  <ng-icon hlmIcon name="lucideLogOut" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            } @else {
              <a
                hlmBtn
                variant="ghost"
                class="justify-start"
                routerLink="/auth/login"
                (click)="closeMobileMenu()"
                data-testid="mobile-login-link"
              >
                <ng-icon hlmIcon name="lucideUserRound" />
                <span>Ingresar</span>
              </a>
            }

            <div class="flex gap-3 mt-4 px-4">
              @for (channel of socialChannels.slice(0, 2); track channel.name) {
                <a
                  [href]="channel.href"
                  class="text-xs text-muted-foreground hover:text-primary transition-colors"
                  rel="noreferrer"
                  target="_blank"
                  >{{ channel.name }}</a
                >
              }
            </div>
          </div>
        </hlm-sheet-content>
      </ng-template>
    </hlm-sheet>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      header {
        opacity: 1;
        transform: translateY(0);
      }

      header.animate-in {
        animation: header-in 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      @keyframes header-in {
        from {
          opacity: 0;
          transform: translateY(-12px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        header,
        header.animate-in {
          animation: none;
          opacity: 1;
          transform: translateY(0);
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

  protected readonly socialChannels = socialChannels;
  protected readonly user = this.auth.user;
  protected readonly count = this.cart.count;
  protected readonly firstName = computed(() => this.user()?.name.split(' ')[0] || '');

  protected readonly isMenuOpen = signal(false);
  protected readonly isVisible = signal(false);
  protected readonly isScrolled = signal(false);

  protected readonly navItems: NavItem[] = [
    {
      label: 'Tienda',
      testId: 'header-nav-tienda',
      icon: 'lucideStore',
      children: [
        {
          label: 'Alimentos',
          href: '/tienda',
          queryParams: { categoria: 'alimentos' },
          icon: 'lucideCat',
          testId: 'header-nav-tienda-alimentos',
        },
        {
          label: 'Arenas',
          href: '/tienda',
          queryParams: { categoria: 'arenas' },
          icon: 'lucideSparkles',
          testId: 'header-nav-tienda-arenas',
        },
        {
          label: 'Juguetes',
          href: '/tienda',
          queryParams: { categoria: 'juguetes' },
          icon: 'lucideHeart',
          testId: 'header-nav-tienda-juguetes',
        },
        {
          label: 'Accesorios',
          href: '/tienda',
          queryParams: { categoria: 'accesorios' },
          icon: 'lucideLayoutGrid',
          testId: 'header-nav-tienda-accesorios',
        },
        {
          label: 'Higiene',
          href: '/tienda',
          queryParams: { categoria: 'higiene' },
          icon: 'lucideSparkles',
          testId: 'header-nav-tienda-higiene',
        },
        {
          label: 'Ver todo',
          href: '/tienda',
          icon: 'lucideStore',
          testId: 'header-nav-tienda-todo',
        },
      ],
      featured: {
        image: '/images/cats/iris4.jpeg',
        title: 'Lo mejor para tu michi',
        href: '/tienda',
      },
    },
    {
      label: 'Servicios',
      href: '/servicios',
      icon: 'lucideBookOpen',
      testId: 'header-nav-servicios',
    },
    {
      label: 'Nosotras',
      testId: 'header-nav-about',
      icon: 'lucideUsers',
      children: [
        {
          label: 'Sobre nosotras',
          href: '/about',
          icon: 'lucideHeart',
          testId: 'header-nav-about-nosotras',
        },
        {
          label: 'Nuestro equipo',
          href: '/about',
          fragment: 'equipo',
          icon: 'lucideUsers',
          testId: 'header-nav-about-equipo',
        },
        {
          label: 'Contacto',
          href: '/contact',
          icon: 'lucideMail',
          testId: 'header-nav-about-contact',
        },
      ],
    },
    {
      label: 'Blog',
      href: '/blog',
      icon: 'lucideBookOpen',
      testId: 'header-nav-blog',
    },
    {
      label: 'Contacto',
      href: '/contact',
      icon: 'lucideMail',
      testId: 'header-nav-contact',
    },
    {
      label: 'Media Kit',
      href: '/media-kit',
      icon: 'lucideSparkles',
      testId: 'header-nav-media-kit',
    },
  ];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        this.isVisible.set(true);
        const onScroll = () => this.isScrolled.set(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
      });
    }
  }

  protected openCart() {
    this.cart.open();
    this.closeMobileMenu();
  }

  protected openMobileMenu() {
    this.isMenuOpen.set(true);
  }

  protected closeMobileMenu() {
    this.isMenuOpen.set(false);
  }

  protected async logout() {
    await this.auth.logout();
    this.closeMobileMenu();
  }

  protected iconName(name: string): string {
    if (name.startsWith('lucide')) return name;
    return ('lucide' +
      name.replace(/(^|-)([a-z])/g, (_: string, _sep: string, letter: string) =>
        letter.toUpperCase(),
      )) as string;
  }
}
