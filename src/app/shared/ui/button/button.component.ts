import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { type VariantProps, cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 ease-smooth active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-orange text-white hover:bg-orange-dark shadow-lg',
        secondary: 'border-2 border-orange text-orange hover:bg-orange hover:text-white',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonProps = VariantProps<typeof buttonVariants>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-button',
  standalone: true,
  imports: [],
  template: `
    <button [type]="type()" [disabled]="disabled()" [class]="computedClass()" data-testid="button">
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonProps['variant']>('primary');
  readonly size = input<ButtonProps['size']>('md');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input<boolean>(false);
  readonly className = input<string>('');

  protected readonly computedClass = computed(() => {
    return twMerge(
      clsx(buttonVariants({ variant: this.variant(), size: this.size() }), this.className()),
    );
  });
}
