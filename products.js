// ========================================================
// Abella Print Tech - Catálogo Completo de Productos 3D
// ========================================================

const CATEGORIES = [
  { id: 'todos', name: 'Todos los productos', icon: 'grid', count: 66 },
  { id: 'soportes', name: 'Fundas & Soportes Tech', icon: 'smartphone', count: 6 },
  { id: 'llaveros', name: 'Llaveros & Accesorios EDC', icon: 'key', count: 6 },
  { id: 'gaming', name: 'Gaming, Rol & Miniaturas', icon: 'crosshair', count: 6 },
  { id: 'hogar', name: 'Hogar, Decoración & Jardín', icon: 'home', count: 6 },
  { id: 'cocina', name: 'Cocina & Gadgets Útiles', icon: 'coffee', count: 6 },
  { id: 'escritorio', name: 'Oficina & Setup', icon: 'pen-tool', count: 6 },
  { id: 'cosplay', name: 'Cosplay, Máscaras & Atrezzo', icon: 'shield', count: 6 },
  { id: 'herramientas', name: 'Taller, Bricolaje & Repuestos', icon: 'tool', count: 6 },
  { id: 'iluminacion', name: 'Lámparas & Litofanías LED', icon: 'sun', count: 6 },
  { id: 'juguetes', name: 'Juguetes Mecánicos & Antiestrés', icon: 'cpu', count: 6 },
  { id: 'mascotas', name: 'Accesorios para Mascotas', icon: 'heart', count: 6 }
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

const PRODUCTS = [
  // ==========================================
  // 1. FUNDAS & SOPORTES TECH
  // ==========================================
  {
    id: 'funda-movil-impact',
    name: 'Funda Móvil Hexagonal Anti-Impactos',
    category: 'soportes',
    categoryLabel: 'Fundas & Soportes Tech',
    price: 14.95,
    tag: 'Top Ventas',
    icon: 'smartphone',
    shape: 'rounded-box',
    shortDesc: 'Funda ergonómica a medida para smartphone con panal interior de dispersión de golpes.',
    description: 'Diseñada con paredes reforzadas y patrón hexagonal interno que absorbe caídas. Adaptada al milímetro para el corte de cámaras y botones de tu modelo específico de móvil. Se imprime en TPU flexible de alta absorción o PLA+ rígido.',
    specs: ['Grosor: 2.2 mm', 'Material idóneo: TPU / PLA+', 'Corte CNC de puertos', 'Compatible carga inalámbrica'],
    customizable: true
  },
  {
    id: 'soporte-movil-ajustable',
    name: 'Soporte Móvil Articulado Multi-Ángulo',
    category: 'soportes',
    categoryLabel: 'Fundas & Soportes Tech',
    price: 11.50,
    tag: 'Funcional',
    icon: 'tablet',
    shape: 'stand',
    shortDesc: 'Soporte plegable con regulación milimétrica y ranura para cable de carga.',
    description: 'Estructura ligera con eje de giro reforzado y tope frontal antideslizante. Se pliega hasta quedar totalmente plano (8 mm) para llevarlo fácilmente en el bolsillo o mochila.',
    specs: ['5 ángulos de inclinación', 'Paso de cable inferior', 'Plegable plano a 8 mm', 'Peso ultraligero: 42g'],
    customizable: true
  },
  {
    id: 'soporte-auriculares-curvo',
    name: 'Soporte Headset Curvo Minimalista',
    category: 'soportes',
    categoryLabel: 'Fundas & Soportes Tech',
    price: 18.50,
    tag: 'Setup Clean',
    icon: 'headphones',
    shape: 'arch',
    shortDesc: 'Soporte de diadema con curva biomecánica para no deformar la almohadilla.',
    description: 'Base sólida de alta estabilidad con perfil curvado orgánico. Creado especialmente para distribuir el peso uniforme en auriculares gaming o de estudio profesional.',
    specs: ['Altura: 26 cm', 'Base pesada antivuelco', 'Curva ergonómica suave', 'Acabado satinado continuo'],
    customizable: false
  },
  {
    id: 'soporte-mando-pro',
    name: 'Base Expositora Doble Mandos (PS5 / Xbox)',
    category: 'soportes',
    categoryLabel: 'Fundas & Soportes Tech',
    price: 13.90,
    tag: 'Gamer',
    icon: 'gamepad',
    shape: 'wedge',
    shortDesc: 'Soporte para lucir mandos sin holguras ni rozaduras en sticks.',
    description: 'Moldeado exacto para el perfil inferior de mandos DualSense, Xbox Series y mandos pro. Incluye ranura inferior para conectar el cable de carga mientras reposa.',
    specs: ['Encaje seguro sin holgura', 'Gomas antideslizantes base', 'Material PLA+ reforzado', 'Opciones bicolores'],
    customizable: true
  },
  {
    id: 'soporte-portatil-vertical',
    name: 'Stand Vertical Doble para Portátil & Tablet',
    category: 'soportes',
    categoryLabel: 'Fundas & Soportes Tech',
    price: 19.90,
    tag: 'Ahorro Espacio',
    icon: 'laptop',
    shape: 'stand',
    shortDesc: 'Coloca tu portátil cerrado en vertical liberando el 85% de tu mesa.',
    description: 'Soporte doble con ranuras acolchadas para alojar un portátil y una tablet o iPad simultáneamente. Favorece la ventilación pasiva al trabajar en modo pantalla externa.',
    specs: ['Ranura ajustable 14-22mm', 'Protección interior antirrayas', 'Base ancha antivuelco', 'Apto MacBook y ThinkPad'],
    customizable: true
  },
  {
    id: 'soporte-tablet-cama',
    name: 'Soporte Ergonómico Tablet y E-Reader',
    category: 'soportes',
    categoryLabel: 'Fundas & Soportes Tech',
    price: 15.90,
    tag: 'Comodidad',
    icon: 'tablet',
    shape: 'wedge',
    shortDesc: 'Base triangular con doble inclinación para leer en sofá, cama o escritorio.',
    description: 'Geometría piramidal ligera que permite colocar la tablet a 60° (ideal para videollamadas) o a 30° (perfecto para escribir o dibujar con stylus).',
    specs: ['Doble ángulo 30° y 60°', 'Tope frontal curvo', 'Ranuras de ventilación', 'Material ultrarresistente'],
    customizable: false
  },

  // ==========================================
  // 2. LLAVEROS & ACCESORIOS EDC
  // ==========================================
  {
    id: 'llavero-matricula-relieve',
    name: 'Llavero Matrícula con Relieve 3D y Bicolor',
    category: 'llaveros',
    categoryLabel: 'Llaveros & Accesorios EDC',
    price: 6.50,
    tag: 'Personalizado',
    icon: 'tag',
    shape: 'plate',
    shortDesc: 'Tu matrícula o texto personalizado con letras en relieve de dos colores.',
    description: 'Fabricado mediante cambio de filamento de precisión milimétrica. Fondo y letras fusionados térmicamente para una durabilidad insuperable frente a roces diarios.',
    specs: ['Dimensiones: 65x16x4 mm', 'Fusión bicapa irrompible', 'Argolla acero inox incluida', 'Letras táctiles 3D'],
    customizable: true
  },
  {
    id: 'llavero-spotify-code',
    name: 'Llavero con Código Escaneable Spotify',
    category: 'llaveros',
    categoryLabel: 'Llaveros & Accesorios EDC',
    price: 7.90,
    tag: 'Regalo Top',
    icon: 'music',
    shape: 'bar',
    shortDesc: 'Apunta con la cámara de Spotify y reproduce tu canción especial.',
    description: 'El detalle perfecto para parejas, amigos o aniversarios. Grabamos las ondas sonoras exactas del código oficial de Spotify con definición láser de capa fina.',
    specs: ['Escaneo 100% verificado', 'Material resistente al agua', 'Contraste visual óptimo', 'Incluye anilla reforzada'],
    customizable: true
  },
  {
    id: 'pastillero-llavero-hermetico',
    name: 'Cápsula Llavero Hermética con Rosca Rápida',
    category: 'llaveros',
    categoryLabel: 'Llaveros & Accesorios EDC',
    price: 8.50,
    tag: 'Utilidad EDC',
    icon: 'box',
    shape: 'capsule',
    shortDesc: 'Cilindro con junta roscada para pastillas de emergencia, billete o tapones.',
    description: 'Rosca trapezoidal de alta tolerancia con cierre estanco. Su superficie exterior estriada ofrece un agarre firme incluso con manos mojadas o frías.',
    specs: ['Paso de rosca estanco', 'Diámetro interior: 16 mm', 'Altura útil: 52 mm', 'Textura moleteada antideslizante'],
    customizable: false
  },
  {
    id: 'llavero-destapador-palanca',
    name: 'Llavero Abridor de Botellas Reforzado',
    category: 'llaveros',
    categoryLabel: 'Llaveros & Accesorios EDC',
    price: 5.90,
    tag: 'Ingeniería',
    icon: 'life-buoy',
    shape: 'wedge',
    shortDesc: 'Abridor ultraligero diseñado mediante cálculo biomecánico de palanca.',
    description: 'Aprovecha la física de palanca de segundo grado para retirar chapas de botella en un solo movimiento suave sin fatigarse ni mellarse.',
    specs: ['Peso: solo 16g', 'Infill reforzado al 100%', 'Resistente a tracción', 'Varios colores mate'],
    customizable: false
  },
  {
    id: 'funda-llavero-airtag',
    name: 'Soporte Llavero Antigolpes para Apple AirTag',
    category: 'llaveros',
    categoryLabel: 'Llaveros & Accesorios EDC',
    price: 6.90,
    tag: 'Seguridad',
    icon: 'shield',
    shape: 'capsule',
    shortDesc: 'Protege tu localizador AirTag contra arañazos, golpes y caídas accidentales.',
    description: 'Ajuste a presión preciso con reborde de seguridad perimetral. Permite escuchar perfectamente el sonido del altavoz integrado sin amortiguar la señal.',
    specs: ['Encaje milimétrico seguro', 'Material TPU antichoque', 'Abertura acústica frontal', 'Argolla de clip rápido'],
    customizable: false
  },
  {
    id: 'mosqueton-print-in-place',
    name: 'Mosquetón Táctico Print-In-Place',
    category: 'llaveros',
    categoryLabel: 'Llaveros & Accesorios EDC',
    price: 7.50,
    tag: 'Print-in-Place',
    icon: 'tool',
    shape: 'articulated',
    shortDesc: 'Impreso de una sola pieza con resorte mecánico interno funcional.',
    description: 'Demuestra el poder de la impresión 3D: gatillo elástico y gozne articulado impresos directamente juntos sin necesidad de muelles de metal ni ensamblajes.',
    specs: ['Resorte 100% polimérico', 'Apertura fluida 18 mm', 'Carga recomendada EDC: 15kg', 'No apto para escalada'],
    customizable: false
  },

  // ==========================================
  // 3. GAMING, ROL & MINIATURAS
  // ==========================================
  {
    id: 'torre-dados-dragon',
    name: 'Torre de Dados Escultórica "Torreón Ancestral"',
    category: 'gaming',
    categoryLabel: 'Gaming, Rol & Miniaturas',
    price: 26.50,
    tag: 'D&D y Rol',
    icon: 'castle',
    shape: 'tower',
    shortDesc: 'Lanza tus dados poliédricos a través de la torre con bandeja receptora.',
    description: 'Ideal para partidas de D&D, Warhammer o juegos de tablero. Rampas internas helicoidales que aseguran un batido aleatorio perfecto sin que los dados caigan fuera.',
    specs: ['Altura: 18.5 cm', 'Apta para d20 de 25mm', 'Bandeja integrada', 'Efecto piedra tallada'],
    customizable: false
  },
  {
    id: 'miniaturas-resina-rol',
    name: 'Miniatura Héroe Fantasía en Resina 8K',
    category: 'gaming',
    categoryLabel: 'Gaming, Rol & Miniaturas',
    price: 9.90,
    tag: 'Ultra Detalle',
    icon: 'user-check',
    shape: 'figurine',
    shortDesc: 'Impresión en resina fotosensible de ultra-definición sin líneas de capa.',
    description: 'Lavado ultrasónico y curado UV completo. Ideal para pintores de miniaturas, ejércitos de rol o figuras personalizadas procedentes de HeroForge y similares.',
    specs: ['Resolución: 22 micras', 'Escala 28mm / 32mm', 'Superficie lisa mate', 'Lista para imprimar y pintar'],
    customizable: true
  },
  {
    id: 'caja-mazo-magic-tcg',
    name: 'Deck Box Magnética TCG con Cajón de Dados',
    category: 'gaming',
    categoryLabel: 'Gaming, Rol & Miniaturas',
    price: 18.90,
    tag: 'Coleccionismo',
    icon: 'archive',
    shape: 'cube',
    shortDesc: 'Caja rígida con 8 imanes de neodimio para 100+ cartas con doble funda.',
    description: 'Diseño robusto para mazos Commander / EDH con protectores premium. Compartimento inferior deslizante exclusivo para dados contadores, tokens y vidas.',
    specs: ['Capacidad: 100+ cartas sleeved', '8 imanes N52 potentes', 'Cajón inferior desmontable', 'Acabado texturizado mate'],
    customizable: true
  },
  {
    id: 'calavera-t-rex-lowpoly',
    name: 'Cráneo T-Rex Low-Poly Geométrico',
    category: 'gaming',
    categoryLabel: 'Gaming, Rol & Miniaturas',
    price: 21.00,
    tag: 'Escultura',
    icon: 'feather',
    shape: 'skull',
    shortDesc: 'Pieza de coleccionista faceteada para estanterías, vitrinas y setups.',
    description: 'Escultura geométrica de 19 cm que capta los volúmenes óseos del Tyrannosaurus Rex. Sus facetas poligonales generan juegos de luces y sombras cautivadores.',
    specs: ['Longitud: 190 mm', 'Geometría autoportante', 'Faceteado nítido', 'Material PLA mate antirreflejo'],
    customizable: false
  },
  {
    id: 'soporte-gpu-anti-sag',
    name: 'Soporte Regulable Anti-Sag para Tarjeta Gráfica',
    category: 'gaming',
    categoryLabel: 'Gaming, Rol & Miniaturas',
    price: 12.50,
    tag: 'Hardware PC',
    icon: 'cpu',
    shape: 'stand',
    shortDesc: 'Evita que el peso de tu tarjeta gráfica doble la placa base (GPU Sag).',
    description: 'Brazo de soporte vertical con rosca milimétrica ajustable en altura y base con imán oculto para fijarse firmemente al chasis metálico de la caja de tu PC.',
    specs: ['Altura graduable 60-140 mm', 'Almohadilla de apoyo suave', 'Base magnética de neodimio', 'Material termorresistente PETG'],
    customizable: false
  },
  {
    id: 'contador-vidas-d20',
    name: 'Contador Giratorio Dual de Vida / Puntos',
    category: 'gaming',
    categoryLabel: 'Gaming, Rol & Miniaturas',
    price: 14.90,
    tag: 'Accesorios TCG',
    icon: 'crosshair',
    shape: 'gear',
    shortDesc: 'Diales giratorios mecánicos con clic táctil para registrar de 0 a 99 vidas.',
    description: 'Mecanismo de trinquete con resorte sonoro que bloquea cada número con precisión. Imprescindible para Magic The Gathering, Yu-Gi-Oh! y juegos de mesa.',
    specs: ['Doble anillo 00 a 99', 'Clic táctil mecánico', 'Números en alto relieve bicolor', 'Tamaño bolsillo: 55 mm'],
    customizable: true
  },

  // ==========================================
  // 4. HOGAR, DECORACIÓN & JARDÍN
  // ==========================================
  {
    id: 'maceta-dodecaedro-drenaje',
    name: 'Macetero Dodecaedro Geométrico Autorregable',
    category: 'hogar',
    categoryLabel: 'Hogar, Decoración & Jardín',
    price: 15.50,
    tag: 'Diseño Nórdico',
    icon: 'feather',
    shape: 'vase',
    shortDesc: 'Maceta moderna con depósito interior de agua y plato de drenaje oculto.',
    description: 'Estructura poligonal de caras simétricas. Su plato inferior integrado recoge el exceso de riego sin ensuciar la mesa, ideal para suculentas, cactus y potos.',
    specs: ['Diámetro: 13.5 cm', 'Drenaje oculto integrado', 'Apta para interior y terraza', 'Material biodegradable'],
    customizable: false
  },
  {
    id: 'jarron-vortex-espiral',
    name: 'Jarrón Escultórico Fluido "Vortex Flow"',
    category: 'hogar',
    categoryLabel: 'Hogar, Decoración & Jardín',
    price: 22.90,
    tag: 'Arte Moderno',
    icon: 'maximize-2',
    shape: 'spiral',
    shortDesc: 'Jarrón fluido con líneas helicoidales que generan reflejos de luz.',
    description: 'Impreso en modo espiral continuo sin costuras visibles de capa. Apto para flores secas o frescas (interior tratado para total estanqueidad del agua).',
    specs: ['Altura: 24 cm', 'Superficie continua fluida', 'Base pesada estable', 'Colores seda disponibles'],
    customizable: false
  },
  {
    id: 'colgador-llaves-nube-magnetica',
    name: 'Cuelga-Llaves Magnético de Pared "Cloud"',
    category: 'hogar',
    categoryLabel: 'Hogar, Decoración & Jardín',
    price: 13.90,
    tag: 'Magia Visual',
    icon: 'cloud',
    shape: 'cloud',
    shortDesc: 'Pega tus llaveros flotando bajo la nube gracias a potentes imanes ocultos.',
    description: 'Un detalle decorativo y divertido para la entrada de casa. Sus imanes interiores de neodimio soportan llaveros pesados con múltiples llaves sin que se caigan.',
    specs: ['3 zonas magnéticas N52', 'Instalación con adhesivo 3M o tornillo', 'Capacidad 300g por punto', 'Largo: 12 cm'],
    customizable: false
  },
  {
    id: 'sujetalibros-portal-infinito',
    name: 'Sujetalibros Geométrico "Portal Dimensional"',
    category: 'hogar',
    categoryLabel: 'Hogar, Decoración & Jardín',
    price: 19.50,
    tag: 'Efecto Óptico',
    icon: 'book',
    shape: 'cube',
    shortDesc: 'Pareja de sujetalibros con siluetas que simulan entrar y salir por un portal.',
    description: 'Estructura sólida en ángulo recto con base de apoyo bajo los libros para que el propio peso de los tomos mantenga la firmeza sin deslizarse.',
    specs: ['Pack de 2 piezas (Entrada + Salida)', 'Base metálica oculta', 'Altura: 17 cm', 'Diseño moderno en negro mate'],
    customizable: false
  },
  {
    id: 'tope-puerta-minimalista',
    name: 'Cuña Tope de Puerta TPU Goma Elástica',
    category: 'hogar',
    categoryLabel: 'Hogar, Decoración & Jardín',
    price: 8.90,
    tag: 'TPU Flexible',
    icon: 'shield',
    shape: 'wedge',
    shortDesc: 'Tope de puerta flexible que no raya el suelo ni resbala sobre baldosas.',
    description: 'Fabricado íntegramente en elastómero termoplástico (TPU) con suela de relieve estriado que muerde cualquier superficie (madera, mármol o gres).',
    specs: ['100% TPU indestructible', 'Ángulo de inclinación 18°', 'Suela estriada antideslizante', 'Fácil de lavar'],
    customizable: false
  },
  {
    id: 'maceta-autorriego-gato',
    name: 'Maceta Autorregable con Mecha "Cat Low-Poly"',
    category: 'hogar',
    categoryLabel: 'Hogar, Decoración & Jardín',
    price: 16.90,
    tag: 'Creativo',
    icon: 'heart',
    shape: 'figurine',
    shortDesc: 'Maceta con forma de gato que bebe agua del plato para regar tu planta.',
    description: 'Funciona por capilaridad con mecha de algodón: llena la base de agua y la planta absorberá solo la humedad que necesita durante hasta 12 días seguidos.',
    specs: ['Capilaridad pasiva por mecha', 'Depósito de 250ml', 'Ideal para vacaciones', 'Apta para plantas de 8-10cm'],
    customizable: false
  },

  // ==========================================
  // 5. COCINA & GADGETS ÚTILES
  // ==========================================
  {
    id: 'posavasos-hexagonales-pack',
    name: 'Set 6 Posavasos Hexagonales con Base Soporte',
    category: 'cocina',
    categoryLabel: 'Cocina & Gadgets Útiles',
    price: 14.90,
    tag: 'Geométrico',
    icon: 'coffee',
    shape: 'hex-coasters',
    shortDesc: 'Pack de 6 posavasos con relieve laberíntico para atrapar la condensación.',
    description: 'Diseño geométrico encajable con reborde antiderrames. Incluye una base a juego para tenerlos ordenados sobre la mesa o encimera.',
    specs: ['6 posavasos + soporte torre', 'Diámetro 95 mm', 'Material apto lavavajillas suave', 'Colores modernos'],
    customizable: true
  },
  {
    id: 'dispensador-capsulas-nespresso',
    name: 'Torre Dispensadora Giratoria de Cápsulas',
    category: 'cocina',
    categoryLabel: 'Cocina & Gadgets Útiles',
    price: 19.90,
    tag: 'Cafetería',
    icon: 'coffee',
    shape: 'tower',
    shortDesc: 'Organiza hasta 32 cápsulas de café en 4 columnas verticales con extracción rápida.',
    description: 'Diseño compacto de base rotatoria. Desliza las cápsulas desde la parte superior y extráelas cómodamente una a una por la rampa inferior.',
    specs: ['Capacidad: 32 cápsulas Nespresso', 'Eje con giro 360° suave', 'Ocupa solo 11 cm de diámetro', 'Fácil reposición'],
    customizable: false
  },
  {
    id: 'clips-selladores-hermeticos',
    name: 'Pack 4 Clips Selladores de Bolsas Herméticos',
    category: 'cocina',
    categoryLabel: 'Cocina & Gadgets Útiles',
    price: 7.50,
    tag: 'Print-in-Place',
    icon: 'tool',
    shape: 'bar',
    shortDesc: 'Pinzas con bisagra viva y cierre hermético que no pierden tensión.',
    description: 'Impresos de una sola pieza en polímero elástico resistente a la fatiga mecánica. Cierra bolsas de café, patatas o congelados manteniendo el frescor.',
    specs: ['Pack de 4 unidades (2 largas + 2 estándar)', 'Cierre a presión click sonoro', 'Apto congelador (-20°C)', 'Reutilizables infinitas veces'],
    customizable: false
  },
  {
    id: 'escurridor-cubiertos-elefante',
    name: 'Escurridor de Cubiertos Elefante con Trompa Desagüe',
    category: 'cocina',
    categoryLabel: 'Cocina & Gadgets Útiles',
    price: 15.90,
    tag: 'Favorito Viral',
    icon: 'smile',
    shape: 'figurine',
    shortDesc: 'El agua escurrida de los cubiertos fluye por su trompa directamente al fregadero.',
    description: 'Un gadget de cocina tan simpático como higiénico. El suelo interior inclinado canaliza el agua estancada hacia el exterior, evitando moho y bacterias.',
    specs: ['Desagüe pasivo continuo', 'Base antideslizante', 'Apto también para cepillos de dientes', 'Dimensiones: 16x10x12 cm'],
    customizable: false
  },
  {
    id: 'soporte-esponja-fregadero',
    name: 'Soporte Autodrenante para Esponja y Estropajo',
    category: 'cocina',
    categoryLabel: 'Cocina & Gadgets Útiles',
    price: 9.50,
    tag: 'Higiene',
    icon: 'droplet',
    shape: 'wedge',
    shortDesc: 'Bandeja en cascada inclinada para secar esponjas sin charcos en la encimera.',
    description: 'Ángulo calculado de 15° con canaletas estriadas que evacuan el agua jabonosa al seno del fregadero en segundos.',
    specs: ['Drenaje en cascada', 'Rejilla superior desmontable', 'Material antibacteriano PETG', 'Fácil de lavar'],
    customizable: false
  },
  {
    id: 'embudo-plegable-embudo',
    name: 'Embudo de Cocina con Filtro Tamiz Desmontable',
    category: 'cocina',
    categoryLabel: 'Cocina & Gadgets Útiles',
    price: 8.90,
    tag: 'Precisión',
    icon: 'filter',
    shape: 'vase',
    shortDesc: 'Embudo de cuello estrecho con ranura de salida de aire y rejilla tamiz.',
    description: 'La ranura lateral exterior libera el aire de la botella mientras viertes líquido, evitando borbotones y salpicaduras indeseadas.',
    specs: ['Filtro de impurezas removible', 'Canal de alivio de aire', 'Boquilla fina para botellas estándar', 'Material apto contacto alimentos'],
    customizable: false
  },

  // ==========================================
  // 6. OFICINA & SETUP DE ESCRITORIO
  // ==========================================
  {
    id: 'organizador-cables-magnetico',
    name: 'Organizador Magnético de Cables de Escritorio',
    category: 'escritorio',
    categoryLabel: 'Oficina & Setup',
    price: 12.90,
    tag: 'Setup Limpio',
    icon: 'sliders',
    shape: 'plate',
    shortDesc: 'Mantén los cables de carga USB y Lightning fijos en el borde de tu mesa.',
    description: 'Base adherente con 4 clips cilíndricos imantados que abrazan cables de hasta 4.5 mm de grosor. Se acoplan con un chasquido magnético instantáneo.',
    specs: ['Base + 4 clips magnéticos', 'Imanes de neodimio de sujeción firme', 'Adhesivo extrafuerte reposicionable', 'Compatibilidad universal USB-C/Lightning'],
    customizable: true
  },
  {
    id: 'portalapices-voronoi-organico',
    name: 'Portalápices Escultórico Patrón Voronoi',
    category: 'escritorio',
    categoryLabel: 'Oficina & Setup',
    price: 13.50,
    tag: 'Geométrico',
    icon: 'pen-tool',
    shape: 'hex-grid',
    shortDesc: 'Cilindro con calado orgánico tipo Voronoi para bolígrafos y rotuladores.',
    description: 'Una pieza ligera pero resistente que luce espectacular bajo la luz de la lámpara de mesa. Mantiene ordenados más de 20 bolígrafos y tijeras.',
    specs: ['Altura: 11.5 cm', 'Diámetro: 8.5 cm', 'Malla voronoi de alta rigidez', 'Fondo ciego antipérdida'],
    customizable: false
  },
  {
    id: 'elevador-monitor-modular',
    name: 'Patas Elevadoras Antivibración para Monitor',
    category: 'escritorio',
    categoryLabel: 'Oficina & Setup',
    price: 15.90,
    tag: 'Ergonomía',
    icon: 'layers',
    shape: 'cube',
    shortDesc: 'Eleva tu pantalla a la altura de los ojos y libera espacio debajo para el teclado.',
    description: 'Pareja de elevadores modulares con nido de panal interior que soportan hasta 35 kg por pata. Permite deslizar cuadernos o el teclado debajo.',
    specs: ['Soporta hasta 35kg/par', 'Hueco inferior útil: 65 mm', 'Almohadillas de silicona base', 'Diseño estructural reforzado'],
    customizable: false
  },
  {
    id: 'soporte-tarjetas-visita',
    name: 'Expositor Inclinado de Tarjetas y Notas',
    category: 'escritorio',
    categoryLabel: 'Oficina & Setup',
    price: 8.50,
    tag: 'Profesional',
    icon: 'credit-card',
    shape: 'stand',
    shortDesc: 'Peana minimalista para lucir tarjetas de visita comerciales o fotos.',
    description: 'Ángulo suave de 20° que facilita la lectura y extracción de tarjetas por parte de tus clientes en mostradores, recepciones o despachos.',
    specs: ['Capacidad: 50 tarjetas de visita', 'Anchura: 9.5 cm', 'Ranura escalonada', 'Personalizable con tu logo'],
    customizable: true
  },
  {
    id: 'bandeja-vaciabolsillos-edc',
    name: 'Bandeja Geométrica Valet Tray Vaciabolsillos',
    category: 'escritorio',
    categoryLabel: 'Oficina & Setup',
    price: 16.50,
    tag: 'Elegancia',
    icon: 'inbox',
    shape: 'plate',
    shortDesc: 'Bandeja compartimentada para reloj, llaves, monedas, cartera y anillos.',
    description: 'Superficie dividida en compartimentos con bordes cóncavos ergonómicos para recoger monedas y objetos pequeños fácilmente sin atascarse.',
    specs: ['3 compartimentos zonificados', 'Dimensiones: 22x15x2 cm', 'Superficie satinada antihuellas', 'Base con fieltro protector'],
    customizable: true
  },
  {
    id: 'soporte-microfono-brazo',
    name: 'Adaptador Antivibración Shock-Mount de Micrófono',
    category: 'escritorio',
    categoryLabel: 'Oficina & Setup',
    price: 14.00,
    tag: 'Streaming',
    icon: 'mic',
    shape: 'spiral',
    shortDesc: 'Aísla el micrófono de los golpes del teclado y movimientos de mesa.',
    description: 'Jaula circular con ganchos de suspensión para bandas elásticas que amortiguan ruidos parásitos en podcasts, streaming y locuciones.',
    specs: ['Rosca estándar 5/8" y 3/8"', 'Para micrófonos de 42-48 mm', 'Bandas amortiguadoras incluidas', 'Peso pluma: 60g'],
    customizable: false
  },

  // ==========================================
  // 7. COSPLAY, MÁSCARAS & ATREZZO
  // ==========================================
  {
    id: 'mascara-samurai-oni',
    name: 'Máscara Samurai Oni Tradicional con Colmillos',
    category: 'cosplay',
    categoryLabel: 'Cosplay, Máscaras & Atrezzo',
    price: 34.90,
    tag: 'Cosplay Top',
    icon: 'shield',
    shape: 'mask',
    shortDesc: 'Media máscara samurái japonesa con colmillos afilados y anclajes para correa.',
    description: 'Impresión de alta resolución con relieve táctil de arrugas y textura demoníaca feudal. Diseñada para adaptarse a la anatomía facial con orificios de respiración nasal.',
    specs: ['Ajuste ergonómico nasal', '4 ranuras para correa elástica', 'Resistencia a impactos ligeros', 'Preparada para lacado o pintura acrílica'],
    customizable: true
  },
  {
    id: 'cuernos-malefica-diadema',
    name: 'Par de Cuernos Fantasía Ultraligeros',
    category: 'cosplay',
    categoryLabel: 'Cosplay, Máscaras & Atrezzo',
    price: 18.50,
    tag: 'Ultraligero',
    icon: 'feather',
    shape: 'horns',
    shortDesc: 'Cuernos espirales curvos huecos montables sobre cualquier diadema estándar.',
    description: 'Diseñados con infill helicoidal del 5% para que pesen menos de 35 gramos cada uno, permitiendo llevarlos durante horas en convenciones sin dolor de cabeza.',
    specs: ['Peso: solo 32g por cuerno', 'Longitud: 16 cm', 'Clip de anclaje a diadema', 'Efecto estriado realista'],
    customizable: false
  },
  {
    id: 'casco-mandaloriano-kit',
    name: 'Kit Réplica 1:1 Casco Guerrero Espacial',
    category: 'cosplay',
    categoryLabel: 'Cosplay, Máscaras & Atrezzo',
    price: 79.00,
    tag: 'Gran Escala',
    icon: 'user',
    shape: 'skull',
    shortDesc: 'Casco a escala real para cosplay de cazarrecompensas interestelar.',
    description: 'Impreso en piezas de encaje machihembrado de alta tolerancia o en bloque entero según tamaño. Listo para masillado, lijado, imprimación y visera T-visor.',
    specs: ['Escala 1:1 adulto (perímetro 60cm)', 'Grosor de pared: 3.5 mm', 'Encajes guiados por espigas', 'Material PLA+ rígido'],
    customizable: true
  },
  {
    id: 'empunadura-sable-luz',
    name: 'Empuñadura de Sable de Luz Cosplay Modular',
    category: 'cosplay',
    categoryLabel: 'Cosplay, Máscaras & Atrezzo',
    price: 29.90,
    tag: 'Sci-Fi',
    icon: 'zap',
    shape: 'tower',
    shortDesc: 'Empuñadura desmontable a rosca con cámara para tubo LED o electrónica.',
    description: 'Compuesta por 5 secciones atornillables (pomo, empuñadura con aletas, caja de ignición y emisor). Perfecta como pieza de exhibición o para cosplay interactivo.',
    specs: ['Longitud: 28 cm', 'Interior hueco para tubo de 1 pulgada', 'Piezas roscadas modulares', 'Acabados bicolores disponibles'],
    customizable: true
  },
  {
    id: 'varita-magica-texturizada',
    name: 'Varita de Mago Ergonómica con Núcleo Reforzado',
    category: 'cosplay',
    categoryLabel: 'Cosplay, Máscaras & Atrezzo',
    price: 16.90,
    tag: 'Mundo Mágico',
    icon: 'star',
    shape: 'spiral',
    shortDesc: 'Varita escultórica con empuñadura de ramas retorcidas y runas grabadas.',
    description: 'Inspirada en el universo de fantasía clásica. Incorpora un canal interno para varilla de acero opcional que le aporta rigidez y un peso en mano sumamente realista.',
    specs: ['Longitud: 34 cm', 'Diseño orgánico de madera tallada', 'Alta resistencia a flexión', 'Acabado en pátina envejecida opcional'],
    customizable: true
  },
  {
    id: 'guantelete-articulado-cyber',
    name: 'Guantelete Exoesqueleto de Dedos Articulados',
    category: 'cosplay',
    categoryLabel: 'Cosplay, Máscaras & Atrezzo',
    price: 24.50,
    tag: 'Mecánico',
    icon: 'tool',
    shape: 'articulated',
    shortDesc: 'Extensiones biomecánicas para dedos que imitan tus movimientos de flexión.',
    description: 'Se acopla a tu mano mediante anillos y correas elásticas: al doblar tus dedos naturales, las falanges robóticas se alargan y contraen en sincronía perfecta.',
    specs: ['5 dedos mecánicos articulados', 'Ajustable con bandas elásticas', 'Rango de flexión 90°', 'Estética Cyberpunk'],
    customizable: false
  },

  // ==========================================
  // 8. TALLER, BRICOLAJE & REPUESTOS
  // ==========================================
  {
    id: 'calibre-radio-curvatura',
    name: 'Galgas Medidoras de Radio Cóncavo y Convexo',
    category: 'herramientas',
    categoryLabel: 'Taller, Bricolaje & Repuestos',
    price: 9.90,
    tag: 'Precisión',
    icon: 'compass',
    shape: 'plate',
    shortDesc: 'Juego de galgas métricas de R1 a R25 mm para modelado 3D e ingeniería inversa.',
    description: 'Herramienta imprescindible para makers y diseñadores CAD: mide la curvatura exacta de esquinas y redondeos de piezas existentes para replicarlas al milímetro.',
    specs: ['Rango: R1 a R25 mm', 'Grabado de medidas en alto contraste', 'Anilla de almacenamiento', 'Precisión: 0.1 mm'],
    customizable: false
  },
  {
    id: 'organizador-puntas-atornillador',
    name: 'Estuche Hexagonal Magnético para 36 Puntas 1/4"',
    category: 'herramientas',
    categoryLabel: 'Taller, Bricolaje & Repuestos',
    price: 11.90,
    tag: 'Taller Ordenado',
    icon: 'grid',
    shape: 'cube',
    shortDesc: 'Organizador con 36 ranuras hexagonales con imanes para puntas de atornillar.',
    description: 'Evita que las puntas de impacto o atornillador salten al mover el estuche gracias a sus imanes en la base de cada alojamiento. Tapa con cierre a presión.',
    specs: ['Capacidad: 36 puntas estándar 1/4"', 'Base magnética anticaídas', 'Tapa transparente opcional', 'Cierre de bayoneta seguro'],
    customizable: false
  },
  {
    id: 'caja-tornilleria-compartimentada',
    name: 'Caja Organizadora Apilable con Gavetas Extraíbles',
    category: 'herramientas',
    categoryLabel: 'Taller, Bricolaje & Repuestos',
    price: 15.50,
    tag: 'Modular',
    icon: 'archive',
    shape: 'cube',
    shortDesc: 'Caja de piezas pequeñas con 12 compartimentos y guías para apilar varias.',
    description: 'Fabricada en PETG resistente a impactos y aceites de taller. Sus divisores redondeados permiten extraer tornillos M3, M4 o tuercas con la yema del dedo.',
    specs: ['12 cubetas con fondo curvo', 'Guías de apilado machihembrado', 'Resistente a aceites y químicos', 'Medidas: 18x12x4.5 cm'],
    customizable: false
  },
  {
    id: 'soporte-taladro-bateria',
    name: 'Soporte de Pared para Baterías y Taladros (Bosch/Makita/DeWalt)',
    category: 'herramientas',
    categoryLabel: 'Taller, Bricolaje & Repuestos',
    price: 10.50,
    tag: 'Bricolaje',
    icon: 'tool',
    shape: 'wedge',
    shortDesc: 'Cuelga tus herramientas a batería de forma segura en paneles o paredes.',
    description: 'Diseño específico para el riel de inserción de baterías de 18V de las principales marcas. Aguanta taladros pesados y atornilladores sin deformarse con el tiempo.',
    specs: ['Para Bosch, Makita, DeWalt o Milwaukee', 'Carga máxima: 15 kg', '2 orificios avellanados para tornillos', 'PETG sólido de 4 mm'],
    customizable: true
  },
  {
    id: 'tiradores-mueble-modernos',
    name: 'Set 4 Tiradores Ergonómicos de Diseño Nórdico',
    category: 'herramientas',
    categoryLabel: 'Taller, Bricolaje & Repuestos',
    price: 12.00,
    tag: 'Restauración',
    icon: 'check-square',
    shape: 'bar',
    shortDesc: 'Tiradores geométricos para renovar armarios, cajoneras y muebles de cocina.',
    description: 'Distancia entre ejes estándar de 96 mm o 128 mm con insertos roscados de latón M4 para un apriete firme como el de un herraje metálico.',
    specs: ['Pack de 4 tiradores', 'Insertos roscados de latón M4', 'Distancia estándar 96/128mm', 'Colores cobre, negro y dorado'],
    customizable: true
  },
  {
    id: 'guia-corte-ingletes',
    name: 'Caja de Ingletes Compacta para Cortes a 45° y 90°',
    category: 'herramientas',
    categoryLabel: 'Taller, Bricolaje & Repuestos',
    price: 13.90,
    tag: 'Precisión',
    icon: 'crop',
    shape: 'wedge',
    shortDesc: 'Guía de corte precisa para molduras, listones de madera y perfiles de aluminio.',
    description: 'Ranuras estrechas calibradas para serruchos de costilla. Sus paredes laterales gruesas garantizan un ángulo de corte exactamente perpendicular o a inglete.',
    specs: ['Ranuras a 45°, 90° y 135°', 'Capacidad para piezas de hasta 40x40mm', 'Base con reborde para banco de trabajo', 'Material ultra-rígido'],
    customizable: false
  },

  // ==========================================
  // 9. LÁMPARAS & LITOFANÍAS LED
  // ==========================================
  {
    id: 'lampara-luna-3d-textura',
    name: 'Lámpara Lunar 3D con Topografía Real de la NASA',
    category: 'iluminacion',
    categoryLabel: 'Lámparas & Litofanías LED',
    price: 28.90,
    tag: 'Iluminación Top',
    icon: 'moon',
    shape: 'lithophane',
    shortDesc: 'Esfera lunar translúcida impresa con los cráteres reales de la Luna.',
    description: 'Calculada a partir de los mapas de elevación del satélite LRO de la NASA. Las diferencias de grosor de capa proyectan luces y sombras idénticas a la luna llena.',
    specs: ['Diámetro: 15 cm', 'Base trípode de diseño incluida', 'Compatible kit LED táctil USB', 'Efecto de brillo cálido difuso'],
    customizable: false
  },
  {
    id: 'litofania-personalizada-foto',
    name: 'Cuadro Litofanía Curvo con tu Fotografía Favorita',
    category: 'iluminacion',
    categoryLabel: 'Lámparas & Litofanías LED',
    price: 19.90,
    tag: '100% Personalizado',
    icon: 'image',
    shape: 'lithophane',
    shortDesc: 'Tu foto se vuelve visible mágicamente al encender la luz trasera.',
    description: 'Envíanos tu foto familiar, de mascota o paisaje. Generamos un mapa de densidades impreso a 0.08 mm de capa que revela la imagen con una escala tonal asombrosa.',
    specs: ['Dimensiones: 15x10 cm curvo', 'Resolución de 0.08 mm por capa', 'Base con ranura para luz LED', 'Efecto sepia cálido'],
    customizable: true
  },
  {
    id: 'pantalla-lampara-origami',
    name: 'Tulipa Pantalla de Lámpara Origami "Komorebi"',
    category: 'iluminacion',
    categoryLabel: 'Lámparas & Litofanías LED',
    price: 24.90,
    tag: 'Ambiente Zen',
    icon: 'sun',
    shape: 'origami',
    shortDesc: 'Pantalla geométrica facetada que tamiza la luz creando sombras cálidas.',
    description: 'Inspirada en el plegado de papel japonés. Apta para colgar de techo o colocar sobre una lámpara de pie con casquillo E27 convencional.',
    specs: ['Para casquillo E27 estándar', 'Uso exclusivo con bombillas LED frías', 'Diámetro: 21 cm', 'Efecto de luz arquitectónico'],
    customizable: false
  },
  {
    id: 'lampara-seta-retro-led',
    name: 'Lámpara Hongo Seta Retro con Difusor Opal',
    category: 'iluminacion',
    categoryLabel: 'Lámparas & Litofanías LED',
    price: 26.00,
    tag: 'Diseño Retro',
    icon: 'sun',
    shape: 'vase',
    shortDesc: 'Lámpara de mesita estilo space-age con luz ambiental tenue.',
    description: 'Inspirada en los iconos del diseño industrial de los años 70. Su cúpula translúcida dispersa la luz hacia abajo creando una atmósfera relajante para leer o dormir.',
    specs: ['Altura: 20 cm', 'Alojamiento para bombilla LED G9/E14', 'Pie lastrado estable', 'Acabado bicolor'],
    customizable: false
  },
  {
    id: 'panel-led-hexagonal-modular',
    name: 'Módulo Aplique Hexagonal Iluminado de Pared',
    category: 'iluminacion',
    categoryLabel: 'Lámparas & Litofanías LED',
    price: 17.50,
    tag: 'Modular Gaming',
    icon: 'hexagon',
    shape: 'hex-grid',
    shortDesc: 'Paneles hexagonales encajables para crear patrones de luz en tu pared.',
    description: 'Crea constelaciones personalizadas sobre tu setup gamer o cabecero. Los módulos se unen magnéticamente y difunden tiras LED interiores de manera homogénea.',
    specs: ['Diámetro: 16 cm por panel', 'Difusor frontal translúcido mate', 'Canal pasacables interior', 'Fijación con tiras adhesivas'],
    customizable: false
  },
  {
    id: 'farolillo-vela-gotico',
    name: 'Farolillo con Celosías Arabescas para Vela LED',
    category: 'iluminacion',
    categoryLabel: 'Lámparas & Litofanías LED',
    price: 18.90,
    tag: 'Decoración',
    icon: 'feather',
    shape: 'tower',
    shortDesc: 'Farolillo con calados intrincados que proyecta sombras mágicas en la habitación.',
    description: 'Diseño inspirado en linternas marroquíes y góticas. Diseñado para usar con velas electrónicas LED de parpadeo realista de forma 100% segura.',
    specs: ['Altura: 16.5 cm', 'Asa superior abatible', 'Apto velas LED hasta 5 cm', 'Proyección de sombras 360°'],
    customizable: false
  },

  // ==========================================
  // 10. JUGUETES MECÁNICOS & ANTIESTRÉS
  // ==========================================
  {
    id: 'serpiente-articulada-pip',
    name: 'Dragón Articulado Print-in-Place Flexible',
    category: 'juguetes',
    categoryLabel: 'Juguetes Mecánicos & Antiestrés',
    price: 14.50,
    tag: 'Sensación Viral',
    icon: 'activity',
    shape: 'articulated',
    shortDesc: 'Figura de dragón con decenas de eslabones móviles impreso en una sola pieza.',
    description: 'Sale de la cama de impresión completamente móvil y flexible sin necesidad de tornillos ni montaje. Increíblemente relajante de sostener entre las manos.',
    specs: ['Longitud: 38 cm', 'Más de 30 vértebras móviles', 'Print-in-place 100%', 'Colores efecto seda bicolor'],
    customizable: false
  },
  {
    id: 'cubo-infinito-fidget',
    name: 'Cubo Infinito Fidget Anti-Estrés Articulado',
    category: 'juguetes',
    categoryLabel: 'Juguetes Mecánicos & Antiestrés',
    price: 8.90,
    tag: 'Fidget Top',
    icon: 'box',
    shape: 'cube',
    shortDesc: '8 cubos unidos por bisagras que se pliegan sobre sí mismos eternamente.',
    description: 'El accesorio antiestrés definitivo para mantener las manos ocupadas durante llamadas, horas de estudio o momentos de concentración frente a la pantalla.',
    specs: ['Bisagras mecánicas resistentes', 'Plegado infinito continuo', 'Tamaño bolsillo: 4x4 cm cerrado', 'Sonido clic suave y satisfactorio'],
    customizable: false
  },
  {
    id: 'engranajes-planetarios-spin',
    name: 'Girosférico Mecánico de Engranajes Planetarios',
    category: 'juguetes',
    categoryLabel: 'Juguetes Mecánicos & Antiestrés',
    price: 12.90,
    tag: 'Mecánica Pura',
    icon: 'cpu',
    shape: 'gear',
    shortDesc: 'Anillo con sistema de engranajes sol y satélites que giran en armonía.',
    description: 'Gira el anillo exterior y observa cómo giran los piñones interiores a diferentes relaciones de transmisión. Una joya de ingeniería háptica impresa en 3D.',
    specs: ['Relación de transmisión 4:1', 'Rodamiento suave sin holguras', 'Diámetro exterior: 60 mm', 'Colores contrastados'],
    customizable: false
  },
  {
    id: 'puzzle-laberinto-cilindrico',
    name: 'Cilindro Laberinto Secreto con Apertura Roscada',
    category: 'juguetes',
    categoryLabel: 'Juguetes Mecánicos & Antiestrés',
    price: 15.00,
    tag: 'Ingenio & Rompecabezas',
    icon: 'lock',
    shape: 'capsule',
    shortDesc: 'Resuelve el laberinto interior a ciegas para abrir el compartimento oculto.',
    description: 'Perfecto para esconder un regalo, dinero o una llave sorpresa: el destinatario deberá guiar el pasador a través del dédalo interior para poder desatornillarlo.',
    specs: ['Dificultad media (5-10 min)', 'Compartimento interior secreto', 'Laberinto de doble camino falso', 'Mecanismo indestructible'],
    customizable: false
  },
  {
    id: 'peonza-giroscopica-precision',
    name: 'Peonza Giroscópica de Alta Inercia con Anillo de Peso',
    category: 'juguetes',
    categoryLabel: 'Juguetes Mecánicos & Antiestrés',
    price: 7.90,
    tag: 'Física Clásica',
    icon: 'refresh-cw',
    shape: 'vase',
    shortDesc: 'Peonza balanceada con punta de carburo que gira durante más de 3 minutos.',
    description: 'Geometría diseñada con distribución de masa periférica concentrada en el borde exterior para maximizar el momento de inercia y la estabilidad de giro.',
    specs: ['Punta esférica pulida', 'Tiempo de giro: hasta 3+ minutos', 'Diámetro: 42 mm', 'Textura de agarre superior estriada'],
    customizable: false
  },
  {
    id: 'pistola-gomas-mecanica',
    name: 'Lanzador Mecánico de Gomas Elásticas Semiatuomático',
    category: 'juguetes',
    categoryLabel: 'Juguetes Mecánicos & Antiestrés',
    price: 13.50,
    tag: 'Diversión Oficina',
    icon: 'zap',
    shape: 'wedge',
    shortDesc: 'Dispara hasta 5 gomas elásticas seguidas mediante trinquete repetidor.',
    description: 'Carga las gomas sobre la rueda dentada y presiona el gatillo para disparar una a una hacia dianas de papel en la oficina o sala de juegos.',
    specs: ['Capacidad: 5 disparos consecutivos', 'Trinquete print-in-place', 'Alcance suave y seguro (3-4 m)', 'Incluye pack de 20 gomas'],
    customizable: false
  },

  // ==========================================
  // 11. ACCESORIOS PARA MASCOTAS
  // ==========================================
  {
    id: 'placa-identificativa-hueso',
    name: 'Placa Personalizada para Collar con Teléfono Grabado',
    category: 'mascotas',
    categoryLabel: 'Accesorios para Mascotas',
    price: 6.90,
    tag: 'Personalizado',
    icon: 'heart',
    shape: 'plate',
    shortDesc: 'Placa ligera para collar con el nombre de tu perro o gato y teléfono.',
    description: 'Mucho más ligera y silenciosa que las medallas de metal tradicionales (no tintinea al caminar ni molesta al animal). Letras fusionadas térmicamente.',
    specs: ['Peso: solo 4 gramos', 'Teléfono y nombre legibles en relieve', 'Anilla de acero inoxidable incluida', 'Formas de hueso, corazón o pez'],
    customizable: true
  },
  {
    id: 'comedero-lento-laberinto',
    name: 'Plato Comedero Lento Antivoracidad con Laberinto',
    category: 'mascotas',
    categoryLabel: 'Accesorios para Mascotas',
    price: 16.90,
    tag: 'Salud Canina',
    icon: 'shield',
    shape: 'hex-grid',
    shortDesc: 'Obliga a tu mascota a comer despacio, evitando atragantamientos y gases.',
    description: 'Laberinto con crestas suaves que estimula la inteligencia del perro o gato y multiplica el tiempo de ingesta por cinco, mejorando su digestión.',
    specs: ['Diámetro: 20 cm', 'Apto pienso seco y comida húmeda', 'Bordes redondeados de seguridad', 'Base antideslizante con ventosas'],
    customizable: false
  },
  {
    id: 'dispensador-bolsas-hueso',
    name: 'Dispensador de Bolsas Higiénicas con Mosquetón de Paseo',
    category: 'mascotas',
    categoryLabel: 'Accesorios para Mascotas',
    price: 8.50,
    tag: 'Práctico Paseo',
    icon: 'box',
    shape: 'capsule',
    shortDesc: 'Cápsula rígida con rosca rápida para rollos estándar de bolsas higiénicas.',
    description: 'Se acopla a la correa del perro o mochila con su mosquetón. Dispone de abertura frontal para sacar y cortar las bolsas cómodamente con una sola mano.',
    specs: ['Rosca de recarga rápida', 'Apto para cualquier rollo universal', 'Mosquetón incluido', 'Material irrompible TPU/PETG'],
    customizable: false
  },
  {
    id: 'soporte-cuencos-elevado',
    name: 'Base Elevada Ergonómica para Comedero y Bebedero',
    category: 'mascotas',
    categoryLabel: 'Accesorios para Mascotas',
    price: 21.00,
    tag: 'Ergonomía Animal',
    icon: 'layers',
    shape: 'stand',
    shortDesc: 'Eleva los comederos 10 cm para proteger la columna y articulaciones.',
    description: 'Recomendado por veterinarios para perros senior o de tamaño mediano/grande: reduce la tensión cervical y favorece el paso del alimento al estómago.',
    specs: ['Altura: 10 cm', 'Alojamiento para 2 cuencos de 14-16 cm', 'Patas de goma antivibración', 'Fácil de limpiar'],
    customizable: true
  },
  {
    id: 'juguete-dispensador-premios',
    name: 'Pelota Laberíntica Dispensadora de Snacks',
    category: 'mascotas',
    categoryLabel: 'Accesorios para Mascotas',
    price: 11.50,
    tag: 'Estimulación Mental',
    icon: 'help-circle',
    shape: 'sphere',
    shortDesc: 'Juguete rodante que suelta golosinas a medida que la mascota lo empuja.',
    description: 'El laberinto interior ralentiza la salida de los premios manteniendo a tu perro o gato entretenido y mentalmente activo durante largos periodos.',
    specs: ['Diámetro: 85 mm', 'Abertura regulable para diferentes tamaños de pienso', 'Material TPU elástico no tóxico', 'Fácil de desmontar para lavar'],
    customizable: false
  },
  {
    id: 'puerta-gatera-retenedor',
    name: 'Tope Regulador de Puerta para Paso Exclusivo de Gatos',
    category: 'mascotas',
    categoryLabel: 'Accesorios para Mascotas',
    price: 9.90,
    tag: 'Solución Hogar',
    icon: 'lock',
    shape: 'wedge',
    shortDesc: 'Mantiene la puerta entreabierta lo justo para que pase el gato pero no el perro.',
    description: 'Se ancla al pestillo y marco de la puerta sin tornillos ni adhesivos. Permite al gato acceder al arenero o comedero con total intimidad.',
    specs: ['Separación regulable de 7 a 13 cm', 'Instalación en 5 segundos sin herramientas', 'No daña la puerta ni el marco', 'Material flexible resistente'],
    customizable: false
  }
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
