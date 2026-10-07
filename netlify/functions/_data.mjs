import { getStore } from '@netlify/blobs';

export const categories = [
  { id: 'alimentacao', name: 'Alimentação', icon: '🍔' },
  { id: 'mercados', name: 'Mercados', icon: '🛒' },
  { id: 'farmacias', name: 'Farmácias', icon: '💊' },
  { id: 'servicos', name: 'Serviços', icon: '🔧' },
  { id: 'beleza', name: 'Beleza', icon: '💇' },
  { id: 'automotivo', name: 'Automotivo', icon: '🚗' },
  { id: 'casa', name: 'Casa & Construção', icon: '🏠' },
  { id: 'saude', name: 'Saúde', icon: '🩺' }
];

export const useful = [
  { id: 'samu', name: 'SAMU', number: '192', icon: '🚑' },
  { id: 'pm', name: 'Polícia Militar', number: '190', icon: '🚓' },
  { id: 'bombeiros', name: 'Bombeiros', number: '193', icon: '🚒' },
  { id: 'defesa-civil', name: 'Defesa Civil', number: '199', icon: '🛟' },
  { id: 'policia-civil', name: 'Polícia Civil', number: '197', icon: '👮' },
  { id: 'disque-denuncia', name: 'Disque Denúncia', number: '181', icon: '☎️' }
];

export const seedBusinesses = [
  {
    id: 'bora-cafe-lanches', name: 'BoraAÍ Café & Lanches', category: 'alimentacao',
    desc: 'Café, lanches e atendimento local.', phone: '14999990000', whatsapp: '14999990000',
    address: 'Boracéia, SP', hours: 'Consulte o estabelecimento', featured: true, active: true,
    emoji: '☕', createdAt: '2026-10-07'
  },
  {
    id: 'mercado-boraceia', name: 'Mercado Boracéia', category: 'mercados',
    desc: 'Mercado completo para o dia a dia.', phone: '14999991111', whatsapp: '14999991111',
    address: 'Boracéia, SP', hours: 'Consulte o estabelecimento', featured: true, active: true,
    emoji: '🛒', createdAt: '2026-10-07'
  },
  {
    id: 'auto-center-boraceia', name: 'Auto Center Boracéia', category: 'automotivo',
    desc: 'Serviços e manutenção automotiva.', phone: '14999992222', whatsapp: '14999992222',
    address: 'Boracéia, SP', hours: 'Consulte o estabelecimento', featured: true, active: true,
    emoji: '🚗', createdAt: '2026-10-07'
  },
  {
    id: 'farmacia-boraceia', name: 'Farmácia Boracéia', category: 'farmacias',
    desc: 'Medicamentos, higiene e cuidados para sua família.', phone: '14999993333', whatsapp: '14999993333',
    address: 'Boracéia, SP', hours: 'Consulte o estabelecimento', featured: false, active: true,
    emoji: '💊', createdAt: '2026-10-07'
  }
];

export function store() { return getStore('boraai-data'); }

export async function getBusinesses() {
  const s = store();
  const data = await s.get('businesses', { type: 'json', consistency: 'strong' });
  if (Array.isArray(data)) return data;
  await s.setJSON('businesses', seedBusinesses);
  return seedBusinesses;
}

export async function saveBusinesses(items) {
  await store().setJSON('businesses', items);
  return items;
}
