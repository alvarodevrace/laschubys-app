import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgClass],
  template: `
    <div
      class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          role="alert"
          class="pointer-events-auto animate-slide-up rounded-2xl px-5 py-4 shadow-2xl border backdrop-blur-md max-w-sm transition-all duration-300"
          [ngClass]="{
            'bg-emerald-50 border-emerald-200 text-emerald-800': toast.type === 'success',
            'bg-red-50 border-red-200 text-red-800': toast.type === 'error',
            'bg-sky-50 border-sky-200 text-sky-800': toast.type === 'info',
          }"
        >
          <div class="flex items-start gap-3">
            <span class="mt-0.5 text-lg leading-none">
              @switch (toast.type) {
                @case ('success') {
                  ✓
                }
                @case ('error') {
                  ✕
                }
                @case ('info') {
                  ℹ
                }
              }
            </span>
            <p class="text-sm font-medium flex-1">{{ toast.message }}</p>
            <button
              type="button"
              (click)="toastService.dismiss(toast.id)"
              class="text-current/60 hover:text-current transition-colors text-lg leading-none -mr-1"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);
}
