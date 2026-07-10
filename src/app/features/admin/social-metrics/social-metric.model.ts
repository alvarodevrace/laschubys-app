export interface SocialMetric {
  id: string;
  platform: string;
  accountId: string;
  metricType: string;
  valueNumeric: number | null;
  valueText: string | null;
  period: string | null;
  recordedAt: string;
  externalId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialMetricQuery {
  platform?: string;
  metricType?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

export interface SocialMetricListResponse {
  data: SocialMetric[];
  total: number;
  limit: number;
  offset: number;
}

export interface SocialMetricSnapshotItem {
  platform: string;
  accountId: string;
  metrics: Record<string, SocialMetric>;
  recordedAt?: string | null;
}

export interface SocialMetricHistoryPoint {
  recordedAt: string;
  value: number | null;
  valueText: string | null;
}

export interface SocialMetricHistoryGroup {
  platform: string;
  accountId: string;
  metricType: string;
  points: SocialMetricHistoryPoint[];
}

export interface SocialMetricHistoryResponse {
  data: SocialMetricHistoryGroup[];
}

export interface SocialMetricCreateDto {
  platform: string;
  accountId: string;
  metricType: string;
  valueNumeric: number | null;
  valueText: string | null;
  period: string | null;
  recordedAt: string;
  externalId: string | null;
  metadata: Record<string, unknown> | null;
}

export type SocialMetricUpdateDto = Partial<SocialMetricCreateDto>;

export const SOCIAL_PLATFORMS = ['instagram', 'tiktok', 'facebook'] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
};

export const SOCIAL_METRIC_TYPES = [
  'followers',
  'likes',
  'reach',
  'impressions',
  'engagement',
  'views',
  'comments',
  'shares',
  'saves',
  'profile_visits',
  'followers_growth',
  'other',
] as const;

export type SocialMetricType = (typeof SOCIAL_METRIC_TYPES)[number];
