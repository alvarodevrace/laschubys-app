import { inject, Injectable } from '@angular/core';

import { environment } from '../config/environment';
import { ApiService } from './api.service';
import { BlogComment, BlogPost, ProductPick } from '../models/content.model';

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

  async getProducts(filter?: ProductPick['audience']) {
    const products = await this.api.get<ProductPick[]>(`${environment.apiUrl}/content/products`);
    return filter ? products.filter((product) => product.audience === filter) : products;
  }

  async addComment(slug: string, body: string) {
    const response = await this.api.post<{ ok: boolean; comment: BlogComment }>(
      `${environment.apiUrl}/comments`,
      { slug, body }
    );

    return response.comment;
  }
}
