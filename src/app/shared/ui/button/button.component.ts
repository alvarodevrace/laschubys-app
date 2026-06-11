import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-button',
  standalone: true,
  imports: [],
  template: `
    <button
      [type]="type()"
      [class]="
        'px-6 py-3 rounded-xl font-bold transition-all duration-200 ease-smooth active:scale-95 flex items-center justify-center gap-2 ' +
        variants[variant()]
      "
      data-testid="button"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  readonly variant = input<'primary' | 'outline' | 'ghost'>('primary');
  readonly type = input<'button' | 'submit'>('button');

  protected readonly variants = {
    primary: 'bg-orange text-white hover:bg-orange-dark shadow-lg',
    outline: 'border-2 border-orange text-orange hover:bg-orange hover:text-white',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  } as const;
}
