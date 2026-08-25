import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  lucideAlertCircle,
  lucideCheckCircle,
  lucideFacebook,
  lucideInstagram,
  lucideMail,
  lucideMessageCircle,
  lucideShare2,
} from '@ng-icons/lucide';

import { HlmButtonImports } from '@spartan-ng/helm/button';
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
  ParallaxDirective,
  StaggerChildrenDirective,
  TextRevealDirective,
} from '../../shared/animations';
import { SectionShellComponent } from '../../shared/ui/section-shell/section-shell.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmButtonImports,
    HlmIconImports,
    HlmInputImports,
    HlmLabelImports,
    HlmTextareaImports,
    HlmAlertImports,
    ScrollRevealDirective,
    ParallaxDirective,
    StaggerChildrenDirective,
    TextRevealDirective,
    SectionShellComponent,
  ],
  providers: [
    provideIcons({
      lucideAlertCircle,
      lucideCheckCircle,
      lucideFacebook,
      lucideInstagram,
      lucideMail,
      lucideMessageCircle,
      lucideShare2,
    }),
  ],
  template: `
    <!-- Header band -->
    <section class="relative bg-surface overflow-hidden" aria-labelledby="contact-title">
      <div class="relative max-w-6xl mx-auto px-4 pt-10 pb-24 md:pt-12 md:pb-28">
        <svg
          class="absolute top-6 right-[5%] w-10 h-10 text-primary/10 rotate-[25deg]"
          appParallax
          [speed]="-0.3"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M11.73 2.225c1.434 0 2.597 1.162 2.597 2.597 0 1.434-1.163 2.597-2.597 2.597-1.435 0-2.598-1.163-2.598-2.597s1.163-2.597 2.598-2.597zm-6.39 4.648c1.163 0 2.106.943 2.106 2.106s-.943 2.106-2.106 2.106-2.106-.943-2.106-2.106.943-2.106 2.106-2.106zm12.78 0c1.163 0 2.106.943 2.106 2.106s-.943 2.106-2.106 2.106-2.106-.943-2.106-2.106.943-2.106 2.106-2.106zM9.875 15.01c1.434 0 2.598 1.163 2.598 2.598 0 1.434-1.164 2.597-2.598 2.597-1.434 0-2.597-1.163-2.597-2.597s1.163-2.598 2.597-2.598zm4.65 0c1.434 0 2.597 1.163 2.597 2.598 0 1.434-1.163 2.597-2.597 2.597-1.435 0-2.598-1.163-2.598-2.597s1.163-2.598 2.598-2.598zM12.2 21.477c1.666 0 3.016 1.35 3.016 3.016s-1.35 3.016-3.016 3.016-3.016-1.35-3.016-3.016 1.35-3.016 3.016-3.016z"
          />
        </svg>

        <div class="text-center" appScrollReveal [y]="24" [duration]="0.6">
          <h1
            id="contact-title"
            class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
          >
            <ng-icon hlmIcon name="lucideMail" class="w-5 h-5 md:w-6 md:h-6" />
            <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
              >Hablemos</span
            >
          </h1>
          <p class="text-base md:text-lg font-bold text-muted-foreground">
            Colaboraciones, contenido o simplemente decir hola — email para marcas, WhatsApp para
            respuesta rápida
          </p>
        </div>
      </div>

      <!-- Wave: header → contacto directo -->
      <svg
        class="absolute bottom-0 w-full h-16 md:h-20 pointer-events-none z-10 text-white"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0 20 Q75 0 150 20 T300 20 T450 20 T600 20 T750 20 T900 20 T1050 20 T1200 20 L1200 80 L0 80 Z"
        />
      </svg>
    </section>

    <!-- Contacto directo -->
    <app-section-shell variant="white">
      <div class="text-center mb-10" appScrollReveal [y]="24" [duration]="0.6">
        <h2
          class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
        >
          <ng-icon hlmIcon name="lucideMessageCircle" class="w-5 h-5 md:w-6 md:h-6" />
          <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
            >Contacto directo</span
          >
        </h2>
        <p class="text-base md:text-lg font-bold text-muted-foreground mb-3">
          La forma más rápida de llegar al comité
        </p>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto"
        appStaggerChildren
        childSelector="a"
        [staggerDelay]="0.1"
        [duration]="0.5"
        [y]="30"
      >
        <a
          class="group flex items-center gap-4 rounded-[2.5rem] bg-white border border-border p-5 transition-all duration-500 ease-bounce hover:-translate-y-2 hover:shadow-xl"
          href="https://wa.me/593960463743"
          target="_blank"
          rel="noreferrer"
        >
          <span
            class="w-[52px] h-[52px] rounded-2xl inline-flex items-center justify-center flex-shrink-0 bg-primary/[0.12] text-primary"
            aria-hidden="true"
          >
            <ng-icon hlmIcon name="lucideMessageCircle" class="w-6 h-6 block" />
          </span>
          <div class="min-w-0">
            <span class="block text-xs font-extrabold uppercase tracking-widest text-primary mb-0.5"
              >WhatsApp</span
            >
            <span class="block text-sm font-bold text-foreground truncate">+593 96 046 3743</span>
          </div>
        </a>
        <a
          class="group flex items-center gap-4 rounded-[2.5rem] bg-white border border-border p-5 transition-all duration-500 ease-bounce hover:-translate-y-2 hover:shadow-xl"
          [href]="'mailto:' + siteMeta.email"
        >
          <span
            class="w-[52px] h-[52px] rounded-2xl inline-flex items-center justify-center flex-shrink-0 bg-primary/[0.12] text-primary"
            aria-hidden="true"
          >
            <ng-icon hlmIcon name="lucideMail" class="w-6 h-6 block" />
          </span>
          <div class="min-w-0">
            <span class="block text-xs font-extrabold uppercase tracking-widest text-primary mb-0.5"
              >Correo</span
            >
            <span class="block text-sm font-bold text-foreground truncate">{{
              siteMeta.email
            }}</span>
          </div>
        </a>
      </div>
    </app-section-shell>

    <!-- Wave: contacto directo → canales -->
    <div class="relative h-16 md:h-20 overflow-hidden bg-white -mb-1" aria-hidden="true">
      <svg
        class="absolute bottom-0 w-full h-full text-surface"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0 20 Q75 0 150 20 T300 20 T450 20 T600 20 T750 20 T900 20 T1050 20 T1200 20 L1200 80 L0 80 Z"
        />
      </svg>
    </div>

    <!-- Canales activos -->
    <app-section-shell variant="warm">
      <div class="text-center mb-10" appScrollReveal [y]="24" [duration]="0.6">
        <h2
          class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
        >
          <ng-icon hlmIcon name="lucideShare2" class="w-5 h-5 md:w-6 md:h-6" />
          <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
            >Canales activos</span
          >
        </h2>
        <p class="text-base md:text-lg font-bold text-muted-foreground mb-3">
          Respondemos por donde sea más cómodo
        </p>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto"
        appStaggerChildren
        childSelector="a"
        [staggerDelay]="0.1"
        [duration]="0.5"
        [y]="30"
      >
        <a
          class="group flex items-center gap-4 rounded-[2.5rem] bg-white border border-border p-5 transition-all duration-500 ease-bounce hover:-translate-y-2 hover:shadow-xl"
          href="https://www.instagram.com/laschubys/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          <span
            class="w-11 h-11 rounded-2xl inline-flex items-center justify-center flex-shrink-0 bg-primary/[0.12] text-primary"
            aria-hidden="true"
          >
            <ng-icon hlmIcon name="lucideInstagram" class="w-5 h-5 block" />
          </span>
          <span class="text-sm font-bold text-foreground">Instagram</span>
        </a>
        <a
          class="group flex items-center gap-4 rounded-[2.5rem] bg-white border border-border p-5 transition-all duration-500 ease-bounce hover:-translate-y-2 hover:shadow-xl"
          href="https://www.tiktok.com/@laschubys.oficial"
          target="_blank"
          rel="noreferrer"
          aria-label="TikTok"
        >
          <span
            class="w-11 h-11 rounded-2xl inline-flex items-center justify-center flex-shrink-0 bg-primary/[0.12] text-primary"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" class="w-5 h-5 block">
              <path
                d="M14 3c1 2.2 2.5 3.7 5 4v3.1c-1.8-.1-3.3-.7-4.8-1.8v6.5a5.2 5.2 0 1 1-5.2-5.2c.4 0 .8 0 1.2.1v3.2a2.6 2.6 0 1 0 1.4 2.3V3H14z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
          <span class="text-sm font-bold text-foreground">TikTok</span>
        </a>
        <a
          class="group flex items-center gap-4 rounded-[2.5rem] bg-white border border-border p-5 transition-all duration-500 ease-bounce hover:-translate-y-2 hover:shadow-xl"
          href="https://www.facebook.com/people/Las-Chubys/61589964727281/"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
        >
          <span
            class="w-11 h-11 rounded-2xl inline-flex items-center justify-center flex-shrink-0 bg-primary/[0.12] text-primary"
            aria-hidden="true"
          >
            <ng-icon hlmIcon name="lucideFacebook" class="w-5 h-5 block" />
          </span>
          <span class="text-sm font-bold text-foreground">Facebook</span>
        </a>
      </div>
    </app-section-shell>

    <!-- Wave: canales → formulario -->
    <div class="relative h-16 md:h-20 overflow-hidden bg-surface -mb-1" aria-hidden="true">
      <svg
        class="absolute bottom-0 w-full h-full text-white"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0 20 Q75 0 150 20 T300 20 T450 20 T600 20 T750 20 T900 20 T1050 20 T1200 20 L1200 80 L0 80 Z"
        />
      </svg>
    </div>

    <!-- Formulario -->
    <app-section-shell variant="white">
      <div class="text-center mb-10" appScrollReveal [y]="24" [duration]="0.6">
        <h2
          class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
        >
          <ng-icon hlmIcon name="lucideMessageCircle" class="w-5 h-5 md:w-6 md:h-6" />
          <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
            >Escríbenos directamente</span
          >
        </h2>
        <p class="text-base md:text-lg font-bold text-muted-foreground mb-3">
          Te respondemos pronto
        </p>
      </div>

      <div
        class="rounded-[2.5rem] bg-surface p-6 md:p-8 max-w-3xl mx-auto"
        appScrollReveal
        [y]="30"
        [duration]="0.6"
      >
        <form
          [formGroup]="contactForm"
          (ngSubmit)="submit()"
          class="grid grid-cols-1 md:grid-cols-2 gap-5"
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
    </app-section-shell>
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
