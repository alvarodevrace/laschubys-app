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
import { provideIcons } from '@ng-icons/core';
import { lucideAlertCircle, lucideArrowLeft } from '@ng-icons/lucide';

import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import {
  HlmSelect,
  HlmSelectContent,
  HlmSelectItem,
  HlmSelectTrigger,
  HlmSelectValue,
} from '@spartan-ng/helm/select';
import { HlmSwitch } from '@spartan-ng/helm/switch';

import { AdminService, AdminProduct } from '../../../core/services/admin.service';
import { ContentService } from '../../../core/services/content.service';
import { ImageUploaderComponent } from '../shared/image-uploader.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    HlmAlertImports,
    HlmButton,
    HlmIconImports,
    HlmInput,
    HlmLabel,
    HlmSpinner,
    HlmTextarea,
    HlmSelect,
    HlmSelectTrigger,
    HlmSelectValue,
    HlmSelectContent,
    HlmSelectItem,
    HlmSwitch,
    ImageUploaderComponent,
  ],
  providers: [provideIcons({ lucideAlertCircle, lucideArrowLeft })],
  template: `
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <a routerLink="/admin/products" hlmBtn variant="ghost" size="icon-sm">
          <ng-icon hlmIcon name="lucideArrowLeft" class="w-5 h-5" />
        </a>
        <div>
          <p class="text-xs font-extrabold uppercase tracking-widest text-primary">Productos</p>
          <h1 class="text-2xl font-extrabold text-foreground">
            {{ isEdit() ? 'Editar producto' : 'Nuevo producto' }}
          </h1>
        </div>
      </div>

      @if (loadingProduct()) {
        <div class="flex items-center justify-center py-20">
          <hlm-spinner />
        </div>
      } @else {
        <form (ngSubmit)="submit()" #f="ngForm" class="space-y-5">
          <!-- Nombre -->
          <div class="grid gap-1.5">
            <label hlmLabel for="product-name">Nombre *</label>
            <input
              hlmInput
              id="product-name"
              name="name"
              [(ngModel)]="form.name"
              required
              (blur)="autoSlug()"
              placeholder="Nombre del producto"
            />
          </div>

          <!-- Slug -->
          <div class="grid gap-1.5">
            <label hlmLabel for="product-slug">Slug</label>
            <input
              hlmInput
              id="product-slug"
              name="slug"
              [(ngModel)]="form.slug"
              placeholder="limpiador-dental-50-unidades"
            />
            <p class="text-xs text-muted-foreground">Se genera automáticamente desde el nombre.</p>
          </div>

          <!-- Precio + Source -->
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-1.5">
              <label hlmLabel for="product-price">Precio *</label>
              <div class="relative">
                <span
                  class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold"
                  >$</span
                >
                <input
                  hlmInput
                  id="product-price"
                  name="price"
                  [(ngModel)]="form.price"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  class="pl-8"
                />
              </div>
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="product-source">Origen *</label>
              <hlm-select id="product-source" name="source" [(ngModel)]="form.source" required>
                <hlm-select-trigger>
                  <hlm-select-value placeholder="Selecciona origen"></hlm-select-value>
                </hlm-select-trigger>
                <hlm-select-content>
                  <hlm-select-item value="owned">Propio</hlm-select-item>
                  <hlm-select-item value="affiliate">Afiliado</hlm-select-item>
                </hlm-select-content>
              </hlm-select>
            </div>
          </div>

          <!-- Categoría + Tipo producto -->
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-1.5">
              <label hlmLabel for="product-category">Categoría</label>
              <hlm-select id="product-category" name="category_id" [(ngModel)]="form.category_id">
                <hlm-select-trigger>
                  <hlm-select-value placeholder="Sin categoría"></hlm-select-value>
                </hlm-select-trigger>
                <hlm-select-content>
                  <hlm-select-item value="">Sin categoría</hlm-select-item>
                  @for (category of categoriesResource.value() ?? []; track category.id) {
                    <hlm-select-item [value]="category.id">{{ category.name }}</hlm-select-item>
                  }
                </hlm-select-content>
              </hlm-select>
              @if (categoriesResource.error()) {
                <p class="text-xs text-red-600">No se pudieron cargar las categorías.</p>
              }
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="product-type">Tipo de producto</label>
              <hlm-select id="product-type" name="product_type" [(ngModel)]="form.product_type">
                <hlm-select-trigger>
                  <hlm-select-value placeholder="Sin tipo"></hlm-select-value>
                </hlm-select-trigger>
                <hlm-select-content>
                  <hlm-select-item [value]="null">Sin tipo</hlm-select-item>
                  <hlm-select-item value="physical">Físico</hlm-select-item>
                  <hlm-select-item value="link">Enlace externo</hlm-select-item>
                </hlm-select-content>
              </hlm-select>
            </div>
          </div>

          <!-- Copy (tagline) -->
          <div class="grid gap-1.5">
            <label hlmLabel for="product-copy">Tagline (copy)</label>
            <input
              hlmInput
              id="product-copy"
              name="copy"
              [(ngModel)]="form.copy"
              placeholder="Frase corta de venta"
            />
          </div>

          <!-- Descripción -->
          <div class="grid gap-1.5">
            <label hlmLabel for="product-description">Descripción</label>
            <textarea
              hlmTextarea
              id="product-description"
              name="description"
              [(ngModel)]="form.description"
              rows="3"
              placeholder="Descripción detallada del producto..."
            ></textarea>
          </div>

          <!-- Detalle del producto -->
          <div class="grid gap-1.5">
            <label hlmLabel for="product-details">Detalle del producto</label>
            <textarea
              hlmTextarea
              id="product-details"
              name="details"
              [(ngModel)]="form.details"
              rows="4"
              placeholder="Descripción larga del producto..."
            ></textarea>
          </div>

          <!-- Especificaciones -->
          <div class="grid gap-1.5">
            <label hlmLabel for="product-specifications">Especificaciones</label>
            <textarea
              hlmTextarea
              id="product-specifications"
              name="specifications"
              [(ngModel)]="form.specifications"
              rows="4"
              placeholder="Ejemplo: Peso: 2kg&#10;Color: Azul"
            ></textarea>
          </div>

          <!-- Tag + Nota envío -->
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-1.5">
              <label hlmLabel for="product-tag">Tag / etiqueta</label>
              <input
                hlmInput
                id="product-tag"
                name="tag"
                [(ngModel)]="form.tag"
                placeholder="Nuevo, Popular, Oferta..."
              />
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="product-shipping">Nota de envío</label>
              <input
                hlmInput
                id="product-shipping"
                name="shipping_note"
                [(ngModel)]="form.shipping_note"
                placeholder="Envío gratis, 2-3 días..."
              />
            </div>
          </div>

          <!-- URL afiliado (solo si tipo afiliado) -->
          @if (form.source === 'affiliate') {
            <div class="grid gap-1.5">
              <label hlmLabel for="product-affiliate">URL de afiliado</label>
              <input
                hlmInput
                id="product-affiliate"
                name="affiliate_url"
                [(ngModel)]="form.affiliate_url"
                placeholder="https://..."
              />
            </div>
          }

          <!-- Imágenes -->
          <div class="grid gap-1.5">
            <label hlmLabel>Imágenes</label>
            <app-image-uploader
              [images]="form.images"
              [multiple]="true"
              (imagesChange)="form.images = $event"
            >
            </app-image-uploader>
          </div>

          <!-- Activo -->
          <div class="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
            <hlm-switch id="product-active" name="active" [(ngModel)]="form.active"></hlm-switch>
            <div>
              <p class="text-sm font-semibold text-muted-foreground">Producto activo</p>
              <p class="text-xs text-muted-foreground">Visible en la tienda</p>
            </div>
          </div>

          <!-- Error -->
          @if (error()) {
            <div hlmAlert variant="destructive">
              <ng-icon hlmIcon name="lucideAlertCircle" class="w-4 h-4" />
              <h4 hlmAlertTitle>Error</h4>
              <p hlmAlertDescription>{{ error() }}</p>
            </div>
          }

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <a routerLink="/admin/products" hlmBtn variant="outline" class="flex-1">Cancelar</a>
            <button type="submit" hlmBtn class="flex-1" [disabled]="saving() || f.invalid">
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
      await this.router.navigate(['/admin/products']);
    } catch (e: any) {
      this.error.set(e.message ?? 'Error guardando');
    } finally {
      this.saving.set(false);
    }
  }
}
