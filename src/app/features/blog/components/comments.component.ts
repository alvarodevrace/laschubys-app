import { Component, inject, input, model, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { BlogComment } from '../../../core/models/content.model';
import { ContentService } from '../../../core/services/content.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-comments',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="comments">
      <div class="comments__head">
        <h2>Comentarios</h2>
        <span>{{ comments().length }}</span>
      </div>

      <div class="comments__list">
        @if (comments().length === 0) {
          <p class="comments__empty">Todavía no hay comentarios públicos en este post.</p>
        } @else {
          @for (comment of comments(); track comment.id ?? comment.date) {
            <article class="comment-card">
              <div class="comment-card__meta">
                <strong>{{ comment.author }}</strong>
                <span>{{ comment.date }}</span>
              </div>
              <p>{{ comment.body }}</p>
            </article>
          }
        }
      </div>

      <div class="comments__composer">
        <h3>Deja tu comentario</h3>

        @if (!auth.isLoggedIn()) {
          <p class="comments__auth-copy">
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
          ></textarea>

          @if (error()) {
            <p class="comments__error">{{ error() }}</p>
          }

          @if (success()) {
            <p class="comments__success">{{ success() }}</p>
          }

          <button
            class="button-primary"
            type="button"
            [disabled]="pending() || !hasDraft()"
            (click)="submit()"
          >
            {{ pending() ? 'Enviando...' : 'Publicar comentario' }}
          </button>
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
