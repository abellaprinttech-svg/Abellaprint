// ========================================================
// Abella Print Tech - Carrito de Compras & Checkout
// ========================================================

const CART_STORAGE_KEY = 'abella_print_cart_v1';
const FREE_SHIPPING_THRESHOLD = 45.00; // Envío gratis a partir de 45€
const STANDARD_SHIPPING_COST = 4.95;

// Obtener carrito de localStorage
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error cargando carrito:', e);
    return [];
  }
}

// Guardar carrito en localStorage
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
  } catch (e) {
    console.error('Error guardando carrito:', e);
  }
}

// Añadir artículo al carrito
function addToCart(item) {
  const cart = getCart();

  // Buscar si ya existe el mismo producto con idénticas opciones
  const existingIndex = cart.findIndex(c => 
    c.productId === item.productId &&
    c.color === item.color &&
    c.materialId === item.materialId &&
    (c.customText || '') === (item.customText || '')
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += (item.quantity || 1);
  } else {
    cart.push({
      id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      productId: item.productId,
      name: item.name,
      basePrice: item.basePrice,
      unitPrice: item.unitPrice,
      color: item.color,
      colorHex: item.colorHex,
      materialId: item.materialId,
      materialName: item.materialName,
      customText: item.customText || '',
      quantity: item.quantity || 1,
      category: item.category || ''
    });
  }

  saveCart(cart);
  showToastNotification(`¡"${item.name}" añadido al carrito!`);
  openCartDrawer();
}

// Modificar cantidad
function updateCartQuantity(cartItemId, delta) {
  let cart = getCart();
  const item = cart.find(c => c.id === cartItemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(c => c.id !== cartItemId);
  }

  saveCart(cart);
}

// Eliminar un artículo
function removeFromCart(cartItemId) {
  let cart = getCart();
  cart = cart.filter(c => c.id !== cartItemId);
  saveCart(cart);
}

// Vaciar carrito
function clearCart() {
  saveCart([]);
}

// Calcular totales
function getCartTotals() {
  const cart = getCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = subtotal === 0 ? 0 : (isFreeShipping ? 0 : STANDARD_SHIPPING_COST);
  const total = subtotal + shipping;

  return {
    totalItems,
    subtotal,
    shipping,
    isFreeShipping,
    total,
    remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  };
}

// Formatear precio en euros
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
}

// Actualizar contadores y badges visuales
function updateCartUI() {
  const totals = getCartTotals();
  const countElements = document.querySelectorAll('.cart-count-badge');
  countElements.forEach(el => {
    el.textContent = totals.totalItems;
    if (totals.totalItems > 0) {
      el.classList.remove('hidden');
      el.style.display = 'inline-flex';
    } else {
      el.classList.add('hidden');
      el.style.display = 'none';
    }
  });

  // Si el modal/drawer del carrito está abierto o existe, renderizar
  renderCartDrawerContent();
}

// Renderizar contenido del Drawer del carrito
function renderCartDrawerContent() {
  const drawerBody = document.getElementById('cartDrawerItems');
  const drawerFooter = document.getElementById('cartDrawerFooter');
  const emptyState = document.getElementById('cartDrawerEmpty');

  if (!drawerBody) return;

  const cart = getCart();
  const totals = getCartTotals();

  if (cart.length === 0) {
    drawerBody.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (drawerFooter) drawerFooter.classList.add('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (drawerFooter) drawerFooter.classList.remove('hidden');

  drawerBody.innerHTML = cart.map(item => `
    <div class="cart-item-row" data-cart-id="${item.id}">
      <div class="cart-item-swatch" style="background-color: ${item.colorHex || '#c27835'};"></div>
      <div class="cart-item-info">
        <h4 class="cart-item-title">${escapeCartHtml(item.name)}</h4>
        <div class="cart-item-meta">
          <span>${escapeCartHtml(item.materialName || 'PLA+')}</span>
          <span>&bull;</span>
          <span>${escapeCartHtml(item.color || 'Negro')}</span>
          ${item.customText ? `<span class="cart-item-custom-tag">Texto: "${escapeCartHtml(item.customText)}"</span>` : ''}
        </div>
        <div class="cart-item-pricing">
          <span class="cart-item-price">${formatCurrency(item.unitPrice)}</span>
          <div class="cart-item-qty-control">
            <button type="button" onclick="updateCartQuantity('${item.id}', -1)" aria-label="Disminuir">&minus;</button>
            <span>${item.quantity}</span>
            <button type="button" onclick="updateCartQuantity('${item.id}', 1)" aria-label="Aumentar">&plus;</button>
          </div>
        </div>
      </div>
      <button type="button" class="cart-item-remove-btn" onclick="removeFromCart('${item.id}')" title="Eliminar">&times;</button>
    </div>
  `).join('');

  // Actualizar resumen en el footer del drawer
  const subtotalEl = document.getElementById('cartDrawerSubtotal');
  const shippingEl = document.getElementById('cartDrawerShipping');
  const totalEl = document.getElementById('cartDrawerTotal');
  const shippingBannerEl = document.getElementById('cartShippingBanner');

  if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
  if (shippingEl) shippingEl.textContent = totals.isFreeShipping ? 'Gratis' : formatCurrency(totals.shipping);
  if (totalEl) totalEl.textContent = formatCurrency(totals.total);

  if (shippingBannerEl) {
    if (totals.isFreeShipping) {
      shippingBannerEl.className = 'shipping-promo-banner free';
      shippingBannerEl.innerHTML = '🎉 ¡Felicidades! Tienes <strong>Envío Gratuito</strong> para este pedido.';
    } else {
      shippingBannerEl.className = 'shipping-promo-banner';
      shippingBannerEl.innerHTML = `Añade <strong>${formatCurrency(totals.remainingForFreeShipping)}</strong> más para conseguir <strong>Envío Gratis</strong>.`;
    }
  }
}

// Abrir y cerrar Drawer del Carrito
function openCartDrawer() {
  let drawer = document.getElementById('cartDrawer');
  let overlay = document.getElementById('cartOverlay');

  if (!drawer) {
    injectCartDrawerDOM();
    drawer = document.getElementById('cartDrawer');
    overlay = document.getElementById('cartOverlay');
  }

  renderCartDrawerContent();
  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Inyectar el HTML del Drawer si no existe en la página
function injectCartDrawerDOM() {
  if (document.getElementById('cartDrawer')) return;

  const drawerHTML = `
    <div id="cartOverlay" class="cart-overlay" onclick="closeCartDrawer()"></div>
    <aside id="cartDrawer" class="cart-drawer" role="dialog" aria-label="Carrito de compra">
      <div class="cart-drawer-header">
        <div class="cart-drawer-title-group">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h3>Tu Carrito 3D</h3>
        </div>
        <button type="button" class="cart-drawer-close" onclick="closeCartDrawer()" aria-label="Cerrar">&times;</button>
      </div>

      <div id="cartShippingBanner" class="shipping-promo-banner"></div>

      <div id="cartDrawerEmpty" class="cart-empty-state">
        <div class="cart-empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <p class="cart-empty-text">Tu carrito está vacío.</p>
        <p class="cart-empty-sub">Explora nuestro catálogo y añade piezas únicas impresas en 3D.</p>
        <button type="button" class="catalog-btn-primary" onclick="closeCartDrawer(); window.location.href='index.html#catalogSection';">Ver Catálogo</button>
      </div>

      <div id="cartDrawerItems" class="cart-drawer-items"></div>

      <div id="cartDrawerFooter" class="cart-drawer-footer hidden">
        <div class="cart-summary-lines">
          <div class="summary-line">
            <span>Subtotal</span>
            <span id="cartDrawerSubtotal">0,00 €</span>
          </div>
          <div class="summary-line">
            <span>Envío estándar</span>
            <span id="cartDrawerShipping">4,95 €</span>
          </div>
          <div class="summary-line total">
            <span>Total estimado (IVA incl.)</span>
            <span id="cartDrawerTotal" class="total-amount">0,00 €</span>
          </div>
        </div>

        <div class="cart-drawer-actions">
          <button type="button" class="checkout-btn-primary" onclick="proceedToCheckout()">
            <span>Tramitar Pedido</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <a href="carrito.html" class="cart-view-full-link">Ver carrito detallado y opciones</a>
        </div>
      </div>
    </aside>
  `;

  document.body.insertAdjacentHTML('beforeend', drawerHTML);
}

// Notificación Toast flotante
function showToastNotification(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'global-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${escapeCartHtml(message)}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Proceder a checkout (redirige a carrito.html con paso checkout)
function proceedToCheckout() {
  window.location.href = 'carrito.html?step=checkout';
}

function escapeCartHtml(text) {
  if (!text) return '';
  return text.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
  injectCartDrawerDOM();
  updateCartUI();
});
