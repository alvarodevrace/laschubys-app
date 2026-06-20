import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideFacebook, lucideInstagram } from '@ng-icons/lucide';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { socialChannels } from '../../../core/content/site-content';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, HlmButtonImports, HlmIconImports],
  providers: [provideIcons({ lucideFacebook, lucideInstagram })],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  protected readonly socialChannels = socialChannels;
}
