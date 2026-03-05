const API = '/api/ads';
const grid = document.getElementById('ads-grid');
const modal = document.getElementById('modal-overlay');
const form = document.getElementById('ad-form');
const filterStatus = document.getElementById('filter-status');
let allAds = [];

// --- Helpers ---
function formatPrice(value) {
  if (!value && value !== 0) return '';
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function statusLabel(status) {
  const map = { active: 'Ativo', paused: 'Pausado', finished: 'Finalizado' };
  return map[status] || status;
}

// --- Renderização ---
function renderAds(list) {
  if (!list.length) {
    grid.innerHTML = '<p class="empty-state">Nenhum anúncio encontrado.</p>';
    return;
  }

  grid.innerHTML = list.map(ad => `
    <div class="ad-card">
      ${ad.imageUrl
        ? `<img class="ad-card-image" src="${ad.imageUrl}" alt="${ad.title}" onerror="this.outerHTML='<div class=\\'ad-card-placeholder\\'>Imagem indisponível</div>'">`
        : '<div class="ad-card-placeholder">Sem imagem</div>'
      }
      <div class="ad-card-body">
        <h3>${ad.title}</h3>
        <p>${ad.description || 'Sem descrição'}</p>
        <div class="ad-card-meta">
          <span class="ad-price">${ad.price ? formatPrice(ad.price) : '—'}</span>
          ${ad.category ? `<span class="ad-category">${ad.category}</span>` : ''}
        </div>
        <span class="ad-status status-${ad.status}">${statusLabel(ad.status)}</span>
        <div class="ad-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="openEdit(${ad.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="removeAd(${ad.id})">Excluir</button>
        </div>
      </div>
    </div>
  `).join('');
}

function applyFilter() {
  const status = filterStatus.value;
  const filtered = status ? allAds.filter(a => a.status === status) : allAds;
  renderAds(filtered);
}

// --- API ---
async function loadAds() {
  try {
    const res = await fetch(API);
    allAds = await res.json();
    applyFilter();
  } catch {
    grid.innerHTML = '<p class="empty-state">Erro ao carregar anúncios.</p>';
  }
}

async function saveAd(data) {
  const id = data.id;
  delete data.id;
  const url = id ? `${API}/${id}` : API;
  const method = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erro ao salvar');
  }

  return res.json();
}

async function removeAd(id) {
  if (!confirm('Tem certeza que deseja excluir este anúncio?')) return;
  try {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    await loadAds();
  } catch {
    alert('Erro ao excluir anúncio.');
  }
}

// --- Modal ---
function openModal(title = 'Novo Anúncio') {
  document.getElementById('modal-title').textContent = title;
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  form.reset();
  document.getElementById('ad-id').value = '';
}

function openEdit(id) {
  const ad = allAds.find(a => a.id === id);
  if (!ad) return;

  document.getElementById('ad-id').value = ad.id;
  document.getElementById('ad-title').value = ad.title;
  document.getElementById('ad-description').value = ad.description || '';
  document.getElementById('ad-price').value = ad.price || '';
  document.getElementById('ad-category').value = ad.category || '';
  document.getElementById('ad-image').value = ad.imageUrl || '';
  document.getElementById('ad-status').value = ad.status;

  openModal('Editar Anúncio');
}

// --- Eventos ---
document.getElementById('btn-new').addEventListener('click', () => openModal());
document.getElementById('btn-close-modal').addEventListener('click', closeModal);
document.getElementById('btn-cancel').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

filterStatus.addEventListener('change', applyFilter);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById('ad-title').value.trim(),
    description: document.getElementById('ad-description').value.trim() || null,
    price: document.getElementById('ad-price').value || null,
    imageUrl: document.getElementById('ad-image').value.trim() || null,
    category: document.getElementById('ad-category').value.trim() || null,
    status: document.getElementById('ad-status').value,
  };

  const id = document.getElementById('ad-id').value;
  if (id) data.id = Number(id);

  try {
    await saveAd(data);
    closeModal();
    await loadAds();
  } catch (err) {
    alert(err.message);
  }
});

// --- Init ---
loadAds();
