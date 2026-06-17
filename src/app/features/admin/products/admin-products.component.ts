import { Component, ChangeDetectionStrategy, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { AdminService, AdminProduct } from '../../../core/services/admin.service';
import { ContentService } from '../../../core/services/content.service';
import { Category } from '../../../core/models/content.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900">Productos</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ products().length }} productos en total</p>
      </div>
      <a
        routerLink="new"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange text-white text-sm font-bold hover:bg-orange-dark transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-4 h-4"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Nuevo producto
      </a>
    </div>

    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <div
          class="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
    } @else if (error()) {
      <div class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
        {{ error() }}
      </div>
    } @else if (!products().length) {
      <div class="text-center py-20 text-gray-400">
        <p class="text-lg font-semibold">Sin productos aún</p>
        <p class="text-sm mt-1">Agrega el primer producto de la tienda</p>
      </div>
    } @else {
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th
                class="text-left px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-gray-500"
              >
                Producto
              </th>
              <th
                class="text-left px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-gray-500 hidden sm:table-cell"
              >
                Precio
              </th>
              <th
                class="text-left px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-gray-500 hidden md:table-cell"
              >
                Categoría
              </th>
              <th
                class="text-left px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-gray-500 hidden md:table-cell"
              >
                Origen
              </th>
              <th
                class="text-left px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-gray-500 hidden md:table-cell"
              >
                Tipo
              </th>
              <th
                class="text-left px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-gray-500 hidden lg:table-cell"
              >
                Tag
              </th>
              <th
                class="text-left px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-gray-500 hidden sm:table-cell"
              >
                Estado
              </th>
              <th
                class="text-right px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-gray-500"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            @for (product of products(); track product.id) {
              <tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    @if (product.images?.length) {
                      <img
                        [src]="product.images![0]"
                        [alt]="product.name"
                        class="w-10 h-10 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                      />
                    } @else {
                      <div
                        class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.5"
                          class="w-5 h-5 text-gray-400"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    }
                    <div>
                      <p class="font-semibold text-gray-900 line-clamp-1">{{ product.name }}</p>
                      @if (product.copy) {
                        <p class="text-xs text-gray-400 mt-0.5 line-clamp-1">{{ product.copy }}</p>
                      }
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 hidden sm:table-cell">
                  <span class="font-bold text-gray-900">{{
                    product.price | currency: 'USD' : 'symbol' : '1.2-2'
                  }}</span>
                </td>
                <td class="px-4 py-4 hidden md:table-cell">
                  <span class="text-gray-600 text-xs font-medium">
                    {{ categoryName(product.category_id) }}
                  </span>
                </td>
                <td class="px-4 py-4 hidden md:table-cell">
                  @if (product.source === 'owned') {
                    <span
                      class="inline-flex px-2 py-0.5 rounded-lg bg-orange/10 text-orange text-xs font-bold"
                      >Propio</span
                    >
                  } @else {
                    <span
                      class="inline-flex px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold"
                      >Afiliado</span
                    >
                  }
                </td>
                <td class="px-4 py-4 hidden md:table-cell">
                  @if (product.product_type === 'physical') {
                    <span
                      class="inline-flex px-2 py-0.5 rounded-lg bg-green-100 text-green-700 text-xs font-bold"
                      >Físico</span
                    >
                  } @else if (product.product_type === 'link') {
                    <span
                      class="inline-flex px-2 py-0.5 rounded-lg bg-purple-50 text-purple-600 text-xs font-bold"
                      >Enlace</span
                    >
                  } @else {
                    <span class="text-gray-400 text-xs">—</span>
                  }
                </td>
                <td class="px-4 py-4 text-gray-500 text-xs hidden lg:table-cell">
                  {{ product.tag || '—' }}
                </td>
                <td class="px-4 py-4 hidden sm:table-cell">
                  @if (product.active) {
                    <span
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-50 text-green-700 text-xs font-bold"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>Activo
                    </span>
                  } @else {
                    <span
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500 text-xs font-bold"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>Inactivo
                    </span>
                  }
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-1">
                    @if (product.affiliate_url) {
                      <a
                        [href]="product.affiliate_url"
                        target="_blank"
                        title="Ver producto"
                        class="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-4 h-4"
                        >
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    }
                    <a
                      [routerLink]="[product.id, 'edit']"
                      title="Editar"
                      class="p-2 rounded-lg text-gray-400 hover:text-orange hover:bg-orange/10 transition-colors"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-4 h-4"
                      >
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </a>
                    <button
                      (click)="confirmDelete(product)"
                      title="Eliminar"
                      class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-4 h-4"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <!-- Modal confirm delete -->
    @if (deleting()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      >
        <div class="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
          <h3 class="font-extrabold text-gray-900 text-lg mb-2">¿Eliminar producto?</h3>
          <p class="text-gray-600 text-sm mb-6">
            <strong>{{ deleting()!.name }}</strong> se eliminará permanentemente.
          </p>
          <div class="flex gap-3">
            <button
              (click)="deleting.set(null)"
              class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              (click)="doDelete()"
              [disabled]="deleteLoading()"
              class="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ deleteLoading() ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    }
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
  }

  protected async doDelete() {
    const product = this.deleting();
    if (!product) return;
    this.deleteLoading.set(true);
    try {
      await this.admin.deleteProduct(product.id);
      this.products.update((list) => list.filter((p) => p.id !== product.id));
      this.deleting.set(null);
    } catch (e: any) {
      alert(e.message ?? 'Error eliminando');
    } finally {
      this.deleteLoading.set(false);
    }
  }
}
