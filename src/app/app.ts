import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class App {
  throwTestError(): void {
    throw new Error('Sentry Test Error — laschubys-app');
  }
}
