const isServer = typeof process !== 'undefined' && typeof window === 'undefined';

export const environment = {
  production: isServer ? process.env['NODE_ENV'] === 'production' : true,
  apiUrl: '/api',
  apiServerUrl: isServer ? `${process.env['API_URL'] || 'https://api.laschubys.com'}/api` : '/api',
  siteUrl: 'https://laschubys.com',
  // Bandera de modo pre-lanzamiento: true = muestra pantalla "En construcción" en todo excepto /linktree
  underConstruction: true,
};
