import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [class]="
        'px-6 py-3 rounded-xl font-bold transition-all duration-200 ease-smooth active:scale-95 flex items-center justify-center gap-2 ' +
        variants[variant]
      "
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'outline' | 'ghost' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';

  variants = {
    primary: 'bg-orange text-white hover:bg-orange-dark shadow-lg',
    outline: 'border-2 border-orange text-orange hover:bg-orange hover:text-white',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  };
}
