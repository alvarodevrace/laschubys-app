import { Component, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { BlogComment } from '../../../core/models/content.model';
import { ContentService } from '../../../core/services/content.service';

@Component({
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
  styles: [
    `
      .comments {
        display: grid;
        gap: 1.5rem;
        margin-top: 3rem;
      }

      .comments__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .comments__head h2,
      .comments__composer h3 {
        margin: 0;
      }

      .comments__list,
      .comments__composer {
        display: grid;
        gap: 1rem;
      }

      .comment-card {
        padding: 1rem 1.1rem;
        border-radius: 20px;
        background: var(--gray-50);
        border: 1px solid var(--border);
      }

      .comment-card__meta {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.6rem;
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .comment-card p,
      .comments__empty,
      .comments__auth-copy,
      .comments__error,
      .comments__success {
        margin: 0;
        line-height: 1.6;
      }

      textarea {
        width: 100%;
        padding: 1rem;
        border-radius: 18px;
        border: 1px solid var(--border);
        resize: vertical;
        min-height: 132px;
        background: var(--gray-50);
      }

      .comments__error {
        color: #a33212;
      }

      .comments__success {
        color: #216d3d;
      }
    `,
  ],
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
