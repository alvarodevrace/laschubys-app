import {
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  lucideAlertCircle,
  lucideCheck,
  lucideFileText,
  lucideLoader2,
  lucideMail,
  lucidePercent,
  lucidePlus,
  lucideSave,
  lucideTrash2,
  lucideUsers,
} from '@ng-icons/lucide';

import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

import { AdminMediaKitService, MediaKitConfigRecord } from './admin-media-kit.service';

interface NetworkRow {
  name: string;
  handle: string;
  followers: string;
  engagement: string;
  reachMonthly: string;
  viewsMonthly: string;
  href: string;
}

interface AudienceOverviewRow {
  countriesCount: string;
  countriesLabel: string;
  femalePercent: string;
  femaleLabel: string;
  ageRange: string;
  ageLabel: string;
  countries: string[];
}

interface CollabFormatItem {
  title: string;
  description: string;
}

interface HouseFormatItem {
  title: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-media-kit',
  standalone: true,
  imports: [
    FormsModule,
    HlmAlertImports,
    HlmButtonImports,
    HlmCardImports,
    HlmIconImports,
    HlmInput,
    HlmLabel,
    HlmSkeletonImports,
  ],
  providers: [
    provideIcons({
      lucideAlertCircle,
      lucideCheck,
      lucideFileText,
      lucideLoader2,
      lucideMail,
      lucidePercent,
      lucidePlus,
      lucideSave,
      lucideTrash2,
      lucideUsers,
    }),
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-foreground">Media Kit</h1>
          <p class="text-sm text-muted-foreground">
            Edita métricas, audiencia y servicios. Las imágenes y textos fijos se actualizan en
            código.
          </p>
        </div>
        <a
          href="/media-kit"
          target="_blank"
          rel="noopener noreferrer"
          hlmBtn
          variant="outline"
          size="sm"
        >
          Ver público
        </a>
      </div>

      @if (configResource.isLoading()) {
        <div class="grid gap-4">
          @for (_ of skeletons(); track $index) {
            <div hlmSkeleton class="h-40 w-full rounded-xl"></div>
          }
        </div>
      }

      @if (configResource.error(); as error) {
        <div hlmAlert variant="destructive">
          <ng-icon hlmIcon name="lucideAlertCircle" class="w-4 h-4" />
          <h4 hlmAlertTitle>No se pudo cargar la configuración</h4>
          <p hlmAlertDescription>{{ error.message || 'Intenta de nuevo.' }}</p>
        </div>
      }

      @if (configResource.value()) {
        <!-- Contacto -->
        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlmIcon name="lucideMail" class="w-5 h-5 text-primary" />
              <h2 hlmCardTitle>Contacto</h2>
            </div>
            <p hlmCardDescription>Datos de contacto que aparecen en el media kit público.</p>
          </div>

          <div hlmCardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label hlmLabel for="contact-email">Correo</label>
                <input hlmInput id="contact-email" type="email" [(ngModel)]="contactEmail" />
              </div>
              <div>
                <label hlmLabel for="contact-phone">Teléfono</label>
                <input hlmInput id="contact-phone" type="tel" [(ngModel)]="contactPhone" />
              </div>
              <div class="md:col-span-2">
                <label hlmLabel for="contact-location">Ubicación</label>
                <input hlmInput id="contact-location" type="text" [(ngModel)]="contactLocation" />
              </div>
            </div>
          </div>

          <div hlmCardFooter class="justify-end">
            <button
              hlmBtn
              type="button"
              (click)="saveContact()"
              [disabled]="savingKeys().has('contact')"
              data-testid="save-contact"
            >
              @if (savingKeys().has('contact')) {
                <ng-icon hlmIcon name="lucideLoader2" class="w-4 h-4 mr-2 animate-spin" />
              } @else {
                <ng-icon hlmIcon name="lucideSave" class="w-4 h-4 mr-2" />
              }
              Guardar contacto
            </button>
          </div>
        </section>

        <!-- === Secciones nuevas (diseño media kit PDF) === -->

        <!-- Portada -->
        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlmIcon name="lucideFileText" class="w-5 h-5 text-primary" />
              <h2 hlmCardTitle>Portada</h2>
            </div>
            <p hlmCardDescription>Título y subtítulo que aparecen en la portada del media kit.</p>
          </div>
          <div hlmCardContent>
            <div class="grid grid-cols-1 gap-4 max-w-2xl">
              <div>
                <label hlmLabel for="cover-title">Título</label>
                <input hlmInput id="cover-title" type="text" [(ngModel)]="coverTitle" />
              </div>
              <div>
                <label hlmLabel for="cover-subtitle">Subtítulo</label>
                <textarea
                  hlmInput
                  id="cover-subtitle"
                  rows="2"
                  [(ngModel)]="coverSubtitle"
                ></textarea>
              </div>
            </div>
          </div>
          <div hlmCardFooter class="justify-end">
            <button
              hlmBtn
              type="button"
              (click)="saveCover()"
              [disabled]="savingKeys().has('cover')"
            >
              @if (savingKeys().has('cover')) {
                <ng-icon hlmIcon name="lucideLoader2" class="w-4 h-4 mr-2 animate-spin" />
              } @else {
                <ng-icon hlmIcon name="lucideSave" class="w-4 h-4 mr-2" />
              }
              Guardar portada
            </button>
          </div>
        </section>

        <!-- Métricas por red (nuevo) -->
        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlmIcon name="lucideUsers" class="w-5 h-5 text-primary" />
              <h2 hlmCardTitle>Métricas por red</h2>
            </div>
            <p hlmCardDescription>
              Seguidores, engagement, alcance y vistas por red social. Aparecen en la vista pública
              con logos de cada red.
            </p>
          </div>
          <div hlmCardContent class="grid gap-4">
            @for (row of networks(); track $index; let idx = $index) {
              <div
                class="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 border border-border rounded-lg bg-muted/30"
              >
                <div class="md:col-span-2">
                  <label hlmLabel [for]="'net-name-' + idx">Red</label>
                  <input
                    hlmInput
                    [id]="'net-name-' + idx"
                    type="text"
                    [(ngModel)]="row.name"
                    placeholder="Instagram"
                  />
                </div>
                <div class="md:col-span-2">
                  <label hlmLabel [for]="'net-handle-' + idx">Cuenta</label>
                  <input
                    hlmInput
                    [id]="'net-handle-' + idx"
                    type="text"
                    [(ngModel)]="row.handle"
                    placeholder="@laschubys"
                  />
                </div>
                <div class="md:col-span-2">
                  <label hlmLabel [for]="'net-followers-' + idx">Seguidores</label>
                  <input
                    hlmInput
                    [id]="'net-followers-' + idx"
                    type="text"
                    [(ngModel)]="row.followers"
                    placeholder="31.3K"
                  />
                </div>
                <div class="md:col-span-2">
                  <label hlmLabel [for]="'net-engagement-' + idx">Engagement</label>
                  <input
                    hlmInput
                    [id]="'net-engagement-' + idx"
                    type="text"
                    [(ngModel)]="row.engagement"
                    placeholder="21%"
                  />
                </div>
                <div class="md:col-span-2">
                  <label hlmLabel [for]="'net-reach-' + idx">Alcance/mes</label>
                  <input
                    hlmInput
                    [id]="'net-reach-' + idx"
                    type="text"
                    [(ngModel)]="row.reachMonthly"
                    placeholder="963K"
                  />
                </div>
                <div class="md:col-span-2">
                  <label hlmLabel [for]="'net-views-' + idx">Vistas/mes</label>
                  <input
                    hlmInput
                    [id]="'net-views-' + idx"
                    type="text"
                    [(ngModel)]="row.viewsMonthly"
                    placeholder="1.8M"
                  />
                </div>
                <div class="md:col-span-10">
                  <label hlmLabel [for]="'net-href-' + idx">Enlace</label>
                  <input hlmInput [id]="'net-href-' + idx" type="url" [(ngModel)]="row.href" />
                </div>
                <div class="md:col-span-2 flex items-end justify-end">
                  <button
                    hlmBtn
                    variant="ghost"
                    size="sm"
                    type="button"
                    (click)="removeNetwork(idx)"
                  >
                    <ng-icon hlmIcon name="lucideTrash2" class="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            }
            <button hlmBtn variant="outline" type="button" (click)="addNetwork()">
              <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
              Agregar red
            </button>
          </div>
          <div hlmCardFooter class="justify-end">
            <button
              hlmBtn
              type="button"
              (click)="saveNetworks()"
              [disabled]="savingKeys().has('metrics')"
            >
              @if (savingKeys().has('metrics')) {
                <ng-icon hlmIcon name="lucideLoader2" class="w-4 h-4 mr-2 animate-spin" />
              } @else {
                <ng-icon hlmIcon name="lucideSave" class="w-4 h-4 mr-2" />
              }
              Guardar métricas
            </button>
          </div>
        </section>

        <!-- Audiencia (nuevo formato) -->
        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlmIcon name="lucidePercent" class="w-5 h-5 text-primary" />
              <h2 hlmCardTitle>Audiencia (resumen)</h2>
            </div>
            <p hlmCardDescription>
              Países, género y rango de edad que aparecen en la vista pública.
            </p>
          </div>
          <div hlmCardContent class="grid gap-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label hlmLabel for="aud-countries-count">Cantidad países</label>
                <input
                  hlmInput
                  id="aud-countries-count"
                  type="text"
                  [(ngModel)]="audienceOverview().countriesCount"
                  placeholder="+10"
                />
              </div>
              <div>
                <label hlmLabel for="aud-countries-label">Etiqueta países</label>
                <input
                  hlmInput
                  id="aud-countries-label"
                  type="text"
                  [(ngModel)]="audienceOverview().countriesLabel"
                  placeholder="países"
                />
              </div>
              <div></div>
              <div>
                <label hlmLabel for="aud-female-percent">% Femenino</label>
                <input
                  hlmInput
                  id="aud-female-percent"
                  type="text"
                  [(ngModel)]="audienceOverview().femalePercent"
                  placeholder="66%"
                />
              </div>
              <div>
                <label hlmLabel for="aud-female-label">Etiqueta género</label>
                <input
                  hlmInput
                  id="aud-female-label"
                  type="text"
                  [(ngModel)]="audienceOverview().femaleLabel"
                  placeholder="mujeres"
                />
              </div>
              <div></div>
              <div>
                <label hlmLabel for="aud-age-range">Rango edad</label>
                <input
                  hlmInput
                  id="aud-age-range"
                  type="text"
                  [(ngModel)]="audienceOverview().ageRange"
                  placeholder="25-44"
                />
              </div>
              <div>
                <label hlmLabel for="aud-age-label">Etiqueta edad</label>
                <input
                  hlmInput
                  id="aud-age-label"
                  type="text"
                  [(ngModel)]="audienceOverview().ageLabel"
                  placeholder="años"
                />
              </div>
            </div>
            <div>
              <h3 class="text-sm font-semibold mb-2">Países</h3>
              @for (country of audienceOverview().countries; track $index; let idx = $index) {
                <div class="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
                  <div class="md:col-span-10">
                    <input
                      hlmInput
                      type="text"
                      placeholder="Ecuador"
                      [(ngModel)]="audienceOverview().countries[idx]"
                    />
                  </div>
                  <div class="md:col-span-2 flex items-center">
                    <button
                      hlmBtn
                      variant="ghost"
                      size="sm"
                      type="button"
                      (click)="removeAudienceCountry(idx)"
                    >
                      <ng-icon hlmIcon name="lucideTrash2" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              }
              <button
                hlmBtn
                variant="outline"
                size="sm"
                type="button"
                (click)="addAudienceCountry()"
              >
                <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
                Agregar país
              </button>
            </div>
          </div>
          <div hlmCardFooter class="justify-end">
            <button
              hlmBtn
              type="button"
              (click)="saveAudienceOverview()"
              [disabled]="savingKeys().has('audience')"
            >
              @if (savingKeys().has('audience')) {
                <ng-icon hlmIcon name="lucideLoader2" class="w-4 h-4 mr-2 animate-spin" />
              } @else {
                <ng-icon hlmIcon name="lucideSave" class="w-4 h-4 mr-2" />
              }
              Guardar audiencia
            </button>
          </div>
        </section>

        <!-- Formatos de colaboración -->
        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlmIcon name="lucideFileText" class="w-5 h-5 text-primary" />
              <h2 hlmCardTitle>Formatos de colaboración</h2>
            </div>
            <p hlmCardDescription>
              Título, introducción y lista de formatos de colaboración con marcas.
            </p>
          </div>
          <div hlmCardContent class="grid gap-4">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label hlmLabel for="collab-title">Título</label>
                <input hlmInput id="collab-title" type="text" [(ngModel)]="collabFormatsTitle" />
              </div>
              <div>
                <label hlmLabel for="collab-intro">Introducción</label>
                <textarea
                  hlmInput
                  id="collab-intro"
                  rows="2"
                  [(ngModel)]="collabFormatsIntro"
                ></textarea>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-semibold mb-2">Items</h3>
              @for (item of collabFormatsItems(); track $index; let idx = $index) {
                <div class="grid gap-2 p-3 border border-border rounded-lg bg-muted/30 mb-3">
                  <div class="grid grid-cols-1 md:grid-cols-12 gap-2">
                    <div class="md:col-span-10">
                      <input
                        hlmInput
                        type="text"
                        placeholder="Título del formato"
                        [(ngModel)]="collabFormatsItems()[idx].title"
                      />
                    </div>
                    <div class="md:col-span-2 flex items-center justify-end">
                      <button
                        hlmBtn
                        variant="ghost"
                        size="sm"
                        type="button"
                        (click)="removeCollabItem(idx)"
                      >
                        <ng-icon hlmIcon name="lucideTrash2" class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    hlmInput
                    rows="2"
                    placeholder="Descripción"
                    [(ngModel)]="collabFormatsItems()[idx].description"
                  ></textarea>
                </div>
              }
              <button hlmBtn variant="outline" size="sm" type="button" (click)="addCollabItem()">
                <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
                Agregar formato
              </button>
            </div>
          </div>
          <div hlmCardFooter class="justify-end">
            <button
              hlmBtn
              type="button"
              (click)="saveCollabFormats()"
              [disabled]="savingKeys().has('collab_formats')"
            >
              @if (savingKeys().has('collab_formats')) {
                <ng-icon hlmIcon name="lucideLoader2" class="w-4 h-4 mr-2 animate-spin" />
              } @else {
                <ng-icon hlmIcon name="lucideSave" class="w-4 h-4 mr-2" />
              }
              Guardar colaboración
            </button>
          </div>
        </section>

        <!-- Formatos de La Casa Chuby -->
        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlmIcon name="lucideFileText" class="w-5 h-5 text-primary" />
              <h2 hlmCardTitle>Formatos de La Casa Chuby</h2>
            </div>
            <p hlmCardDescription>
              Título, nota de crecimiento y lista de formatos de contenido propio.
            </p>
          </div>
          <div hlmCardContent class="grid gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label hlmLabel for="house-title">Título</label>
                <input hlmInput id="house-title" type="text" [(ngModel)]="houseFormatsTitle" />
              </div>
              <div>
                <label hlmLabel for="house-growth">Nota de crecimiento</label>
                <input
                  hlmInput
                  id="house-growth"
                  type="text"
                  [(ngModel)]="houseFormatsGrowthNote"
                  placeholder="Crecimiento 100% orgánico."
                />
              </div>
            </div>
            <div>
              <h3 class="text-sm font-semibold mb-2">Items</h3>
              @for (item of houseFormatsItems(); track $index; let idx = $index) {
                <div class="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
                  <div class="md:col-span-10">
                    <input
                      hlmInput
                      type="text"
                      placeholder="Nombre del formato"
                      [(ngModel)]="houseFormatsItems()[idx].title"
                    />
                  </div>
                  <div class="md:col-span-2 flex items-center">
                    <button
                      hlmBtn
                      variant="ghost"
                      size="sm"
                      type="button"
                      (click)="removeHouseItem(idx)"
                    >
                      <ng-icon hlmIcon name="lucideTrash2" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              }
              <button hlmBtn variant="outline" size="sm" type="button" (click)="addHouseItem()">
                <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
                Agregar formato
              </button>
            </div>
          </div>
          <div hlmCardFooter class="justify-end">
            <button
              hlmBtn
              type="button"
              (click)="saveHouseFormats()"
              [disabled]="savingKeys().has('house_formats')"
            >
              @if (savingKeys().has('house_formats')) {
                <ng-icon hlmIcon name="lucideLoader2" class="w-4 h-4 mr-2 animate-spin" />
              } @else {
                <ng-icon hlmIcon name="lucideSave" class="w-4 h-4 mr-2" />
              }
              Guardar formatos
            </button>
          </div>
        </section>

        <div class="fixed top-4 right-4 z-50 grid gap-2 w-full max-w-sm">
          @for (notification of notifications(); track notification.id) {
            <div
              hlmAlert
              [class.bg-green-50]="notification.type === 'success'"
              [class.border-green-200]="notification.type === 'success'"
              [class.bg-red-50]="notification.type === 'error'"
              [class.border-red-200]="notification.type === 'error'"
              [attr.aria-live]="notification.type === 'error' ? 'assertive' : 'polite'"
            >
              <ng-icon
                hlmIcon
                [name]="notification.type === 'success' ? 'lucideCheck' : 'lucideAlertCircle'"
                [class.text-green-600]="notification.type === 'success'"
                [class.text-red-600]="notification.type === 'error'"
                class="w-4 h-4"
              />
              <p
                class="text-sm font-medium"
                [class.text-green-800]="notification.type === 'success'"
                [class.text-red-800]="notification.type === 'error'"
              >
                {{ notification.message }}
              </p>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AdminMediaKitComponent {
  private readonly adminService = inject(AdminMediaKitService);

  protected readonly contactEmail = signal('');
  protected readonly contactPhone = signal('');
  protected readonly contactLocation = signal('');

  // Secciones nuevas
  protected readonly coverTitle = signal('');
  protected readonly coverSubtitle = signal('');
  protected readonly networks = signal<NetworkRow[]>([]);
  protected readonly audienceOverview = signal<AudienceOverviewRow>({
    countriesCount: '',
    countriesLabel: '',
    femalePercent: '',
    femaleLabel: '',
    ageRange: '',
    ageLabel: '',
    countries: [],
  });
  protected readonly collabFormatsTitle = signal('');
  protected readonly collabFormatsIntro = signal('');
  protected readonly collabFormatsItems = signal<CollabFormatItem[]>([]);
  protected readonly houseFormatsTitle = signal('');
  protected readonly houseFormatsGrowthNote = signal('');
  protected readonly houseFormatsItems = signal<HouseFormatItem[]>([]);

  protected readonly savingKeys = signal<Set<string>>(new Set());
  protected readonly notifications = signal<
    Array<{ id: number; type: 'success' | 'error'; message: string }>
  >([]);
  protected readonly skeletons = computed(() => Array.from({ length: 4 }));
  private notificationId = 0;

  protected readonly configResource = resource({
    loader: () => this.adminService.getConfig(),
  });

  constructor() {
    effect(() => {
      const records = this.configResource.value();
      if (!records) return;

      this.hydrateFromRecords(records);
    });
  }

  private hydrateFromRecords(records: MediaKitConfigRecord[]) {
    const map = new Map(records.map((r) => [r.key, r.data]));

    const contact = map.get('contact');
    if (contact) {
      this.contactEmail.set(contact['email'] ? String(contact['email']) : '');
      this.contactPhone.set(contact['phone'] ? String(contact['phone']) : '');
      this.contactLocation.set(contact['location'] ? String(contact['location']) : '');
    }

    // === Secciones nuevas ===
    const cover = map.get('cover');
    if (cover) {
      this.coverTitle.set(cover['title'] ? String(cover['title']) : '');
      this.coverSubtitle.set(cover['subtitle'] ? String(cover['subtitle']) : '');
    }

    const metrics = map.get('metrics');
    if (metrics && Array.isArray(metrics['networks'])) {
      this.networks.set(
        metrics['networks']
          .filter((n): n is Record<string, unknown> => typeof n === 'object' && n !== null)
          .map((n) => ({
            name: String(n['name'] || ''),
            handle: String(n['handle'] || ''),
            followers: String(n['followers'] || ''),
            engagement: String(n['engagement'] || ''),
            reachMonthly: String(n['reachMonthly'] || ''),
            viewsMonthly: String(n['viewsMonthly'] || ''),
            href: n['href'] ? String(n['href']) : '',
          })),
      );
    }

    const audienceNew = map.get('audience');
    if (audienceNew && typeof audienceNew === 'object') {
      // Si tiene countriesCount es formato nuevo; si tiene female es formato viejo
      if (audienceNew['countriesCount'] !== undefined) {
        this.audienceOverview.set({
          countriesCount: String(audienceNew['countriesCount'] || ''),
          countriesLabel: String(audienceNew['countriesLabel'] || ''),
          femalePercent: String(audienceNew['femalePercent'] || ''),
          femaleLabel: String(audienceNew['femaleLabel'] || ''),
          ageRange: String(audienceNew['ageRange'] || ''),
          ageLabel: String(audienceNew['ageLabel'] || ''),
          countries: Array.isArray(audienceNew['countries'])
            ? audienceNew['countries'].map((c: string) => String(c))
            : [],
        });
      }
    }

    const collabFormats = map.get('collab_formats');
    if (collabFormats && Array.isArray(collabFormats['items'])) {
      this.collabFormatsTitle.set(collabFormats['title'] ? String(collabFormats['title']) : '');
      this.collabFormatsIntro.set(collabFormats['intro'] ? String(collabFormats['intro']) : '');
      this.collabFormatsItems.set(
        collabFormats['items']
          .filter((i): i is Record<string, unknown> => typeof i === 'object' && i !== null)
          .map((i) => ({
            title: String(i['title'] || ''),
            description: String(i['description'] || ''),
          })),
      );
    }

    const houseFormats = map.get('house_formats');
    if (houseFormats && Array.isArray(houseFormats['items'])) {
      this.houseFormatsTitle.set(houseFormats['title'] ? String(houseFormats['title']) : '');
      this.houseFormatsGrowthNote.set(
        houseFormats['growthNote'] ? String(houseFormats['growthNote']) : '',
      );
      this.houseFormatsItems.set(
        houseFormats['items']
          .filter((i): i is Record<string, unknown> => typeof i === 'object' && i !== null)
          .map((i) => ({ title: String(i['title'] || '') })),
      );
    }
  }

  protected async saveContact() {
    await this.save(
      'contact',
      {
        email: this.contactEmail(),
        phone: this.contactPhone(),
        location: this.contactLocation(),
        whatsapp: 'https://wa.me/593960463743',
        whatsappLabel: '+593 96 046 3743',
      },
      'Contacto',
    );
  }

  // === Métodos nuevos ===

  protected async saveCover() {
    await this.save(
      'cover',
      {
        title: this.coverTitle(),
        subtitle: this.coverSubtitle(),
        photos: [],
      },
      'Portada',
    );
  }

  protected addNetwork() {
    this.networks.update((rows) => [
      ...rows,
      {
        name: '',
        handle: '',
        followers: '',
        engagement: '',
        reachMonthly: '',
        viewsMonthly: '',
        href: '',
      },
    ]);
  }

  protected removeNetwork(index: number) {
    this.networks.update((rows) => rows.filter((_, i) => i !== index));
  }

  protected async saveNetworks() {
    await this.save(
      'metrics',
      {
        networks: this.networks()
          .filter((n) => n.name)
          .map((n) => ({
            name: n.name,
            handle: n.handle,
            followers: n.followers,
            engagement: n.engagement,
            reachMonthly: n.reachMonthly,
            viewsMonthly: n.viewsMonthly,
            href: n.href || undefined,
          })),
        asOf: 'Julio 2026',
      },
      'Métricas por red',
    );
  }

  protected addAudienceCountry() {
    this.audienceOverview.update((a) => ({ ...a, countries: [...a.countries, ''] }));
  }

  protected removeAudienceCountry(index: number) {
    this.audienceOverview.update((a) => ({
      ...a,
      countries: a.countries.filter((_c: string, i: number) => i !== index),
    }));
  }

  protected async saveAudienceOverview() {
    const aud = this.audienceOverview();
    await this.save(
      'audience',
      {
        countriesCount: aud.countriesCount,
        countriesLabel: aud.countriesLabel,
        femalePercent: aud.femalePercent,
        femaleLabel: aud.femaleLabel,
        ageRange: aud.ageRange,
        ageLabel: aud.ageLabel,
        countries: aud.countries.filter(Boolean),
      },
      'Audiencia',
    );
  }

  protected addCollabItem() {
    this.collabFormatsItems.update((items) => [...items, { title: '', description: '' }]);
  }

  protected removeCollabItem(index: number) {
    this.collabFormatsItems.update((items) => items.filter((_, i) => i !== index));
  }

  protected async saveCollabFormats() {
    await this.save(
      'collab_formats',
      {
        title: this.collabFormatsTitle(),
        intro: this.collabFormatsIntro(),
        items: this.collabFormatsItems().filter((i) => i.title),
      },
      'Formatos de colaboración',
    );
  }

  protected addHouseItem() {
    this.houseFormatsItems.update((items) => [...items, { title: '' }]);
  }

  protected removeHouseItem(index: number) {
    this.houseFormatsItems.update((items) => items.filter((_, i) => i !== index));
  }

  protected async saveHouseFormats() {
    await this.save(
      'house_formats',
      {
        title: this.houseFormatsTitle(),
        growthNote: this.houseFormatsGrowthNote(),
        items: this.houseFormatsItems().filter((i) => i.title),
      },
      'Formatos de La Casa Chuby',
    );
  }

  private async save(key: string, data: Record<string, unknown>, label: string) {
    this.savingKeys.update((set) => new Set([...set, key]));

    try {
      await this.adminService.updateConfig(key, data);
      this.notify('success', `${label} actualizado correctamente.`);
      this.configResource.reload();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo guardar.';
      this.notify('error', `Error guardando ${label.toLowerCase()}: ${message}`);
    } finally {
      this.savingKeys.update((set) => {
        const next = new Set(set);
        next.delete(key);
        return next;
      });
    }
  }

  private notify(type: 'success' | 'error', message: string) {
    const id = ++this.notificationId;
    this.notifications.update((list) => [...list, { id, type, message }]);
    setTimeout(() => {
      this.notifications.update((list) => list.filter((n) => n.id !== id));
    }, 4000);
  }
}
