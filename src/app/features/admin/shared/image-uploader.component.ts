import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideUpload, lucideX } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { environment } from '../../../core/config/environment';
import { ApiService } from '../../../core/services/api.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-image-uploader',
  standalone: true,
  providers: [provideIcons({ lucideUpload, lucideX })],
  imports: [HlmButton, HlmCard, HlmIconImports, HlmSpinnerImports],
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
                class="w-20 h-20 object-cover rounded-xl border border-border"
              />
              <button
                type="button"
                hlmBtn
                variant="destructive"
                size="icon-xs"
                (click)="remove(url)"
                class="absolute -top-1.5 -right-1.5"
              >
                <ng-icon hlmIcon name="lucideX" class="w-3 h-3" />
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
          hlmCard
          class="flex items-center gap-3 px-4 py-3 border-2 border-dashed transition-colors cursor-pointer"
          [class]="
            uploading()
              ? 'border-primary/40 bg-primary/5'
              : 'border-border hover:border-primary/40 hover:bg-primary/5'
          "
        >
          @if (uploading()) {
            <hlm-spinner class="w-5 h-5" />
            <span class="text-sm text-primary font-semibold"
              >Subiendo
              {{ uploadingCount() > 1 ? uploadingCount() + ' imágenes' : 'imagen' }}...</span
            >
          } @else {
            <ng-icon
              hlmIcon
              name="lucideUpload"
              class="w-5 h-5 text-muted-foreground flex-shrink-0"
            />
            <div>
              <p class="text-sm font-semibold text-muted-foreground">
                {{ images.length ? 'Añadir más imágenes' : 'Seleccionar imágenes' }}
              </p>
              <p class="text-xs text-muted-foreground">JPG, PNG, WebP, GIF · máx. 5 MB c/u</p>
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
