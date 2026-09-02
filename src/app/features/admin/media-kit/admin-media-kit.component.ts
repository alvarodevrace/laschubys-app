import { Component, computed, effect, inject, resource, signal, ChangeDetectionStrategy } from '@angular/core';
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

interface SocialMetricRow {
  platform: string;
  account: string;
  metric: string;
  label: string;
  engagement?: string;
  href?: string;
}

interface CountryRow {
  country: string;
  percentage: string;
}

interface CityRow {
  city: string;
  percentage: string;
}

interface ServiceRow {
  title: string;
  description: string;
  deliverables: string[];
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
            Edita métricas, audiencia y servicios. Las imágenes y textos fijos se actualizan en código.
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
        <!-- Métricas sociales -->
        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlmIcon name="lucideUsers" class="w-5 h-5 text-primary" />
              <h2 hlmCardTitle>Métricas sociales</h2>
            </div>
            <p hlmCardDescription>
              Redes, seguidores y engagement que aparecen en la sección pública.
            </p>
          </div>

          <div hlmCardContent class="grid gap-4">
            @for (row of socialMetrics(); track $index; let idx = $index) {
              <div class="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 border border-border rounded-lg bg-muted/30">
                <div class="md:col-span-2">
                  <label hlmLabel [for]="'sm-platform-' + idx">Red</label>
                  <input hlmInput [id]="'sm-platform-' + idx" type="text" [(ngModel)]="row.platform" />
                </div>
                <div class="md:col-span-2">
                  <label hlmLabel [for]="'sm-account-' + idx">Cuenta</label>
                  <input hlmInput [id]="'sm-account-' + idx" type="text" [(ngModel)]="row.account" />
                </div>
                <div class="md:col-span-2">
                  <label hlmLabel [for]="'sm-metric-' + idx">Valor</label>
                  <input hlmInput [id]="'sm-metric-' + idx" type="text" [(ngModel)]="row.metric" />
                </div>
                <div class="md:col-span-2">
                  <label hlmLabel [for]="'sm-label-' + idx">Etiqueta</label>
                  <input hlmInput [id]="'sm-label-' + idx" type="text" [(ngModel)]="row.label" />
                </div>
                <div class="md:col-span-2">
                  <label hlmLabel [for]="'sm-engagement-' + idx">Engagement</label>
                  <input hlmInput [id]="'sm-engagement-' + idx" type="text" [(ngModel)]="row.engagement" />
                </div>
                <div class="md:col-span-7">
                  <label hlmLabel [for]="'sm-href-' + idx">Enlace</label>
                  <input hlmInput [id]="'sm-href-' + idx" type="url" [(ngModel)]="row.href" />
                </div>
                <div class="md:col-span-5 flex items-end justify-end">
                  <button hlmBtn variant="ghost" size="sm" type="button" (click)="removeSocialMetric(idx)">
                    <ng-icon hlmIcon name="lucideTrash2" class="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            }

            <button hlmBtn variant="outline" type="button" (click)="addSocialMetric()">
              <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
              Agregar red
            </button>
          </div>

          <div hlmCardFooter class="justify-end">
            <button
              hlmBtn
              type="button"
              (click)="saveSocialMetrics()"
              [disabled]="savingKeys().has('social_metrics')"
              data-testid="save-social-metrics"
            >
              @if (savingKeys().has('social_metrics')) {
                <ng-icon hlmIcon name="lucideLoader2" class="w-4 h-4 mr-2 animate-spin" />
              } @else {
                <ng-icon hlmIcon name="lucideSave" class="w-4 h-4 mr-2" />
              }
              Guardar métricas
            </button>
          </div>
        </section>

        <!-- Audiencia -->
        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlmIcon name="lucidePercent" class="w-5 h-5 text-primary" />
              <h2 hlmCardTitle>Audiencia</h2>
            </div>
            <p hlmCardDescription>Porcentajes de género, países y ciudades principales.</p>
          </div>

          <div hlmCardContent class="grid gap-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label hlmLabel for="aud-female">Femenino</label>
                <input hlmInput id="aud-female" type="text" [(ngModel)]="audienceFemale" />
              </div>
              <div>
                <label hlmLabel for="aud-male">Masculino</label>
                <input hlmInput id="aud-male" type="text" [(ngModel)]="audienceMale" />
              </div>
            </div>

            <div>
              <h3 class="text-sm font-semibold mb-2">Países principales</h3>
              @for (row of topCountries(); track $index; let idx = $index) {
                <div class="grid grid-cols-1 md:grid-cols-12 gap-3 mb-2">
                  <div class="md:col-span-5">
                    <input hlmInput type="text" placeholder="País" [(ngModel)]="row.country" />
                  </div>
                  <div class="md:col-span-4">
                    <input hlmInput type="text" placeholder="Porcentaje" [(ngModel)]="row.percentage" />
                  </div>
                  <div class="md:col-span-3 flex items-end">
                    <button hlmBtn variant="ghost" size="sm" type="button" (click)="removeCountry(idx)">
                      <ng-icon hlmIcon name="lucideTrash2" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              }
              <button hlmBtn variant="outline" size="sm" type="button" (click)="addCountry()">
                <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
                Agregar país
              </button>
            </div>

            <div>
              <h3 class="text-sm font-semibold mb-2">Ciudades principales</h3>
              @for (row of topCities(); track $index; let idx = $index) {
                <div class="grid grid-cols-1 md:grid-cols-12 gap-3 mb-2">
                  <div class="md:col-span-5">
                    <input hlmInput type="text" placeholder="Ciudad" [(ngModel)]="row.city" />
                  </div>
                  <div class="md:col-span-4">
                    <input hlmInput type="text" placeholder="Porcentaje" [(ngModel)]="row.percentage" />
                  </div>
                  <div class="md:col-span-3 flex items-end">
                    <button hlmBtn variant="ghost" size="sm" type="button" (click)="removeCity(idx)">
                      <ng-icon hlmIcon name="lucideTrash2" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              }
              <button hlmBtn variant="outline" size="sm" type="button" (click)="addCity()">
                <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
                Agregar ciudad
              </button>
            </div>
          </div>

          <div hlmCardFooter class="justify-end">
            <button
              hlmBtn
              type="button"
              (click)="saveAudience()"
              [disabled]="savingKeys().has('audience')"
              data-testid="save-audience"
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

        <!-- Pilares de contenido -->
        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlmIcon name="lucideFileText" class="w-5 h-5 text-primary" />
              <h2 hlmCardTitle>Pilares de contenido</h2>
            </div>
            <p hlmCardDescription>Títulos que aparecen como tarjetas en la sección de contenido.</p>
          </div>

          <div hlmCardContent class="grid gap-3">
            @for (pillar of contentPillars(); track $index; let idx = $index) {
              <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div class="md:col-span-9">
                  <input hlmInput type="text" placeholder="Pilar" [(ngModel)]="contentPillars()[idx]" />
                </div>
                <div class="md:col-span-3 flex items-center">
                  <button hlmBtn variant="ghost" size="sm" type="button" (click)="removePillar(idx)">
                    <ng-icon hlmIcon name="lucideTrash2" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            }
            <button hlmBtn variant="outline" size="sm" type="button" (click)="addPillar()">
              <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
              Agregar pilar
            </button>
          </div>

          <div hlmCardFooter class="justify-end">
            <button
              hlmBtn
              type="button"
              (click)="saveContentPillars()"
              [disabled]="savingKeys().has('content_pillars')"
              data-testid="save-content-pillars"
            >
              @if (savingKeys().has('content_pillars')) {
                <ng-icon hlmIcon name="lucideLoader2" class="w-4 h-4 mr-2 animate-spin" />
              } @else {
                <ng-icon hlmIcon name="lucideSave" class="w-4 h-4 mr-2" />
              }
              Guardar pilares
            </button>
          </div>
        </section>

        <!-- Servicios -->
        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlmIcon name="lucideFileText" class="w-5 h-5 text-primary" />
              <h2 hlmCardTitle>Servicios</h2>
            </div>
            <p hlmCardDescription>Servicios que ofrecen a marcas y colaboradores.</p>
          </div>

          <div hlmCardContent class="grid gap-4">
            @for (row of services(); track $index; let idx = $index) {
              <div class="grid gap-3 p-3 border border-border rounded-lg bg-muted/30">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label hlmLabel [for]="'svc-title-' + idx">Título</label>
                    <input hlmInput [id]="'svc-title-' + idx" type="text" [(ngModel)]="row.title" />
                  </div>
                  <div class="flex items-end justify-end">
                    <button hlmBtn variant="ghost" size="sm" type="button" (click)="removeService(idx)">
                      <ng-icon hlmIcon name="lucideTrash2" class="w-4 h-4" />
                      Eliminar servicio
                    </button>
                  </div>
                </div>
                <div>
                  <label hlmLabel [for]="'svc-desc-' + idx">Descripción</label>
                  <textarea
                    hlmInput
                    [id]="'svc-desc-' + idx"
                    rows="2"
                    [(ngModel)]="row.description"
                  ></textarea>
                </div>
                <div>
                  <label class="text-sm font-medium">Deliverables</label>
                  @for (deliverable of row.deliverables; track $index; let dIdx = $index) {
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
                      <div class="md:col-span-10">
                        <input hlmInput type="text" [(ngModel)]="row.deliverables[dIdx]" />
                      </div>
                      <div class="md:col-span-2 flex items-center">
                        <button
                          hlmBtn
                          variant="ghost"
                          size="sm"
                          type="button"
                          (click)="removeDeliverable(idx, dIdx)"
                        >
                          <ng-icon hlmIcon name="lucideTrash2" class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  }
                  <button hlmBtn variant="outline" size="sm" type="button" (click)="addDeliverable(idx)">
                    <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
                    Agregar deliverable
                  </button>
                </div>
              </div>
            }
            <button hlmBtn variant="outline" type="button" (click)="addService()">
              <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
              Agregar servicio
            </button>
          </div>

          <div hlmCardFooter class="justify-end">
            <button
              hlmBtn
              type="button"
              (click)="saveServices()"
              [disabled]="savingKeys().has('services')"
              data-testid="save-services"
            >
              @if (savingKeys().has('services')) {
                <ng-icon hlmIcon name="lucideLoader2" class="w-4 h-4 mr-2 animate-spin" />
              } @else {
                <ng-icon hlmIcon name="lucideSave" class="w-4 h-4 mr-2" />
              }
              Guardar servicios
            </button>
          </div>
        </section>

        <!-- Contacto -->
        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlmIcon name="lucideMail" class="w-5 h-5 text-primary" />
              <h2 hlmCardTitle>Contacto</h2>
            </div>
            <p hlmCardDescription>Correo que aparece en los CTAs del media kit.</p>
          </div>

          <div hlmCardContent>
            <div class="max-w-md">
              <label hlmLabel for="contact-email">Correo</label>
              <input hlmInput id="contact-email" type="email" [(ngModel)]="contactEmail" />
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

  protected readonly socialMetrics = signal<SocialMetricRow[]>([]);
  protected readonly audienceFemale = signal('');
  protected readonly audienceMale = signal('');
  protected readonly topCountries = signal<CountryRow[]>([]);
  protected readonly topCities = signal<CityRow[]>([]);
  protected readonly contentPillars = signal<string[]>([]);
  protected readonly services = signal<ServiceRow[]>([]);
  protected readonly contactEmail = signal('');

  protected readonly savingKeys = signal<Set<string>>(new Set());
  protected readonly notifications = signal<Array<{ id: number; type: 'success' | 'error'; message: string }>>([]);
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

    const social = map.get('social_metrics');
    if (social && Array.isArray(social['items'])) {
      this.socialMetrics.set(
        social['items'].map((item: Record<string, string>) => ({
          platform: String(item['platform'] || ''),
          account: String(item['account'] || ''),
          metric: String(item['metric'] || ''),
          label: String(item['label'] || ''),
          engagement: item['engagement'] ? String(item['engagement']) : '',
          href: item['href'] ? String(item['href']) : '',
        })),
      );
    }

    const audience = map.get('audience');
    if (audience) {
      this.audienceFemale.set(audience['female'] ? String(audience['female']) : '');
      this.audienceMale.set(audience['male'] ? String(audience['male']) : '');

      const countries = Array.isArray(audience['topCountries'])
        ? audience['topCountries'].map((c: Record<string, string>) => ({
            country: String(c['country'] || ''),
            percentage: String(c['percentage'] || ''),
          }))
        : [];
      this.topCountries.set(countries);

      const cities = Array.isArray(audience['topCities'])
        ? audience['topCities'].map((c: Record<string, string>) => ({
            city: String(c['city'] || ''),
            percentage: String(c['percentage'] || ''),
          }))
        : [];
      this.topCities.set(cities);
    }

    const pillars = map.get('content_pillars');
    if (pillars && Array.isArray(pillars['items'])) {
      this.contentPillars.set(pillars['items'].map((p: string) => String(p)));
    }

    const services = map.get('services');
    if (services && Array.isArray(services['items'])) {
      this.services.set(
        services['items'].map((item: Record<string, unknown>) => ({
          title: String(item['title'] || ''),
          description: String(item['description'] || ''),
          deliverables: Array.isArray(item['deliverables'])
            ? item['deliverables'].map((d) => String(d))
            : [],
        })),
      );
    }

    const contact = map.get('contact');
    if (contact) {
      this.contactEmail.set(contact['email'] ? String(contact['email']) : '');
    }
  }

  protected addSocialMetric() {
    this.socialMetrics.update((rows) => [
      ...rows,
      { platform: '', account: '', metric: '', label: '', engagement: '', href: '' },
    ]);
  }

  protected removeSocialMetric(index: number) {
    this.socialMetrics.update((rows) => rows.filter((_, i) => i !== index));
  }

  protected async saveSocialMetrics() {
    await this.save('social_metrics', {
      items: this.socialMetrics().map((row) => ({
        platform: row.platform,
        account: row.account,
        metric: row.metric,
        label: row.label,
        engagement: row.engagement || undefined,
        href: row.href || undefined,
      })),
    }, 'Métricas sociales');
  }

  protected addCountry() {
    this.topCountries.update((rows) => [...rows, { country: '', percentage: '' }]);
  }

  protected removeCountry(index: number) {
    this.topCountries.update((rows) => rows.filter((_, i) => i !== index));
  }

  protected addCity() {
    this.topCities.update((rows) => [...rows, { city: '', percentage: '' }]);
  }

  protected removeCity(index: number) {
    this.topCities.update((rows) => rows.filter((_, i) => i !== index));
  }

  protected async saveAudience() {
    await this.save('audience', {
      female: this.audienceFemale(),
      male: this.audienceMale(),
      topCountries: this.topCountries().filter((r) => r.country && r.percentage),
      topCities: this.topCities().filter((r) => r.city && r.percentage),
    }, 'Audiencia');
  }

  protected addPillar() {
    this.contentPillars.update((items) => [...items, '']);
  }

  protected removePillar(index: number) {
    this.contentPillars.update((items) => items.filter((_, i) => i !== index));
  }

  protected async saveContentPillars() {
    await this.save('content_pillars', {
      items: this.contentPillars().filter(Boolean),
    }, 'Pilares de contenido');
  }

  protected addService() {
    this.services.update((rows) => [...rows, { title: '', description: '', deliverables: [] }]);
  }

  protected removeService(index: number) {
    this.services.update((rows) => rows.filter((_, i) => i !== index));
  }

  protected addDeliverable(serviceIndex: number) {
    this.services.update((rows) => {
      const updated = [...rows];
      updated[serviceIndex] = {
        ...updated[serviceIndex],
        deliverables: [...updated[serviceIndex].deliverables, ''],
      };
      return updated;
    });
  }

  protected removeDeliverable(serviceIndex: number, deliverableIndex: number) {
    this.services.update((rows) => {
      const updated = [...rows];
      updated[serviceIndex] = {
        ...updated[serviceIndex],
        deliverables: updated[serviceIndex].deliverables.filter((_, i) => i !== deliverableIndex),
      };
      return updated;
    });
  }

  protected async saveServices() {
    await this.save('services', {
      items: this.services()
        .filter((r) => r.title)
        .map((r) => ({
          title: r.title,
          description: r.description,
          deliverables: r.deliverables.filter(Boolean),
        })),
    }, 'Servicios');
  }

  protected async saveContact() {
    await this.save('contact', { email: this.contactEmail() }, 'Contacto');
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
