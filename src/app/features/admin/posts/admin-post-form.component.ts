import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideX } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTextarea } from '@spartan-ng/helm/textarea';

import { AdminService, AdminPost } from '../../../core/services/admin.service';
import { ImageUploaderComponent } from '../shared/image-uploader.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-post-form',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    HlmAlertImports,
    HlmButton,
    HlmIconImports,
    HlmInput,
    HlmLabel,
    HlmSpinnerImports,
    HlmTextarea,
    ImageUploaderComponent,
  ],
  providers: [provideIcons({ lucideChevronLeft, lucideX })],
  template: `
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <a routerLink="/admin/posts" hlmBtn variant="ghost" size="icon-sm">
          <ng-icon hlmIcon name="lucideChevronLeft" />
        </a>
        <div>
          <p class="text-xs font-extrabold uppercase tracking-widest text-primary">Blog</p>
          <h1 class="text-2xl font-extrabold text-foreground">
            {{ isEdit() ? 'Editar post' : 'Nuevo post' }}
          </h1>
        </div>
      </div>

      @if (loadingPost()) {
        <div class="flex items-center justify-center py-20">
          <hlm-spinner />
        </div>
      } @else {
        <form (ngSubmit)="submit()" #f="ngForm" class="space-y-5">
          <!-- Título -->
          <div class="grid gap-1.5">
            <label hlmLabel for="post-title">Título *</label>
            <input
              hlmInput
              id="post-title"
              name="title"
              [(ngModel)]="form.title"
              required
              placeholder="El título del artículo"
            />
          </div>

          <!-- Slug -->
          <div class="grid gap-1.5">
            <label hlmLabel for="post-slug">Slug *</label>
            <input
              hlmInput
              id="post-slug"
              name="slug"
              [(ngModel)]="form.slug"
              required
              placeholder="mi-articulo-del-blog"
              class="font-mono"
            />
            <p class="text-xs text-muted-foreground">Solo letras minúsculas, números y guiones</p>
          </div>

          <!-- Categoría + Autor -->
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-1.5">
              <label hlmLabel for="post-category">Categoría</label>
              <input
                hlmInput
                id="post-category"
                name="category"
                [(ngModel)]="form.category"
                placeholder="Blog, Salud, Tips..."
              />
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="post-author">Autor *</label>
              <input
                hlmInput
                id="post-author"
                name="author"
                [(ngModel)]="form.author"
                required
                placeholder="Nombre del autor"
              />
            </div>
          </div>

          <!-- Resumen -->
          <div class="grid gap-1.5">
            <label hlmLabel for="post-excerpt">Resumen (excerpt)</label>
            <textarea
              hlmTextarea
              id="post-excerpt"
              name="excerpt"
              [(ngModel)]="form.excerpt"
              rows="2"
              placeholder="Descripción corta del artículo..."
            ></textarea>
          </div>

          <!-- Imagen portada + Tiempo lectura -->
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-1.5">
              <label hlmLabel>Imagen portada</label>
              <app-image-uploader
                [images]="coverImageArray()"
                [multiple]="false"
                (imagesChange)="onCoverChange($event)"
              >
              </app-image-uploader>
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="post-read-time">Tiempo de lectura</label>
              <input
                hlmInput
                id="post-read-time"
                name="read_time"
                [(ngModel)]="form.read_time"
                placeholder="5 min"
              />
            </div>
          </div>

          <!-- Fecha publicación -->
          <div class="grid gap-1.5">
            <label hlmLabel for="post-published">Fecha publicación</label>
            <input
              hlmInput
              id="post-published"
              name="published_at"
              type="datetime-local"
              [(ngModel)]="form.published_at"
            />
            <p class="text-xs text-muted-foreground">Dejar vacío para guardar como borrador</p>
          </div>

          <!-- Contenido (párrafos) -->
          <div class="grid gap-1.5">
            <div class="flex items-center justify-between">
              <label hlmLabel>Contenido</label>
              <button type="button" hlmBtn variant="ghost" size="sm" (click)="addParagraph()">
                + Añadir párrafo
              </button>
            </div>
            <div class="space-y-2">
              @for (p of form.content; track $index) {
                <div class="flex gap-2">
                  <textarea
                    hlmTextarea
                    [id]="'post-content-' + $index"
                    [name]="'content_' + $index"
                    [(ngModel)]="form.content[$index]"
                    rows="3"
                    [placeholder]="'Párrafo ' + ($index + 1)"
                    class="flex-1"
                  ></textarea>
                  <button
                    type="button"
                    hlmBtn
                    variant="ghost"
                    size="icon-sm"
                    (click)="removeParagraph($index)"
                    class="self-start text-muted-foreground hover:text-red-500"
                  >
                    <ng-icon hlmIcon name="lucideX" />
                  </button>
                </div>
              }
              @if (!form.content.length) {
                <p class="text-sm text-muted-foreground py-2">
                  Sin párrafos. Haz clic en "+ Añadir párrafo"
                </p>
              }
            </div>
          </div>

          <!-- Error -->
          @if (error()) {
            <div hlmAlert variant="destructive">
              <div hlmAlertDescription>{{ error() }}</div>
            </div>
          }

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <a routerLink="/admin/posts" hlmBtn variant="outline" class="flex-1">Cancelar</a>
            <button type="submit" hlmBtn class="flex-1" [disabled]="saving() || f.invalid">
              {{ saving() ? 'Guardando...' : isEdit() ? 'Guardar cambios' : 'Crear post' }}
            </button>
          </div>
        </form>
      }
    </div>
  `,
})
export class AdminPostFormComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isEdit = signal(false);
  protected readonly loadingPost = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected form: Partial<AdminPost> & { content: string[] } = {
    title: '',
    slug: '',
    author: 'Mamá de Las Chubys',
    category: '',
    excerpt: '',
    cover_image: '',
    read_time: '',
    published_at: '',
    content: [],
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.loadPost(id);
    }
  }

  private async loadPost(id: string) {
    this.loadingPost.set(true);
    try {
      const post = await this.admin.getPost(id);
      this.form = {
        ...post,
        content: post.content ?? [],
        published_at: post.published_at ? post.published_at.slice(0, 16) : '',
      };
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.loadingPost.set(false);
    }
  }

  protected coverImageArray() {
    return this.form.cover_image ? [this.form.cover_image] : [];
  }

  protected onCoverChange(urls: string[]) {
    this.form.cover_image = urls[urls.length - 1] ?? null;
  }

  protected addParagraph() {
    this.form.content = [...(this.form.content ?? []), ''];
  }

  protected removeParagraph(i: number) {
    this.form.content = this.form.content.filter((_, idx) => idx !== i);
  }

  protected async submit() {
    if (this.saving()) return;
    this.saving.set(true);
    this.error.set(null);
    try {
      const routeId = this.route.snapshot.paramMap.get('id');
      const {
        id: _id,
        created_at: _ca,
        updated_at: _ua,
        indexado_google: _ig,
        indexado_google_at: _iga,
        ...rest
      } = this.form as any;
      const payload = {
        ...rest,
        content: this.form.content.filter((p: string) => p.trim()),
        published_at: this.form.published_at || null,
      };
      if (this.isEdit() && routeId) {
        await this.admin.updatePost(routeId, payload);
      } else {
        await this.admin.createPost(payload);
      }
      await this.router.navigate(['/admin/posts']);
    } catch (e: any) {
      this.error.set(e.message ?? 'Error guardando');
    } finally {
      this.saving.set(false);
    }
  }
}
