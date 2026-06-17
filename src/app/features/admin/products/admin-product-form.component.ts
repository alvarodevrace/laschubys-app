import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  resource,
} from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminProduct } from '../../../core/services/admin.service';
import { ContentService } from '../../../core/services/content.service';
import { Category } from '../../../core/models/content.model';
import { ImageUploaderComponent } from '../shared/image-uploader.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [FormsModule, RouterLink, ImageUploaderComponent],
  template: `
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <a
          routerLink="/admin/products"
          class="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-5 h-5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </a>
        <div>
          <p class="text-xs font-extrabold uppercase tracking-widest text-orange">Productos</p>
          <h1 class="text-2xl font-extrabold text-gray-900">
            {{ isEdit() ? 'Editar producto' : 'Nuevo producto' }}
          </h1>
        </div>
      </div>

      @if (loadingProduct()) {
        <div class="flex items-center justify-center py-20">
          <div
            class="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin"
          ></div>
        </div>
      } @else {
        <form (ngSubmit)="submit()" #f="ngForm" class="space-y-5">
          <!-- Nombre -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
              >Nombre *</label
            >
            <input
              name="name"
              [(ngModel)]="form.name"
              required
              (blur)="autoSlug()"
              placeholder="Nombre del producto"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
            />
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
              >Slug</label
            >
            <input
              name="slug"
              [(ngModel)]="form.slug"
              placeholder="limpiador-dental-50-unidades"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
            />
            <p class="mt-1 text-xs text-gray-400">Se genera automáticamente desde el nombre.</p>
          </div>

          <!-- Precio + Source -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                >Precio *</label
              >
              <div class="relative">
                <span
                  class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold"
                  >$</span
                >
                <input
                  name="price"
                  [(ngModel)]="form.price"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                >Origen *</label
              >
              <select
                name="source"
                [(ngModel)]="form.source"
                required
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
              >
                <option value="owned">Propio</option>
                <option value="affiliate">Afiliado</option>
              </select>
            </div>
          </div>

          <!-- Categoría + Tipo producto -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                >Categoría</label
              >
              <select
                name="category_id"
                [(ngModel)]="form.category_id"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
              >
                <option value="">Sin categoría</option>
                @for (category of categoriesResource.value() ?? []; track category.id) {
                  <option [value]="category.id">{{ category.name }}</option>
                }
              </select>
              @if (categoriesResource.error()) {
                <p class="mt-1 text-xs text-red-600">No se pudieron cargar las categorías.</p>
              }
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                >Tipo de producto</label
              >
              <select
                name="product_type"
                [(ngModel)]="form.product_type"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
              >
                <option [ngValue]="null">Sin tipo</option>
                <option value="physical">Físico</option>
                <option value="link">Enlace externo</option>
              </select>
            </div>
          </div>

          <!-- Copy (tagline) -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
              >Tagline (copy)</label
            >
            <input
              name="copy"
              [(ngModel)]="form.copy"
              placeholder="Frase corta de venta"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
            />
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
              >Descripción</label
            >
            <textarea
              name="description"
              [(ngModel)]="form.description"
              rows="3"
              placeholder="Descripción detallada del producto..."
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
            ></textarea>
          </div>

          <!-- Detalle del producto -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
              >Detalle del producto</label
            >
            <textarea
              name="details"
              [(ngModel)]="form.details"
              rows="4"
              placeholder="Descripción larga del producto..."
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
            ></textarea>
          </div>

          <!-- Especificaciones -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
              >Especificaciones</label
            >
            <textarea
              name="specifications"
              [(ngModel)]="form.specifications"
              rows="4"
              placeholder="Ejemplo: Peso: 2kg&#10;Color: Azul"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
            ></textarea>
          </div>

          <!-- Tag + Nota envío -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                >Tag / etiqueta</label
              >
              <input
                name="tag"
                [(ngModel)]="form.tag"
                placeholder="Nuevo, Popular, Oferta..."
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                >Nota de envío</label
              >
              <input
                name="shipping_note"
                [(ngModel)]="form.shipping_note"
                placeholder="Envío gratis, 2-3 días..."
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
              />
            </div>
          </div>

          <!-- URL afiliado (solo si tipo afiliado) -->
          @if (form.source === 'affiliate') {
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                >URL de afiliado</label
              >
              <input
                name="affiliate_url"
                [(ngModel)]="form.affiliate_url"
                placeholder="https://..."
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
              />
            </div>
          }

          <!-- Imágenes -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
              >Imágenes</label
            >
            <app-image-uploader
              [images]="form.images"
              [multiple]="true"
              (imagesChange)="form.images = $event"
            >
            </app-image-uploader>
          </div>

          <!-- Activo -->
          <div class="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="active" [(ngModel)]="form.active" class="sr-only peer" />
              <div
                class="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow after:transition-all peer-checked:after:translate-x-4"
              ></div>
            </label>
            <div>
              <p class="text-sm font-semibold text-gray-700">Producto activo</p>
              <p class="text-xs text-gray-400">Visible en la tienda</p>
            </div>
          </div>

          <!-- Error -->
          @if (error()) {
            <div class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {{ error() }}
            </div>
          }

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <a
              routerLink="/admin/products"
              class="flex-1 text-center px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </a>
            <button
              type="submit"
              [disabled]="saving() || f.invalid"
              class="flex-1 px-5 py-3 rounded-xl bg-orange text-white text-sm font-bold hover:bg-orange-dark transition-colors disabled:opacity-50"
            >
              {{ saving() ? 'Guardando...' : isEdit() ? 'Guardar cambios' : 'Crear producto' }}
            </button>
          </div>
        </form>
      }
    </div>
  `,
})
export class AdminProductFormComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isEdit = signal(false);
  protected readonly loadingProduct = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly categoriesResource = resource({
    loader: async () => this.content.getCategories(),
  });
  protected form: Partial<AdminProduct> & { images: string[] } = {
    name: '',
    slug: '',
    price: 0,
    source: 'owned',
    category_id: '',
    product_type: null,
    copy: '',
    description: '',
    details: null,
    specifications: null,
    tag: '',
    shipping_note: '',
    affiliate_url: '',
    active: true,
    images: [],
  };

  protected autoSlug() {
    const name = this.form.name;
    if (!name || this.form.slug) return;
    this.form.slug = String(name)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.loadProduct(id);
    }
  }

  private async loadProduct(id: string) {
    this.loadingProduct.set(true);
    try {
      const product = await this.admin.getProduct(id);
      this.form = { ...product, images: product.images ?? [] };
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.loadingProduct.set(false);
    }
  }

  protected async submit() {
    if (this.saving()) return;
    this.saving.set(true);
    this.error.set(null);
    try {
      const routeId = this.route.snapshot.paramMap.get('id');
      const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = this.form as any;
      const payload: Partial<AdminProduct> = {
        ...rest,
        price: Number(this.form.price),
        category_id: this.form.category_id || null,
        product_type: this.form.product_type || null,
        slug: this.form.slug?.trim() || undefined,
      };
      if (this.isEdit() && routeId) {
        await this.admin.updateProduct(routeId, payload);
      } else {
        await this.admin.createProduct(payload);
      }
      this.router.navigate(['/admin/products']);
    } catch (e: any) {
      this.error.set(e.message ?? 'Error guardando');
    } finally {
      this.saving.set(false);
    }
  }
}
