import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
})
export class InputComponent {
  readonly id = input<string>(`lch-input-${Math.random().toString(36).slice(2, 9)}`);
  readonly label = input<string>('');
  readonly type = input<'text' | 'email' | 'tel' | 'textarea' | 'select'>('text');
  readonly placeholder = input<string>('');
  readonly required = input<boolean>(false);
  readonly options = input<string[]>([]);
  readonly error = input<string>('');
}
