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
        <p class="page-hero__sub">Colaboraciones, contenido o simplemente decir hola. Email para marcas, WhatsApp para respuesta rápida.</p>

        <div class="contact-options">
          <a class="contact-option" href="https://wa.me/593960463743" target="_blank" rel="noreferrer">
            <span class="contact-option__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 11.9c0 4.4-3.6 8-8 8-1.4 0-2.7-.4-3.8-1l-4.2 1.1 1.1-4.1A8 8 0 1 1 20 11.9z"></path>
                <path d="M9 8.2c-.2-.4-.4-.4-.7-.4h-.6c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.2.2 2 3.1 4.8 4.2.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.1-1.3-.1-.1-.3-.2-.7-.4l-1.6-.8c-.3-.1-.5-.2-.8.2l-.6.8c-.2.2-.3.3-.6.2-.3-.1-1.2-.4-2.2-1.3-.8-.7-1.3-1.7-1.5-2-.2-.3 0-.4.1-.6l.5-.6.3-.5c.1-.2.1-.4 0-.6l-.8-1.9z" fill="currentColor" stroke="none"></path>
              </svg>
            </span>
            <span class="contact-option__label">WhatsApp</span>
            <span class="contact-option__value">+593 96 046 3743</span>
          </a>
          <a class="contact-option" [href]="'mailto:' + siteMeta.email">
            <span class="contact-option__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
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
              WhatsApp para resolver rápido, correo para colaboraciones y redes para seguir el caos diario de Iris y Rubi.
            </p>
          </div>

          <div class="contact-socials">
            <a href="https://www.instagram.com/laschubys.oficial/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <span class="contact-socials__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                  <circle cx="12" cy="12" r="4"></circle>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle>
                </svg>
              </span>
              <span>Instagram</span>
            </a>
            <a href="https://www.tiktok.com/@laschubys.oficial" target="_blank" rel="noreferrer" aria-label="TikTok">
              <span class="contact-socials__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M14 3c1 2.2 2.5 3.7 5 4v3.1c-1.8-.1-3.3-.7-4.8-1.8v6.5a5.2 5.2 0 1 1-5.2-5.2c.4 0 .8 0 1.2.1v3.2a2.6 2.6 0 1 0 1.4 2.3V3H14z" fill="currentColor"></path>
                </svg>
              </span>
              <span>TikTok</span>
            </a>
            <a routerLink="/tienda">
              <span class="contact-socials__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
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
  styles: [`
    .contact-options {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }

    .contact-option {
      display: grid;
      grid-template-columns: 52px minmax(0, 1fr);
      gap: 1rem;
      align-items: center;
      padding: 1.35rem 1.4rem;
      border-radius: 20px;
      border: 1px solid rgba(255, 122, 26, 0.18);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 244, 232, 0.92) 100%);
      box-shadow: 0 18px 40px rgba(53, 25, 11, 0.08);
      transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
    }

    .contact-option:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 122, 26, 0.44);
      box-shadow: 0 24px 48px rgba(53, 25, 11, 0.12);
    }

    .contact-option__icon {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 122, 26, 0.12);
      color: var(--orange);
      flex: 0 0 auto;
    }

    .contact-option__icon svg {
      width: 24px;
      height: 24px;
      display: block;
      flex: 0 0 auto;
    }

    .contact-option__label,
    .contact-option__value {
      display: block;
    }

    .contact-option__label {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--orange);
      margin-bottom: 0.35rem;
    }

    .contact-option__value {
      font-size: clamp(0.82rem, 1.4vw, 0.98rem);
      line-height: 1.35;
      font-weight: 700;
      color: var(--dark);
      white-space: nowrap;
    }

    .contact-panel {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
      gap: 1.5rem;
      align-items: start;
      padding: 1.75rem;
      border: 1px solid rgba(255, 122, 26, 0.14);
      border-radius: 24px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 244, 232, 0.88) 100%);
      box-shadow: 0 22px 52px rgba(32, 18, 12, 0.08);
    }

    .contact-panel__title {
      margin: 0 0 0.75rem;
      font-size: clamp(1.5rem, 2.8vw, 2rem);
      line-height: 1.08;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--dark);
    }

    .contact-panel__body {
      margin: 0;
      max-width: 46ch;
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--text-muted);
    }

    .contact-socials {
      display: grid;
      gap: 0.8rem;
      margin: 0;
      padding: 0;
      border: 0;
    }

    .contact-socials a {
      min-height: 56px;
      display: inline-flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.95rem 1rem;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.88);
      border: 1px solid rgba(224, 224, 224, 0.9);
      color: var(--text);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transition: transform 180ms ease, border-color 180ms ease, color 180ms ease;
    }

    .contact-socials a:hover {
      transform: translateY(-1px);
      border-color: rgba(255, 122, 26, 0.28);
      color: var(--orange-dark);
    }

    .contact-socials__icon {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 122, 26, 0.12);
      color: var(--orange);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      flex: 0 0 auto;
    }

    .contact-socials__icon svg {
      width: 18px;
      height: 18px;
      display: block;
      flex: 0 0 auto;
    }

    @media (max-width: 768px) {
      .contact-options,
      .contact-panel {
        grid-template-columns: 1fr;
      }

      .contact-panel {
        padding: 1.25rem;
      }

      .contact-option {
        padding: 1.1rem 1rem;
      }
    }

    @media (max-width: 520px) {
      .contact-option {
        grid-template-columns: 44px minmax(0, 1fr);
        gap: 0.85rem;
      }

      .contact-option__icon {
        width: 44px;
        height: 44px;
        border-radius: 14px;
      }

      .contact-option__icon svg {
        width: 21px;
        height: 21px;
      }

      .contact-option__value {
        white-space: normal;
        overflow-wrap: anywhere;
      }
    }
  `],
})
export class ContactComponent {
  private readonly seo = inject(SeoService);

  protected readonly siteMeta = siteMeta;
  protected readonly submitted = signal(false);
  protected name = '';
  protected email = '';
  protected message = '';

  constructor() {
    this.seo.setPage('Contacto | Las Chubys', 'Habla con Las Chubys para colaboraciones, contenido y marca.', '/brand/logo.png', '/contact');
  }

  protected submit() {
    this.submitted.set(true);
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
