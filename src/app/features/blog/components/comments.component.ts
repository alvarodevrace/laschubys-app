import { Component, inject, input, model, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { BlogComment } from '../../../core/models/content.model';
import { ContentService } from '../../../core/services/content.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-comments',
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent],
  template: `
    <section class="grid gap-6 mt-12">
      <div class="flex justify-between items-center gap-4">
        <h2 class="m-0">Comentarios</h2>
        <span>{{ comments().length }}</span>
      </div>

      <div class="grid gap-4">
        @if (comments().length === 0) {
          <p class="m-0 leading-relaxed">Todavía no hay comentarios públicos en este post.</p>
        } @else {
          @for (comment of comments(); track comment.id ?? comment.date) {
            <article class="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <div class="flex justify-between gap-4 mb-1.5 text-gray-500 text-sm">
                <strong>{{ comment.author }}</strong>
                <span>{{ comment.date }}</span>
              </div>
              <p class="m-0 leading-relaxed">{{ comment.body }}</p>
            </article>
          }
        }
      </div>

      <div class="grid gap-4">
        <h3 class="m-0">Deja tu comentario</h3>

        @if (!auth.isLoggedIn()) {
          <p class="m-0 leading-relaxed">
            Necesitas sesión para comentar.
            <a [routerLink]="['/auth/login']" [queryParams]="{ redirect: '/blog/' + slug() }"
              >Inicia aquí</a
            >.
          </p>
        } @else {
          <textarea
            [(ngModel)]="draft"
            rows="4"
            placeholder="Escribe algo digno de Iris y Rubi..."
            class="w-full p-4 rounded-2xl border border-gray-200 resize-y min-h-[132px] bg-gray-50"
          ></textarea>

          @if (error()) {
            <p class="m-0 leading-relaxed text-red-700">{{ error() }}</p>
          }

          @if (success()) {
            <p class="m-0 leading-relaxed text-green-700">{{ success() }}</p>
          }

          <app-button
            type="button"
            size="md"
            [disabled]="pending() || !hasDraft()"
            (click)="submit()"
          >
            {{ pending() ? 'Enviando...' : 'Publicar comentario' }}
          </app-button>
        }
      </div>
    </section>
  `,
})
export class CommentsComponent {
  readonly auth = inject(AuthService);
  private readonly content = inject(ContentService);

  readonly slug = input.required<string>();
  readonly comments = model<BlogComment[]>([]);

  protected draft = '';
  protected readonly pending = signal(false);
  protected readonly error = signal('');
  protected readonly success = signal('');

  protected async submit() {
    const body = this.draft.trim();

    if (!body) {
      return;
    }

    this.pending.set(true);
    this.error.set('');
    this.success.set('');

    try {
      const comment = await this.content.addComment(this.slug(), body);
      this.comments.set([comment, ...this.comments()]);
      this.draft = '';
      this.success.set('Comentario publicado.');
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No se pudo publicar el comentario.');
    } finally {
      this.pending.set(false);
    }
  }

  protected hasDraft() {
    return this.draft.trim().length > 0;
  }
}
