import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideAlertCircle,
  lucideCheckCircle,
  lucideFacebook,
  lucideInstagram,
  lucideMail,
  lucideMessageCircle,
} from '@ng-icons/lucide';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

import { siteMeta } from '../../core/content/site-content';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
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
    HlmButtonImports,
    HlmBreadcrumbImports,
    HlmCardImports,
    HlmIconImports,
    HlmInputImports,
    HlmLabelImports,
    HlmTextareaImports,
    HlmAlertImports,
    ScrollRevealDirective,
    StaggerChildrenDirective,
    TextRevealDirective,
    TiltCardDirective,
  ],
  providers: [
    provideIcons({
      lucideAlertCircle,
      lucideCheckCircle,
      lucideFacebook,
      lucideInstagram,
      lucideMail,
      lucideMessageCircle,
    }),
  ],
  template: `
    <section class="py-10 pb-8" appScrollReveal>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="mb-4" hlmBreadcrumb aria-label="Breadcrumb">
          <ol hlmBreadcrumbList>
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbLink [link]="['/']">Inicio</a>
            </li>
            <li hlmBreadcrumbSeparator></li>
            <li hlmBreadcrumbItem>
              <span hlmBreadcrumbPage>Contacto</span>
            </li>
          </ol>
        </nav>
        <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-2">Contacto</p>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-primary mb-2"
          appTextReveal
        >
          Hablemos.
        </h1>
        <p class="text-muted-foreground max-w-2xl">
          Colaboraciones, contenido o simplemente decir hola. Email para marcas, WhatsApp para
          respuesta rápida.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <a
            hlmCard
            class="flex items-center gap-4"
            href="https://wa.me/593960463743"
            target="_blank"
            rel="noreferrer"
            appTiltCard
            [max]="6"
            [scale]="1.02"
          >
            <span
              class="w-[52px] h-[52px] rounded-2xl inline-flex items-center justify-center flex-shrink-0 bg-primary/[0.12] text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white"
              aria-hidden="true"
            >
              <ng-icon hlmIcon name="lucideMessageCircle" class="w-6 h-6 block" />
            </span>
            <div class="min-w-0">
              <span
                class="block text-xs font-extrabold uppercase tracking-widest text-primary mb-0.5"
                >WhatsApp</span
              >
              <span class="block text-sm font-bold text-foreground truncate">+593 96 046 3743</span>
            </div>
          </a>
          <a
            hlmCard
            class="flex items-center gap-4"
            [href]="'mailto:' + siteMeta.email"
            appTiltCard
            [max]="6"
            [scale]="1.02"
          >
            <span
              class="w-[52px] h-[52px] rounded-2xl inline-flex items-center justify-center flex-shrink-0 bg-primary/[0.12] text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white"
              aria-hidden="true"
            >
              <ng-icon hlmIcon name="lucideMail" class="w-6 h-6 block" />
            </span>
            <div class="min-w-0">
              <span
                class="block text-xs font-extrabold uppercase tracking-widest text-primary mb-0.5"
                >Correo</span
              >
              <span class="block text-sm font-bold text-foreground truncate">{{
                siteMeta.email
              }}</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="py-10 pb-12" appScrollReveal>
      <div class="max-w-6xl mx-auto px-4">
        <div hlmCard class="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
              Canales activos
            </p>
            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-3">
              Respondemos por donde sea más cómodo.
            </h2>
            <p class="text-muted-foreground leading-relaxed max-w-md">
              WhatsApp para resolver rápido, correo para colaboraciones y redes para seguir el caos
              diario de Iris y Rubi.
            </p>
          </div>

          <div class="grid gap-3">
            <a
              hlmCard
              href="https://www.instagram.com/laschubys/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              class="inline-flex items-center gap-3.5"
            >
              <span
                class="w-8 h-8 rounded-xl inline-flex items-center justify-center flex-shrink-0 bg-primary/[0.12] text-primary"
                aria-hidden="true"
              >
                <ng-icon hlmIcon name="lucideInstagram" class="w-[18px] h-[18px] block" />
              </span>
              <span>Instagram</span>
            </a>
            <a
              hlmCard
              href="https://www.tiktok.com/@laschubys.oficial"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              class="inline-flex items-center gap-3.5"
            >
              <span
                class="w-8 h-8 rounded-xl inline-flex items-center justify-center flex-shrink-0 bg-primary/[0.12] text-primary"
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
              hlmCard
              href="https://www.facebook.com/people/Las-Chubys/61589964727281/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              class="inline-flex items-center gap-3.5"
            >
              <span
                class="w-8 h-8 rounded-xl inline-flex items-center justify-center flex-shrink-0 bg-primary/[0.12] text-primary"
                aria-hidden="true"
              >
                <ng-icon hlmIcon name="lucideFacebook" class="w-[18px] h-[18px] block" />
              </span>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="py-10 pb-12" appScrollReveal>
      <div class="max-w-6xl mx-auto px-4">
        <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">Formulario</p>
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-3">
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
            <label hlmLabel for="contact-name">Nombre</label>
            <input
              hlmInput
              id="contact-name"
              formControlName="name"
              type="text"
              placeholder="Tu nombre"
              data-testid="contact-name-input"
            />
          </div>
          <div class="field grid gap-1.5">
            <label hlmLabel for="contact-email">Correo</label>
            <input
              hlmInput
              id="contact-email"
              formControlName="email"
              type="email"
              placeholder="tu@email.com"
              data-testid="contact-email-input"
            />
          </div>
          <div class="field grid gap-1.5 md:col-span-2">
            <label hlmLabel for="contact-message">Mensaje</label>
            <textarea
              hlmTextarea
              id="contact-message"
              formControlName="message"
              rows="4"
              placeholder="¿En qué podemos ayudarte?"
              data-testid="contact-message-input"
            ></textarea>
          </div>
          <div class="field md:col-span-2">
            <button
              hlmBtn
              type="submit"
              [variant]="justSent() ? 'outline' : 'default'"
              [disabled]="pending() || contactForm.invalid"
              data-testid="contact-submit-btn"
            >
              {{ buttonLabel() }}
            </button>
          </div>
          @if (feedback()) {
            <div class="md:col-span-2">
              <div hlmAlert [variant]="sent() ? 'default' : 'destructive'">
                <ng-icon
                  hlmIcon
                  [name]="sent() ? 'lucideCheckCircle' : 'lucideAlertCircle'"
                  class="w-4 h-4"
                />
                <h4 hlmAlertTitle>{{ sent() ? 'Mensaje enviado' : 'Error al enviar' }}</h4>
                <p hlmAlertDescription>{{ feedback() }}</p>
              </div>
            </div>
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
    if (this.pending() || this.contactForm.invalid) {
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
