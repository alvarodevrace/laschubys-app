import { Injectable, inject } from '@angular/core';
import { environment } from '../config/environment';
import { ApiService } from './api.service';

export interface AdminPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string[] | null;
  category: string | null;
  read_time: string | null;
  cover_image: string | null;
  author: string;
  published_at: string | null;
  created_at: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  source: 'owned' | 'affiliate';
  tag: string | null;
  copy: string | null;
  description: string | null;
  images: string[] | null;
  affiliate_url: string | null;
  shipping_note: string | null;
  active: boolean;
  created_at: string;
}

const BASE = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiService);

  // ── Posts ──────────────────────────────────────────────
  getPosts() {
    return this.api.get<AdminPost[]>(`${BASE}/admin/posts`);
  }
  getPost(id: string) {
    return this.api.get<AdminPost>(`${BASE}/admin/posts/${id}`);
  }
  createPost(data: Partial<AdminPost>) {
    return this.api.post<AdminPost>(`${BASE}/admin/posts`, data);
  }
  updatePost(id: string, data: Partial<AdminPost>) {
    return this.api.put<AdminPost>(`${BASE}/admin/posts/${id}`, data);
  }
  deletePost(id: string) {
    return this.api.delete<{ success: boolean }>(`${BASE}/admin/posts/${id}`);
  }

  // ── Products ───────────────────────────────────────────
  getProducts() {
    return this.api.get<AdminProduct[]>(`${BASE}/admin/products`);
  }
  getProduct(id: string) {
    return this.api.get<AdminProduct>(`${BASE}/admin/products/${id}`);
  }
  createProduct(data: Partial<AdminProduct>) {
    return this.api.post<AdminProduct>(`${BASE}/admin/products`, data);
  }
  updateProduct(id: string, data: Partial<AdminProduct>) {
    return this.api.put<AdminProduct>(`${BASE}/admin/products/${id}`, data);
  }
  deleteProduct(id: string) {
    return this.api.delete<{ success: boolean }>(`${BASE}/admin/products/${id}`);
  }
}
