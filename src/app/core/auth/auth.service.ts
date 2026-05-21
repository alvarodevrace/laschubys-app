import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, computed, inject, Injectable, signal } from '@angular/core';

import { environment } from '../config/environment';
import { AuthMeResponse, AuthUser } from '../models/auth.model';
import { ApiService } from '../services/api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _user = signal<AuthUser | null>(null);
  private readonly _loading = signal(true);
  private initPromise: Promise<void> | null = null;

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAdmin = computed(() => this._user()?.role === 'admin');
  readonly isLoggedIn = computed(() => !!this._user());

  async initSession() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.runInitSession();
    await this.initPromise;
  }

  private async runInitSession() {
    if (!isPlatformBrowser(this.platformId)) {
      this._loading.set(false);
      return;
    }

    try {
      const response = await this.api.get<AuthMeResponse>(`${environment.apiUrl}/auth/me`);
      this._user.set(response.user);
    } catch {
      this._user.set(null);
    } finally {
      this._loading.set(false);
    }
  }

  async loginWithGoogle(next = '/blog') {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this._loading.set(true);

    const target = new URL(`${environment.apiUrl}/auth/google`, window.location.origin);
    target.searchParams.set('next', this.normalizeNextPath(next));
    target.searchParams.set('origin', window.location.origin);
    window.location.assign(target.toString());
  }

  async logout() {
    try {
      await this.api.get(`${environment.apiUrl}/auth/logout`);
    } catch {}

    this._user.set(null);
    this._loading.set(false);
  }
  private normalizeNextPath(value: string | null | undefined) {
    if (!value || !value.startsWith('/') || value.startsWith('//')) {
      return '/blog';
    }

    return value;
  }
}
