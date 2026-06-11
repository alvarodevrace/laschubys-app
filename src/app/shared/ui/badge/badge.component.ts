import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-badge',
  standalone: true,
  imports: [],
  template: `
    <span
      [class]="
        'inline-flex items-center font-medium ' +
        sizeClasses[size()] +
        ' ' +
        variantClasses[variant()]
      "
      data-testid="badge"
    >
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  readonly variant = input<'default' | 'outline' | 'ghost'>('default');
  readonly size = input<'sm' | 'md'>('md');

  protected readonly sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded-md',
    md: 'text-sm px-3 py-1 rounded-lg',
  } as const;

  protected readonly variantClasses = {
    default: 'bg-orange text-white',
    outline: 'border border-gray-300 text-gray-600 bg-transparent',
    ghost: 'bg-gray-100 text-gray-600',
  } as const;
}
