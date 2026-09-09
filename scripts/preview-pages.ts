import { resolve, sep, extname } from 'node:path';
import { stat } from 'node:fs/promises';
const config = await Bun.file('.pages-preview.json').json();
const root = resolve('out');
const basePath: string = config.basePath;
const server = Bun.serve({
  hostname: '127.0.0.1', port: 4173,
  async fetch(request) {
    const url = new URL(request.url);
    if (basePath && url.pathname === basePath) { url.pathname += '/'; return Response.redirect(url.toString(), 301); }
    if (basePath && !url.pathname.startsWith(basePath + '/')) return new Response('Not found', { status: 404 });
    let path: string;
    try { path = resolve(root, '.' + decodeURIComponent(url.pathname.slice(basePath.length))); }
    catch { return new Response('Invalid path', { status: 400 }); }
    if (path !== root && !path.startsWith(root + sep)) return new Response('Not found', { status: 404 });
    try {
      if ((await stat(path)).isDirectory()) {
        if (!url.pathname.endsWith('/')) { url.pathname += '/'; return Response.redirect(url.toString(), 301); }
        path = resolve(path, 'index.html');
      }
      const file = Bun.file(path);
      if (await file.exists()) return new Response(file, { headers: { 'Cache-Control': 'no-store', ...(extname(path) === '.txt' ? { 'Content-Type': 'text/plain; charset=utf-8' } : {}) } });
    } catch { /* Serve a real 404, never an SPA fallback. */ }
    return new Response(Bun.file(resolve(root, '404.html')), { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  },
});
console.log(`Static preview: ${server.url.origin}${basePath}/`);
