import { HTML } from './site.js';
import { withLoader } from './loader.js';

const PAGE_HTML = withLoader(HTML);

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sha256(value) {
  const data = new TextEncoder().encode(value || '');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/pre-register') {
      try {
        const body = await request.json();
        const email = String(body.email || '').trim().toLowerCase();
        const source = String(body.source || 'unmad.me').slice(0, 120);

        if (!emailPattern.test(email) || email.length > 254) {
          return json({ error: 'enter a valid email' }, 400);
        }

        const userAgent = String(request.headers.get('user-agent') || '').slice(0, 500);
        const ip = request.headers.get('cf-connecting-ip') || '';
        const ipHash = ip ? await sha256(ip) : null;
        const before = await env.DB.prepare('SELECT id FROM preregistrations WHERE email = ?')
          .bind(email)
          .first();

        await env.DB.prepare(`INSERT INTO preregistrations (email, source, user_agent, ip_hash)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(email) DO UPDATE SET
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'),
            source = excluded.source`)
          .bind(email, source, userAgent, ipHash)
          .run();

        return json({ ok: true, duplicate: Boolean(before) });
      } catch {
        return json({ error: 'could not save right now' }, 500);
      }
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: { allow: 'POST, OPTIONS' } });
    }

    return new Response(PAGE_HTML, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=60',
      },
    });
  },
};
