import { Component, inject, input, model, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

import { AuthService } from '../../../core/auth/auth.service';
import { BlogComment } from '../../../core/models/content.model';
import { ContentService } from '../../../core/services/content.service';
import { StaggerChildrenDirective } from '../../../shared/animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-comments',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    StaggerChildrenDirective,
    HlmButtonImports,
    HlmCardImports,
    HlmTextareaImports,
    HlmAlertImports,
  ],
  template: `
    <section class="grid gap-6 mt-12">
      <div class="flex justify-between items-center gap-4">
        <h2 class="m-0">Comentarios</h2>
        <span>{{ comments().length }}</span>
      </div>

      <div class="grid gap-4" appStaggerChildren [staggerDelay]="0.08" childSelector="hlm-card">
        @if (comments().length === 0) {
          <p class="m-0 leading-relaxed">Todavía no hay comentarios públicos en este post.</p>
        } @else {
          @for (comment of comments(); track comment.id ?? comment.date) {
            <hlm-card size="sm">
              <div hlmCardContent class="py-4">
                <div class="flex justify-between gap-4 mb-1.5 text-muted-foreground text-sm">
                  <strong>{{ comment.author }}</strong>
                  <span>{{ comment.date }}</span>
                </div>
                <p class="m-0 leading-relaxed">{{ comment.body }}</p>
              </div>
            </hlm-card>
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
              hlmTextarea
              formControlName="body"
              rows="4"
              placeholder="Escribe algo digno de Iris y Rubi..."
              data-testid="comment-textarea"
            ></textarea>

            @if (error()) {
              <div hlmAlert variant="destructive">
                <p hlmAlertDescription>{{ error() }}</p>
              </div>
            }

            @if (success()) {
              <div hlmAlert>
                <p hlmAlertDescription>{{ success() }}</p>
              </div>
            }

            <button
              hlmBtn
              type="submit"
              [disabled]="pending() || commentForm.invalid"
              data-testid="comment-submit-btn"
            >
              {{ pending() ? 'Enviando...' : 'Publicar comentario' }}
            </button>
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
