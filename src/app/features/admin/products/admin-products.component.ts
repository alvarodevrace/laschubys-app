import { Component, ChangeDetectionStrategy, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import {
  lucideAlertCircle,
  lucideExternalLink,
  lucideImage,
  lucidePencil,
  lucidePlus,
  lucideTrash2,
} from '@ng-icons/lucide';

import { HlmButton } from '@spartan-ng/helm/button';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

import { AdminService, AdminProduct } from '../../../core/services/admin.service';
import { ContentService } from '../../../core/services/content.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    HlmButton,
    HlmBadge,
    HlmDialogImports,
    HlmIconImports,
    HlmSpinner,
    HlmTableImports,
    HlmAlertImports,
  ],
  providers: [
    provideIcons({
      lucideAlertCircle,
      lucideExternalLink,
      lucideImage,
      lucidePencil,
      lucidePlus,
      lucideTrash2,
    }),
  ],
  template: `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-extrabold text-foreground">Productos</h1>
        <p class="text-sm text-muted-foreground mt-0.5">
          {{ products().length }} productos en total
        </p>
      </div>
      <a hlmBtn routerLink="new">
        <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
        Nuevo producto
      </a>
    </div>

    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <hlm-spinner />
      </div>
    } @else if (error()) {
      <div hlmAlert variant="destructive" class="mb-6">
        <ng-icon hlmIcon name="lucideAlertCircle" class="w-4 h-4" />
        <h4 hlmAlertTitle>Error</h4>
        <p hlmAlertDescription>{{ error() }}</p>
      </div>
    } @else if (!products().length) {
      <div class="text-center py-20 text-muted-foreground">
        <p class="text-lg font-semibold">Sin productos aún</p>
        <p class="text-sm mt-1">Agrega el primer producto de la tienda</p>
      </div>
    } @else {
      <div class="bg-white rounded-2xl border border-border overflow-hidden">
        <table hlmTable>
          <thead hlmTableHeader>
            <tr hlmTableRow>
              <th hlmTableHead>Producto</th>
              <th hlmTableHead class="hidden sm:table-cell">Precio</th>
              <th hlmTableHead class="hidden md:table-cell">Categoría</th>
              <th hlmTableHead class="hidden md:table-cell">Origen</th>
              <th hlmTableHead class="hidden md:table-cell">Tipo</th>
              <th hlmTableHead class="hidden lg:table-cell">Tag</th>
              <th hlmTableHead class="hidden sm:table-cell">Estado</th>
              <th hlmTableHead class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody hlmTableBody>
            @for (product of products(); track product.id) {
              <tr hlmTableRow>
                <td hlmTableCell>
                  <div class="flex items-center gap-3">
                    @if (product.images?.length) {
                      <img
                        [src]="product.images![0]"
                        [alt]="product.name"
                        class="w-10 h-10 rounded-xl object-cover border border-border flex-shrink-0"
                      />
                    } @else {
                      <div
                        class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"
                      >
                        <ng-icon hlmIcon name="lucideImage" class="w-5 h-5 text-muted-foreground" />
                      </div>
                    }
                    <div>
                      <p class="font-semibold text-foreground line-clamp-1">{{ product.name }}</p>
                      @if (product.copy) {
                        <p class="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {{ product.copy }}
                        </p>
                      }
                    </div>
                  </div>
                </td>
                <td hlmTableCell class="hidden sm:table-cell">
                  <span class="font-bold text-foreground">{{
                    product.price | currency: 'USD' : 'symbol' : '1.2-2'
                  }}</span>
                </td>
                <td hlmTableCell class="hidden md:table-cell">
                  <span class="text-muted-foreground text-xs font-medium">
                    {{ categoryName(product.category_id) }}
                  </span>
                </td>
                <td hlmTableCell class="hidden md:table-cell">
                  @if (product.source === 'owned') {
                    <span hlmBadge variant="secondary">Propio</span>
                  } @else {
                    <span hlmBadge variant="outline">Afiliado</span>
                  }
                </td>
                <td hlmTableCell class="hidden md:table-cell">
                  @if (product.product_type === 'physical') {
                    <span hlmBadge variant="secondary">Físico</span>
                  } @else if (product.product_type === 'link') {
                    <span hlmBadge variant="outline">Enlace</span>
                  } @else {
                    <span class="text-muted-foreground text-xs">—</span>
                  }
                </td>
                <td hlmTableCell class="text-muted-foreground text-xs hidden lg:table-cell">
                  {{ product.tag || '—' }}
                </td>
                <td hlmTableCell class="hidden sm:table-cell">
                  @if (product.active) {
                    <span hlmBadge variant="default">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>Activo
                    </span>
                  } @else {
                    <span hlmBadge variant="secondary">
                      <span class="w-1.5 h-1.5 rounded-full bg-muted"></span>Inactivo
                    </span>
                  }
                </td>
                <td hlmTableCell>
                  <div class="flex items-center justify-end gap-1">
                    @if (product.affiliate_url) {
                      <a
                        [href]="product.affiliate_url"
                        target="_blank"
                        title="Ver producto"
                        hlmBtn
                        variant="ghost"
                        size="icon-sm"
                      >
                        <ng-icon hlmIcon name="lucideExternalLink" class="w-4 h-4" />
                      </a>
                    }
                    <a
                      [routerLink]="[product.id, 'edit']"
                      title="Editar"
                      hlmBtn
                      variant="ghost"
                      size="icon-sm"
                    >
                      <ng-icon hlmIcon name="lucidePencil" class="w-4 h-4" />
                    </a>
                    <button
                      (click)="confirmDelete(product)"
                      title="Eliminar"
                      hlmBtn
                      variant="ghost"
                      size="icon-sm"
                    >
                      <ng-icon hlmIcon name="lucideTrash2" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <!-- Dialog confirm delete -->
    <hlm-dialog
      [state]="dialogOpen() ? 'open' : 'closed'"
      (stateChanged)="onDialogStateChange($event)"
    >
      <hlm-dialog-content *hlmDialogPortal [showCloseButton]="false">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>¿Eliminar producto?</h3>
          <p hlmDialogDescription>
            <strong>{{ deleting()?.name }}</strong> se eliminará permanentemente.
          </p>
        </hlm-dialog-header>
        <hlm-dialog-footer>
          <button hlmBtn variant="outline" (click)="closeDialog()">Cancelar</button>
          <button hlmBtn variant="destructive" (click)="doDelete()" [disabled]="deleteLoading()">
            {{ deleteLoading() ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class AdminProductsComponent {
  private readonly admin = inject(AdminService);
  private readonly content = inject(ContentService);

  protected readonly products = signal<AdminProduct[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly deleting = signal<AdminProduct | null>(null);
  protected readonly deleteLoading = signal(false);
  protected readonly dialogOpen = signal(false);
  protected readonly categoriesResource = resource({
    loader: async () => this.content.getCategories(),
  });

  constructor() {
    this.load();
  }

  protected categoryName(categoryId: string | null | undefined): string {
    if (!categoryId) return '—';
    const category = this.categoriesResource.value()?.find((c) => c.id === categoryId);
    return category?.name ?? '—';
  }

  private async load() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.admin.getProducts();
      this.products.set(data);
    } catch (e: any) {
      this.error.set(e.message ?? 'Error cargando productos');
    } finally {
      this.loading.set(false);
    }
  }

  protected confirmDelete(product: AdminProduct) {
    this.deleting.set(product);
    this.dialogOpen.set(true);
  }

  protected closeDialog() {
    this.dialogOpen.set(false);
  }

  protected onDialogStateChange(state: string) {
    this.dialogOpen.set(state === 'open');
    if (state !== 'open') {
      this.deleting.set(null);
    }
  }

  protected async doDelete() {
    const product = this.deleting();
    if (!product) return;
    if (this.deleteLoading()) return;
    this.deleteLoading.set(true);
    try {
      await this.admin.deleteProduct(product.id);
      this.products.update((list) => list.filter((p) => p.id !== product.id));
      this.dialogOpen.set(false);
    } catch (e: any) {
      alert(e.message ?? 'Error eliminando');
    } finally {
      this.deleteLoading.set(false);
    }
  }
}
