import { SiteMeta } from '../models/content.model';

export const siteMeta: SiteMeta = {
  name: 'Las Chubys',
  tagline: 'Curado por Iris & Rubi para michis y cat moms.',
  subtitle: 'Iris, Rubi y su universo editorial felino.',
  email: 'laschubys.oficial@gmail.com',
  location: 'Ecuador',
};

export const socialChannels = [
  {
    name: 'Instagram',
    handle: '@laschubys.oficial',
    href: 'https://www.instagram.com/laschubys.oficial/',
    copy: 'Fotos, carouseles y glamour felino para la audiencia diaria.',
  },
  {
    name: 'TikTok',
    handle: '@laschubys.oficial',
    href: 'https://www.tiktok.com/@laschubys.oficial',
    copy: 'Zoomies, travesuras y clips cortos con alto potencial viral.',
  },
  {
    name: 'Amazon Finds',
    handle: 'Curaduría',
    href: '/tienda',
    copy: 'Selecciones cute para cat moms listas para tu carrito.',
  },
] as const;

export const marqueeItems = [
  'Siestas tácticas',
  'Amazon finds que sí funcionan',
  'Tips para cat moms',
  'Iris & Rubi: El Podcast (pronto)',
  'Envíos en Ecuador',
  'Curaduría Chic',
  'Rutinas de mañana felina',
  'Outfits con pelo incluido',
];

export const stats = [
  { value: '2', label: 'gatas protagonistas' },
  { value: '24/7', label: 'caos, glamour y zoomies' },
  { value: '∞', label: 'memes, tips y antojos' },
];

export const personas = [
  {
    name: 'Iris',
    role: 'La Seria',
    image: '/images/cats/iris.jpeg',
    accent: 'Drama elegante, siestas tácticas y mirada de CEO felina.',
  },
  {
    name: 'Rubi',
    role: 'La Revoltosa',
    image: '/images/cats/rubi.jpeg',
    accent: 'Energía impredecible, zoomies nocturnos y encanto absoluto.',
  },
] as const;

export const serviceHighlights = [
  {
    title: 'Consultoría Felina',
    body: 'Tips personalizados para mejorar la convivencia con tus michis.',
  },
  {
    title: 'Fotografía para Mascotas',
    body: 'Sesiones editoriales para que tu gata brille como Iris.',
  },
  {
    title: 'Curaduría de Espacios',
    body: 'Diseñamos rincones cat-friendly con estilo.',
  },
] as const;
