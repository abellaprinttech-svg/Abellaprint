// ========================================================
// Abella Print Tech - Catálogo de Productos 3D
// ========================================================

const CATEGORIES = [
  { id: 'todos', name: 'Todos los productos', icon: 'grid', count: 0 },
  { id: 'soportes', name: 'Fundas & Soportes Tech', icon: 'smartphone', count: 0 },
  { id: 'llaveros', name: 'Llaveros & Accesorios EDC', icon: 'key', count: 0 },
  { id: 'gaming', name: 'Gaming, Rol & Miniaturas', icon: 'crosshair', count: 0 },
  { id: 'hogar', name: 'Hogar, Decoración & Jardín', icon: 'home', count: 0 },
  { id: 'cocina', name: 'Cocina & Gadgets Útiles', icon: 'coffee', count: 0 },
  { id: 'escritorio', name: 'Oficina & Setup', icon: 'pen-tool', count: 0 },
  { id: 'cosplay', name: 'Cosplay, Máscaras & Atrezzo', icon: 'shield', count: 0 },
  { id: 'herramientas', name: 'Taller, Bricolaje & Repuestos', icon: 'tool', count: 0 },
  { id: 'iluminacion', name: 'Lámparas & Litofanías LED', icon: 'sun', count: 0 },
  { id: 'juguetes', name: 'Juguetes Mecánicos & Antiestrés', icon: 'cpu', count: 0 },
  { id: 'mascotas', name: 'Accesorios para Mascotas', icon: 'heart', count: 0 }
];

const AVAILABLE_COLORS = [
  { name: 'Negro Mate', hex: '#1e2022' },
  { name: 'Cobre / Bronce Tech', hex: '#c27835' },
  { name: 'Blanco Seda', hex: '#f8fafc' },
  { name: 'Gris Carbón', hex: '#475569' },
  { name: 'Azul Cobalto', hex: '#2563eb' },
  { name: 'Rojo Carmesí', hex: '#dc2626' },
  { name: 'Verde Militar', hex: '#166534' },
  { name: 'Dorado Metálico', hex: '#d97706' },
  { name: 'Translúcido Frost', hex: '#cbd5e1' }
];

const AVAILABLE_MATERIALS = [
  { id: 'pla', name: 'PLA+ Premium (Bio-plástico de alta rigidez)', extra: 0 },
  { id: 'petg', name: 'PETG Industrial (Alta resistencia térmica y UV)', extra: 3.50 },
  { id: 'resina', name: 'Resina 8K Ultra-Detalle (Superficie lisa perfecta)', extra: 6.00 },
  { id: 'tpu', name: 'TPU Flexible (Goma elástica irrompible)', extra: 4.50 }
];

/**
 * ========================================================
 * LISTA DE PRODUCTOS
 * ========================================================
 * Añade tus productos dentro del array PRODUCTS siguiendo la estructura de ejemplo:
 * 
 * {
 *   id: 'identificador-unico-sin-espacios',
 *   name: 'Nombre del Producto',
 *   category: 'soportes', // id de una de las categorías definidas arriba
 *   categoryLabel: 'Fundas & Soportes Tech', // nombre legible de la categoría
 *   price: 19.99, // precio base en euros (numérico)
 *   tag: 'Nuevo', // etiqueta destacada (Top Ventas, Nuevo, EDC, etc.)
 *   icon: 'smartphone', // icono representativo (smartphone, box, tool, heart, etc.)
 *   shape: 'rounded-box', // forma geométrica para el visor 3D (cylinder, rounded-box, cube, sphere, ring, stand, etc.)
 *   shortDesc: 'Descripción corta para la tarjeta del catálogo.',
 *   description: 'Descripción completa para la ficha individual del producto.',
 *   specs: ['Especificación 1', 'Especificación 2', 'Material recomendado'],
 *   customizable: true // true si permite grabado o personalización de texto
 * }
 */
const PRODUCTS = [
  // El catálogo está actualmente vacío. Añade tus nuevos productos aquí.
];

// Helper para obtener producto por ID
function getProductById(id) {
  if (!id) return null;
  return PRODUCTS.find(p => p.id === id) || null;
}

// Helper para filtrar productos por categoría
function getProductsByCategory(category) {
  if (!category || category === 'todos') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

// Helper para búsqueda textual
function searchProducts(query) {
  if (!query || !query.trim()) return PRODUCTS;
  const q = query.toLowerCase().trim();
  return PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.shortDesc.toLowerCase().includes(q) ||
    p.categoryLabel.toLowerCase().includes(q) ||
    p.tag.toLowerCase().includes(q) ||
    (p.specs && p.specs.some(s => s.toLowerCase().includes(q)))
  );
}

// Exportar globalmente
if (typeof window !== 'undefined') {
  window.PRODUCTS = PRODUCTS;
  window.CATEGORIES = CATEGORIES;
  window.AVAILABLE_COLORS = AVAILABLE_COLORS;
  window.AVAILABLE_MATERIALS = AVAILABLE_MATERIALS;
  window.getProductById = getProductById;
  window.getProductsByCategory = getProductsByCategory;
  window.searchProducts = searchProducts;
}
