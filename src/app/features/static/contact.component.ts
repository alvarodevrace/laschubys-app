import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { siteMeta } from '../../core/content/site-content';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import {
  ScrollRevealDirective,
  StaggerChildrenDirective,
  TextRevealDirective,
  TiltCardDirective,
} from '../../shared/animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    ScrollRevealDirective,
    StaggerChildrenDirective,
    TextRevealDirective,
    TiltCardDirective,
  ],
  template: `
    <section class="py-10 pb-8" appScrollReveal>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center gap-2 mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <span>Contacto</span>
        </nav>
        <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-2">Contacto</p>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-orange mb-2"
          appTextReveal
        >
          Hablemos.
        </h1>
        <p class="text-gray-500 max-w-2xl">
          Colaboraciones, contenido o simplemente decir hola. Email para marcas, WhatsApp para
          respuesta rápida.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <a
            class="group flex items-center gap-4 min-h-[92px] p-5 rounded-2xl transition-all duration-200 border border-orange/[0.18] bg-gradient-to-b from-white/[0.98] to-[#fff4e8]/[0.92] shadow-[0_18px_40px_rgba(53,25,11,0.08)] hover:-translate-y-0.5 hover:border-orange/[0.44] hover:shadow-[0_24px_48px_rgba(53,25,11,0.12)]"
            href="https://wa.me/593960463743"
            target="_blank"
            rel="noreferrer"
            appTiltCard
            [max]="6"
            [scale]="1.02"
          >
            <span
              class="w-[52px] h-[52px] rounded-2xl inline-flex items-center justify-center flex-shrink-0 bg-orange/[0.12] text-orange transition-colors duration-200 group-hover:bg-orange group-hover:text-white"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-6 h-6 block"
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
            <div class="min-w-0">
              <span
                class="block text-xs font-extrabold uppercase tracking-widest text-orange mb-0.5"
                >WhatsApp</span
              >
              <span class="block text-sm font-bold text-gray-900 truncate">+593 96 046 3743</span>
            </div>
          </a>
          <a
            class="group flex items-center gap-4 min-h-[92px] p-5 rounded-2xl transition-all duration-200 border border-orange/[0.18] bg-gradient-to-b from-white/[0.98] to-[#fff4e8]/[0.92] shadow-[0_18px_40px_rgba(53,25,11,0.08)] hover:-translate-y-0.5 hover:border-orange/[0.44] hover:shadow-[0_24px_48px_rgba(53,25,11,0.12)]"
            [href]="'mailto:' + siteMeta.email"
            appTiltCard
            [max]="6"
            [scale]="1.02"
          >
            <span
              class="w-[52px] h-[52px] rounded-2xl inline-flex items-center justify-center flex-shrink-0 bg-orange/[0.12] text-orange transition-colors duration-200 group-hover:bg-orange group-hover:text-white"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-6 h-6 block"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                ></path>
                <polyline points="22 6 12 13 2 6"></polyline>
              </svg>
            </span>
            <div class="min-w-0">
              <span
                class="block text-xs font-extrabold uppercase tracking-widest text-orange mb-0.5"
                >Correo</span
              >
              <span class="block text-sm font-bold text-gray-900 truncate">{{
                siteMeta.email
              }}</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="py-10 pb-12" appScrollReveal>
      <div class="max-w-6xl mx-auto px-4">
        <div
          class="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6 items-start p-7 rounded-3xl border border-orange/[0.14] bg-gradient-to-br from-white/[0.96] to-[#fff4e8]/[0.88] shadow-[0_22px_52px_rgba(32,18,12,0.08)]"
        >
          <div>
            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">
              Canales activos
            </p>
            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-3">
              Respondemos por donde sea más cómodo.
            </h2>
            <p class="text-gray-500 leading-relaxed max-w-md">
              WhatsApp para resolver rápido, correo para colaboraciones y redes para seguir el caos
              diario de Iris y Rubi.
            </p>
          </div>

          <div class="grid gap-3">
            <a
              href="https://www.instagram.com/laschubys/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              class="min-h-14 inline-flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wide text-gray-700 transition-all duration-200 bg-white/[0.88] border border-gray-200/[0.9] hover:-translate-y-px hover:text-orange-dark hover:border-orange/[0.28]"
            >
              <span
                class="w-8 h-8 rounded-xl inline-flex items-center justify-center flex-shrink-0 bg-orange/[0.12] text-orange"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="w-[18px] h-[18px] block"
                >
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
              class="min-h-14 inline-flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wide text-gray-700 transition-all duration-200 bg-white/[0.88] border border-gray-200/[0.9] hover:-translate-y-px hover:text-orange-dark hover:border-orange/[0.28]"
            >
              <span
                class="w-8 h-8 rounded-xl inline-flex items-center justify-center flex-shrink-0 bg-orange/[0.12] text-orange"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" class="w-[18px] h-[18px] block">
                  <path
                    d="M14 3c1 2.2 2.5 3.7 5 4v3.1c-1.8-.1-3.3-.7-4.8-1.8v6.5a5.2 5.2 0 1 1-5.2-5.2c.4 0 .8 0 1.2.1v3.2a2.6 2.6 0 1 0 1.4 2.3V3H14z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
              <span>TikTok</span>
            </a>
            <a
              href="https://www.facebook.com/people/Las-Chubys/61589964727281/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              class="min-h-14 inline-flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wide text-gray-700 transition-all duration-200 bg-white/[0.88] border border-gray-200/[0.9] hover:-translate-y-px hover:text-orange-dark hover:border-orange/[0.28]"
            >
              <span
                class="w-8 h-8 rounded-xl inline-flex items-center justify-center flex-shrink-0 bg-orange/[0.12] text-orange"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-[18px] h-[18px] block">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  ></path>
                </svg>
              </span>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="py-10 pb-12" appScrollReveal>
      <div class="max-w-6xl mx-auto px-4">
        <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">Formulario</p>
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-3">
          Escríbenos directamente.
        </h2>

        <form
          [formGroup]="contactForm"
          (ngSubmit)="submit()"
          class="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto"
          appStaggerChildren
          childSelector=".field"
          [staggerDelay]="0.08"
        >
          <div class="field grid gap-1.5">
            <label class="text-sm font-bold text-gray-700" for="contact-name">Nombre</label>
            <input
              id="contact-name"
              formControlName="name"
              type="text"
              placeholder="Tu nombre"
              class="w-full p-3 rounded-2xl border border-gray-200 bg-white text-sm"
              data-testid="contact-name-input"
            />
          </div>
          <div class="field grid gap-1.5">
            <label class="text-sm font-bold text-gray-700" for="contact-email">Correo</label>
            <input
              id="contact-email"
              formControlName="email"
              type="email"
              placeholder="tu@email.com"
              class="w-full p-3 rounded-2xl border border-gray-200 bg-white text-sm"
              data-testid="contact-email-input"
            />
          </div>
          <div class="field grid gap-1.5 md:col-span-2">
            <label class="text-sm font-bold text-gray-700" for="contact-message">Mensaje</label>
            <textarea
              id="contact-message"
              formControlName="message"
              rows="4"
              placeholder="¿En qué podemos ayudarte?"
              class="w-full p-3 rounded-2xl border border-gray-200 bg-white text-sm resize-y"
              data-testid="contact-message-input"
            ></textarea>
          </div>
          <div class="field md:col-span-2">
            <app-button
              type="submit"
              [variant]="justSent() ? 'secondary' : 'primary'"
              [disabled]="pending() || contactForm.invalid"
              data-testid="contact-submit-btn"
            >
              {{ buttonLabel() }}
            </app-button>
          </div>
          @if (feedback()) {
            <p
              class="md:col-span-2 text-sm"
              [class.text-green-700]="sent()"
              [class.text-red-700]="!sent()"
            >
              {{ feedback() }}
            </p>
          }
        </form>
      </div>
    </section>
  `,
})
export class ContactComponent {
  private readonly seo = inject(SeoService);
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  protected readonly siteMeta = siteMeta;
  protected readonly pending = signal(false);
  protected readonly sent = signal(false);
  protected readonly justSent = signal(false);
  protected readonly feedback = signal('');

  protected readonly buttonLabel = computed(() => {
    if (this.pending()) return 'Enviando...';
    if (this.justSent()) return 'Enviado ✓';
    return 'Enviar mensaje';
  });

  protected readonly contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    this.seo.setPage(
      'Contacto | Las Chubys',
      'Habla con Las Chubys para colaboraciones, contenido y marca.',
      '/brand/logo.png',
      '/contact',
    );
  }

  protected async submit() {
    if (this.contactForm.invalid) {
      return;
    }

    this.pending.set(true);
    this.feedback.set('');
    this.sent.set(false);

    try {
      await this.api.post('/api/contact', this.contactForm.getRawValue());
      this.sent.set(true);
      this.justSent.set(true);
      this.feedback.set('Mensaje enviado. Te responderemos pronto.');
      this.contactForm.reset();
      setTimeout(() => this.justSent.set(false), 2500);
    } catch {
      this.sent.set(false);
      this.feedback.set(
        'No se pudo enviar el mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.',
      );
    } finally {
      this.pending.set(false);
    }
  }
}
