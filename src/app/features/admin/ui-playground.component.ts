import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { CardComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ui-playground',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    CardComponent,
    BadgeComponent,
    TitleCasePipe,
    UpperCasePipe,
  ],
  template: `
    <div class="min-h-screen bg-white" data-testid="ui-playground">
      <div class="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <header>
          <h1 class="text-3xl font-bold text-gray-900">UI Playground</h1>
          <p class="text-gray-500 mt-2">Catálogo de componentes del design system</p>
        </header>

        <!-- Buttons -->
        <section
          class="border border-gray-200 rounded-2xl p-6 space-y-4"
          data-testid="ui-playground-buttons"
        >
          <div>
            <h2 class="section-heading">Button</h2>
            <p class="text-gray-500 text-sm mt-1">Variantes y tamaños del componente botón</p>
          </div>

          <div class="space-y-6">
            @for (variant of buttonVariants; track variant) {
              <div class="space-y-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">{{
                  variant
                }}</span>
                <div class="flex flex-wrap items-center gap-4">
                  @for (size of buttonSizes; track size) {
                    <app-button [variant]="variant" [size]="size">
                      {{ variant | titlecase }} {{ size | uppercase }}
                    </app-button>
                  }
                </div>
                <div class="flex flex-wrap items-center gap-4">
                  <app-button [variant]="variant" [disabled]="true">
                    {{ variant | titlecase }} Disabled
                  </app-button>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Inputs -->
        <section
          class="border border-gray-200 rounded-2xl p-6 space-y-4"
          data-testid="ui-playground-inputs"
        >
          <div>
            <h2 class="section-heading">Input</h2>
            <p class="text-gray-500 text-sm mt-1">Tipos de campo de entrada</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <app-input label="Text" type="text" placeholder="Escribe algo..."></app-input>
            <app-input label="Email" type="email" placeholder="correo@ejemplo.com"></app-input>
            <app-input label="Tel" type="tel" placeholder="+34 600 000 000"></app-input>
            <app-input label="Textarea" type="textarea" placeholder="Mensaje largo..."></app-input>
            <app-input
              label="Select"
              type="select"
              placeholder="Selecciona una opción"
              [options]="['Opción 1', 'Opción 2', 'Opción 3']"
            ></app-input>
            <app-input
              label="Con error"
              type="text"
              placeholder="Campo inválido"
              error="Este campo es obligatorio"
            ></app-input>
          </div>
        </section>

        <!-- Cards -->
        <section
          class="border border-gray-200 rounded-2xl p-6 space-y-4"
          data-testid="ui-playground-cards"
        >
          <div>
            <h2 class="section-heading">Card</h2>
            <p class="text-gray-500 text-sm mt-1">Variantes de tarjeta con diferentes paddings</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (variant of cardVariants; track variant) {
              <div class="space-y-3">
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">{{
                  variant
                }}</span>
                <div class="space-y-3">
                  @for (padding of cardPaddings; track padding) {
                    <app-card [variant]="variant" [padding]="padding">
                      <p class="text-gray-700 text-sm">
                        Card {{ variant | titlecase }} — padding {{ padding | uppercase }}
                      </p>
                    </app-card>
                  }
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Badges -->
        <section
          class="border border-gray-200 rounded-2xl p-6 space-y-4"
          data-testid="ui-playground-badges"
        >
          <div>
            <h2 class="section-heading">Badge</h2>
            <p class="text-gray-500 text-sm mt-1">Etiquetas con diferentes estilos y tamaños</p>
          </div>

          <div class="space-y-6">
            @for (variant of badgeVariants; track variant) {
              <div class="space-y-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">{{
                  variant
                }}</span>
                <div class="flex flex-wrap items-center gap-4">
                  @for (size of badgeSizes; track size) {
                    <app-badge [variant]="variant" [size]="size">
                      {{ variant | titlecase }} {{ size | uppercase }}
                    </app-badge>
                  }
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
  protected readonly buttonVariants = ['primary', 'secondary', 'ghost', 'danger'] as const;
  protected readonly buttonSizes = ['sm', 'md', 'lg'] as const;

  protected readonly cardVariants = ['default', 'bordered', 'elevated'] as const;
  protected readonly cardPaddings = ['sm', 'md', 'lg'] as const;

  protected readonly badgeVariants = ['default', 'outline', 'ghost'] as const;
  protected readonly badgeSizes = ['sm', 'md'] as const;
}
