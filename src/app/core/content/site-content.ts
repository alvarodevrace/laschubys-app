import { SiteMeta } from '../models/content.model';

export const siteMeta: SiteMeta = {
  name: 'Las Chubys',
  tagline: 'Reality y parodias felinas.',
  subtitle: 'Iris, Rubí y el universo de la Casa Chuby.',
  email: 'laschubys.oficial@gmail.com',
  location: 'Ecuador',
};

export const socialChannels = [
  {
    name: 'Instagram',
    handle: '@laschubys',
    href: 'https://www.instagram.com/laschubys/',
    copy: 'Fotos, carouseles y glamour felino para la audiencia diaria.',
  },
  {
    name: 'TikTok',
    handle: '@laschubys.oficial',
    href: 'https://www.tiktok.com/@laschubys.oficial',
    copy: 'Zoomies, travesuras y clips cortos con alto potencial viral.',
  },
  {
    name: 'Facebook',
    handle: 'Las Chubys',
    href: 'https://www.facebook.com/people/Las-Chubys/61589964727281/',
    copy: 'Comunidad, actualidades y contenido compartido para cat moms.',
  },
  {
    name: 'YouTube',
    handle: 'Las Chubys',
    href: 'https://www.youtube.com/@laschubys',
    copy: 'Contenido largo, podcast y momentos épicos de la Casa Chuby.',
  },
] as const;

export const marqueeItems = [
  'Comité de Gatos Asociados — en sesión permanente',
  'Reality y parodias felinas',
  'Iris Lourdes — La Reina de la Casa Chuby',
  'Rubí Lucrecia — Defensora oficial del caos',
  'La Casa Chuby — donde el drama es épico',
  'Nuevo episodio cada semana',
  'Unirse al CGA — Comité de Gatos Asociados',
  'Mercado Chuby — productos para michis y cat moms',
];

export const stats = [
  { value: '2', label: 'gatas protagonistas' },
  { value: '8', label: 'series en emisión' },
  { value: '∞', label: 'caos, glamour y zoomies' },
];

export interface Character {
  name: string;
  fullName: string;
  role: string;
  archetype: string;
  image: string;
  personality: string;
  bio: string;
  rolNarrativo: string;
  color: string;
}

export const characters: Character[] = [
  {
    name: 'Iris',
    fullName: 'Iris Lourdes',
    role: 'Matriarca de la Casa Chuby',
    archetype: 'La Reina',
    image: '/images/cats/iris.jpeg',
    personality:
      'Elegante, manipuladora, dramática, territorial y exigente. Es la reina absoluta de la casa: todo conflicto doméstico gira en torno a su jerarquía.',
    bio: 'Gata tricolor (carey/calicó) — manchas negras, blancas y naranjas, ojos amarillos, mirada seria y altiva. Suele aparecer con gafas de sol de diva y outfits elegantes, reforzando su estética de "celebridad exigente". Proyecta autoridad, glamour y un desdén aristocrático hacia el caos que la rodea — ella no participa del drama, lo preside.',
    rolNarrativo:
      'Motor de conflicto y autoridad; suele encabezar los formatos de junta/comité y noticias por su solemnidad natural.',
    color: 'bg-amber-100 text-amber-800',
  },
  {
    name: 'Rubí',
    fullName: 'Rubí Lucrecia',
    role: 'Defensora oficial del caos',
    archetype: 'El Bufón',
    image: '/images/cats/rubi.jpeg',
    personality:
      'Impulsiva, curiosa, divertida, inquieta, tierna y con energía descontrolada. "Defensora. Activista. Rebelde." — descubrió algo que nadie debía saber. Es la fuente más confiable de comedia física y de situaciones que se salen de control.',
    bio: 'Gata atigrada naranja y blanco, ojos verdes/ámbar grandes y expresivos. Tiene un "Acta de Adopción" como parte de su historia de origen — llegó a la Casa Chuby por adopción. Contrapeso cómico de Iris; sus impulsos y curiosidad sin filtro suelen ser el detonante de los episodios más caóticos y virales.',
    rolNarrativo:
      'Contrapeso cómico de Iris; sus impulsos y curiosidad sin filtro suelen ser el detonante de los episodios más caóticos y virales.',
    color: 'bg-orange-100 text-orange-800',
  },
];

export const humans = [
  {
    name: 'Karen',
    role: 'Subordinada humana / Víctima permanente',
    archetype: 'El Cuidador',
    image: '',
    personality:
      'Narradora ocasional, mediadora entre el caos felino y la "normalidad", perpetua receptora de las consecuencias de los planes de Iris y Rubí.',
    rolNarrativo:
      'Da voz humana al caos felino y es el punto de identificación del público — el "así me siento yo con mi gato" de cada publicación.',
  },
  {
    name: 'Karencio',
    role: 'Humano favorito de las gatas',
    archetype: 'El Cuidador',
    image: '',
    personality:
      'Privilegiado, consentido por Iris y Rubí, generador constante de conflictos por el trato preferencial que recibe.',
    rolNarrativo:
      'Su relación especial con las gatas es fuente recurrente de tensión y celos con Karen, alimentando el conflicto doméstico del universo.',
  },
];

export interface ChubySeries {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}

export const chubySeries: ChubySeries[] = [
  {
    title: 'Comité de Gatos Asociados (CGA)',
    subtitle: 'Junta solemne',
    description:
      'Formato de junta/comité donde Iris y Rubí "deliberan" sobre asuntos domésticos con solemnidad absurda.',
    icon: 'lucideClapperboard',
    color: 'bg-cga-bg border-t-[3px] border-cga text-cga-text shadow-sm hover:shadow-md',
  },
  {
    title: 'Noticias Chubys',
    subtitle: 'Farándula felina',
    description:
      'Parodia de noticiero/farándula que reporta los "eventos" de la casa con la seriedad de un noticiero real.',
    icon: 'lucideTv',
    color: 'bg-iris-bg border-t-[3px] border-iris text-iris-text shadow-sm hover:shadow-md',
  },
  {
    title: 'Expedientes Chubys',
    subtitle: 'True crime gatuno',
    description:
      'Formato true crime/investigativo sobre incidentes domésticos triviales —¿quién rompió el jarrón?— tratados como crímenes de Estado.',
    icon: 'lucideSearch',
    color: 'bg-rubi-bg border-t-[3px] border-rubi text-rubi-text shadow-sm hover:shadow-md',
  },
  {
    title: 'Diario de Karen y Karencio',
    subtitle: 'Vlog humano',
    description:
      'Formato confesional/vlog desde la perspectiva humana. Karen y Karencio documentan su día a día sobreviviendo al caos felino.',
    icon: 'lucideBookOpen',
    color: 'bg-human-bg border-t-[3px] border-human text-human-text shadow-sm hover:shadow-md',
  },
  {
    title: 'Talleres Chubys',
    subtitle: 'Educación gatuna',
    description:
      'Parodia de contenido educativo, "dictado" por las gatas. Aprende las técnicas avanzadas de siesta, maullido estratégico y dominación del hogar.',
    icon: 'lucidePencil',
    color: 'bg-iris-bg border-t-[3px] border-iris text-iris-text shadow-sm hover:shadow-md',
  },
  {
    title: 'Parodias Chubys',
    subtitle: 'Cultura pop felina',
    description:
      'Parodias directas de tendencias y cultura pop, adaptadas al universo Chuby. Iris y Rubí versión peluda de tus escenas favoritas.',
    icon: 'lucideFilm',
    color: 'bg-rubi-bg border-t-[3px] border-rubi text-rubi-text shadow-sm hover:shadow-md',
  },
  {
    title: 'Michi Terapia',
    subtitle: 'Consultorio emocional',
    description:
      'Formato de consultorio/terapia procesando "traumas" domésticos. ¿Tu humana no te da de comer a tiempo? Tenemos un diagnóstico.',
    icon: 'lucideSofa',
    color: 'bg-human-bg border-t-[3px] border-human text-human-text shadow-sm hover:shadow-md',
  },
  {
    title: 'Método MIAU',
    subtitle: 'Autoayuda felina',
    description:
      'Self-help/desarrollo personal narrado con seriedad de gurú. Descubre el poder del ronroneo, la siesta estratégica y la indiferencia como filosofía de vida.',
    icon: 'lucideSparkles',
    color: 'bg-cga-bg border-t-[3px] border-cga text-cga-text shadow-sm hover:shadow-md',
  },
];

export const casaChuby = {
  title: 'La Casa Chuby',
  description:
    'El hogar donde ocurre todo: el escenario fijo del reality/sitcom donde conviven las cuatro figuras centrales. Un universo compartido donde cada publicación funciona como un nuevo episodio.',
  lema: 'Conoce nuestra historia y personajes.',
};
