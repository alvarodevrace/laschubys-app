import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
} from '@angular/core';
import { environment } from '../../../core/config/environment';
import { ApiService } from '../../../core/services/api.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-image-uploader',
  standalone: true,
  template: `
    <div class="space-y-3">
      <!-- Thumbnails de imágenes ya subidas -->
      @if (images.length) {
        <div class="flex flex-wrap gap-2">
          @for (url of images; track url) {
            <div class="relative group">
              <img
                [src]="url"
                alt="Imagen"
                class="w-20 h-20 object-cover rounded-xl border border-gray-200"
              />
              <button
                type="button"
                (click)="remove(url)"
                class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-3 h-3"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          }
        </div>
      }

      <!-- Drop zone / Selector de archivo -->
      <label class="block cursor-pointer">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          [multiple]="multiple"
          (change)="onFiles($event)"
          class="sr-only"
          [disabled]="uploading()"
        />
        <div
          class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed transition-colors"
          [class]="
            uploading()
              ? 'border-orange/40 bg-orange/5'
              : 'border-gray-200 hover:border-orange/40 hover:bg-orange/5'
          "
        >
          @if (uploading()) {
            <div
              class="w-5 h-5 border-2 border-orange border-t-transparent rounded-full animate-spin flex-shrink-0"
            ></div>
            <span class="text-sm text-orange font-semibold"
              >Subiendo
              {{ uploadingCount() > 1 ? uploadingCount() + ' imágenes' : 'imagen' }}...</span
            >
          } @else {
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5 text-gray-400 flex-shrink-0"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <div>
              <p class="text-sm font-semibold text-gray-700">
                {{ images.length ? 'Añadir más imágenes' : 'Seleccionar imágenes' }}
              </p>
              <p class="text-xs text-gray-400">JPG, PNG, WebP, GIF · máx. 5 MB c/u</p>
            </div>
          }
        </div>
      </label>

      @if (error()) {
        <p class="text-xs text-red-600">{{ error() }}</p>
      }
    </div>
  `,
})
export class ImageUploaderComponent {
  @Input() images: string[] = [];
  @Input() multiple = true;
  @Output() imagesChange = new EventEmitter<string[]>();

  private readonly api = inject(ApiService);
  protected readonly uploading = signal(false);
  protected readonly uploadingCount = signal(0);
  protected readonly error = signal<string | null>(null);

  protected remove(url: string) {
    this.imagesChange.emit(this.images.filter((u) => u !== url));
  }

  protected async onFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;

    input.value = '';
    this.error.set(null);
    this.uploading.set(true);
    this.uploadingCount.set(files.length);

    const uploaded: string[] = [];
    for (const file of files) {
      try {
        const form = new FormData();
        form.append('file', file);
        const res = await this.api.postForm<{ url: string }>(
          `${environment.apiUrl}/admin/upload`,
          form,
        );
        uploaded.push(res.url);
      } catch (e: any) {
        this.error.set(e.message ?? 'Error subiendo imagen');
      }
    }

    if (uploaded.length) {
      this.imagesChange.emit([...this.images, ...uploaded]);
    }

    this.uploading.set(false);
    this.uploadingCount.set(0);
  }
}
