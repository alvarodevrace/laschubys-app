import { Component, inject, input, model, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { BlogComment } from '../../../core/models/content.model';
import { ContentService } from '../../../core/services/content.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-comments',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent],
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
          <form [formGroup]="commentForm" (ngSubmit)="submit()" class="grid gap-4">
            <textarea
              formControlName="body"
              rows="4"
              placeholder="Escribe algo digno de Iris y Rubi..."
              class="w-full p-4 rounded-2xl border border-gray-200 resize-y min-h-[132px] bg-gray-50"
              data-testid="comment-textarea"
            ></textarea>

            @if (error()) {
              <p class="m-0 leading-relaxed text-red-700">{{ error() }}</p>
            }

            @if (success()) {
              <p class="m-0 leading-relaxed text-green-700">{{ success() }}</p>
            }

            <app-button
              type="submit"
              size="md"
              [disabled]="pending() || commentForm.invalid"
              data-testid="comment-submit-btn"
            >
              {{ pending() ? 'Enviando...' : 'Publicar comentario' }}
            </app-button>
          </form>
        }
      </div>
    </section>
  `,
})
export class CommentsComponent {
  readonly auth = inject(AuthService);
  private readonly content = inject(ContentService);
  private readonly fb = inject(FormBuilder);

  readonly slug = input.required<string>();
  readonly comments = model<BlogComment[]>([]);

  protected readonly commentForm = this.fb.nonNullable.group({
    body: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
  });
  protected readonly pending = signal(false);
  protected readonly error = signal('');
  protected readonly success = signal('');

  protected async submit() {
    if (this.commentForm.invalid) {
      return;
    }

    const body = this.commentForm.value.body!.trim();

    this.pending.set(true);
    this.error.set('');
    this.success.set('');

    try {
      const comment = await this.content.addComment(this.slug(), body);
      this.comments.set([comment, ...this.comments()]);
      this.commentForm.reset();
      this.success.set('Comentario publicado.');
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No se pudo publicar el comentario.');
    } finally {
      this.pending.set(false);
    }
  }
}
