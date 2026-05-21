import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import { createServer, request as httpRequest, IncomingMessage, ServerResponse } from 'node:http';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const engine = new AngularNodeAppEngine();

// In production, laschubys-api runs in the same Docker network at this URL.
const API_TARGET = process.env['API_URL'] || 'http://localhost:3000';

function proxyToApi(req: IncomingMessage, res: ServerResponse) {
  const target = new URL(API_TARGET);
  const options = {
    hostname: target.hostname,
    port: Number(target.port) || (target.protocol === 'https:' ? 443 : 80),
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: target.host },
  };

  const proxy = httpRequest(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxy.on('error', () => {
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

    reqHandler(req, res, () => {
      res.statusCode = 404;
      res.end('Not found');
    });
  }).listen(port, () => {
    console.log(`Las Chubys SSR en http://localhost:${port}`);
  });
}
