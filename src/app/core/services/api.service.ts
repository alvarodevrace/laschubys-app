import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TimeoutError, catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { environment } from '../config/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  get<T>(url: string, waitMs = 8000) {
    const targetUrl = this.resolveUrl(url);
    return firstValueFrom(
      this.http.get<T>(targetUrl).pipe(
        timeout(waitMs),
        catchError((error) => this.handleError(error, targetUrl)),
      ),
    );
  }

  post<T>(url: string, body: unknown, waitMs = 15000) {
    const targetUrl = this.resolveUrl(url);
    return firstValueFrom(
      this.http.post<T>(targetUrl, body).pipe(
        timeout(waitMs),
        catchError((error) => this.handleError(error, targetUrl)),
      ),
    );
  }

  put<T>(url: string, body: unknown, waitMs = 15000) {
    const targetUrl = this.resolveUrl(url);
    return firstValueFrom(
      this.http.put<T>(targetUrl, body).pipe(
        timeout(waitMs),
        catchError((error) => this.handleError(error, targetUrl)),
      ),
    );
  }

  postForm<T>(url: string, body: FormData, waitMs = 30000) {
    const targetUrl = this.resolveUrl(url);
    return firstValueFrom(
      this.http.post<T>(targetUrl, body).pipe(
        timeout(waitMs),
        catchError((error) => this.handleError(error, targetUrl)),
      ),
    );
  }

  delete<T>(url: string, waitMs = 15000) {
    const targetUrl = this.resolveUrl(url);
    return firstValueFrom(
      this.http.delete<T>(targetUrl).pipe(
        timeout(waitMs),
        catchError((error) => this.handleError(error, targetUrl)),
      ),
    );
  }

  private resolveUrl(url: string) {
    if (isPlatformBrowser(this.platformId) || !url.startsWith('/api')) {
      return url;
    }

    return `${environment.apiServerUrl}${url.slice('/api'.length)}`;
  }

  private handleError(error: unknown, url: string) {
    if (error instanceof TimeoutError) {
      return throwError(() => new Error(`Timeout llamando ${url}`));
    }

    if (error instanceof HttpErrorResponse) {
      const serverMessage =
        typeof error.error === 'object' && error.error && 'message' in error.error
          ? String(error.error.message)
          : null;
      const message = serverMessage || error.message || `HTTP ${error.status} en ${url}`;
      return throwError(() => new Error(message));
    }

    const message = error instanceof Error ? error.message : `Error inesperado llamando ${url}`;
    return throwError(() => new Error(message));
  }
}
