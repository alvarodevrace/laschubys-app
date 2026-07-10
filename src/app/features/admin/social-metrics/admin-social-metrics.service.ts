import { inject, Injectable } from '@angular/core';

import { environment } from '../../../core/config/environment';
import { ApiService } from '../../../core/services/api.service';
import {
  SocialMetric,
  SocialMetricCreateDto,
  SocialMetricHistoryResponse,
  SocialMetricListResponse,
  SocialMetricQuery,
  SocialMetricSnapshotItem,
  SocialMetricUpdateDto,
} from './social-metric.model';

const BASE = `${environment.apiUrl}/admin/social-metrics`;

@Injectable({ providedIn: 'root' })
export class AdminSocialMetricsService {
  private readonly api = inject(ApiService);

  getMetrics(query: SocialMetricQuery): Promise<SocialMetricListResponse> {
    const params = new URLSearchParams();
    if (query.platform) params.set('platform', query.platform);
    if (query.metricType) params.set('metricType', query.metricType);
    if (query.from) params.set('from', query.from);
    if (query.to) params.set('to', query.to);
    params.set('limit', String(query.limit ?? 20));
    params.set('offset', String(query.offset ?? 0));
    const qs = params.toString();
    return this.api.get<SocialMetricListResponse>(`${BASE}${qs ? `?${qs}` : ''}`, 10000);
  }

  getSnapshot(): Promise<SocialMetricSnapshotItem[]> {
    return this.api.get<SocialMetricSnapshotItem[]>(`${BASE}/snapshot`, 10000);
  }

  getHistory(): Promise<SocialMetricHistoryResponse> {
    return this.api.get<SocialMetricHistoryResponse>(`${BASE}/history`, 15000);
  }

  createMetric(dto: SocialMetricCreateDto): Promise<SocialMetric> {
    return this.api.post<SocialMetric>(BASE, dto, 15000);
  }

  updateMetric(id: string, dto: SocialMetricUpdateDto): Promise<SocialMetric> {
    return this.api.patch<SocialMetric>(`${BASE}/${id}`, dto, 15000);
  }

  deleteMetric(id: string): Promise<{ success: boolean }> {
    return this.api.delete<{ success: boolean }>(`${BASE}/${id}`, 15000);
  }
}
