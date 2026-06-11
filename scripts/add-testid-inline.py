from pathlib import Path

# checkout.component.ts
checkout = Path('src/app/features/checkout/checkout.component.ts')
content = checkout.read_text()

replacements = [
    ('<form class="checkout-form" (ngSubmit)="submit()">', '<form class="checkout-form" (ngSubmit)="submit()" data-testid="checkout-form">'),
    ('<input [(ngModel)]="form.name" name="name" required />', '<input [(ngModel)]="form.name" name="name" required data-testid="checkout-input-name" />'),
    ('<input [(ngModel)]="form.phone" name="phone" required />', '<input [(ngModel)]="form.phone" name="phone" required data-testid="checkout-input-phone" />'),
    ('<input [(ngModel)]="form.email" name="email" type="email" required />', '<input [(ngModel)]="form.email" name="email" type="email" required data-testid="checkout-input-email" />'),
    ('<select [(ngModel)]="form.province" name="province" required>', '<select [(ngModel)]="form.province" name="province" required data-testid="checkout-input-province">'),
    ('<textarea [(ngModel)]="form.address" name="address" rows="4" required></textarea>', '<textarea [(ngModel)]="form.address" name="address" rows="4" required data-testid="checkout-input-address"></textarea>'),
    ('<button class="button-primary" type="submit" [disabled]="pending() || !isValid()">', '<button class="button-primary" type="submit" [disabled]="pending() || !isValid()" data-testid="checkout-submit-btn">'),
    ('<a class="button-primary" routerLink="/tienda">Ir a tienda</a>', '<a class="button-primary" routerLink="/tienda" data-testid="checkout-empty-shop-link">Ir a tienda</a>'),
]

for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
    else:
        print(f'WARN checkout: {old[:60]}...')

checkout.write_text(content)
print('OK checkout.component.ts')

# auth-login.component.ts
auth = Path('src/app/features/auth/auth-login.component.ts')
content = auth.read_text()

replacements = [
    ('<button class="button-primary" type="button" [disabled]="busy()" (click)="login()">', '<button class="button-primary" type="button" [disabled]="busy()" (click)="login()" data-testid="auth-login-google-btn">'),
]

for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
    else:
        print(f'WARN auth-login: {old[:60]}...')

auth.write_text(content)
print('OK auth-login.component.ts')

# tienda.component.ts
tienda = Path('src/app/features/tienda/tienda.component.ts')
content = tienda.read_text()

replacements = [
    ('<button\n              type="button"\n              class="filter-pill"\n              [class.is-active]="audience() === \'all\'"\n              (click)="audience.set(\'all\')"\n            >\n              Todo\n            </button>', '<button\n              type="button"\n              class="filter-pill"\n              [class.is-active]="audience() === \'all\'"\n              (click)="audience.set(\'all\')"\n              data-testid="tienda-filter-all"\n            >\n              Todo\n            </button>'),
    ('<button\n              type="button"\n              class="filter-pill"\n              [class.is-active]="audience() === \'michis\'"\n              (click)="audience.set(\'michis\')"\n            >\n              Para Michis\n            </button>', '<button\n              type="button"\n              class="filter-pill"\n              [class.is-active]="audience() === \'michis\'"\n              (click)="audience.set(\'michis\')"\n              data-testid="tienda-filter-michis"\n            >\n              Para Michis\n            </button>'),
    ('<button\n              type="button"\n              class="filter-pill"\n              [class.is-active]="audience() === \'michi-lovers\'"\n              (click)="audience.set(\'michi-lovers\')"\n            >\n              Michi Lovers\n            </button>', '<button\n              type="button"\n              class="filter-pill"\n              [class.is-active]="audience() === \'michi-lovers\'"\n              (click)="audience.set(\'michi-lovers\')"\n              data-testid="tienda-filter-michi-lovers"\n            >\n              Michi Lovers\n            </button>'),
    ('<input\n              [ngModel]="query()"\n              (ngModelChange)="query.set($event)"\n              type="search"\n              placeholder="Buscar por nombre o idea..."\n            />', '<input\n              [ngModel]="query()"\n              (ngModelChange)="query.set($event)"\n              type="search"\n              placeholder="Buscar por nombre o idea..."\n              data-testid="tienda-search-input"\n            />'),
    ('<button class="button-secondary" type="button" (click)="openPreview(product)">\n                    Ver\n                  </button>', '<button class="button-secondary" type="button" (click)="openPreview(product)" data-testid="tienda-preview-btn">\n                    Ver\n                  </button>'),
    ('<button class="button-primary" type="button" (click)="addToCart(product)">\n                      Agregar\n                    </button>', '<button class="button-primary" type="button" (click)="addToCart(product)" data-testid="tienda-add-to-cart-btn">\n                      Agregar\n                    </button>'),
    ('<a\n                      class="button-primary"\n                      [href]="product.affiliateUrl"\n                      target="_blank"\n                      rel="noreferrer"\n                      >Comprar</a', '<a\n                      class="button-primary"\n                      [href]="product.affiliateUrl"\n                      target="_blank"\n                      rel="noreferrer"\n                      data-testid="tienda-affiliate-link"\n                      >Comprar</a'),
    ('<button class="button-primary" type="button" (click)="addToCart(product)">\n                Agregar al carrito\n              </button>', '<button class="button-primary" type="button" (click)="addToCart(product)" data-testid="tienda-modal-add-cart">\n                Agregar al carrito\n              </button>'),
    ('<a\n                  class="button-secondary"\n                  [href]="product.affiliateUrl"\n                  target="_blank"\n                  rel="noreferrer"\n                  >Ir al enlace</a', '<a\n                  class="button-secondary"\n                  [href]="product.affiliateUrl"\n                  target="_blank"\n                  rel="noreferrer"\n                  data-testid="tienda-modal-affiliate"\n                  >Ir al enlace</a'),
    ('<div class="modal-shell" (click)="closePreview()">', '<div class="modal-shell" (click)="closePreview()" data-testid="tienda-modal-backdrop">'),
]

for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
    else:
        print(f'WARN tienda: {old[:60]}...')

tienda.write_text(content)
print('OK tienda.component.ts')
print('Done!')
