const api = '/api/negocios';
const categoriesEl = document.querySelector('#categories');
const featuredEl = document.querySelector('#featured');
const usefulEl = document.querySelector('#useful');
const search = document.querySelector('#searchInput');
const installBtn = document.querySelector('#installBtn');

function esc(v=''){ return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function categoryName(id){ return CATEGORIES.find(c=>c.id===id)?.name || id; }
function phoneLink(v){ return String(v||'').replace(/\D/g,''); }
function card(b){ const p=phoneLink(b.phone), w=phoneLink(b.whatsapp||b.phone); return `<article class="business-card"><a href="negocio.html?id=${encodeURIComponent(b.id)}" class="business-image" aria-label="Ver ${esc(b.name)}"><span>${esc(b.emoji||'🏪')}</span></a><div class="business-body"><span class="badge">${b.featured?'⭐ Destaque':categoryName(b.category)}</span><h3><a href="negocio.html?id=${encodeURIComponent(b.id)}">${esc(b.name)}</a></h3><p>${esc(b.desc||'Comércio local em Boracéia.')}</p><div class="actions"><a class="primary" href="tel:+55${p}">📞 Ligar</a><a href="https://wa.me/55${w}" target="_blank" rel="noopener">💬 WhatsApp</a></div></div></article>`; }
function render(items, target=featuredEl){ target.innerHTML = items.length ? items.map(card).join('') : '<div class="empty-state">Nenhum estabelecimento encontrado.</div>'; }
async function getBusinesses(params=''){ const r=await fetch(`${api}${params}`); if(!r.ok) throw new Error('Falha ao carregar'); return (await r.json()).businesses || []; }

categoriesEl.innerHTML=CATEGORIES.slice(0,6).map(c=>`<a class="category" href="negocios.html?category=${c.id}"><span class="icon">${c.icon}</span><span>${c.name}</span></a>`).join('');
function loadUseful(){fetch('/api/telefones').then(r=>r.json()).then(d=>{const items=d.useful||USEFUL;usefulEl.innerHTML=items.slice(0,4).map(x=>`<a class="useful" href="tel:${x.number}"><div class="useful-icon">${x.icon}</div><div><b>${x.name}</b><span>${x.number}</span></div></a>`).join('')}).catch(()=>{usefulEl.innerHTML=USEFUL.slice(0,4).map(x=>`<a class="useful" href="tel:${x.number}"><div class="useful-icon">${x.icon}</div><div><b>${x.name}</b><span>${x.number}</span></div></a>`).join('')})}
loadUseful();

(async()=>{try{const items=await getBusinesses(); render(items.filter(b=>b.featured).slice(0,3));}catch{render([]);}})();
let timer;
search?.addEventListener('input',()=>{clearTimeout(timer);const q=search.value.trim();if(!q)return;timer=setTimeout(async()=>{try{const items=await getBusinesses(`?q=${encodeURIComponent(q)}`);render(items);document.querySelector('.featured-section').scrollIntoView({behavior:'smooth'});}catch{}},250);});
let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;installBtn?.classList.remove('hidden')});installBtn?.addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.classList.add('hidden')});
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
