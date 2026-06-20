import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { lucideExternalLink, lucidePencil, lucidePlus, lucideTrash2 } from '@ng-icons/lucide';

import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';

import { AdminService, AdminPost } from '../../../core/services/admin.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-posts',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    HlmAlertImports,
    HlmButton,
    HlmBadge,
    HlmDialogImports,
    HlmIconImports,
    HlmSpinner,
    HlmTableImports,
  ],
  providers: [provideIcons({ lucideExternalLink, lucidePencil, lucidePlus, lucideTrash2 })],
  template: `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-extrabold text-foreground">Blog posts</h1>
        <p class="text-sm text-muted-foreground mt-0.5">{{ posts().length }} artículos en total</p>
      </div>
      <a hlmBtn routerLink="new">
        <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
        Nuevo post
      </a>
    </div>

    @if (loading()) {
      <div class="flex items-center justify-center py-20">
        <hlm-spinner />
      </div>
    } @else if (error()) {
      <div hlmAlert variant="destructive" class="mb-6">
        <ng-icon hlmIcon name="lucideAlertCircle" class="w-4 h-4" />
        <h4 hlmAlertTitle>Error</h4>
        <p hlmAlertDescription>{{ error() }}</p>
      </div>
    } @else if (!posts().length) {
      <div class="text-center py-20 text-muted-foreground">
        <p class="text-lg font-semibold">Sin posts aún</p>
        <p class="text-sm mt-1">Crea el primer artículo del blog</p>
      </div>
    } @else {
      <div class="bg-white rounded-2xl border border-border overflow-hidden">
        <table hlmTable>
          <thead hlmTableHeader>
            <tr hlmTableRow>
              <th hlmTableHead>Título</th>
              <th hlmTableHead class="hidden md:table-cell">Categoría</th>
              <th hlmTableHead class="hidden lg:table-cell">Autor</th>
              <th hlmTableHead class="hidden lg:table-cell">Publicado</th>
              <th hlmTableHead class="hidden sm:table-cell">Estado</th>
              <th hlmTableHead class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody hlmTableBody>
            @for (post of posts(); track post.id) {
              <tr hlmTableRow>
                <td hlmTableCell>
                  <p class="font-semibold text-foreground line-clamp-1">{{ post.title }}</p>
                  <p class="text-xs text-muted-foreground mt-0.5 font-mono">
                    /blog/{{ post.slug }}
                  </p>
                </td>
                <td hlmTableCell class="hidden md:table-cell">
                  <span hlmBadge variant="secondary">{{ post.category || '—' }}</span>
                </td>
                <td hlmTableCell class="text-muted-foreground hidden lg:table-cell">
                  {{ post.author }}
                </td>
                <td hlmTableCell class="text-muted-foreground hidden lg:table-cell text-xs">
                  {{ post.published_at ? (post.published_at | date: 'dd/MM/yy') : '—' }}
                </td>
                <td hlmTableCell class="hidden sm:table-cell">
                  @if (post.published_at) {
                    <span hlmBadge variant="default">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>Publicado
                    </span>
                  } @else {
                    <span hlmBadge variant="secondary">
                      <span class="w-1.5 h-1.5 rounded-full bg-muted"></span>Borrador
                    </span>
                  }
                </td>
                <td hlmTableCell>
                  <div class="flex items-center justify-end gap-1">
                    <a
                      [routerLink]="['/blog', post.slug]"
                      target="_blank"
                      title="Ver en el sitio"
                      hlmBtn
                      variant="ghost"
                      size="icon-sm"
                    >
                      <ng-icon hlmIcon name="lucideExternalLink" class="w-4 h-4" />
                    </a>
                    <a
                      [routerLink]="[post.id, 'edit']"
                      title="Editar"
                      hlmBtn
                      variant="ghost"
                      size="icon-sm"
                    >
                      <ng-icon hlmIcon name="lucidePencil" class="w-4 h-4" />
                    </a>
                    <button
                      (click)="confirmDelete(post)"
                      title="Eliminar"
                      hlmBtn
                      variant="ghost"
                      size="icon-sm"
                    >
                      <ng-icon hlmIcon name="lucideTrash2" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <!-- Dialog confirm delete -->
    <hlm-dialog
      [state]="dialogOpen() ? 'open' : 'closed'"
      (stateChanged)="onDialogStateChange($event)"
    >
      <hlm-dialog-content *hlmDialogPortal [showCloseButton]="false">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>¿Eliminar post?</h3>
          <p hlmDialogDescription>
            <strong>{{ deleting()?.title }}</strong> se eliminará permanentemente.
          </p>
        </hlm-dialog-header>
        <hlm-dialog-footer>
          <button hlmBtn variant="outline" (click)="closeDialog()">Cancelar</button>
          <button hlmBtn variant="destructive" (click)="doDelete()" [disabled]="deleteLoading()">
            {{ deleteLoading() ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class AdminPostsComponent {
  private readonly admin = inject(AdminService);

  protected readonly posts = signal<AdminPost[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly deleting = signal<AdminPost | null>(null);
  protected readonly deleteLoading = signal(false);
  protected readonly dialogOpen = signal(false);

  constructor() {
    this.load();
  }

  private async load() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.admin.getPosts();
      this.posts.set(data);
    } catch (e: any) {
      this.error.set(e.message ?? 'Error cargando posts');
    } finally {
      this.loading.set(false);
    }
  }

  protected confirmDelete(post: AdminPost) {
    this.deleting.set(post);
    this.dialogOpen.set(true);
  }

  protected closeDialog() {
    this.dialogOpen.set(false);
  }

  protected onDialogStateChange(state: string) {
    this.dialogOpen.set(state === 'open');
    if (state !== 'open') {
      this.deleting.set(null);
    }
  }

  protected async doDelete() {
    const post = this.deleting();
    if (!post) return;
    if (this.deleteLoading()) return;
    this.deleteLoading.set(true);
    try {
      await this.admin.deletePost(post.id);
      this.posts.update((list) => list.filter((p) => p.id !== post.id));
      this.dialogOpen.set(false);
    } catch (e: any) {
      alert(e.message ?? 'Error eliminando');
    } finally {
      this.deleteLoading.set(false);
    }
  }
}
