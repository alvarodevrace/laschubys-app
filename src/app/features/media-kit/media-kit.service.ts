import { inject, Injectable } from '@angular/core';

import { ApiService } from '../../core/services/api.service';
import { MediaKitData } from './media-kit.model';

export const DEFAULT_MEDIA_KIT: MediaKitData = {
  hero: {
    title: 'Las Chubys · Media Kit',
    subtitle:
      'Contenido felino con alma: memes, recomendaciones, reviews y storytelling que conecta con cat moms y marcas en LATAM.',
    pill: 'Ecuador · LATAM',
    image: '/images/cats/iris2.jpeg',
    imageAlt: 'Iris y Rubi, las gatas de Las Chubys',
    ctaDownload: {
      label: 'Solicitar media kit completo',
      href: 'mailto:laschubys.oficial@gmail.com?subject=Quiero%20el%20Media%20Kit%20completo%20de%20Las%20Chubys',
    },
    ctaWrite: {
      label: 'Escríbenos',
      href: 'mailto:laschubys.oficial@gmail.com',
    },
  },
  metrics: [
    {
      network: 'Instagram',
      handle: '@laschubys',
      value: '17K',
      label: 'seguidores',
      engagement: '4-7%',
      href: 'https://www.instagram.com/laschubys/',
    },
    {
      network: 'TikTok',
      handle: '@laschubys.oficial',
      value: '14.4K',
      label: 'seguidores · 609K likes',
      engagement: '4-7%',
      href: 'https://www.tiktok.com/@laschubys.oficial',
    },
    {
      network: 'Facebook',
      handle: 'Las Chubys',
      value: '2.6K',
      label: 'seguidores',
      engagement: '4-7%',
      href: 'https://www.facebook.com/people/Las-Chubys/61589964727281/',
    },
    {
      network: 'Engagement',
      handle: 'Promedio mensual',
      value: '4-7%',
      label: 'engagement orgánico',
      href: 'https://www.instagram.com/laschubys/',
    },
  ],
  about: {
    headline: '¿Quiénes son Las Chubys?',
    story:
      'Las Chubys nació como un rincón para compartir el día a día de dos gatas con mucha personalidad. Álvaro y Brenda pusieron la estrategia, la cámara y las ideas; Iris y Rubi pusieron el drama, las siestas tácticas y los zoomies virales. Hoy somos una comunidad de cat moms, pet parents y marcas que creen en contenido auténtico, divertido y con propósito.',
    team: [
      {
        name: 'Álvaro',
        role: 'Estrategia & tecnología',
        image: '/images/cats/iris3.jpeg',
        bio: 'Creador, editor y el humano que convierte el caos felino en una marca con estructura.',
      },
      {
        name: 'Brenda',
        role: 'Creatividad & comunidad',
        image: '/images/cats/rubi3.jpeg',
        bio: 'Voz detrás de los captions, las stories y la conexión real con la audiencia.',
      },
      {
        name: 'Iris',
        role: 'La Seria',
        image: '/images/cats/iris.jpeg',
        bio: 'Drama elegante, siestas tácticas y mirada de CEO felina. La protagonista del feed.',
      },
      {
        name: 'Rubi',
        role: 'La Revoltosa',
        image: '/images/cats/rubi.jpeg',
        bio: 'Energía impredecible, zoomies nocturnos y encanto absoluto. Reina del TikTok.',
      },
    ],
  },
  audience: {
    segments: [
      {
        title: 'Cat lovers',
        description:
          'Amantes de los gatos que buscan contenido cute, tips y productos recomendados.',
        icon: 'heart',
      },
      {
        title: 'Pet parents',
        description: 'Dueños de mascotas que quieren mejorar la vida de sus peludos con estilo.',
        icon: 'users',
      },
      {
        title: 'Marcas locales',
        description:
          'Emprendimientos y marcas de Ecuador y LATAM que quieren llegar a una comunidad fiel.',
        icon: 'briefcase',
      },
    ],
    demographics: [
      { label: 'Ecuador', value: '60%', detail: 'Audiencia principal' },
      { label: 'México', value: '20%', detail: 'Segundo mercado' },
      { label: 'Colombia', value: '12%', detail: 'En crecimiento' },
      { label: 'Otros', value: '8%', detail: 'Resto de LATAM' },
    ],
  },
  content: [
    { title: 'Reels', image: '/images/cats/iris2.jpeg', metric: 'Mayor alcance' },
    { title: 'TikTok', image: '/images/cats/rubi2.jpeg', metric: 'Alta viralidad' },
    { title: 'Stories', image: '/images/cats/iris4.jpeg', metric: 'Conexión diaria' },
    { title: 'UGC', image: '/images/cats/rubi4.jpeg', metric: 'Confianza de marca' },
  ],
  services: [
    {
      name: 'Post feed',
      description: 'Publicación permanente en Instagram con foto, copy y etiquetado de marca.',
      deliverables: ['1 foto o carrusel', 'Copy optimizado', '3 stories de respaldo'],
    },
    {
      name: 'Reel',
      description: 'Video corto vertical para Instagram con edición, audio trending y hooks.',
      deliverables: ['1 reel 15-60s', 'Edición incluida', 'Stories + link en bio'],
    },
    {
      name: 'TikTok',
      description: 'Contenido nativo para TikTok pensado para viralización y descubrimiento.',
      deliverables: ['1 video 15-90s', 'Trends adaptados', 'Duet/stitch opcional'],
    },
    {
      name: 'Stories',
      description: 'Secuencia de stories interactivas con encuestas, enlaces y CTA claros.',
      deliverables: ['3-5 stories', 'Stickers interactivos', 'Swipe-up / link'],
    },
    {
      name: 'UGC',
      description: 'Contenido generado por Las Chubys para que la marca lo use en sus canales.',
      deliverables: ['1-3 videos', 'Derechos de uso', 'Raw footage opcional'],
    },
    {
      name: 'Embajadoría',
      description: 'Colaboración de largo plazo: contenido recurrente, activaciones y reportes.',
      deliverables: ['Pack mensual', 'Reporte de métricas', 'Prioridad en calendario'],
    },
  ],
  contact: {
    email: 'laschubys.oficial@gmail.com',
    whatsapp: 'https://wa.me/593960463743',
    whatsappLabel: '+593 96 046 3743',
  },
};

@Injectable({ providedIn: 'root' })
export class MediaKitService {
  private readonly api = inject(ApiService);

  async getMediaKit(): Promise<MediaKitData> {
    try {
      const data = await this.api.get<MediaKitData>('/api/content/media-kit', 10000);
      return data ?? DEFAULT_MEDIA_KIT;
    } catch (error) {
      console.error('[MediaKitService] Error cargando media kit, usando fallback', error);
      return DEFAULT_MEDIA_KIT;
    }
  }

  getMediaKitPdfUrl(): string {
    return '/api/content/media-kit.pdf';
  }
}
