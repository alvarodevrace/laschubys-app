import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import {
  HlmSelect,
  HlmSelectContent,
  HlmSelectItem,
  HlmSelectTrigger,
  HlmSelectValue,
} from '@spartan-ng/helm/select';
import {
  HlmCard,
  HlmCardContent,
  HlmCardHeader,
  HlmCardTitle,
  HlmCardDescription,
  HlmCardFooter,
} from '@spartan-ng/helm/card';
import { HlmBadge } from '@spartan-ng/helm/badge';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ui-playground',
  standalone: true,
  imports: [
    TitleCasePipe,
    UpperCasePipe,
    HlmButton,
    HlmInput,
    HlmLabel,
    HlmTextarea,
    HlmSelect,
    HlmSelectTrigger,
    HlmSelectValue,
    HlmSelectContent,
    HlmSelectItem,
    HlmCard,
    HlmCardContent,
    HlmCardHeader,
    HlmCardTitle,
    HlmCardDescription,
    HlmCardFooter,
    HlmBadge,
  ],
  template: `
    <div class="min-h-screen bg-white" data-testid="ui-playground">
      <div class="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <header>
          <h1 class="text-3xl font-bold text-foreground">UI Playground</h1>
          <p class="text-muted-foreground mt-2">Catálogo de componentes spartan.ng</p>
        </header>

        <!-- Buttons -->
        <section
          class="border border-border rounded-2xl p-6 space-y-4"
          data-testid="ui-playground-buttons"
        >
          <div>
            <h2 class="section-heading">Button</h2>
            <p class="text-muted-foreground text-sm mt-1">Variantes y tamaños de hlm-button</p>
          </div>

          <div class="space-y-6">
            @for (variant of buttonVariants; track variant.name) {
              <div class="space-y-2">
                <span
                  class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >{{ variant.name }}</span
                >
                <div class="flex flex-wrap items-center gap-4">
                  @for (size of buttonSizes; track size) {
                    <button hlmBtn [variant]="variant.value" [size]="size">
                      {{ variant.name | titlecase }} {{ size | uppercase }}
                    </button>
                  }
                </div>
                <div class="flex flex-wrap items-center gap-4">
                  <button hlmBtn [variant]="variant.value" disabled>
                    {{ variant.name | titlecase }} Disabled
                  </button>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Inputs -->
        <section
          class="border border-border rounded-2xl p-6 space-y-4"
          data-testid="ui-playground-inputs"
        >
          <div>
            <h2 class="section-heading">Input</h2>
            <p class="text-muted-foreground text-sm mt-1">Campos de entrada spartan.ng</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="grid gap-1.5">
              <label hlmLabel for="pg-text">Text</label>
              <input hlmInput id="pg-text" type="text" placeholder="Escribe algo..." />
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="pg-email">Email</label>
              <input hlmInput id="pg-email" type="email" placeholder="correo@ejemplo.com" />
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="pg-tel">Tel</label>
              <input hlmInput id="pg-tel" type="tel" placeholder="+34 600 000 000" />
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="pg-textarea">Textarea</label>
              <textarea hlmTextarea id="pg-textarea" placeholder="Mensaje largo..."></textarea>
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="pg-select">Select</label>
              <hlm-select id="pg-select">
                <hlm-select-trigger>
                  <hlm-select-value placeholder="Selecciona una opción"></hlm-select-value>
                </hlm-select-trigger>
                <hlm-select-content>
                  <hlm-select-item value="Opción 1">Opción 1</hlm-select-item>
                  <hlm-select-item value="Opción 2">Opción 2</hlm-select-item>
                  <hlm-select-item value="Opción 3">Opción 3</hlm-select-item>
                </hlm-select-content>
              </hlm-select>
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="pg-error">Con error</label>
              <input hlmInput id="pg-error" type="text" placeholder="Campo inválido" />
              <span class="text-destructive text-sm">Este campo es obligatorio</span>
            </div>
          </div>
        </section>

        <!-- Cards -->
        <section
          class="border border-border rounded-2xl p-6 space-y-4"
          data-testid="ui-playground-cards"
        >
          <div>
            <h2 class="section-heading">Card</h2>
            <p class="text-muted-foreground text-sm mt-1">Estructuras hlm-card</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article hlmCard>
              <div hlmCardHeader>
                <h3 hlmCardTitle>Default</h3>
                <p hlmCardDescription>Card con header, content y footer</p>
              </div>
              <div hlmCardContent>
                <p class="text-muted-foreground text-sm">Contenido principal de la tarjeta.</p>
              </div>
              <div hlmCardFooter>
                <button hlmBtn size="sm">Acción</button>
              </div>
            </article>

            <article hlmCard data-size="sm">
              <div hlmCardHeader>
                <h3 hlmCardTitle>Compact</h3>
              </div>
              <div hlmCardContent>
                <p class="text-muted-foreground text-sm">Tarjeta con menor espaciado.</p>
              </div>
            </article>

            <article hlmCard>
              <div hlmCardContent>
                <p class="text-muted-foreground text-sm">Tarjeta minimalista solo con contenido.</p>
              </div>
            </article>
          </div>
        </section>

        <!-- Badges -->
        <section
          class="border border-border rounded-2xl p-6 space-y-4"
          data-testid="ui-playground-badges"
        >
          <div>
            <h2 class="section-heading">Badge</h2>
            <p class="text-muted-foreground text-sm mt-1">Etiquetas hlm-badge</p>
          </div>

          <div class="space-y-6">
            @for (variant of badgeVariants; track variant) {
              <div class="space-y-2">
                <span
                  class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >{{ variant | titlecase }}</span
                >
                <div class="flex flex-wrap items-center gap-4">
                  <span hlmBadge [variant]="variant">{{ variant | titlecase }}</span>
                  <span hlmBadge [variant]="variant">Con texto</span>
                </div>
              </div>
            }
          </div>
        </section>
      </div>
    </div>
  `,
})
export class UiPlaygroundComponent {
  protected readonly buttonVariants = [
    { name: 'default', value: 'default' as const },
    { name: 'outline', value: 'outline' as const },
    { name: 'secondary', value: 'secondary' as const },
    { name: 'ghost', value: 'ghost' as const },
    { name: 'destructive', value: 'destructive' as const },
  ];
  protected readonly buttonSizes = ['sm', 'default', 'lg'] as const;

  protected readonly badgeVariants = [
    'default',
    'secondary',
    'destructive',
    'outline',
    'ghost',
  ] as const;
}
