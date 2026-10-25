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

/**
 * Filtra las tarjetas del catálogo según la categoría seleccionada
 * @param {string} category - Categoría a filtrar ('todos', 'polimeros', 'metales', 'utillajes', 'prototipado')
 * @param {HTMLElement} btn - Botón presionado
 */
function filterCatalog(category, btn) {
  // Actualizar clase activa en botones de filtro
  const buttons = document.querySelectorAll('.catalog-filters .filter-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // Filtrar tarjetas
  const cards = document.querySelectorAll('.catalog-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'todos' || cardCat === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

/**
 * Selecciona un producto del catálogo y lo traslada a la barra de consulta
 * @param {string} itemName - Nombre del producto seleccionado
 */
function selectCatalogItem(itemName) {
  const input = document.getElementById('mindInput');
  const searchBar = document.querySelector('.search-bar');

  if (input) {
    input.value = `Quiero personalizar: ${itemName}`;
    input.focus();

    // Efecto visual de resaltado suave en la barra
    if (searchBar) {
      searchBar.style.borderColor = 'var(--accent-color)';
      searchBar.style.boxShadow = 'var(--shadow-focused)';
      setTimeout(() => {
        searchBar.style.borderColor = '';
        searchBar.style.boxShadow = '';
      }, 1200);
    }
  }

  // Desplazar suavemente a la barra de búsqueda
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  return text.replace(/[&<>"']/g, m => map[m]);
}
