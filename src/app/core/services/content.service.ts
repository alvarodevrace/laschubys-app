import { inject, Injectable } from '@angular/core';

import { environment } from '../config/environment';
import { ApiService } from './api.service';
import { BlogComment, BlogPost, Category, ProductPick } from '../models/content.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly api = inject(ApiService);

  async getPosts(limit?: number) {
    const suffix = limit ? `?limit=${limit}` : '';
    return this.api.get<BlogPost[]>(`${environment.apiUrl}/content/posts${suffix}`);
  }

  async getPost(slug: string) {
    return this.api.get<BlogPost | null>(`${environment.apiUrl}/content/posts/${slug}`);
  }

  async getCategories() {
    return this.api.get<Category[]>(`${environment.apiUrl}/content/categories`);
  }

  async getProducts(filters?: {
    category?: string;
    type?: 'physical' | 'link';
    audience?: 'michis' | 'michi-lovers';
    search?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.type) params.set('type', filters.type);
    if (filters?.audience) params.set('audience', filters.audience);
    if (filters?.search?.trim()) params.set('search', filters.search.trim());
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.api.get<ProductPick[]>(`${environment.apiUrl}/content/products${query}`);
  }

  async getProduct(slug: string) {
    return this.api.get<ProductPick | null>(`${environment.apiUrl}/content/products/${slug}`);
  }

  async addComment(slug: string, body: string) {
    const response = await this.api.post<{ ok: boolean; comment: BlogComment }>(
      `${environment.apiUrl}/comments`,
      { slug, body },
    );

    return response.comment;
  }
}
