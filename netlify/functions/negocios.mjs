import crypto from 'node:crypto';
import { getBusinesses, saveBusinesses } from './_data.mjs';
import { json, validSession } from './_auth.mjs';

const slugify = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
const clean = (v, max = 300) => String(v ?? '').trim().slice(0, max);

function sanitize(input, existing = {}) {
  const name = clean(input.name, 100);
  const item = {
    ...existing,
    id: existing.id || slugify(name) || crypto.randomUUID(),
    name,
    category: clean(input.category, 50),
    desc: clean(input.desc, 220),
    phone: clean(input.phone, 30),
    whatsapp: clean(input.whatsapp || input.phone, 30),
    address: clean(input.address, 180),
    hours: clean(input.hours, 180),
    instagram: clean(input.instagram, 120),
    website: clean(input.website, 180),
    maps: clean(input.maps, 300),
    emoji: clean(input.emoji || '🏪', 8),
    featured: Boolean(input.featured),
    active: input.active !== false,
    updatedAt: new Date().toISOString()
  };
  if (!item.name) throw new Error('O nome da empresa é obrigatório.');
  return item;
}

export default async (req) => {
  const url = new URL(req.url);
  try {
    const items = await getBusinesses();
    if (req.method === 'GET') {
      const id = url.searchParams.get('id');
      const q = clean(url.searchParams.get('q'), 100).toLowerCase();
      const category = clean(url.searchParams.get('category'), 50);
      let result = items.filter(x => x.active !== false);
      if (id) result = result.filter(x => x.id === id);
      if (category) result = result.filter(x => x.category === category);
      if (q) result = result.filter(x => [x.name, x.desc, x.category, x.address].join(' ').toLowerCase().includes(q));
      result.sort((a,b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name, 'pt-BR'));
      return json({ businesses: id ? result.slice(0, 1) : result });
    }

    if (!validSession(req)) return json({ error: 'Não autorizado.' }, 401);

    if (req.method === 'POST') {
      const body = await req.json();
      const item = sanitize(body);
      if (items.some(x => x.id === item.id)) item.id = `${item.id}-${crypto.randomUUID().slice(0,6)}`;
      const next = [item, ...items];
      await saveBusinesses(next);
      return json({ business: item }, 201);
    }

    const id = url.searchParams.get('id');
    if (!id) return json({ error: 'Informe o ID da empresa.' }, 400);
    const index = items.findIndex(x => x.id === id);
    if (index < 0) return json({ error: 'Empresa não encontrada.' }, 404);

    if (req.method === 'PUT') {
      const body = await req.json();
      const item = sanitize(body, items[index]);
      items[index] = item;
      await saveBusinesses(items);
      return json({ business: item });
    }

    if (req.method === 'DELETE') {
      items.splice(index, 1);
      await saveBusinesses(items);
      return new Response(null, { status: 204 });
    }

    return json({ error: 'Método não permitido.' }, 405);
  } catch (error) {
    console.error(error);
    return json({ error: error.message || 'Erro interno.' }, 500);
  }
};

export const config = { path: "/api/negocios" };
