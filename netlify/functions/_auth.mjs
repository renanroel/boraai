import crypto from 'node:crypto';

const COOKIE = 'boraai_admin';
const MAX_AGE = 60 * 60 * 8;

function secret() { return process.env.ADMIN_SESSION_SECRET || ''; }
function b64(value) { return Buffer.from(value).toString('base64url'); }
function sign(payload) { return b64(crypto.createHmac('sha256', secret()).update(payload).digest()); }

export function createSession() {
  const payload = JSON.stringify({ exp: Math.floor(Date.now() / 1000) + MAX_AGE });
  const encoded = b64(payload);
  return `${encoded}.${sign(encoded)}`;
}

export function validSession(req) {
  if (!secret()) return false;
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.split(';').map(x => x.trim()).find(x => x.startsWith(`${COOKIE}=`));
  if (!match) return false;
  const token = decodeURIComponent(match.slice(COOKIE.length + 1));
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return false;
  const expected = sign(encoded);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  } catch { return false; }
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch { return false; }
}

export function sessionCookie(token) {
  return `${COOKIE}=${encodeURIComponent(token)}; Max-Age=${MAX_AGE}; Path=/; HttpOnly; SameSite=Lax; Secure`;
}

export function clearCookie() {
  return `${COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax; Secure`;
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers } });
}
