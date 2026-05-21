import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-float',
  standalone: true,
  template: `
    <a
      class="whatsapp-float"
      href="https://wa.me/593960463743"
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.6 6.2A8.7 8.7 0 0 0 3.8 16.7L2.5 21.5l5-1.3a8.7 8.7 0 0 0 4.1 1 8.7 8.7 0 0 0 6-15zm-6 13.5a7.2 7.2 0 0 1-3.7-1l-.3-.2-3 .8.8-2.9-.2-.3a7.2 7.2 0 1 1 6.4 3.6zm4-5.4c-.2-.1-1.4-.7-1.6-.7s-.3-.1-.5.2l-.4.6c-.1.2-.2.2-.5.1a5.9 5.9 0 0 1-2.9-2.5c-.2-.3 0-.4.1-.5l.3-.4c.1-.1.1-.2.2-.3.1-.1 0-.3 0-.4l-.7-1.6c-.2-.4-.3-.4-.5-.4h-.4c-.2 0-.4 0-.6.2s-.8.8-.8 1.9.8 2.1 1 2.4a8.2 8.2 0 0 0 3.1 2.8c1.9.8 1.9.5 2.3.5s1.5-.6 1.7-1.2.2-1 .1-1.2-.2-.1-.4-.3z"></path>
      </svg>
    </a>
  `,
  styleUrl: './whatsapp-float.component.css',
})
export class WhatsappFloatComponent {}
