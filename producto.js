// ========================================================
// Abella Print Tech - Lógica de Ficha de Producto & Visor 3D
// ========================================================

let currentProduct = null;
let currentMaterial = null;
let currentColor = null;
let currentQuantity = 1;

// Variables Three.js
let scene, camera, renderer, currentMesh, modelGroup;
let isAutoRotating = true;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let currentRotationVelocity = { x: 0, y: 0 };

document.addEventListener('DOMContentLoaded', () => {
  // Configurar año en footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Obtener ID del producto desde URL query param o constante global
  const urlParams = new URLSearchParams(window.location.search);
  let productId = urlParams.get('id');
  if (!productId && window.STATIC_PRODUCT_ID) {
    productId = window.STATIC_PRODUCT_ID;
  }

  if (!productId || typeof getProductById !== 'function') {
    showProductNotFound();
    return;
  }

  currentProduct = getProductById(productId);
  if (!currentProduct) {
    showProductNotFound();
    return;
  }

  // Inicializar producto
  initProductUI();
  init3DViewer();
  calculatePrice();
});

function showProductNotFound() {
  const notFound = document.getElementById('productNotFound');
  const content = document.getElementById('productContent');
  if (notFound) notFound.classList.remove('hidden');
  if (content) content.classList.add('hidden');
}

function initProductUI() {
  document.title = `${currentProduct.name} | Abella Print Tech`;

  // Asignar textos
  document.getElementById('productTitle').textContent = currentProduct.name;
  document.getElementById('productShortDesc').textContent = currentProduct.shortDesc;
  document.getElementById('productFullDesc').textContent = currentProduct.description;
  document.getElementById('productCategoryTag').textContent = currentProduct.categoryLabel;
  document.getElementById('productTag').textContent = currentProduct.tag;
  document.getElementById('basePriceLabel').textContent = `${currentProduct.price.toFixed(2)} €`;

  // Renderizar especificaciones
  const specsList = document.getElementById('productSpecsList');
  if (specsList && currentProduct.specs) {
    specsList.innerHTML = currentProduct.specs.map(spec => `
      <li>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${escapeCartHtml(spec)}</span>
      </li>
    `).join('');
  }

  // Ocultar personalización si el producto no lo soporta
  const customGroup = document.getElementById('customTextGroup');
  if (customGroup && !currentProduct.customizable) {
    customGroup.style.display = 'none';
  }

  // Renderizar productos relacionados
  renderRelatedProducts();

  // Renderizar opciones de materiales
  const matContainer = document.getElementById('materialOptionsContainer');
  if (matContainer && window.AVAILABLE_MATERIALS) {
    currentMaterial = window.AVAILABLE_MATERIALS[0]; // PLA por defecto
    matContainer.innerHTML = window.AVAILABLE_MATERIALS.map((mat, idx) => `
      <div class="material-option-card ${idx === 0 ? 'selected' : ''}" onclick="selectMaterial('${mat.id}', this)">
        <div class="material-opt-top">
          <span class="material-opt-name">${escapeCartHtml(mat.name)}</span>
          ${mat.extra > 0 ? `<span class="material-opt-extra">+${mat.extra.toFixed(2)} €</span>` : '<span class="material-opt-extra free">Incluido</span>'}
        </div>
      </div>
    `).join('');
  }

  // Renderizar muestras de color
  const colorContainer = document.getElementById('colorSwatchesContainer');
  if (colorContainer && window.AVAILABLE_COLORS) {
    currentColor = window.AVAILABLE_COLORS[0]; // Negro mate por defecto
    colorContainer.innerHTML = window.AVAILABLE_COLORS.map((col, idx) => `
      <button 
        type="button" 
        class="color-swatch-btn ${idx === 0 ? 'selected' : ''}" 
        style="--swatch-color: ${col.hex};" 
        onclick="selectColor('${col.name}', '${col.hex}', this)"
        title="${col.name}"
        aria-label="Color ${col.name}"
      >
        <span class="swatch-check">✓</span>
      </button>
    `).join('');
  }
}

// Selección de Material
function selectMaterial(matId, element) {
  document.querySelectorAll('.material-option-card').forEach(el => el.classList.remove('selected'));
  if (element) element.classList.add('selected');

  currentMaterial = window.AVAILABLE_MATERIALS.find(m => m.id === matId) || window.AVAILABLE_MATERIALS[0];
  const matVal = document.getElementById('selectedMaterialValue');
  if (matVal) matVal.textContent = currentMaterial.name.split(' (')[0];

  calculatePrice();
  update3DMaterialProperties();
}

// Selección de Color
function selectColor(name, hex, element) {
  document.querySelectorAll('.color-swatch-btn').forEach(el => el.classList.remove('selected'));
  if (element) element.classList.add('selected');

  currentColor = { name, hex };
  const colVal = document.getElementById('selectedColorValue');
  const tagPreview = document.getElementById('previewColorTag');
  if (colVal) colVal.textContent = name;
  if (tagPreview) tagPreview.textContent = `Color: ${name}`;

  update3DModelColor(hex);
}

// Cantidad
function changeQuantity(delta) {
  const input = document.getElementById('productQuantity');
  let val = parseInt(input.value) || 1;
  val = Math.max(1, Math.min(50, val + delta));
  input.value = val;
  currentQuantity = val;
  calculatePrice();
}

// Cálculo dinámico de precio
function calculatePrice() {
  if (!currentProduct) return;

  const base = currentProduct.price;
  const matExtra = currentMaterial ? currentMaterial.extra : 0;
  const unitPrice = base + matExtra;
  const total = unitPrice * currentQuantity;

  const totalEl = document.getElementById('dynamicTotalPrice');
  const breakdownEl = document.getElementById('priceBreakdownTag');

  if (totalEl) totalEl.textContent = total.toFixed(2);
  if (breakdownEl) {
    if (matExtra > 0) {
      breakdownEl.textContent = `${unitPrice.toFixed(2)} € / ud. (${base.toFixed(2)} € base + ${matExtra.toFixed(2)} € material)`;
    } else {
      breakdownEl.textContent = `${unitPrice.toFixed(2)} € / unidad`;
    }
  }
}

// Añadir al Carrito
function handleAddToCartClick() {
  if (!currentProduct) return;

  const customTextInput = document.getElementById('customTextInput');
  const customText = customTextInput ? customTextInput.value.trim() : '';

  const base = currentProduct.price;
  const matExtra = currentMaterial ? currentMaterial.extra : 0;
  const unitPrice = base + matExtra;

  addToCart({
    productId: currentProduct.id,
    name: currentProduct.name,
    basePrice: base,
    unitPrice: unitPrice,
    color: currentColor ? currentColor.name : 'Negro Mate',
    colorHex: currentColor ? currentColor.hex : '#1e2022',
    materialId: currentMaterial ? currentMaterial.id : 'pla',
    materialName: currentMaterial ? currentMaterial.name.split(' (')[0] : 'PLA+',
    customText: customText,
    quantity: currentQuantity,
    category: currentProduct.category
  });
}

// Comprar Ahora (redirige a la página de Kickstarter)
function handleBuyNowClick() {
  handleAddToCartClick();
  window.location.href = 'kickstarter.html';
}

// ========================================================
// Visor 3D con Three.js
// ========================================================
function init3DViewer() {
  const container = document.getElementById('canvas3dContainer');
  const canvas = document.getElementById('product3dCanvas');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 400;
  const height = container.clientHeight || 360;

  // 1. Escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfbfbfc);

  // 2. Cámara
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 4, 9);
  camera.lookAt(0, 0, 0);

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // 4. Iluminación de estudio
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
  keyLight.position.set(5, 10, 7);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xc27835, 0.4); // Tono cálido cobre
  fillLight.position.set(-6, 4, -4);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xdbeafe, 0.5);
  rimLight.position.set(0, -5, -6);
  scene.add(rimLight);

  // 5. Suelo con rejilla tecnológica sutil
  const gridHelper = new THREE.GridHelper(10, 20, 0xc27835, 0xe2e8f0);
  gridHelper.position.y = -2;
  scene.add(gridHelper);

  // 6. Grupo de modelo
  modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // Construir geometría representativa según la forma del producto
  buildProductGeometry();

  // 7. Eventos de ratón / toque
  setupViewerControls(container);

  // 8. Loop de animación
  animateViewer();

  // Redimensionar al cambiar tamaño de ventana
  window.addEventListener('resize', onViewerWindowResize);
}

function onViewerWindowResize() {
  const container = document.getElementById('canvas3dContainer');
  if (!container || !renderer || !camera) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function buildProductGeometry() {
  if (!modelGroup) return;

  // Limpiar anterior si existe
  while (modelGroup.children.length > 0) {
    modelGroup.remove(modelGroup.children[0]);
  }

  const shapeType = currentProduct.shape || 'rounded-box';
  let geometry;

  switch (shapeType) {
    case 'arch':
      geometry = new THREE.TorusGeometry(1.8, 0.4, 16, 50, Math.PI);
      break;
    case 'cube':
      geometry = new THREE.BoxGeometry(2.4, 2.4, 2.4);
      break;
    case 'gear':
      geometry = new THREE.CylinderGeometry(1.9, 1.9, 0.65, 14);
      break;
    case 'cloud':
      geometry = new THREE.DodecahedronGeometry(1.9, 2);
      break;
    case 'origami':
      geometry = new THREE.ConeGeometry(1.8, 3.2, 6);
      break;
    case 'articulated':
      geometry = new THREE.CylinderGeometry(0.7, 1.4, 3.8, 10);
      break;
    case 'tower':
      geometry = new THREE.CylinderGeometry(1.2, 1.8, 4, 8);
      break;
    case 'vase':
    case 'spiral':
      geometry = new THREE.TorusKnotGeometry(1.4, 0.45, 100, 16);
      break;
    case 'capsule':
      geometry = new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(1, 2.2, 16, 32) : new THREE.CylinderGeometry(1, 1, 3, 32);
      break;
    case 'plate':
    case 'bar':
      geometry = new THREE.BoxGeometry(4.2, 0.4, 1.8);
      break;
    case 'stand':
    case 'wedge':
    case 'holder':
      geometry = new THREE.CylinderGeometry(1.5, 2.2, 2.5, 6);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(1.8, 48, 48);
      break;
    case 'lithophane':
      geometry = new THREE.CylinderGeometry(2.2, 2.2, 3.0, 32, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
      break;
    case 'mask':
    case 'horns':
      geometry = new THREE.ConeGeometry(1.6, 3.5, 16);
      break;
    case 'hex-grid':
    case 'hex-coasters':
      geometry = new THREE.CylinderGeometry(2, 2, 0.6, 6);
      break;
    case 'figurine':
    case 'skull':
      geometry = new THREE.DodecahedronGeometry(1.8, 1);
      break;
    case 'rounded-box':
    default:
      geometry = new THREE.BoxGeometry(2.4, 3.8, 0.8);
      break;
  }

  const initialHex = currentColor ? currentColor.hex : '#1e2022';
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialHex),
    roughness: 0.35,
    metalness: 0.15,
    flatShading: shapeType === 'figurine' || shapeType === 'skull'
  });

  currentMesh = new THREE.Mesh(geometry, material);
  currentMesh.castShadow = true;
  currentMesh.receiveShadow = true;
  currentMesh.position.y = 0;

  modelGroup.add(currentMesh);
}

function update3DModelColor(hex) {
  if (currentMesh && currentMesh.material) {
    currentMesh.material.color.set(hex);
  }
}

function update3DMaterialProperties() {
  if (!currentMesh || !currentMesh.material || !currentMaterial) return;

  if (currentMaterial.id === 'resina') {
    currentMesh.material.roughness = 0.15;
    currentMesh.material.metalness = 0.3;
  } else if (currentMaterial.id === 'petg') {
    currentMesh.material.roughness = 0.25;
    currentMesh.material.metalness = 0.1;
  } else if (currentMaterial.id === 'tpu') {
    currentMesh.material.roughness = 0.7;
    currentMesh.material.metalness = 0.05;
  } else {
    // PLA+
    currentMesh.material.roughness = 0.4;
    currentMesh.material.metalness = 0.1;
  }
}

function setupViewerControls(container) {
  // Reset View Button
  const btnReset = document.getElementById('btnResetView');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      setViewerAngle('isometric');
    });
  }

  // Toggle Auto Rotate
  const btnRotate = document.getElementById('btnToggleRotate');
  if (btnRotate) {
    btnRotate.addEventListener('click', () => {
      isAutoRotating = !isAutoRotating;
      btnRotate.classList.toggle('active', isAutoRotating);
    });
  }

  // Mouse drag
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    isAutoRotating = false;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging || !modelGroup) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    modelGroup.rotation.y += deltaX * 0.01;
    modelGroup.rotation.x += deltaY * 0.01;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Touch drag
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      isAutoRotating = false;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !modelGroup || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    modelGroup.rotation.y += deltaX * 0.012;
    modelGroup.rotation.x += deltaY * 0.012;

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  // Zoom rueda
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (!camera) return;
    camera.position.z += e.deltaY * 0.006;
    camera.position.z = Math.max(4, Math.min(16, camera.position.z));
  }, { passive: false });
}

function setViewerAngle(angle) {
  if (!modelGroup || !camera) return;
  isAutoRotating = false;

  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = Array.from(document.querySelectorAll('.preset-btn')).find(b => b.getAttribute('onclick')?.includes(angle));
  if (activeBtn) activeBtn.classList.add('active');

  switch (angle) {
    case 'front':
      modelGroup.rotation.set(0, 0, 0);
      camera.position.set(0, 0, 9);
      break;
    case 'top':
      modelGroup.rotation.set(Math.PI / 2, 0, 0);
      camera.position.set(0, 9, 0.1);
      break;
    case 'side':
      modelGroup.rotation.set(0, Math.PI / 2, 0);
      camera.position.set(9, 0, 0);
      break;
    case 'isometric':
    default:
      modelGroup.rotation.set(0.3, 0.6, 0);
      camera.position.set(0, 4, 9);
      break;
  }
  camera.lookAt(0, 0, 0);
}

function animateViewer() {
  requestAnimationFrame(animateViewer);

  if (isAutoRotating && modelGroup) {
    modelGroup.rotation.y += 0.008;
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// Renderizar sección de productos relacionados
function renderRelatedProducts() {
  const grid = document.getElementById('relatedProductsGrid');
  if (!grid || !window.PRODUCTS || !currentProduct) return;

  const sameCategory = window.PRODUCTS.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4);
  const fallback = sameCategory.length < 4 
    ? [...sameCategory, ...window.PRODUCTS.filter(p => p.id !== currentProduct.id && !sameCategory.includes(p))].slice(0, 4)
    : sameCategory;

  grid.innerHTML = fallback.map(p => `
    <div class="related-card">
      <div class="related-card-top">
        <span class="related-tag">${escapeCartHtml(p.tag)}</span>
        <span class="related-cat">${escapeCartHtml(p.categoryLabel)}</span>
      </div>
      <h4 class="related-title-text">${escapeCartHtml(p.name)}</h4>
      <p class="related-desc">${escapeCartHtml(p.shortDesc)}</p>
      <div class="related-card-bottom">
        <span class="related-price">${p.price.toFixed(2)} €</span>
        <a href="producto.html?id=${p.id}" class="related-btn-view">Ver Ficha 3D &rarr;</a>
      </div>
    </div>
  `).join('');
}
