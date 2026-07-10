import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { HlmCard, HlmCardContent, HlmCardHeader, HlmCardTitle } from '@spartan-ng/helm/card';

export interface SocialMetricChartPoint {
  label: string;
  value: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-social-metric-chart',
  standalone: true,
  imports: [DatePipe, DecimalPipe, HlmCard, HlmCardContent, HlmCardHeader, HlmCardTitle],
  template: `
    <hlm-card hlmCard class="h-full">
      <hlm-card-header hlmCardHeader class="pb-2">
        <div class="flex items-center justify-between">
          <h3 hlmCardTitle class="text-sm font-semibold">{{ title() }}</h3>
          @if (hasData()) {
            <span class="text-2xl font-extrabold" [style.color]="color()">
              {{ currentValue() | number }}
            </span>
          }
        </div>
        <p hlmCardDescription class="text-xs">Evolución de seguidores</p>
      </hlm-card-header>
      <div hlmCardContent>
        @if (hasData()) {
          <svg
            role="img"
            [attr.aria-label]="ariaLabel()"
            [attr.width]="svgWidth"
            [attr.height]="height()"
            [attr.viewBox]="viewBox()"
            class="w-full"
            preserveAspectRatio="none"
          >
            <!-- Grid lines -->
            @for (y of gridYPositions(); track y) {
              <line
                [attr.x1]="padding.left"
                [attr.y1]="y"
                [attr.x2]="innerWidth() + padding.left"
                [attr.y2]="y"
                stroke="currentColor"
                stroke-opacity="0.1"
                stroke-width="1"
              />
            }

            <!-- Area under the line -->
            <path [attr.d]="areaPath()" [attr.fill]="color()" fill-opacity="0.12" />

            <!-- Line -->
            <path
              [attr.d]="linePath()"
              [attr.stroke]="color()"
              fill="none"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Dots -->
            @for (point of svgPoints(); track point.index) {
              <circle
                [attr.cx]="point.x"
                [attr.cy]="point.y"
                r="3.5"
                [attr.fill]="color()"
                stroke="var(--card, white)"
                stroke-width="1.5"
              />
            }

            <!-- X axis labels -->
            @for (label of xLabels(); track label.index) {
              <text
                [attr.x]="label.x"
                [attr.y]="height() - 4"
                text-anchor="middle"
                class="text-[10px] fill-muted-foreground"
              >
                {{ label.text | date: 'dd/MM' }}
              </text>
            }
          </svg>

          <div class="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Min: {{ minValue() | number }}</span>
            <span>Max: {{ maxValue() | number }}</span>
          </div>
        } @else {
          <div
            class="flex items-center justify-center text-sm text-muted-foreground"
            [style.height.px]="height()"
          >
            Sin datos históricos
          </div>
        }
      </div>
    </hlm-card>
  `,
})
export class SocialMetricChartComponent {
  readonly data = input<SocialMetricChartPoint[]>([]);
  readonly color = input<string>('var(--primary)');
  readonly title = input<string>('Evolución');
  readonly height = input<number>(220);

  protected readonly padding = { top: 12, right: 8, bottom: 24, left: 8 };
  protected readonly svgWidth = 600;

  protected readonly viewBox = computed(() => `0 0 ${this.svgWidth} ${this.height()}`);
  protected readonly ariaLabel = computed(
    () => `Gráfico de líneas: ${this.title()} con ${this.data().length} puntos`,
  );

  protected readonly innerWidth = computed(
    () => this.svgWidth - this.padding.left - this.padding.right,
  );
  protected readonly innerHeight = computed(
    () => this.height() - this.padding.top - this.padding.bottom,
  );

  protected readonly values = computed(() => this.data().map((d) => d.value));
  protected readonly minValue = computed(() => {
    const vals = this.values();
    if (vals.length === 0) return 0;
    return Math.min(...vals);
  });
  protected readonly maxValue = computed(() => {
    const vals = this.values();
    if (vals.length === 0) return 0;
    return Math.max(...vals);
  });

  protected readonly currentValue = computed(() => {
    const data = this.data();
    if (data.length === 0) return 0;
    return data[data.length - 1].value;
  });

  protected readonly hasData = computed(() => this.data().length >= 1);

  protected readonly svgPoints = computed(() => {
    const data = this.data();
    const min = this.minValue();
    const max = this.maxValue();
    const range = Math.max(max - min, 1);
    const innerWidth = this.innerWidth();
    const innerHeight = this.innerHeight();

    return data.map((point, index) => {
      const x =
        data.length === 1
          ? this.padding.left + innerWidth / 2
          : this.padding.left + (index / (data.length - 1)) * innerWidth;
      const yOffset = ((point.value - min) / range) * innerHeight;
      const y = this.padding.top + innerHeight - yOffset;
      return { x, y, index };
    });
  });

  protected readonly linePath = computed(() => {
    const points = this.svgPoints();
    if (points.length === 0) return '';
    return points
      .map((point, index) => (index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`))
      .join(' ');
  });

  protected readonly areaPath = computed(() => {
    const line = this.linePath();
    if (!line) return '';
    const points = this.svgPoints();
    const first = points[0];
    const last = points[points.length - 1];
    const bottom = this.padding.top + this.innerHeight();
    return `${line} L ${last.x} ${bottom} L ${first.x} ${bottom} Z`;
  });

  protected readonly gridYPositions = computed(() => {
    const count = 4;
    const innerHeight = this.innerHeight();
    return Array.from({ length: count + 1 }, (_, index) => {
      const yOffset = (index / count) * innerHeight;
      return this.padding.top + innerHeight - yOffset;
    });
  });

  protected readonly xLabels = computed(() => {
    const data = this.data();
    const innerWidth = this.innerWidth();
    if (data.length === 0) return [];
    if (data.length === 1) {
      return [
        {
          x: this.padding.left + innerWidth / 2,
          text: data[0].label,
          index: 0,
        },
      ];
    }

    const labelCount = Math.min(data.length, 5);
    return Array.from({ length: labelCount }, (_, index) => {
      const dataIndex = Math.round((index / (labelCount - 1)) * (data.length - 1));
      const point = data[dataIndex];
      const x = this.padding.left + (dataIndex / (data.length - 1)) * innerWidth;
      return { x, text: point.label, index };
    });
  });
}
