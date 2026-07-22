import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const port = Number(process.env.PORT || 4321);

const types = {
  '.html':'text/html; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml',
  '.webp':'image/webp',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.xml':'application/xml; charset=utf-8',
  '.txt':'text/plain; charset=utf-8'
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let path = decodeURIComponent(url.pathname);
    path = path.replace(/^\/+/, '');
    let file = normalize(join(dist, path));
    if (!file.startsWith(dist)) throw new Error('Invalid path');

    let info;
    try { info = await stat(file); } catch {}
    if (info?.isDirectory()) file = join(file, 'index.html');
    else if (!extname(file)) file = join(file, 'index.html');

    try {
      const body = await readFile(file);
      res.writeHead(200, {'content-type': types[extname(file)] || 'application/octet-stream', 'cache-control':'no-store'});
      res.end(body);
    } catch {
      const body = await readFile(join(dist, '404.html'));
      res.writeHead(404, {'content-type':'text/html; charset=utf-8'});
      res.end(body);
    }
  } catch (error) {
    res.writeHead(400, {'content-type':'text/plain; charset=utf-8'});
    res.end('Bad request');
  }
}).listen(port, () => {
  console.log(`Preview: http://localhost:${port}`);
});
