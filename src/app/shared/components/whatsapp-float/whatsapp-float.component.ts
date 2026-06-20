import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMessageCircle } from '@ng-icons/lucide';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-whatsapp-float',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons({ lucideMessageCircle })],
  template: `
    <a
      class="fixed right-4 bottom-4 w-14 h-14 rounded-full bg-[#25d366] text-white border-0 shadow-lg hover:bg-[#128c7e] hover:-translate-y-0.5 hover:shadow-xl z-[2000] inline-flex items-center justify-center transition-all"
      href="https://wa.me/593960463743"
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <ng-icon name="lucideMessageCircle" class="w-7 h-7" />
    </a>
  `,
})
export class WhatsappFloatComponent {}
