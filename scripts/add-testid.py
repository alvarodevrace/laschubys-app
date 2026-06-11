import re
from pathlib import Path

# header.component.html
header = Path('src/app/shared/components/header/header.component.html')
html = header.read_text()

replacements = [
    ('<button class="nav-hamburger" type="button" (click)="toggleMobileMenu()" aria-label="Abrir menú" [attr.aria-expanded]="isMenuOpen()">',
     '<button class="nav-hamburger" type="button" (click)="toggleMobileMenu()" aria-label="Abrir menú" [attr.aria-expanded]="isMenuOpen()" data-testid="header-menu-toggle">'),
    ('<form class="main-header__search" role="search" (ngSubmit)="submitSearch()">',
     '<form class="main-header__search" role="search" (ngSubmit)="submitSearch()" data-testid="header-search-form">'),
    ('<input\n          #searchInput\n          type="search"\n          name="q"\n          placeholder="Buscar productos para los michis..."\n          autocomplete="off"\n          aria-label="Buscar productos"\n          [value]="searchQuery()"\n          (input)="searchQuery.set(searchInput.value)"\n        />',
     '<input\n          #searchInput\n          type="search"\n          name="q"\n          placeholder="Buscar productos para los michis..."\n          autocomplete="off"\n          aria-label="Buscar productos"\n          [value]="searchQuery()"\n          (input)="searchQuery.set(searchInput.value)"\n          data-testid="header-search-input"\n        />'),
    ('<button type="submit" aria-label="Buscar">',
     '<button type="submit" aria-label="Buscar" data-testid="header-search-submit">'),
    ('<button class="header-action-btn" type="button" (click)="toggleUserMenu()">',
     '<button class="header-action-btn" type="button" (click)="toggleUserMenu()" data-testid="header-user-menu-toggle">'),
    ('<a routerLink="/admin" (click)="toggleUserMenu()">Panel</a>',
     '<a routerLink="/admin" (click)="toggleUserMenu()" data-testid="header-admin-link">Panel</a>'),
    ('<button type="button" (click)="logout()">Salir</button>',
     '<button type="button" (click)="logout()" data-testid="header-logout-btn">Salir</button>'),
    ('<a class="header-action-btn" routerLink="/auth/login">',
     '<a class="header-action-btn" routerLink="/auth/login" data-testid="header-login-link">'),
    ('<button class="header-action-btn header-cart-btn" type="button" (click)="openCart()" aria-label="Carrito de compras">',
     '<button class="header-action-btn header-cart-btn" type="button" (click)="openCart()" aria-label="Carrito de compras" data-testid="header-cart-btn">'),
    ('<a routerLink="/tienda" routerLinkActive="is-active" class="cat-nav__item">',
     '<a routerLink="/tienda" routerLinkActive="is-active" class="cat-nav__item" data-testid="header-nav-tienda">'),
    ('<a routerLink="/servicios" routerLinkActive="is-active" class="cat-nav__item">',
     '<a routerLink="/servicios" routerLinkActive="is-active" class="cat-nav__item" data-testid="header-nav-servicios">'),
    ('<a routerLink="/about" routerLinkActive="is-active" class="cat-nav__item">',
     '<a routerLink="/about" routerLinkActive="is-active" class="cat-nav__item" data-testid="header-nav-about">'),
    ('<a routerLink="/blog" routerLinkActive="is-active" class="cat-nav__item">',
     '<a routerLink="/blog" routerLinkActive="is-active" class="cat-nav__item" data-testid="header-nav-blog">'),
    ('<a routerLink="/contact" routerLinkActive="is-active" class="cat-nav__item">',
     '<a routerLink="/contact" routerLinkActive="is-active" class="cat-nav__item" data-testid="header-nav-contact">'),
    ('<button class="nav-mobile__backdrop" type="button" (click)="closeMobileMenu()" aria-label="Cerrar menú"></button>',
     '<button class="nav-mobile__backdrop" type="button" (click)="closeMobileMenu()" aria-label="Cerrar menú" data-testid="mobile-menu-backdrop"></button>'),
    ('<button class="nav-mobile__close" type="button" (click)="closeMobileMenu()" aria-label="Cerrar menú">',
     '<button class="nav-mobile__close" type="button" (click)="closeMobileMenu()" aria-label="Cerrar menú" data-testid="mobile-menu-close">'),
    ('<a class="nav-mobile__link" routerLink="/tienda" (click)="closeMobileMenu()">',
     '<a class="nav-mobile__link" routerLink="/tienda" (click)="closeMobileMenu()" data-testid="mobile-nav-tienda">'),
    ('<a class="nav-mobile__link" routerLink="/blog" (click)="closeMobileMenu()">',
     '<a class="nav-mobile__link" routerLink="/blog" (click)="closeMobileMenu()" data-testid="mobile-nav-blog">'),
    ('<a class="nav-mobile__link" routerLink="/about" (click)="closeMobileMenu()">',
     '<a class="nav-mobile__link" routerLink="/about" (click)="closeMobileMenu()" data-testid="mobile-nav-about">'),
    ('<a class="nav-mobile__link" routerLink="/servicios" (click)="closeMobileMenu()">',
     '<a class="nav-mobile__link" routerLink="/servicios" (click)="closeMobileMenu()" data-testid="mobile-nav-servicios">'),
    ('<a class="nav-mobile__link" routerLink="/contact" (click)="closeMobileMenu()">',
     '<a class="nav-mobile__link" routerLink="/contact" (click)="closeMobileMenu()" data-testid="mobile-nav-contact">'),
    ('<a class="nav-mobile__action" routerLink="/admin" (click)="closeMobileMenu()">',
     '<a class="nav-mobile__action" routerLink="/admin" (click)="closeMobileMenu()" data-testid="mobile-admin-link">'),
    ('<button class="nav-mobile__action" type="button" (click)="logout()">',
     '<button class="nav-mobile__action" type="button" (click)="logout()" data-testid="mobile-logout-btn">'),
    ('<a class="nav-mobile__signin" routerLink="/auth/login" (click)="closeMobileMenu()">',
     '<a class="nav-mobile__signin" routerLink="/auth/login" (click)="closeMobileMenu()" data-testid="mobile-login-link">'),
]

for old, new in replacements:
    if old in html:
        html = html.replace(old, new)
    else:
        print(f'WARN: not found in header: {old[:60]}...')

header.write_text(html)
print('OK header.component.html')

# footer.component.html
footer = Path('src/app/shared/components/footer/footer.component.html')
html = footer.read_text()

replacements = [
    ('<a class="ps-footer__brand" routerLink="/" aria-label="Inicio Las Chubys">',
     '<a class="ps-footer__brand" routerLink="/" aria-label="Inicio Las Chubys" data-testid="footer-brand">'),
    ('<a [href]="channel.href" [attr.aria-label]="channel.name" class="ps-footer__social-link" rel="noreferrer" target="_blank">',
     '<a [href]="channel.href" [attr.aria-label]="channel.name" class="ps-footer__social-link" rel="noreferrer" target="_blank" [attr.data-testid]="\'footer-social-\' + channel.name.toLowerCase()">'),
    ('<a routerLink="/about">¿Quiénes somos?</a>',
     '<a routerLink="/about" data-testid="footer-link-about">¿Quiénes somos?</a>'),
    ('<a routerLink="/blog">Blog felino</a>',
     '<a routerLink="/blog" data-testid="footer-link-blog">Blog felino</a>'),
    ('<a routerLink="/contact">Contáctanos</a>',
     '<a routerLink="/contact" data-testid="footer-link-contact">Contáctanos</a>'),
    ('<a href="https://wa.me/593960463743" target="_blank" rel="noreferrer">WhatsApp</a>',
     '<a href="https://wa.me/593960463743" target="_blank" rel="noreferrer" data-testid="footer-link-whatsapp">WhatsApp</a>'),
    ('<a href="https://www.instagram.com/laschubys.oficial/" rel="noreferrer" target="_blank">Instagram</a>',
     '<a href="https://www.instagram.com/laschubys.oficial/" rel="noreferrer" target="_blank" data-testid="footer-link-instagram">Instagram</a>'),
    ('<a routerLink="/auth/login">Mi cuenta</a>',
     '<a routerLink="/auth/login" data-testid="footer-link-login">Mi cuenta</a>'),
    ('<a routerLink="/carrito">Mis pedidos</a>',
     '<a routerLink="/carrito" data-testid="footer-link-cart">Mis pedidos</a>'),
    ('<a routerLink="/tienda">Ir a la tienda</a>',
     '<a routerLink="/tienda" data-testid="footer-link-shop">Ir a la tienda</a>'),
    ('<a routerLink="/contact">Términos y condiciones</a>',
     '<a routerLink="/contact" data-testid="footer-link-terms">Términos y condiciones</a>'),
    ('<a routerLink="/contact">Política de privacidad</a>',
     '<a routerLink="/contact" data-testid="footer-link-privacy">Política de privacidad</a>'),
    ('<a routerLink="/contact">Compra con tarjeta de crédito</a>',
     '<a routerLink="/contact" data-testid="footer-link-credit">Compra con tarjeta de crédito</a>'),
    ('<a routerLink="/contact">Compra con tarjeta de débito</a>',
     '<a routerLink="/contact" data-testid="footer-link-debit">Compra con tarjeta de débito</a>'),
]

for old, new in replacements:
    if old in html:
        html = html.replace(old, new)
    else:
        print(f'WARN: not found in footer: {old[:60]}...')

footer.write_text(html)
print('OK footer.component.html')

# cart-drawer.component.html
cart = Path('src/app/shared/components/cart-drawer/cart-drawer.component.html')
html = cart.read_text()

replacements = [
    ('<button class="cart-drawer__backdrop" type="button" (click)="close()" aria-label="Cerrar carrito"></button>',
     '<button class="cart-drawer__backdrop" type="button" (click)="close()" aria-label="Cerrar carrito" data-testid="cart-drawer-backdrop"></button>'),
    ('<button class="cart-drawer__close" type="button" (click)="close()">Cerrar</button>',
     '<button class="cart-drawer__close" type="button" (click)="close()" data-testid="cart-drawer-close">Cerrar</button>'),
    ('<a routerLink="/tienda" (click)="close()">Ir a la tienda</a>',
     '<a routerLink="/tienda" (click)="close()" data-testid="cart-empty-shop-link">Ir a la tienda</a>'),
    ('<button class="cdd-item__remove" type="button" (click)="remove(item.id)">Eliminar</button>',
     '<button class="cdd-item__remove" type="button" (click)="remove(item.id)" data-testid="cart-remove-item">Eliminar</button>'),
    ('<a class="button-primary" routerLink="/carrito" (click)="close()">Ver carrito</a>',
     '<a class="button-primary" routerLink="/carrito" (click)="close()" data-testid="cart-view-cart-link">Ver carrito</a>'),
    ('<button class="button-secondary" type="button" (click)="clear()">Vaciar carrito</button>',
     '<button class="button-secondary" type="button" (click)="clear()" data-testid="cart-clear-btn">Vaciar carrito</button>'),
]

for old, new in replacements:
    if old in html:
        html = html.replace(old, new)
    else:
        print(f'WARN: not found in cart-drawer: {old[:60]}...')

cart.write_text(html)
print('OK cart-drawer.component.html')
print('Done!')
