import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [class]="'px-6 py-3 rounded-xl font-bold transition-all duration-200 ease-smooth active:scale-95 flex items-center justify-center gap-2 ' + variants[variant]"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'outline' | 'ghost' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';

  variants = {
    primary: 'bg-fire text-white hover:bg-fire-dark shadow-button',
    outline: 'border-2 border-fire text-fire hover:bg-fire hover:text-white',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  };
}
