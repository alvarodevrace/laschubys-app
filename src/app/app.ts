import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { environment } from './core/config/environment';
import { UnderConstructionComponent } from './features/static/under-construction.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UnderConstructionComponent],
  template: `
    @if (showUnderConstruction) {
      <app-under-construction />
    } @else {
      <router-outlet />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly showUnderConstruction =
    environment.underConstruction && this.document.location.pathname !== '/linktree';

  throwTestError(): void {
    throw new Error('Sentry Test Error — laschubys-app');
  }
}
