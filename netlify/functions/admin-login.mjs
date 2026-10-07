import { createSession, sessionCookie, clearCookie, json, validSession } from './_auth.mjs';

export default async (req) => {
  if (req.method === 'GET') return json({ authenticated: validSession(req) });
  if (req.method === 'DELETE') return new Response(null, { status: 204, headers: { 'Set-Cookie': clearCookie() } });
  if (req.method !== 'POST') return json({ error: 'Método não permitido.' }, 405);

  const configuredPassword = process.env.ADMIN_PASSWORD || '';
  const configuredSecret = process.env.ADMIN_SESSION_SECRET || '';
  if (!configuredPassword || !configuredSecret) return json({ error: 'Configure ADMIN_PASSWORD e ADMIN_SESSION_SECRET no Netlify antes de usar o painel.' }, 503);

  const body = await req.json().catch(() => ({}));
  if (!body.password || body.password !== configuredPassword) return json({ error: 'Senha inválida.' }, 401);
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(createSession()) });
};

export const config = { path: "/api/admin-login" };
