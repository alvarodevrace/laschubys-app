import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

export interface MediaKitConfigRecord {
  id: string;
  key: string;
  data: Record<string, unknown>;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class AdminMediaKitService {
  private readonly api = inject(ApiService);

  getConfig(): Promise<MediaKitConfigRecord[]> {
    return this.api.get<MediaKitConfigRecord[]>('/api/admin/media-kit', 10000);
  }

  updateConfig(key: string, data: Record<string, unknown>): Promise<MediaKitConfigRecord> {
    return this.api.put<MediaKitConfigRecord>('/api/admin/media-kit', { key, data }, 15000);
  }
}
