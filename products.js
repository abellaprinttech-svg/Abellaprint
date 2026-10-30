// ========================================================
// Abella Print Tech - Catálogo Completo de Productos 3D
// ========================================================

const CATEGORIES = [
  { id: 'todos', name: 'Todos los productos', icon: 'grid' },
  { id: 'soportes', name: 'Fundas & Soportes', icon: 'smartphone' },
  { id: 'llaveros', name: 'Llaveros & Accesorios', icon: 'key' },
  { id: 'gaming', name: 'Gaming & Miniaturas', icon: 'crosshair' },
  { id: 'hogar', name: 'Hogar & Decoración', icon: 'home' },
  { id: 'cocina', name: 'Cocina & Gadgets', icon: 'coffee' },
  { id: 'escritorio', name: 'Oficina & Escritorio', icon: 'pen-tool' },
  { id: 'cosplay', name: 'Cosplay & Moda', icon: 'shield' },
  { id: 'herramientas', name: 'Repuestos & Taller', icon: 'tool' },
  { id: 'iluminacion', name: 'Lámparas & Litofanías', icon: 'sun' }
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
  { id: 'pla', name: 'PLA+ Premium (Bio-plástico biodegradable)', extra: 0 },
  { id: 'petg', name: 'PETG Industrial (Alta resistencia térmica y mecánica)', extra: 3.50 },
  { id: 'resina', name: 'Resina 8K Ultra-Detalle (Superficie lisa perfecta)', extra: 6.00 },
  { id: 'tpu', name: 'TPU Flexible (Goma elástica irrompible)', extra: 4.50 }
];

const PRODUCTS = [
  // --- FUNDAS & SOPORTES ---
  {
    id: 'funda-movil-impact',
    name: 'Funda Móvil Impact Resistente Personalizada',
    category: 'soportes',
    categoryLabel: 'Fundas & Soportes',
    price: 14.95,
    tag: 'Top Ventas',
    icon: 'smartphone',
    shape: 'rounded-box',
    shortDesc: 'Funda ergonómica a medida para cualquier modelo de smartphone con panal interior anti-impactos.',
    description: 'Diseñada con paredes reforzadas y patrón hexagonal interno para dispersión de golpes. Adaptada exactamente al corte de cámaras y botones de tu modelo de móvil. Personalizable con tu nombre o relieve trasero.',
    specs: ['Grosor: 2.2 mm', 'Material idóneo: TPU / PLA+', 'Corte CNC de puertos', 'Compatible carga inalámbrica'],
    customizable: true
  },
  {
    id: 'soporte-movil-ajustable',
    name: 'Soporte de Móvil Plegable Multi-Ángulo',
    category: 'soportes',
    categoryLabel: 'Fundas & Soportes',
    price: 11.50,
    tag: 'Funcional',
    icon: 'tablet',
    shape: 'stand',
    shortDesc: 'Soporte articulado con ranura para cable de carga mientras visualizas tutoriales o videollamadas.',
    description: 'Estructura ligera plegable con tope antideslizante y regulación de 15° a 75°. Ideal para mesa de noche, escritorio u oficina.',
    specs: ['5 ángulos de inclinación', 'Paso de cable inferior', 'Plegable plano a 8 mm', 'Peso: 45g'],
    customizable: true
  },
  {
    id: 'soporte-auriculares-curvo',
    name: 'Stands para Auriculares Headset Minimalista',
    category: 'soportes',
    categoryLabel: 'Fundas & Soportes',
    price: 17.90,
    tag: 'Setup Clean',
    icon: 'headphones',
    shape: 'arch',
    shortDesc: 'Soporte de diadema con curva biomecánica para no deformar la almohadilla de tus cascos.',
    description: 'Base lastrada de alta estabilidad con perfil curvado moderno. Diseñado para cuidar la espuma de la diadema de auriculares gaming o de estudio.',
    specs: ['Altura: 26 cm', 'Base pesada antivuelco', 'Radio de curvatura ergonómico', 'Acabado satinado'],
    customizable: false
  },
  {
    id: 'soporte-mando-consola',
    name: 'Base Exhibidora para Mandos (PS5, Xbox, Switch)',
    category: 'soportes',
    categoryLabel: 'Fundas & Soportes',
    price: 12.90,
    tag: 'Gamer',
    icon: 'gamepad',
    shape: 'wedge',
    shortDesc: 'Base a medida para colocar y lucir tu gamepad sin balanceos.',
    description: 'Moldeado exacto para el perfil inferior de los mandos DualSense, Xbox Wireless Controller o Nintendo Pro. Con opción de serigrafía o grabado en la frontal.',
    specs: ['Encaje milimétrico', 'Patas de goma compatibles', 'Material PLA+ rígido', 'Opciones bicolores'],
    customizable: true
  },

  // --- LLAVEROS & ACCESORIOS ---
  {
    id: 'llavero-matricula-auto',
    name: 'Llavero Réplica Matrícula con Relieve 3D',
    category: 'llaveros',
    categoryLabel: 'Llaveros & Accesorios',
    price: 6.50,
    tag: 'Personalizado',
    icon: 'tag',
    shape: 'plate',
    shortDesc: 'Tu matrícula o texto personalizado en dos colores con relieve táctil de alta definición.',
    description: 'Fabricado mediante doble extrusión o cambio de filamento de precisión. Incluye argolla metálica inoxidable y números en relieve de gran contraste visual.',
    specs: ['Dimensiones: 65x15x4 mm', 'Doble color integrado', 'Argolla de acero incluida', 'Letras en alto relieve'],
    customizable: true
  },
  {
    id: 'llavero-spotify-code',
    name: 'Llavero con Código Escaneable Spotify',
    category: 'llaveros',
    categoryLabel: 'Llaveros & Accesorios',
    price: 7.90,
    tag: 'Regalo Top',
    icon: 'music',
    shape: 'bar',
    shortDesc: 'Escanea el código con la cámara de Spotify y reproduce tu canción o playlist favorita.',
    description: 'El detalle sentimental perfecto. Indícanos el enlace o título de la canción y generamos el código de barras sonoro de Spotify grabado con precisión de 0.12 mm.',
    specs: ['Lectura 100% verificada', 'Resistente al agua', 'Acabado en alto contraste', 'Incluye anilla'],
    customizable: true
  },
  {
    id: 'pastillero-llavero-hermetico',
    name: 'Cápsula Llavero Hermética con Rosca Rápida',
    category: 'llaveros',
    categoryLabel: 'Llaveros & Accesorios',
    price: 8.50,
    tag: 'Utilidad',
    icon: 'box',
    shape: 'capsule',
    shortDesc: 'Cilindro con junta de estanqueidad para llevar pastillas, billete de emergencia o tapones.',
    description: 'Rosca de paso continuo de alta tolerancia y estrías exteriores para un agarre seguro. Ideal para EDC (Everyday Carry).',
    specs: ['Cierre de rosca segura', 'Diámetro interior: 16 mm', 'Altura útil: 52 mm', 'Textura estriada'],
    customizable: false
  },
  {
    id: 'llavero-destapador-reforzado',
    name: 'Llavero Abridor de Botellas con Inserto Moneda',
    category: 'llaveros',
    categoryLabel: 'Llaveros & Accesorios',
    price: 6.90,
    tag: 'Ingenioso',
    icon: 'life-buoy',
    shape: 'wedge',
    shortDesc: 'Abridor ultracompacto que aprovecha el refuerzo de palanca mecánica.',
    description: 'Geometría calculada mediante análisis de esfuerzos para destapar botellas sin esfuerzo ni fatiga en el material plástico.',
    specs: ['Diseño ultraligero 18g', 'Alta rigidez mecánica', 'Anilla de agarre rápido', 'Varios colores'],
    customizable: false
  },

  // --- GAMING & MINIATURAS ---
  {
    id: 'torre-dados-dragon',
    name: 'Torre de Dados Escultórica "Torreón Ancestral"',
    category: 'gaming',
    categoryLabel: 'Gaming & Miniaturas',
    price: 26.50,
    tag: 'Rol & D&D',
    icon: 'castle',
    shape: 'tower',
    shortDesc: 'Lanza tus dados poliédricos a través de la torre con rampa interna aleatoria y bandeja receptora.',
    description: 'Ideal para partidas de Dungeons & Dragons, Warhammer o juegos de mesa. Escaleras interiores y deflectores que garantizan tiradas 100% justas y sin caídas fuera de la mesa.',
    specs: ['Altura: 18 cm', 'Apta para d20 estándar de 25mm', 'Bandeja acolchada opcional', 'Detalles de piedra medieval'],
    customizable: false
  },
  {
    id: 'miniaturas-resina-rol',
    name: 'Miniatura Personalizada en Resina 8K (28mm / 32mm)',
    category: 'gaming',
    categoryLabel: 'Gaming & Miniaturas',
    price: 9.90,
    tag: 'Ultra Detalle',
    icon: 'user-check',
    shape: 'figurine',
    shortDesc: 'Impresión en resina fotosensible de ultra-alta definición sin marcas de capas perceptibles.',
    description: 'Curas completas y lavados ultrasónicos. Perfectas para pintores de miniaturas, ejércitos de wargames o héroes de rol diseñados en HeroForge o Eldritch Foundry.',
    specs: ['Resolución XY: 22 micras', 'Escala 28mm / 32mm / 75mm', 'Curado UV completo', 'Superficie preparada para imprimación'],
    customizable: true
  },
  {
    id: 'caja-mazo-magic-tcg',
    name: 'Deck Box Magnética para Cartas TCG (Magic/Pokémon)',
    category: 'gaming',
    categoryLabel: 'Gaming & Miniaturas',
    price: 18.00,
    tag: 'Coleccionismo',
    icon: 'archive',
    shape: 'cube',
    shortDesc: 'Caja rígida con cierre mediante imanes de neodimio para más de 100 cartas con doble funda.',
    description: 'Interior espacioso para mazos Commander / EDH con protectores premium. Compartimento inferior secreto para contadores, dados y tokens.',
    specs: ['Capacidad: 100+ cartas double-sleeved', 'Cierre con 8 imanes potentes', 'Cajón inferior para dados', 'Acabado texturizado'],
    customizable: true
  },
  {
    id: 'calavera-t-rex-baja-poligonal',
    name: 'Cráneo T-Rex Low-Poly Geométrico',
    category: 'gaming',
    categoryLabel: 'Gaming & Miniaturas',
    price: 21.00,
    tag: 'Escultura',
    icon: 'feather',
    shape: 'skull',
    shortDesc: 'Pieza de coleccionista y decoración con estética poligonal moderna para estanterías.',
    description: 'Escultura faceteada de 18 cm de longitud que refracta la luz en diferentes ángulos. Un diseño impactante para salas de juego, setups y oficinas.',
    specs: ['Longitud: 185 mm', 'Diseño autoportante', 'Faceteado geométrico', 'Material mate antirreflejos'],
    customizable: false
  },

  // --- HOGAR & DECORACIÓN ---
  {
    id: 'maceta-geometria-dodecaedro',
    name: 'Macetero Dodecaedro Geométrico Autorregable',
    category: 'hogar',
    categoryLabel: 'Hogar & Decoración',
    price: 15.50,
    tag: 'Diseño Nórdico',
    icon: 'feather',
    shape: 'vase',
    shortDesc: 'Maceta moderna con depósito interior de agua y plato de drenaje oculto.',
    description: 'Estructura minimalista de caras poligonales. Su plato interior recoge el exceso de agua evitando manchas en muebles y pudrición de raíces para suculentas y cactus.',
    specs: ['Diámetro: 13 cm', 'Drenaje integrado', 'Plato recolector oculto', 'Apta para interior y exterior'],
    customizable: false
  },
  {
    id: 'jarron-vórtice-espiral',
    name: 'Jarrón de Diseño Espiral "Vortex Flow"',
    category: 'hogar',
    categoryLabel: 'Hogar & Decoración',
    price: 22.90,
    tag: 'Arte Moderno',
    icon: 'maximize-2',
    shape: 'spiral',
    shortDesc: 'Jarrón fluido con líneas helicoidales que generan reflejos orgánicos de luz.',
    description: 'Fabricado en modo espiral continuo hermético para flores secas o frescas (tratamiento impermeable). Una pieza de galería de arte para tu salón.',
    specs: ['Altura: 24 cm', 'Líneas continuas sin costura', 'Base estabilizada', 'Colores seda disponibles'],
    customizable: false
  },
  {
    id: 'colgador-llaves-magnetico-nube',
    name: 'Cuelga-Llaves Magnético de Pared "Cloud"',
    category: 'hogar',
    categoryLabel: 'Hogar & Decoración',
    price: 13.90,
    tag: 'Magia Visual',
    icon: 'cloud',
    shape: 'cloud',
    shortDesc: 'Pega tus llaveros flotando bajo la nube gracias a potentes imanes ocultos.',
    description: 'Se fija a la pared con adhesivo de doble cara sin taladros. Cada nube sujeta hasta 3 manojos pesados de llaves simplemente acercándolos a la base.',
    specs: ['3 imanes N52 de alto flujo', 'Fijación sin tornillos', 'Soporta hasta 600g por punto', 'Largo: 12 cm'],
    customizable: false
  },
  {
    id: 'sujetalibros-portal-dimensional',
    name: 'Sujetalibros Par de Portales Iluminados',
    category: 'hogar',
    categoryLabel: 'Hogar & Decoración',
    price: 29.90,
    tag: 'Sci-Fi Fan',
    icon: 'book-open',
    shape: 'portal',
    shortDesc: 'Juego de dos sujetalibros inspirados en portales de teletransporte para tu biblioteca.',
    description: 'Un extremo simula la entrada y el otro la salida con una silueta cruzando el espacio. Mantiene tus libros y novelas gráficas perfectamente verticales.',
    specs: ['Juego de 2 unidades', 'Chapa metálica de apoyo interior', 'Base engomada antirrayaduras', 'Largo: 16 cm cada uno'],
    customizable: false
  },

  // --- COCINA & GADGETS ---
  {
    id: 'posavasos-hexagonales-soporte',
    name: 'Set 6 Posavasos Geométricos con Soporte Nido',
    category: 'cocina',
    categoryLabel: 'Cocina & Gadgets',
    price: 16.50,
    tag: 'Pack Completo',
    icon: 'disc',
    shape: 'hex-coasters',
    shortDesc: 'Set de 6 posavasos con relieve de panal de abeja y soporte organizador.',
    description: 'Protege tus mesas de madera y cristal contra condensación fría y calor de tazas. El soporte a juego los mantiene ordenados ocupando mínimo espacio.',
    specs: ['Diámetro: 95 mm cada uno', 'Resistente a 80°C (PETG)', 'Borde antiderrames', 'Soporte apilable vertical'],
    customizable: false
  },
  {
    id: 'cortadores-galletas-personalizados',
    name: 'Cortadores de Galletas con Forma & Texto',
    category: 'cocina',
    categoryLabel: 'Cocina & Gadgets',
    price: 8.90,
    tag: 'Repostería',
    icon: 'scissors',
    shape: 'cutter',
    shortDesc: 'Molde con tu nombre, iniciales, logo o dibujo para hacer galletas únicas.',
    description: 'Filo afilado de 0.8 mm para cortes limpios en masa y expulsor de sello con relieve para estampar la textura deseada. Apto para masas, fondant y arcilla polimérica.',
    specs: ['Filo de corte biselado', 'Material PLA apto contacto alimentos breve', 'Lavable con agua templada', 'Tamaño 8x8 cm'],
    customizable: true
  },
  {
    id: 'dispensador-capsulas-cafe',
    name: 'Dispensador Torre de Cápsulas (Nespresso / Dolce Gusto)',
    category: 'cocina',
    categoryLabel: 'Cocina & Gadgets',
    price: 18.50,
    tag: 'Organización',
    icon: 'layers',
    shape: 'column',
    shortDesc: 'Torre de gravedad con dispensado inferior para tener tus cafés siempre a mano.',
    description: 'Guarda hasta 20 cápsulas ordenadas por tipos de café. Retira una cápsula por la ventanilla inferior y la siguiente cae automáticamente por gravedad.',
    specs: ['Capacidad: 20 cápsulas', 'Alimentación superior', 'Base circular de 11 cm', 'Diseño ventilado'],
    customizable: false
  },
  {
    id: 'clips-bolsa-cierre-hermetico',
    name: 'Pack 8 Pinzas Cierra-Bolsas con Boquilla Vertedora',
    category: 'cocina',
    categoryLabel: 'Cocina & Gadgets',
    price: 9.90,
    tag: 'Súper Útil',
    icon: 'check-circle',
    shape: 'clip',
    shortDesc: 'Pinzas con tapón vertedor para servir cereales, arroz, café o snacks sin desparramar.',
    description: 'Sujetan la bolsa abierta sellándola herméticamente y permiten servir el contenido directamente abriendo la tapa superior.',
    specs: ['Pack de 4 grandes + 4 estándar', 'Cierre de clip reforzado', 'Tapón de rosca antiderrames', 'Material apto uso doméstico'],
    customizable: false
  },

  // --- OFICINA & ESCRITORIO ---
  {
    id: 'organizador-escritorio-modular',
    name: 'Organizador Modular Hexagonal para Escritorio',
    category: 'escritorio',
    categoryLabel: 'Oficina & Escritorio',
    price: 19.90,
    tag: 'Modular',
    icon: 'grid',
    shape: 'hex-grid',
    shortDesc: 'Módulos imantados intercambiables para bolígrafos, clips, post-its y pendrives.',
    description: 'Ensambla los hexágonos como prefieras gracias a sus conectores machihembrados. Configura tu espacio de trabajo a tu medida.',
    specs: ['5 módulos incluidos', 'Ranuras para SD y USB', 'Compartimento para móvil', 'Base antideslizante'],
    customizable: false
  },
  {
    id: 'soporte-laptop-vertical',
    name: 'Soporte Vertical Doble para Portátil & MacBook',
    category: 'escritorio',
    categoryLabel: 'Oficina & Escritorio',
    price: 17.50,
    tag: 'Ahorro Espacio',
    icon: 'monitor',
    shape: 'slot',
    shortDesc: 'Coloca tu ordenador cerrado en vertical para conectar a monitor externo.',
    description: 'Libera hasta un 80% del espacio en tu mesa. Ranuras acolchadas compatibles con portátiles de hasta 22 mm de grosor (MacBook Air, Pro, ThinkPad, etc.).',
    specs: ['Doble ranura (laptop + tablet)', 'Aberturas de ventilación lateral', 'Estabilidad antivuelco', 'Gomas de protección interior'],
    customizable: false
  },
  {
    id: 'guia-cables-escritorio-clip',
    name: 'Pack 10 Clips Pasacables para Borde de Mesa',
    category: 'escritorio',
    categoryLabel: 'Oficina & Escritorio',
    price: 8.50,
    tag: 'Cable Clean',
    icon: 'link-2',
    shape: 'cable-clip',
    shortDesc: 'Sujeta cables USB-C, Lightning y HDMI para que nunca se caigan al suelo tras la mesa.',
    description: 'Se encajan a presión en tableros de 18 a 25 mm sin taladros ni adhesivos que dejen residuos pegajosos.',
    specs: ['Ajuste a presión', 'Apto para 3 cables cada clip', 'Material con memoria elástica', 'Pack de 10 clips'],
    customizable: false
  },
  {
    id: 'porta-tarjetas-negocios',
    name: 'Tarjetero de Visita con Expulsor Mecánico',
    category: 'escritorio',
    categoryLabel: 'Oficina & Escritorio',
    price: 12.00,
    tag: 'Profesional',
    icon: 'credit-card',
    shape: 'wallet',
    shortDesc: 'Desliza el gatillo lateral y despliega tus tarjetas de visita de forma futurista.',
    description: 'Impreso en una sola pieza con bisagras mecánicas internas (print-in-place). Deja una impresión memorable en cualquier reunión o evento de networking.',
    specs: ['Mecanismo Print-in-Place', 'Capacidad: 15 tarjetas', 'Bloqueo antiquedada', 'Grosor ultra-slim 9 mm'],
    customizable: true
  },

  // --- COSPLAY & MODA ---
  {
    id: 'mascara-cyberpunk-oni',
    name: 'Media Máscara Cibernética "Cyber Oni"',
    category: 'cosplay',
    categoryLabel: 'Cosplay & Moda',
    price: 34.00,
    tag: 'Cosplay Pro',
    icon: 'smile',
    shape: 'mask',
    shortDesc: 'Máscara facial ergonómica con ventilaciones y ranuras para filtros intercambiables.',
    description: 'Diseño inspirado en el folclore japonés fusionado con estética neo-Tokyo cyberpunk. Incluye ranuras laterales para correas elásticas ajustables y almohadillas internas.',
    specs: ['Ajuste a contorno nasal', 'Rejillas de respiración activa', 'Ranuras para correa de 20mm', 'Apta para pintar o con acabado seda'],
    customizable: false
  },
  {
    id: 'cuernos-demonio-diadema',
    name: 'Cuernos Fantasía Texturizados con Diadema Oculta',
    category: 'cosplay',
    categoryLabel: 'Cosplay & Moda',
    price: 18.90,
    tag: 'Fiesta & Eventos',
    icon: 'zap',
    shape: 'horns',
    shortDesc: 'Par de cuernos ultraligeros huecos montables sobre diadema o clips para pelucas.',
    description: 'Con textura estriada realista y peso inferior a 60 gramos el par para garantizar comodidad durante horas en convenciones o fiestas.',
    specs: ['Peso pluma: 28g por cuerno', 'Diadema negra incluida', 'Acabado negro mate o hueso', 'Altura: 14 cm'],
    customizable: false
  },
  {
    id: 'pajarita-geometrica-3d',
    name: 'Pajarita Geométrica Texturizada con Cuello Ajustable',
    category: 'cosplay',
    categoryLabel: 'Cosplay & Moda',
    price: 15.00,
    tag: 'Elegancia Tech',
    icon: 'award',
    shape: 'bowtie',
    shortDesc: 'Pajarita rígida con patrón poliédrico y cinta elástica regulable.',
    description: 'Un complemento de moda vanguardista para bodas, graduaciones o galas. El diseño poligonal capta los destellos de iluminación como ningún tejido tradicional.',
    specs: ['Cierre con clip regulable', 'Material flexible cómodo al cuello', 'Patrón facetado bajo relieve', 'Colores metalizados'],
    customizable: false
  },

  // --- HERRAMIENTAS & TALLER ---
  {
    id: 'calibre-digital-soporte-pared',
    name: 'Soporte Magnético de Taller para Calibre y Reglas',
    category: 'herramientas',
    categoryLabel: 'Repuestos & Taller',
    price: 10.90,
    tag: 'Taller Ordenado',
    icon: 'tool',
    shape: 'holder',
    shortDesc: 'Base para sujetar tu calibre de precisión sin dañar sus puntas de medición.',
    description: 'Con hueco para 2 imanes traseros o tornillos de pared. Mantiene tu pie de rey protegido y listo para coger con una sola mano.',
    specs: ['Protección de puntas de medición', 'Sujeción magnética o tornillo', 'Material PETG resistente a grasa', 'Apto calibres 150mm'],
    customizable: false
  },
  {
    id: 'plantilla-guia-angulos-carpinteria',
    name: 'Guía de Ángulos y Espaciador para Taladros',
    category: 'herramientas',
    categoryLabel: 'Repuestos & Taller',
    price: 14.50,
    tag: 'Bricolaje',
    icon: 'compass',
    shape: 'angle-guide',
    shortDesc: 'Plantilla de precisión con ángulos estándar de 90°, 45°, 30° y casquillos de perforación.',
    description: 'Facilita perforaciones perpendiculares perfectas sin desviaciones. Indispensable para trabajos con madera, montaje de estantes y marcos.',
    specs: ['Ángulos exactos calibrados', 'Guías de broca 4, 6, 8, 10mm', 'Graduación milimétrica', 'Alta solidez con 50% infill'],
    customizable: false
  },
  {
    id: 'gavetas-apilables-tornilleria',
    name: 'Pack 4 Gavetas Modulares Apilables para Tornillería',
    category: 'herramientas',
    categoryLabel: 'Repuestos & Taller',
    price: 16.00,
    tag: 'Pack Taller',
    icon: 'inbox',
    shape: 'bin',
    shortDesc: 'Cajitas apilables con frontal inclinado para coger tornillos, tuercas y componentes con facilidad.',
    description: 'Se acoplan lateral y verticalmente entre sí para crear estanterías del tamaño que necesites en tu mesa de trabajo o furgoneta.',
    specs: ['Pack de 4 unidades', 'Enganche machihembrado', 'Frontal para etiqueta', 'Resistente a aceites y químicos'],
    customizable: false
  },

  // --- ILUMINACIÓN & LITOFANÍAS ---
  {
    id: 'litofania-foto-personalizada',
    name: 'Lámpara Litofanía 3D con Tu Foto Personalizada',
    category: 'iluminacion',
    categoryLabel: 'Lámparas & Litofanías',
    price: 28.50,
    tag: 'Regalo Emotivo',
    icon: 'image',
    shape: 'lithophane',
    shortDesc: 'Tu foto familiar, mascota o recuerdo convertida en una escultura que se ilumina con magia.',
    description: 'La litofanía aprovecha el grosor variable del material para reproducir luces y sombras exactas cuando la luz trasera se enciende. Incluye base de madera con LED cálido y cable USB.',
    specs: ['Resolución fotográfica 0.1mm', 'Base LED cálida USB incluida', 'Forma curva panorámica o plana', 'Envía tu foto por email o WhatsApp'],
    customizable: true
  },
  {
    id: 'lampara-luna-3d-textura-nasa',
    name: 'Lámpara Lunar Luna Llena con Relieve Real NASA',
    category: 'iluminacion',
    categoryLabel: 'Lámparas & Litofanías',
    price: 32.00,
    tag: 'Top Iluminación',
    icon: 'moon',
    shape: 'sphere',
    shortDesc: 'Esfera lunar de 15 cm con cráteres y mares topográficos basados en datos satelitales.',
    description: 'Impresa con más de 24 horas de precisión milimétrica. Incluye trípode de madera ensamblable y bombilla LED táctil recargable con 3 intensidades de color.',
    specs: ['Diámetro: 150 mm', 'Trípode de madera incluido', 'Luz LED táctil regulable', 'Batería recargable USB'],
    customizable: false
  },
  {
    id: 'pantalla-lampara-origami-doblada',
    name: 'Tulipa Pantalla de Lámpara Estilo Origami "Komorebi"',
    category: 'iluminacion',
    categoryLabel: 'Lámparas & Litofanías',
    price: 24.90,
    tag: 'Ambiente Zen',
    icon: 'sun',
    shape: 'origami',
    shortDesc: 'Pantalla geométrica para bombillas LED E27 que proyecta sombras cálidas difusas.',
    description: 'Transforma cualquier bombilla colgante o lámpara de mesa estándar en una pieza de diseño nórdico japonés.',
    specs: ['Compatible casquillo E27', 'Uso exclusivo con bombillas LED', 'Efecto de luz tamizada', 'Diámetro: 20 cm'],
    customizable: false
  }
];

// Helper para obtener producto por ID
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

// Helper para filtrar productos
function getProductsByCategory(category) {
  if (!category || category === 'todos') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

// Exportar globalmente
if (typeof window !== 'undefined') {
  window.PRODUCTS = PRODUCTS;
  window.CATEGORIES = CATEGORIES;
  window.AVAILABLE_COLORS = AVAILABLE_COLORS;
  window.AVAILABLE_MATERIALS = AVAILABLE_MATERIALS;
  window.getProductById = getProductById;
  window.getProductsByCategory = getProductsByCategory;
}
