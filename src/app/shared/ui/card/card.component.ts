import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva('bg-white rounded-2xl', {
  variants: {
    variant: {
      default: '',
      bordered: 'border border-gray-200',
      elevated: 'shadow-lg',
    },
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
});

type CardVariants = VariantProps<typeof cardVariants>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-card',
  standalone: true,
  imports: [],
  template: `
    <div [class]="cardVariants({ variant: variant(), padding: padding() })" data-testid="card">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
  readonly variant = input<CardVariants['variant']>('default');
  readonly padding = input<CardVariants['padding']>('md');
  protected readonly cardVariants = cardVariants;
}
