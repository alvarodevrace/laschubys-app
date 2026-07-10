import { DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideAlertCircle,
  lucideFacebook,
  lucideInstagram,
  lucideMusic,
  lucidePencil,
  lucidePlus,
  lucideRefreshCw,
  lucideRefreshCcw,
  lucideTrash2,
  lucideTrendingUp,
  lucideUsers,
} from '@ng-icons/lucide';

import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmCard,
  HlmCardContent,
  HlmCardDescription,
  HlmCardHeader,
  HlmCardTitle,
} from '@spartan-ng/helm/card';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import {
  HlmSelect,
  HlmSelectContent,
  HlmSelectItem,
  HlmSelectTrigger,
  HlmSelectValue,
} from '@spartan-ng/helm/select';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';

import { AdminSocialMetricsService } from './admin-social-metrics.service';
import {
  SocialMetric,
  SocialMetricCreateDto,
  SocialMetricHistoryGroup,
  SocialMetricSnapshotItem,
  SocialMetricUpdateDto,
  SOCIAL_METRIC_TYPES,
  SOCIAL_PLATFORMS,
  SOCIAL_PLATFORM_LABELS,
  SocialPlatform,
} from './social-metric.model';
import {
  SocialMetricChartComponent,
  SocialMetricChartPoint,
} from './social-metric-chart.component';

type MetricFormKey =
  | 'platform'
  | 'accountId'
  | 'metricType'
  | 'valueNumeric'
  | 'valueText'
  | 'period'
  | 'recordedAt'
  | 'externalId'
  | 'metadata';

interface MetricForm {
  platform: string;
  accountId: string;
  metricType: string;
  valueNumeric: string;
  valueText: string;
  period: string;
  recordedAt: string;
  externalId: string;
  metadata: string;
}

const DEFAULT_LIMIT = 20;

const EMPTY_FORM: MetricForm = {
  platform: '',
  accountId: '',
  metricType: '',
  valueNumeric: '',
  valueText: '',
  period: '',
  recordedAt: '',
  externalId: '',
  metadata: '',
};

const PLATFORM_META: Record<SocialPlatform, { color: string; icon: string; ringClass: string }> = {
  instagram: { color: '#E1306C', icon: 'lucideInstagram', ringClass: 'ring-pink-500/20' },
  facebook: { color: '#1877F2', icon: 'lucideFacebook', ringClass: 'ring-blue-500/20' },
  tiktok: { color: '#ff0050', icon: 'lucideMusic', ringClass: 'ring-rose-500/20' },
};

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('es-EC').format(value);
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-social-metrics',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    DecimalPipe,
    HlmAlertImports,
    HlmBadgeImports,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmCardDescription,
    HlmCardHeader,
    HlmCardTitle,
    HlmDialogImports,
    HlmIconImports,
    HlmInput,
    HlmLabel,
    HlmSelect,
    HlmSelectTrigger,
    HlmSelectValue,
    HlmSelectContent,
    HlmSelectItem,
    HlmSkeletonImports,
    HlmSpinner,
    HlmTableImports,
    SocialMetricChartComponent,
  ],
  providers: [
    provideIcons({
      lucideActivity,
      lucideAlertCircle,
      lucideFacebook,
      lucideInstagram,
      lucideMusic,
      lucidePencil,
      lucidePlus,
      lucideRefreshCw,
      lucideRefreshCcw,
      lucideTrash2,
      lucideTrendingUp,
      lucideUsers,
    }),
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-foreground">Métricas sociales</h1>
          <p class="text-sm text-muted-foreground mt-0.5">
            {{ metricsResource.value()?.total ?? 0 }} métricas registradas
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            hlmBtn
            variant="outline"
            (click)="forceSync()"
            [disabled]="syncLoading()"
            type="button"
          >
            <ng-icon hlmIcon name="lucideRefreshCcw" class="w-4 h-4" />
            {{ syncLoading() ? 'Sincronizando...' : 'Forzar sincronización' }}
          </button>
          <button
            hlmBtn
            variant="outline"
            (click)="refresh()"
            [disabled]="
              metricsResource.isLoading() ||
              snapshotResource.isLoading() ||
              historyResource.isLoading()
            "
            type="button"
          >
            <ng-icon hlmIcon name="lucideRefreshCw" class="w-4 h-4" />
            Refrescar
          </button>
          <button hlmBtn (click)="openCreate()" type="button">
            <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
            Añadir métrica
          </button>
        </div>
      </div>

      @if (syncInfo()) {
        <div hlmAlert>
          <ng-icon hlmIcon name="lucideActivity" class="w-4 h-4" />
          <h4 hlmAlertTitle>Sincronización automática</h4>
          <p hlmAlertDescription>{{ syncInfo() }}</p>
        </div>
      }

      <!-- Summary cards -->
      @if (snapshotResource.isLoading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (skeleton of [1, 2, 3]; track skeleton) {
            <hlm-card hlmCard>
              <hlm-card-header hlmCardHeader>
                <hlm-skeleton class="h-5 w-28" />
                <hlm-skeleton class="h-4 w-20" />
              </hlm-card-header>
              <div hlmCardContent>
                <div class="grid grid-cols-2 gap-3">
                  <hlm-skeleton class="h-8 w-full" />
                  <hlm-skeleton class="h-8 w-full" />
                </div>
              </div>
            </hlm-card>
          }
        </div>
      } @else if (snapshotResource.error()) {
        <div hlmAlert variant="destructive">
          <ng-icon hlmIcon name="lucideAlertCircle" class="w-4 h-4" />
          <h4 hlmAlertTitle>Error cargando resumen</h4>
          <p hlmAlertDescription>{{ snapshotErrorMessage() }}</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (platform of platforms; track platform) {
            <hlm-card hlmCard class="overflow-hidden">
              <div
                class="h-1.5 w-full"
                [style.background-color]="platformMeta(platform).color"
              ></div>
              <hlm-card-header hlmCardHeader class="pb-3">
                <div class="flex items-center gap-2">
                  <div
                    class="w-9 h-9 rounded-full flex items-center justify-center ring-2"
                    [class]="platformMeta(platform).ringClass"
                    [style.background-color]="platformMeta(platform).color + '15'"
                  >
                    <ng-icon
                      hlmIcon
                      [name]="platformMeta(platform).icon"
                      class="w-4 h-4"
                      [style.color]="platformMeta(platform).color"
                    />
                  </div>
                  <div>
                    <h3 hlmCardTitle class="text-base">{{ platformLabel(platform) }}</h3>
                    <p hlmCardDescription>{{ snapshotAccount(platform) || 'Sin cuenta' }}</p>
                  </div>
                </div>
              </hlm-card-header>
              <div hlmCardContent>
                <div class="grid grid-cols-2 gap-3">
                  <div class="rounded-lg bg-surface p-2">
                    <div class="flex items-center gap-1 text-xs text-muted-foreground">
                      <ng-icon hlmIcon name="lucideUsers" class="w-3 h-3" />
                      Seguidores
                    </div>
                    <p class="text-lg font-bold truncate">
                      {{ snapshotMetricValue(platform, 'followers') }}
                    </p>
                  </div>
                  <div class="rounded-lg bg-surface p-2">
                    <div class="flex items-center gap-1 text-xs text-muted-foreground">
                      <ng-icon hlmIcon name="lucideTrendingUp" class="w-3 h-3" />
                      Engagement
                    </div>
                    <p class="text-lg font-bold truncate">
                      {{ snapshotMetricValue(platform, 'engagement') }}
                    </p>
                  </div>
                </div>
              </div>
            </hlm-card>
          }
        </div>
      }

      <!-- Charts -->
      @if (historyResource.isLoading()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          @for (skeleton of [1, 2, 3]; track skeleton) {
            <hlm-card hlmCard>
              <hlm-card-header hlmCardHeader>
                <hlm-skeleton class="h-5 w-32" />
              </hlm-card-header>
              <div hlmCardContent>
                <hlm-skeleton class="h-48 w-full" />
              </div>
            </hlm-card>
          }
        </div>
      } @else if (historyResource.error()) {
        <div hlmAlert variant="destructive">
          <ng-icon hlmIcon name="lucideAlertCircle" class="w-4 h-4" />
          <h4 hlmAlertTitle>Error cargando historial</h4>
          <p hlmAlertDescription>{{ historyErrorMessage() }}</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          @for (platform of chartPlatforms(); track platform) {
            <app-social-metric-chart
              [title]="platformLabel(platform)"
              [color]="platformMeta(platform).color"
              [data]="chartData(platform)"
              [height]="220"
            />
          }
        </div>
      }

      <!-- Filters -->
      <hlm-card hlmCard>
        <div hlmCardContent class="p-4">
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm font-medium text-muted-foreground">Plataforma:</span>
              <button
                hlmBtn
                size="sm"
                [variant]="filterPlatform() === '' ? 'default' : 'outline'"
                (click)="setFilterPlatform('')"
                type="button"
              >
                Todas
              </button>
              @for (platform of platforms; track platform) {
                <button
                  hlmBtn
                  size="sm"
                  [variant]="filterPlatform() === platform ? 'default' : 'outline'"
                  (click)="setFilterPlatform(platform)"
                  type="button"
                >
                  {{ platformLabel(platform) }}
                </button>
              }
            </div>
            <div class="flex-1"></div>
            <button hlmBtn variant="outline" size="sm" (click)="resetFilters()" type="button">
              Limpiar filtros
            </button>
          </div>
        </div>
      </hlm-card>

      @if (metricsResource.error()) {
        <div hlmAlert variant="destructive">
          <ng-icon hlmIcon name="lucideAlertCircle" class="w-4 h-4" />
          <h4 hlmAlertTitle>Error cargando métricas</h4>
          <p hlmAlertDescription>{{ metricsErrorMessage() }}</p>
        </div>
      }

      @if (metricsResource.isLoading()) {
        <div class="flex items-center justify-center py-20">
          <hlm-spinner />
        </div>
      } @else if (!(metricsResource.value()?.data ?? []).length) {
        <div
          class="text-center py-20 text-muted-foreground rounded-2xl border border-border bg-card"
        >
          <p class="text-lg font-semibold">Sin métricas</p>
          <p class="text-sm mt-1">Ajusta los filtros o añade una métrica manual</p>
        </div>
      } @else {
        <hlm-card hlmCard class="overflow-hidden">
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr>
                <th hlmTh>Plataforma</th>
                <th hlmTh>Tipo</th>
                <th hlmTh class="text-right">Valor</th>
                <th hlmTh>Fecha</th>
                <th hlmTh class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (metric of metricsResource.value()?.data; track metric.id) {
                <tr hlmTr>
                  <td hlmTd>
                    <span hlmBadge variant="secondary">{{ platformLabel(metric.platform) }}</span>
                  </td>
                  <td hlmTd>{{ metric.metricType }}</td>
                  <td hlmTd class="text-right font-mono">
                    @if (metric.valueNumeric !== null) {
                      {{ metric.valueNumeric | number }}
                    } @else if (metric.valueText) {
                      {{ metric.valueText }}
                    } @else {
                      <span class="text-muted-foreground">—</span>
                    }
                  </td>
                  <td hlmTd class="text-xs text-muted-foreground">
                    {{ metric.recordedAt ? (metric.recordedAt | date: 'dd/MM/yy HH:mm') : '—' }}
                  </td>
                  <td hlmTd>
                    <div class="flex items-center justify-end gap-1">
                      <button
                        (click)="openEdit(metric)"
                        title="Editar"
                        hlmBtn
                        variant="ghost"
                        size="icon-sm"
                        type="button"
                      >
                        <ng-icon hlmIcon name="lucidePencil" class="w-4 h-4" />
                      </button>
                      <button
                        (click)="confirmDelete(metric)"
                        title="Eliminar"
                        hlmBtn
                        variant="ghost"
                        size="icon-sm"
                        type="button"
                      >
                        <ng-icon hlmIcon name="lucideTrash2" class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="flex items-center justify-between px-4 py-3 border-t border-border">
            <p class="text-sm text-muted-foreground">
              Mostrando {{ offset() + 1 }} –
              {{ min(offset() + limit(), metricsResource.value()?.total ?? 0) }} de
              {{ metricsResource.value()?.total ?? 0 }}
            </p>
            <div class="flex items-center gap-2">
              <button
                hlmBtn
                variant="outline"
                size="sm"
                (click)="prevPage()"
                [disabled]="offset() === 0 || metricsResource.isLoading()"
                type="button"
              >
                Anterior
              </button>
              <button
                hlmBtn
                variant="outline"
                size="sm"
                (click)="nextPage()"
                [disabled]="
                  offset() + limit() >= (metricsResource.value()?.total ?? 0) ||
                  metricsResource.isLoading()
                "
                type="button"
              >
                Siguiente
              </button>
            </div>
          </div>
        </hlm-card>
      }
    </div>

    <!-- Create / Edit dialog -->
    <hlm-dialog
      [state]="dialogOpen() ? 'open' : 'closed'"
      (stateChanged)="onDialogStateChange($event)"
    >
      <hlm-dialog-content *hlmDialogPortal [showCloseButton]="false">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>{{ isEdit() ? 'Editar métrica' : 'Añadir métrica manual' }}</h3>
          <p hlmDialogDescription>
            {{
              isEdit() ? 'Modifica los datos de la métrica.' : 'Completa los datos de la métrica.'
            }}
          </p>
        </hlm-dialog-header>

        <form (ngSubmit)="submitForm()" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-1.5">
              <label hlmLabel for="form-platform">Plataforma *</label>
              <hlm-select
                id="form-platform"
                name="platform"
                [ngModel]="form().platform"
                (ngModelChange)="updateForm('platform', $event)"
                required
              >
                <hlm-select-trigger>
                  <hlm-select-value placeholder="Selecciona"></hlm-select-value>
                </hlm-select-trigger>
                <hlm-select-content>
                  @for (p of platforms; track p) {
                    <hlm-select-item [value]="p">{{ platformLabel(p) }}</hlm-select-item>
                  }
                </hlm-select-content>
              </hlm-select>
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="form-account">Cuenta *</label>
              <input
                hlmInput
                id="form-account"
                name="accountId"
                [ngModel]="form().accountId"
                (ngModelChange)="updateForm('accountId', $event)"
                required
                placeholder="@usuario"
              />
            </div>
          </div>

          <div class="grid gap-1.5">
            <label hlmLabel for="form-type">Tipo de métrica *</label>
            <hlm-select
              id="form-type"
              name="metricType"
              [ngModel]="form().metricType"
              (ngModelChange)="updateForm('metricType', $event)"
              required
            >
              <hlm-select-trigger>
                <hlm-select-value placeholder="Selecciona"></hlm-select-value>
              </hlm-select-trigger>
              <hlm-select-content>
                @for (t of metricTypes; track t) {
                  <hlm-select-item [value]="t">{{ t }}</hlm-select-item>
                }
              </hlm-select-content>
            </hlm-select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-1.5">
              <label hlmLabel for="form-numeric">Valor numérico</label>
              <input
                hlmInput
                id="form-numeric"
                name="valueNumeric"
                [ngModel]="form().valueNumeric"
                (ngModelChange)="updateForm('valueNumeric', $event)"
                type="number"
                min="0"
                step="any"
                placeholder="0"
              />
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="form-text">Valor texto</label>
              <input
                hlmInput
                id="form-text"
                name="valueText"
                [ngModel]="form().valueText"
                (ngModelChange)="updateForm('valueText', $event)"
                placeholder="Ej. 4-7%"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-1.5">
              <label hlmLabel for="form-period">Período</label>
              <input
                hlmInput
                id="form-period"
                name="period"
                [ngModel]="form().period"
                (ngModelChange)="updateForm('period', $event)"
                placeholder="Ej. 2026-05"
              />
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="form-recorded">Fecha registrada *</label>
              <input
                hlmInput
                id="form-recorded"
                name="recordedAt"
                [ngModel]="form().recordedAt"
                (ngModelChange)="updateForm('recordedAt', $event)"
                type="datetime-local"
                required
              />
            </div>
          </div>

          <div class="grid gap-1.5">
            <label hlmLabel for="form-external">External ID</label>
            <input
              hlmInput
              id="form-external"
              name="externalId"
              [ngModel]="form().externalId"
              (ngModelChange)="updateForm('externalId', $event)"
              placeholder="ID externo de la plataforma"
            />
          </div>

          <div class="grid gap-1.5">
            <label hlmLabel for="form-metadata">Metadata (JSON)</label>
            <input
              hlmInput
              id="form-metadata"
              name="metadata"
              [ngModel]="form().metadata"
              (ngModelChange)="updateForm('metadata', $event)"
              placeholder='{"campaign": "verano"}'
            />
          </div>

          @if (formError()) {
            <div hlmAlert variant="destructive">
              <ng-icon hlmIcon name="lucideAlertCircle" class="w-4 h-4" />
              <h4 hlmAlertTitle>Error</h4>
              <p hlmAlertDescription>{{ formError() }}</p>
            </div>
          }

          <hlm-dialog-footer>
            <button hlmBtn variant="outline" (click)="closeDialog()" type="button">Cancelar</button>
            <button hlmBtn type="submit" [disabled]="saving() || formInvalid()">
              {{ saving() ? 'Guardando...' : isEdit() ? 'Guardar cambios' : 'Añadir métrica' }}
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Delete confirmation dialog -->
    <hlm-dialog
      [state]="deleteDialogOpen() ? 'open' : 'closed'"
      (stateChanged)="onDeleteDialogStateChange($event)"
    >
      <hlm-dialog-content *hlmDialogPortal [showCloseButton]="false">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>¿Eliminar métrica?</h3>
          <p hlmDialogDescription>
            La métrica <strong>{{ deleting()?.metricType }}</strong> de
            <strong>{{ platformLabel(deleting()?.platform ?? '') }}</strong> se eliminará
            permanentemente.
          </p>
        </hlm-dialog-header>
        <hlm-dialog-footer>
          <button hlmBtn variant="outline" (click)="closeDeleteDialog()" type="button">
            Cancelar
          </button>
          <button
            hlmBtn
            variant="destructive"
            (click)="doDelete()"
            [disabled]="deleteLoading()"
            type="button"
          >
            {{ deleteLoading() ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class AdminSocialMetricsComponent {
  private readonly service = inject(AdminSocialMetricsService);

  protected readonly platforms = SOCIAL_PLATFORMS;
  protected readonly metricTypes = SOCIAL_METRIC_TYPES;

  protected readonly filterPlatform = signal<string>('');
  protected readonly limit = signal<number>(DEFAULT_LIMIT);
  protected readonly offset = signal<number>(0);

  protected readonly dialogOpen = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly form = signal<MetricForm>({ ...EMPTY_FORM });
  protected readonly saving = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected readonly deleteDialogOpen = signal(false);
  protected readonly deleting = signal<SocialMetric | null>(null);
  protected readonly deleteLoading = signal(false);

  protected readonly syncLoading = signal(false);
  protected readonly syncInfo = signal<string | null>(null);

  protected readonly isEdit = computed(() => this.editingId() !== null);

  protected readonly metricsResource = resource({
    params: () => ({
      platform: this.filterPlatform(),
      metricType: '',
      from: '',
      to: '',
      limit: this.limit(),
      offset: this.offset(),
    }),
    loader: async ({ params }) => this.service.getMetrics(params),
  });

  protected readonly snapshotResource = resource({
    loader: async () => this.service.getSnapshot(),
  });

  protected readonly historyResource = resource({
    loader: async () => this.service.getHistory(),
  });

  protected readonly metricsErrorMessage = computed(() => {
    const err = this.metricsResource.error();
    return err instanceof Error ? err.message : 'Error cargando métricas';
  });

  protected readonly snapshotErrorMessage = computed(() => {
    const err = this.snapshotResource.error();
    return err instanceof Error ? err.message : 'Error cargando snapshot';
  });

  protected readonly historyErrorMessage = computed(() => {
    const err = this.historyResource.error();
    return err instanceof Error ? err.message : 'Error cargando historial';
  });

  protected readonly snapshotIndex = computed(() => {
    const snapshot = this.snapshotResource.value() ?? [];
    const index = new Map<string, SocialMetricSnapshotItem>();
    for (const item of snapshot) {
      index.set(item.platform.toLowerCase(), item);
    }
    return index;
  });

  protected readonly historyIndex = computed(() => {
    const history = this.historyResource.value()?.data ?? [];
    const index = new Map<string, SocialMetricHistoryGroup>();
    for (const group of history) {
      const key = `${group.platform.toLowerCase()}:${group.metricType.toLowerCase()}`;
      index.set(key, group);
    }
    return index;
  });

  protected readonly chartPlatforms = computed(() => {
    const selected = this.filterPlatform();
    if (selected) {
      return [selected];
    }
    return [...this.platforms];
  });

  constructor() {
    this.resetRecordedAt();
  }

  protected platformLabel(platform: string): string {
    const key = platform.toLowerCase() as SocialPlatform;
    return SOCIAL_PLATFORM_LABELS[key] ?? platform;
  }

  protected platformMeta(platform: string): { color: string; icon: string; ringClass: string } {
    const key = platform.toLowerCase() as SocialPlatform;
    return (
      PLATFORM_META[key] ?? {
        color: '#888888',
        icon: 'lucideActivity',
        ringClass: 'ring-gray-500/20',
      }
    );
  }

  protected snapshotAccount(platform: string): string {
    return this.snapshotIndex().get(platform.toLowerCase())?.accountId ?? '';
  }

  protected snapshotMetricValue(platform: string, metricType: string): string {
    const item = this.snapshotIndex().get(platform.toLowerCase());
    if (!item) return '—';
    const metric = item.metrics[metricType.toLowerCase()];
    if (!metric) return '—';
    if (metric.valueNumeric !== null) {
      return formatNumber(metric.valueNumeric);
    }
    return metric.valueText ?? '—';
  }

  protected chartData(platform: string): SocialMetricChartPoint[] {
    const group = this.historyIndex().get(`${platform.toLowerCase()}:followers`);
    if (!group) return [];

    return group.points
      .filter(
        (point): point is { recordedAt: string; value: number; valueText: string | null } =>
          typeof point.value === 'number',
      )
      .map((point) => ({
        label: point.recordedAt,
        value: point.value,
      }));
  }

  protected setFilterPlatform(platform: string): void {
    this.filterPlatform.set(platform);
    this.offset.set(0);
  }

  protected min(a: number, b: number): number {
    return Math.min(a, b);
  }

  protected updateForm(key: MetricFormKey, value: string): void {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  protected refresh(): void {
    void this.metricsResource.reload();
    void this.snapshotResource.reload();
    void this.historyResource.reload();
  }

  protected resetFilters(): void {
    this.filterPlatform.set('');
    this.offset.set(0);
  }

  protected prevPage(): void {
    this.offset.update((value) => Math.max(0, value - this.limit()));
  }

  protected nextPage(): void {
    this.offset.update((value) => value + this.limit());
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.resetRecordedAt();
    this.formError.set(null);
    this.dialogOpen.set(true);
  }

  protected openEdit(metric: SocialMetric): void {
    this.editingId.set(metric.id);
    this.form.set({
      platform: metric.platform,
      accountId: metric.accountId,
      metricType: metric.metricType,
      valueNumeric: metric.valueNumeric !== null ? String(metric.valueNumeric) : '',
      valueText: metric.valueText ?? '',
      period: metric.period ?? '',
      recordedAt: this.toDatetimeLocal(metric.recordedAt),
      externalId: metric.externalId ?? '',
      metadata: metric.metadata ? JSON.stringify(metric.metadata) : '',
    });
    this.formError.set(null);
    this.dialogOpen.set(true);
  }

  protected closeDialog(): void {
    this.dialogOpen.set(false);
  }

  protected onDialogStateChange(state: string): void {
    this.dialogOpen.set(state === 'open');
    if (state !== 'open') {
      this.editingId.set(null);
      this.form.set({ ...EMPTY_FORM });
      this.formError.set(null);
      this.resetRecordedAt();
    }
  }

  protected formInvalid(): boolean {
    const f = this.form();
    const hasValue = f.valueNumeric.trim() !== '' || f.valueText.trim() !== '';
    const metadataInvalid = f.metadata.trim() !== '' && this.parseMetadata(f.metadata) === null;
    return (
      !f.platform.trim() ||
      !f.accountId.trim() ||
      !f.metricType.trim() ||
      !f.recordedAt.trim() ||
      !hasValue ||
      metadataInvalid
    );
  }

  protected async submitForm(): Promise<void> {
    if (this.saving()) return;
    if (this.formInvalid()) {
      this.formError.set('Completa los campos obligatorios, al menos un valor y un JSON válido.');
      return;
    }

    this.saving.set(true);
    this.formError.set(null);
    try {
      if (this.isEdit() && this.editingId()) {
        const dto: SocialMetricUpdateDto = this.buildDto();
        await this.service.updateMetric(this.editingId()!, dto);
      } else {
        const dto: SocialMetricCreateDto = this.buildDto();
        await this.service.createMetric(dto);
      }
      this.dialogOpen.set(false);
      this.refresh();
    } catch (err) {
      this.formError.set(err instanceof Error ? err.message : 'Error guardando la métrica');
    } finally {
      this.saving.set(false);
    }
  }

  protected confirmDelete(metric: SocialMetric): void {
    this.deleting.set(metric);
    this.deleteDialogOpen.set(true);
  }

  protected closeDeleteDialog(): void {
    this.deleteDialogOpen.set(false);
  }

  protected onDeleteDialogStateChange(state: string): void {
    this.deleteDialogOpen.set(state === 'open');
    if (state !== 'open') {
      this.deleting.set(null);
    }
  }

  protected async doDelete(): Promise<void> {
    const metric = this.deleting();
    if (!metric) return;
    if (this.deleteLoading()) return;
    this.deleteLoading.set(true);
    try {
      await this.service.deleteMetric(metric.id);
      this.deleteDialogOpen.set(false);
      this.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error eliminando la métrica');
    } finally {
      this.deleteLoading.set(false);
    }
  }

  protected async forceSync(): Promise<void> {
    if (this.syncLoading()) return;
    this.syncLoading.set(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      this.syncInfo.set(
        'La sincronización automática con plataformas requiere configuración de credenciales y un workflow de n8n. Contacta a TRIN para activarla.',
      );
    } finally {
      this.syncLoading.set(false);
    }
  }

  private resetRecordedAt(): void {
    this.form.update((current) => ({
      ...current,
      recordedAt: this.toDatetimeLocal(new Date().toISOString()),
    }));
  }

  private toDatetimeLocal(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private buildDto(): SocialMetricCreateDto {
    const f = this.form();
    const numeric = f.valueNumeric.trim() === '' ? null : Number(f.valueNumeric);
    const metadata = this.parseMetadata(f.metadata);
    return {
      platform: f.platform,
      accountId: f.accountId,
      metricType: f.metricType,
      valueNumeric: numeric,
      valueText: f.valueText.trim() === '' ? null : f.valueText,
      period: f.period.trim() === '' ? null : f.period,
      recordedAt: new Date(f.recordedAt).toISOString(),
      externalId: f.externalId.trim() === '' ? null : f.externalId,
      metadata,
    };
  }

  private parseMetadata(value: string): Record<string, unknown> | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
      return null;
    } catch {
      return null;
    }
  }
}
