import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminPost } from '../../../core/services/admin.service';
import { ImageUploaderComponent } from '../shared/image-uploader.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-post-form',
  standalone: true,
  imports: [FormsModule, RouterLink, ImageUploaderComponent],
  template: `
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <a
          routerLink="/admin/posts"
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
          <p class="text-xs font-extrabold uppercase tracking-widest text-orange">Blog</p>
          <h1 class="text-2xl font-extrabold text-gray-900">
            {{ isEdit() ? 'Editar post' : 'Nuevo post' }}
          </h1>
        </div>
      </div>

      @if (loadingPost()) {
        <div class="flex items-center justify-center py-20">
          <div
            class="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin"
          ></div>
        </div>
      } @else {
        <form (ngSubmit)="submit()" #f="ngForm" class="space-y-5">
          <!-- Título -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
              >Título *</label
            >
            <input
              name="title"
              [(ngModel)]="form.title"
              required
              placeholder="El título del artículo"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
            />
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
              >Slug *</label
            >
            <input
              name="slug"
              [(ngModel)]="form.slug"
              required
              placeholder="mi-articulo-del-blog"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
            />
            <p class="text-xs text-gray-400 mt-1">Solo letras minúsculas, números y guiones</p>
          </div>

          <!-- Categoría + Autor -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                >Categoría</label
              >
              <input
                name="category"
                [(ngModel)]="form.category"
                placeholder="Blog, Salud, Tips..."
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                >Autor *</label
              >
              <input
                name="author"
                [(ngModel)]="form.author"
                required
                placeholder="Nombre del autor"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
              />
            </div>
          </div>

          <!-- Resumen -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
              >Resumen (excerpt)</label
            >
            <textarea
              name="excerpt"
              [(ngModel)]="form.excerpt"
              rows="2"
              placeholder="Descripción corta del artículo..."
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
            ></textarea>
          </div>

          <!-- Imagen portada + Tiempo lectura -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                >Imagen portada</label
              >
              <app-image-uploader
                [images]="coverImageArray()"
                [multiple]="false"
                (imagesChange)="onCoverChange($event)"
              >
              </app-image-uploader>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                >Tiempo de lectura</label
              >
              <input
                name="read_time"
                [(ngModel)]="form.read_time"
                placeholder="5 min"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
              />
            </div>
          </div>

          <!-- Fecha publicación -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
              >Fecha publicación</label
            >
            <input
              name="published_at"
              type="datetime-local"
              [(ngModel)]="form.published_at"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
            />
            <p class="text-xs text-gray-400 mt-1">Dejar vacío para guardar como borrador</p>
          </div>

          <!-- Contenido (párrafos) -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-bold uppercase tracking-wide text-gray-500"
                >Contenido</label
              >
              <button
                type="button"
                (click)="addParagraph()"
                class="text-xs text-orange font-bold hover:underline"
              >
                + Añadir párrafo
              </button>
            </div>
            <div class="space-y-2">
              @for (p of form.content; track $index) {
                <div class="flex gap-2">
                  <textarea
                    [name]="'content_' + $index"
                    [(ngModel)]="form.content[$index]"
                    rows="3"
                    [placeholder]="'Párrafo ' + ($index + 1)"
                    class="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                  ></textarea>
                  <button
                    type="button"
                    (click)="removeParagraph($index)"
                    class="p-2 self-start rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
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
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              }
              @if (!form.content.length) {
                <p class="text-sm text-gray-400 py-2">
                  Sin párrafos. Haz clic en "+ Añadir párrafo"
                </p>
              }
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
              routerLink="/admin/posts"
              class="flex-1 text-center px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </a>
            <button
              type="submit"
              [disabled]="saving() || f.invalid"
              class="flex-1 px-5 py-3 rounded-xl bg-orange text-white text-sm font-bold hover:bg-orange-dark transition-colors disabled:opacity-50"
            >
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
      this.router.navigate(['/admin/posts']);
    } catch (e: any) {
      this.error.set(e.message ?? 'Error guardando');
    } finally {
      this.saving.set(false);
    }
  }
}
