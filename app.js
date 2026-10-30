// ========================================================
// Abella Print Tech - Lógica de Interacción
// ========================================================

// Estado de archivos adjuntos
let selectedFiles = [];

// Extensiones válidas para impresión 3D
const VALID_3D_EXTENSIONS = ['.stl', '.obj', '.3mf', '.step', '.stp', '.iges', '.igs', '.ply', '.amf'];

/**
 * Comprueba si un nombre de archivo corresponde a un formato de impresión 3D válido
 * @param {string} fileName
 * @returns {boolean}
 */
function isValid3DFormat(fileName) {
  if (!fileName) return false;
  const lower = fileName.toLowerCase().trim();
  return VALID_3D_EXTENSIONS.some(ext => lower.endsWith(ext));
}

document.addEventListener('DOMContentLoaded', () => {
  // Configurar año actual automáticamente en el footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Autoenfocar la barra de entrada al cargar
  const mindInput = document.getElementById('mindInput');
  if (mindInput) {
    mindInput.focus();

    // Ocultar mensaje de error si el usuario empieza a escribir
    mindInput.addEventListener('input', () => {
      const errorBox = document.getElementById('fileErrorMessage');
      if (errorBox) errorBox.classList.add('hidden');
    });
  }

  // Inicializar Catálogo Dinámico
  initCatalogApp();
});

/**
 * Guarda el archivo 3D de forma íntegra en IndexedDB y sessionStorage antes de redirigir
 * @param {File} file
 * @returns {Promise<boolean>}
 */
async function save3DFileToDB(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // 1. Guardar en IndexedDB como ArrayBuffer puro (no objeto File)
    await new Promise((resolve) => {
      try {
        const request = indexedDB.open('AbellaPrint3D', 2);
        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (db.objectStoreNames.contains('models')) {
            db.deleteObjectStore('models');
          }
          db.createObjectStore('models');
        };
        request.onsuccess = (e) => {
          const db = e.target.result;
          const tx = db.transaction('models', 'readwrite');
          const store = tx.objectStore('models');
          store.put({
            buffer: arrayBuffer,
            name: file.name,
            size: file.size,
            type: file.name.split('.').pop().toLowerCase()
          }, 'currentModel');
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        };
        request.onerror = () => resolve(false);
      } catch (err) {
        resolve(false);
      }
    });

    // 2. Si el archivo es menor a 3MB, guardar también en sessionStorage como base64 de respaldo instantáneo
    if (file.size < 3 * 1024 * 1024) {
      try {
        let binary = '';
        const bytes = new Uint8Array(arrayBuffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        sessionStorage.setItem('uploaded3DBase64', btoa(binary));
      } catch (err) {
        console.warn('Fallback base64 omitido', err);
      }
    }

    return true;
  } catch (err) {
    console.error('Error al procesar archivo 3D:', err);
    return false;
  }
}

/**
 * Maneja la selección de archivos desde el input de subida
 * @param {Event} event - Evento change del input file
 */
function handleFilesSelected(event) {
  const fileInput = event.target;
  const errorBox = document.getElementById('fileErrorMessage');
  const errorText = document.getElementById('fileErrorText');

  if (!fileInput.files || fileInput.files.length === 0) return;

  const file = fileInput.files[0];

  // 1. Validar si el formato NO es válido para impresión 3D
  if (!isValid3DFormat(file.name)) {
    if (errorBox) {
      if (errorText) {
        errorText.textContent = `"${file.name}" no es un formato válido para impresión 3D. Formatos aceptados: .STL, .OBJ, .3MF, .STEP, .STP`;
      }
      errorBox.classList.remove('hidden');
    }
    // Limpiar input para permitir volver a seleccionar
    fileInput.value = '';
    return;
  }

  // 2. Si el formato SÍ es válido para impresión 3D
  if (errorBox) {
    errorBox.classList.add('hidden');
  }

  // Guardar datos del archivo en sessionStorage para visualización rápida
  try {
    sessionStorage.setItem('uploaded3DFile', JSON.stringify({
      name: file.name,
      size: file.size,
      lastModified: file.lastModified
    }));
  } catch (err) {
    console.error('Error guardando en sessionStorage:', err);
  }

  // Guardar archivo binario en IndexedDB y redirigir
  save3DFileToDB(file).then(() => {
    window.location.href = 'visor.html';
  });
}

/**
 * Renderiza la lista de archivos adjuntos
 */
function renderAttachedFiles() {
  const listContainer = document.getElementById('attachedFilesList');
  if (!listContainer) return;

  if (selectedFiles.length === 0) {
    listContainer.classList.add('hidden');
    listContainer.innerHTML = '';
    return;
  }

  listContainer.classList.remove('hidden');
  listContainer.innerHTML = selectedFiles.map((file, index) => {
    const formattedSize = formatFileSize(file.size);
    return `
      <div class="attached-file-badge" id="file-badge-${index}">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <span class="attached-file-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span>
        <span class="attached-file-size">(${formattedSize})</span>
        <button type="button" class="attached-file-remove" onclick="removeAttachedFile(${index})" title="Eliminar archivo">&times;</button>
      </div>
    `;
  }).join('');
}

/**
 * Elimina un archivo de la lista de adjuntos
 * @param {number} index - Índice del archivo en el array
 */
function removeAttachedFile(index) {
  selectedFiles.splice(index, 1);
  renderAttachedFiles();
}

/**
 * Formatea el tamaño del archivo a KB o MB
 * @param {number} bytes - Tamaño en bytes
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Llena el campo de texto con una idea o sugerencia rápida
 * @param {string} text - El texto a insertar
 */
function fillPrompt(text) {
  const input = document.getElementById('mindInput');
  if (input) {
    input.value = text;
    input.focus();
  }
}

/**
 * Maneja el envío de la consulta o idea en mente
 * @param {Event} event - Evento del formulario
 */
function handleMindSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('mindInput');
  const responseArea = document.getElementById('responseArea');
  const responseMessage = document.getElementById('responseMessage');

  if (!responseArea || !responseMessage) return;

  const query = input ? input.value.trim() : '';
  const hasFiles = selectedFiles.length > 0;

  // Si no hay texto ni archivos, avisar al usuario
  if (!query && !hasFiles) {
    if (input) {
      input.focus();
      input.placeholder = "Por favor, escribe tu consulta o sube un archivo...";
      setTimeout(() => {
        input.placeholder = "¿Qué tienes en mente?";
      }, 3000);
    }
    return;
  }

  // Construir mensaje de respuesta
  let details = '';
  if (query) {
    details += `Has consultado sobre: <strong>"${escapeHtml(query)}"</strong>.<br>`;
  }
  
  if (hasFiles) {
    const fileNames = selectedFiles.map(f => `<strong>${escapeHtml(f.name)}</strong> (${formatFileSize(f.size)})`).join(', ');
    details += `Archivos adjuntos: ${fileNames}.<br>`;
  }

  details += `<br>¡Perfecto! En <strong>Abella Print Tech</strong> podemos hacer realidad tu diseño personalizado con la máxima calidad y detalle.`;

  responseMessage.innerHTML = details;
  responseArea.classList.remove('hidden');

  // Desplazar suavemente hacia la respuesta
  responseArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Reinicia la barra de búsqueda y oculta el área de respuesta
 */
function resetSearch() {
  const input = document.getElementById('mindInput');
  const responseArea = document.getElementById('responseArea');

  if (responseArea) {
    responseArea.classList.add('hidden');
  }

  if (input) {
    input.value = '';
    input.focus();
  }

  selectedFiles = [];
  renderAttachedFiles();
}

// ========================================================
// Lógica del Catálogo Dinámico de Productos 3D
// ========================================================

let activeCategory = 'todos';
let searchQuery = '';
let currentSort = 'featured';

function initCatalogApp() {
  const catalogGrid = document.getElementById('catalogGrid');
  if (!catalogGrid || typeof window.PRODUCTS === 'undefined') return;

  renderCategoryFilters();
  renderCatalog();
}

function renderCategoryFilters() {
  const container = document.getElementById('catalogFiltersContainer');
  if (!container || !window.CATEGORIES) return;

  container.innerHTML = window.CATEGORIES.map(cat => {
    const isActive = cat.id === activeCategory;
    return `
      <button 
        type="button" 
        class="filter-btn ${isActive ? 'active' : ''}" 
        onclick="handleCatalogCategoryChange('${cat.id}', this)"
      >
        <span>${escapeHtml(cat.name)}</span>
        <span class="filter-count-badge">${cat.count || 0}</span>
      </button>
    `;
  }).join('');
}

function handleCatalogCategoryChange(catId, btn) {
  activeCategory = catId;

  document.querySelectorAll('#catalogFiltersContainer .filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  renderCatalog();
}

function handleCatalogSearch(val) {
  searchQuery = (val || '').trim();
  const clearBtn = document.getElementById('catalogSearchClear');
  if (clearBtn) {
    if (searchQuery.length > 0) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }
  renderCatalog();
}

function clearCatalogSearch() {
  const input = document.getElementById('catalogSearchInput');
  const clearBtn = document.getElementById('catalogSearchClear');
  if (input) input.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  searchQuery = '';
  renderCatalog();
}

function handleCatalogSort(sortVal) {
  currentSort = sortVal || 'featured';
  renderCatalog();
}

function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  const countLabel = document.getElementById('catalogCountLabel');
  if (!grid || !window.PRODUCTS) return;

  // 1. Filtrar por categoría
  let list = window.PRODUCTS;
  if (activeCategory !== 'todos') {
    list = list.filter(p => p.category === activeCategory);
  }

  // 2. Filtrar por búsqueda
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q) ||
      (p.specs && p.specs.some(s => s.toLowerCase().includes(q)))
    );
  }

  // 3. Ordenar
  if (currentSort === 'price-asc') {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-desc') {
    list = [...list].sort((a, b) => b.price - a.price);
  } else if (currentSort === 'name-asc') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Actualizar contador
  if (countLabel) {
    countLabel.textContent = `Mostrando ${list.length} producto${list.length === 1 ? '' : 's'}${activeCategory !== 'todos' ? ` en ${activeCategory}` : ''}${searchQuery ? ` para "${searchQuery}"` : ''}`;
  }

  // Renderizar estado vacío si no hay resultados
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="catalog-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3>No se encontraron productos</h3>
        <p>No hay artículos que coincidan con "${escapeHtml(searchQuery)}". Intenta buscar con otros términos o cambia de categoría.</p>
        <button type="button" class="catalog-btn-primary" onclick="clearCatalogSearch(); handleCatalogCategoryChange('todos', null);">Ver todos los productos</button>
      </div>
    `;
    return;
  }

  // Renderizar tarjetas de producto
  grid.innerHTML = list.map(p => `
    <article class="catalog-card" data-category="${p.category}">
      
      <div class="catalog-card-header">
        <span class="catalog-tech-tag">${escapeHtml(p.tag)}</span>
        <span class="catalog-cat-tag">${escapeHtml(p.categoryLabel)}</span>
      </div>

      <div class="catalog-card-body">
        <div class="catalog-card-icon-wrap">
          <div class="catalog-card-icon">
            ${getProductIconSvg(p.icon)}
          </div>
          <span class="badge-3d-live">3D Live</span>
        </div>

        <h3 class="catalog-card-title">${escapeHtml(p.name)}</h3>
        <p class="catalog-card-desc">${escapeHtml(p.shortDesc)}</p>

        <div class="catalog-card-specs">
          ${(p.specs || []).slice(0, 3).map(spec => `<span class="spec-badge">${escapeHtml(spec)}</span>`).join('')}
        </div>
      </div>

      <div class="catalog-card-pricing-block">
        <div class="card-price-row">
          <span class="card-price">${p.price.toFixed(2)} €</span>
          <span class="card-tax">IVA incluido</span>
        </div>
      </div>

      <div class="catalog-card-actions-grid">
        <a href="producto.html?id=${p.id}" class="card-action-btn btn-view-page" title="Ver visualizador 3D interactivo y personalizar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>Ver en 3D</span>
        </a>

        <button type="button" class="card-action-btn btn-quick-cart" onclick="quickAddToCart('${p.id}')" title="Añadir al carrito">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>+ Carrito</span>
        </button>

        <button type="button" class="card-action-btn btn-quick-buy" onclick="quickDirectBuy('${p.id}')" title="Compra directa">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          <span>Comprar Ya</span>
        </button>
      </div>

    </article>
  `).join('');
}

// Iconos SVG para el catálogo
function getProductIconSvg(iconName) {
  const iconMap = {
    'smartphone': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>',
    'tablet': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>',
    'headphones': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>',
    'gamepad': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line><rect x="2" y="6" width="20" height="12" rx="2"></rect></svg>',
    'laptop': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line></svg>',
    'tag': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>',
    'music': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
    'box': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
    'life-buoy': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>',
    'shield': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    'tool': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
    'castle': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l3-3 3 3v14M19 21V7l-3-3-3 3v14M9 10h6"></path></svg>',
    'user-check': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>',
    'archive': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>',
    'feather': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>',
    'cpu': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>',
    'crosshair': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>',
    'maximize-2': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
    'cloud': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>',
    'book': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    'coffee': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
    'pen-tool': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>',
    'sun': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
    'moon': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
    'heart': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
    'zap': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
    'lock': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'
  };

  return iconMap[iconName] || '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
}

/**
 * Escapar caracteres HTML para evitar inyecciones
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return (text || '').toString().replace(/[&<>"']/g, m => map[m]);
}
