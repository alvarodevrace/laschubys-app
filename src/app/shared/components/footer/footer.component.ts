import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { socialChannels } from '../../../core/content/site-content';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  protected readonly socialChannels = socialChannels;
}
