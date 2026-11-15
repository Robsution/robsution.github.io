import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.woff2':'font/woff2','.jpg':'image/jpeg','.pdf':'application/pdf','.svg':'image/svg+xml','.css':'text/css','.js':'text/javascript'};
http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!target.startsWith(root + path.sep)) {res.writeHead(403);res.end('Forbidden');return;}
    const data = await readFile(target);
    res.writeHead(200,{'Content-Type':types[path.extname(target)] || 'text/plain; charset=utf-8','Cache-Control':'no-store'});
    res.end(data);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(4187,'127.0.0.1',() => console.log('Local mock-ups: http://127.0.0.1:4187/'));
