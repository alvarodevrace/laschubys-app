import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { siteMeta } from '../../core/content/site-content';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="page-hero" data-reveal>
      <div class="page-hero__inner">
        <p class="page-hero__eyebrow">Contacto</p>
        <h1 class="page-hero__title">Hablemos.</h1>
        <p class="page-hero__sub">
          Colaboraciones, contenido o simplemente decir hola. Email para marcas, WhatsApp para
          respuesta rápida.
        </p>

        <div class="contact-options">
          <a
            class="contact-option"
            href="https://wa.me/593960463743"
            target="_blank"
            rel="noreferrer"
          >
            <span class="contact-option__icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M20 11.9c0 4.4-3.6 8-8 8-1.4 0-2.7-.4-3.8-1l-4.2 1.1 1.1-4.1A8 8 0 1 1 20 11.9z"
                ></path>
                <path
                  d="M9 8.2c-.2-.4-.4-.4-.7-.4h-.6c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.2.2 2 3.1 4.8 4.2.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.1-1.3-.1-.1-.3-.2-.7-.4l-1.6-.8c-.3-.1-.5-.2-.8.2l-.6.8c-.2.2-.3.3-.6.2-.3-.1-1.2-.4-2.2-1.3-.8-.7-1.3-1.7-1.5-2-.2-.3 0-.4.1-.6l.5-.6.3-.5c.1-.2.1-.4 0-.6l-.8-1.9z"
                  fill="currentColor"
                  stroke="none"
                ></path>
              </svg>
            </span>
            <span class="contact-option__label">WhatsApp</span>
            <span class="contact-option__value">+593 96 046 3743</span>
          </a>
          <a class="contact-option" [href]="'mailto:' + siteMeta.email">
            <span class="contact-option__icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                ></path>
                <polyline points="22 6 12 13 2 6"></polyline>
              </svg>
            </span>
            <span class="contact-option__label">Correo</span>
            <span class="contact-option__value">{{ siteMeta.email }}</span>
          </a>
        </div>
      </div>
    </section>

    <section class="shop-section" data-reveal>
      <div class="page-wrap">
        <div class="contact-panel">
          <div class="contact-panel__copy">
            <p class="section-eyebrow">Canales activos</p>
            <h2 class="contact-panel__title">Respondemos por donde sea más cómodo.</h2>
            <p class="contact-panel__body">
              WhatsApp para resolver rápido, correo para colaboraciones y redes para seguir el caos
              diario de Iris y Rubi.
            </p>
          </div>

          <div class="contact-socials">
            <a
              href="https://www.instagram.com/laschubys.oficial/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <span class="contact-socials__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                  <circle cx="12" cy="12" r="4"></circle>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle>
                </svg>
              </span>
              <span>Instagram</span>
            </a>
            <a
              href="https://www.tiktok.com/@laschubys.oficial"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
            >
              <span class="contact-socials__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M14 3c1 2.2 2.5 3.7 5 4v3.1c-1.8-.1-3.3-.7-4.8-1.8v6.5a5.2 5.2 0 1 1-5.2-5.2c.4 0 .8 0 1.2.1v3.2a2.6 2.6 0 1 0 1.4 2.3V3H14z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
              <span>TikTok</span>
            </a>
            <a routerLink="/tienda">
              <span class="contact-socials__icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <path d="M3 6h18"></path>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </span>
              <span>Tienda</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContactComponent {
  private readonly seo = inject(SeoService);

  protected readonly siteMeta = siteMeta;
  protected readonly submitted = signal(false);
  protected name = '';
  protected email = '';
  protected message = '';

  constructor() {
    this.seo.setPage(
      'Contacto | Las Chubys',
      'Habla con Las Chubys para colaboraciones, contenido y marca.',
      '/brand/logo.png',
      '/contact',
    );
  }

  protected submit() {
    this.submitted.set(true);
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
