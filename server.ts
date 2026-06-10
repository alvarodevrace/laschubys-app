import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer, request as httpRequest, IncomingMessage, ServerResponse } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { extname, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MIME: Record<string, string> = {
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
};

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const engine = new AngularNodeAppEngine();

// In production, proxy to the public backend API.
const API_TARGET = process.env['API_URL'] || 'https://api.laschubys.com';

function serveStatic(req: IncomingMessage, res: ServerResponse, distFolder: string): boolean {
  const url = new URL(req.url || '/', 'http://localhost');
  const filePath = resolve(distFolder, url.pathname.slice(1));

  // Security: prevent path traversal
  if (!filePath.startsWith(distFolder)) return false;

  // NEVER serve index.html as static — let SSR handle routes
  if (url.pathname === '/' || url.pathname === '/index.html') return false;

  const mime = MIME[extname(filePath).toLowerCase()];
  if (!mime || !existsSync(filePath)) return false;

  const { size } = statSync(filePath);
  res.writeHead(200, {
    'Content-Type': mime,
    'Content-Length': size,
    'Cache-Control': 'public, max-age=31536000, immutable',
  });
  createReadStream(filePath).pipe(res);
  return true;
}

function proxyToApi(req: IncomingMessage, res: ServerResponse, overridePath?: string) {
  const target = new URL(API_TARGET);
  const isHttps = target.protocol === 'https:';
  const options = {
    hostname: target.hostname,
    port: Number(target.port) || (isHttps ? 443 : 80),
    path: overridePath ?? req.url,
    method: req.method,
    headers: { ...req.headers, host: target.host },
  };

  const requestFn = isHttps ? httpsRequest : httpRequest;
  const proxy = requestFn(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxy.on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.statusCode = 502;
    res.end(JSON.stringify({ message: 'API no disponible' }));
  });

  req.pipe(proxy);
}

export const reqHandler = createNodeRequestHandler(async (req, res, next) => {
  const response = await engine.handle(req, { server: { browserDistFolder } });
  if (response) {
    writeResponseToNodeResponse(response, res);
  } else {
    next();
  }
});

if (isMainModule(import.meta.url)) {
  const port = parseInt(process.env['PORT'] || '4321', 10);

  createServer((req, res) => {
    if (req.url?.startsWith('/api')) {
      proxyToApi(req, res);
      return;
    }
    if (req.url === '/sitemap.xml') {
      proxyToApi(req, res, '/api/content/sitemap.xml');
      return;
    }
    if (req.url === '/robots.txt') {
      const body =
        'User-agent: *\nAllow: /\n\nSitemap: https://api.laschubys.com/api/content/sitemap.xml\n';
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
        'Cache-Control': 'public, max-age=3600',
      });
      res.end(body);
      return;
    }

    // 1. Serve static assets (JS, CSS, images) first — Angular SSR must NOT touch these
    if (serveStatic(req, res, browserDistFolder)) return;

    // 2. SSR for page routes only
    // Wrap response to add anti-cache headers to HTML (prevents stale chunk references)
    const origWriteHead = res.writeHead.bind(res);
    res.writeHead = (statusCode: number, ...args: any[]) => {
      const headers = args[0] as Record<string, string | string[]> | undefined;
      if (headers && typeof headers === 'object' && !Array.isArray(headers)) {
        const ct = headers['content-type'] || headers['Content-Type'];
        if (typeof ct === 'string' && ct.includes('text/html')) {
          headers['cache-control'] = 'no-cache, no-store, must-revalidate';
          headers['pragma'] = 'no-cache';
          headers['expires'] = '0';
        }
      }
      return origWriteHead(statusCode, ...args);
    };
    reqHandler(req, res, () => {
      // 3. True 404
      res.statusCode = 404;
      res.end('Not found');
    });
  }).listen(port, () => {
    console.log(`Las Chubys SSR en http://localhost:${port}`);
  });
}
