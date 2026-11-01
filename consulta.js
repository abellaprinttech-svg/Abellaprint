// ========================================================
// Abella Print Tech - Visualizador 3D & Integración Meshy AI
// ========================================================

const STORAGE_KEY_API_KEY = 'meshy_api_key';
const STORAGE_KEY_CONN_MODE = 'meshy_connection_mode';
const MESHY_API_BASE = 'https://api.meshy.ai/openapi/v2';
const CORS_PROXY_PREFIX = 'https://corsproxy.io/?url=';

// Estado de Three.js
let scene, camera, renderer, controls;
let currentLoadedMesh = null;
let gridHelper = null;
let isAutoRotating = true;
let currentGLBUrl = null;
let currentPromptText = '';
let pollingInterval = null;

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  initThreeViewer();
  initMeshyFlow();
  updateApiKeyStatusUI();
});

// ========================================================
// 1. Configuración de Three.js & Visualizador 3D Centrado
// ========================================================
function initThreeViewer() {
  const canvas = document.getElementById('meshy3dCanvas');
  const container = document.getElementById('viewerHeroContainer');
  if (!canvas || !container) return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || (window.innerHeight - 60);

  // 1. Escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x11161d);
  scene.fog = new THREE.FogExp2(0x11161d, 0.003);

  // 2. Cámara
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 35, 65);

  // 3. Renderizador WebGL
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // 4. Luces de Estudio 3D
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1f2937, 0.8);
  hemiLight.position.set(0, 100, 0);
  scene.add(hemiLight);

  // Luz principal con sombra
  const mainDirLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
  mainDirLight.position.set(45, 70, 50);
  mainDirLight.castShadow = true;
  mainDirLight.shadow.mapSize.width = 2048;
  mainDirLight.shadow.mapSize.height = 2048;
  mainDirLight.shadow.bias = -0.0001;
  scene.add(mainDirLight);

  // Luz de relleno cálida Abella
  const warmFillLight = new THREE.DirectionalLight(0xc27835, 0.7);
  warmFillLight.position.set(-50, 30, -40);
  scene.add(warmFillLight);

  // Luz azulada de contraste
  const coolRimLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
  coolRimLight.position.set(0, -30, -50);
  scene.add(coolRimLight);

  // 5. Cuadrícula de base (Suelo de impresión 3D)
  gridHelper = new THREE.GridHelper(100, 30, 0xc27835, 0x273546);
  gridHelper.position.y = 0;
  scene.add(gridHelper);

  // 6. Controles Orbitales (Rotación, Zoom, Desplazamiento/Pan)
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    controls.minDistance = 5;
    controls.maxDistance = 250;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Evita mirar por debajo del suelo
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.6;
    controls.target.set(0, 12, 0);
    controls.update();
  }

  // 7. Eventos de Resize
  window.addEventListener('resize', onWindowResize);

  // Iniciar bucle de animación
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  if (controls) {
    controls.autoRotate = isAutoRotating;
    controls.update();
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function onWindowResize() {
  const container = document.getElementById('viewerHeroContainer');
  if (!container || !renderer || !camera) return;

  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// ========================================================
// 2. Lógica de Flujo de Consulta & Meshy AI
// ========================================================
function initMeshyFlow() {
  // Obtener la consulta guardada de la barra de inicio
  const storedQuery = sessionStorage.getItem('abellaConsultaQuery');
  currentPromptText = (storedQuery || '').trim();

  const promptDisplay = document.getElementById('promptDisplay');
  if (currentPromptText) {
    if (promptDisplay) promptDisplay.textContent = currentPromptText;
  } else {
    currentPromptText = 'Escultura de dragón geométrico con alas extendidas';
    if (promptDisplay) promptDisplay.textContent = currentPromptText;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    // Si no hay API Key configurada, informar amigablemente y ofrecer configurarla o cargar demo
    showStatusCard({
      title: 'Configura tu API Key de Meshy AI',
      desc: 'Para conectar con los servidores de Meshy y generar modelos 3D con IA, introduce tu clave de API oficial.',
      progress: 0,
      showSpinner: false,
      errorMsg: null,
      showConfigButton: true
    });
  } else {
    // Si ya existe la API Key, iniciar la tarea de generación automáticamente
    startTextTo3DGeneration(currentPromptText);
  }
}

/**
 * Inicia la generación Text-to-3D en Meshy AI
 * @param {string} prompt 
 */
async function startTextTo3DGeneration(prompt) {
  const apiKey = getApiKey();
  if (!apiKey) {
    openApiKeyModal();
    return;
  }

  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }

  showStatusCard({
    title: 'Creando tarea en Meshy AI...',
    desc: `Enviando prompt: "${prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt}"`,
    progress: 5,
    showSpinner: true,
    errorMsg: null,
    showConfigButton: false
  });

  try {
    // 1. Crear Tarea Text-to-3D en Meshy (modo preview)
    const requestPayload = {
      mode: 'preview',
      prompt: prompt,
      art_style: 'realistic',
      should_remesh: true,
      target_formats: ['glb']
    };

    const createResult = await executeMeshyRequest('/text-to-3d', {
      method: 'POST',
      body: JSON.stringify(requestPayload)
    });

    const taskId = createResult.result || createResult.id;
    if (!taskId) {
      throw new Error(createResult.message || 'No se recibió un ID de tarea válido de Meshy.');
    }

    showStatusCard({
      title: 'Generando modelo 3D con IA...',
      desc: 'Meshy AI está calculando la geometría volumétrica y polígonos...',
      progress: 15,
      showSpinner: true,
      errorMsg: null
    });

    // 2. Iniciar sondeo periódico (Polling) del estado de la tarea
    pollMeshyTaskProgress(taskId);

  } catch (err) {
    console.error('Error al iniciar tarea de Meshy:', err);
    showStatusCard({
      title: 'Error de conexión con Meshy AI',
      desc: 'No se pudo iniciar la generación 3D.',
      progress: 0,
      showSpinner: false,
      errorMsg: `${err.message}. Comprueba que tu API Key sea válida o prueba el modo Proxy CORS.`,
      showConfigButton: true
    });
  }
}

/**
 * Consulta periódica de estado de la tarea
 * @param {string} taskId 
 */
function pollMeshyTaskProgress(taskId) {
  let attempts = 0;
  const maxAttempts = 120; // Hasta 6-7 minutos

  pollingInterval = setInterval(async () => {
    attempts++;
    if (attempts > maxAttempts) {
      clearInterval(pollingInterval);
      showStatusCard({
        title: 'Tiempo de espera agotado',
        desc: 'La generación tardó más de lo habitual. Puedes reintentar en cualquier momento.',
        progress: 0,
        showSpinner: false,
        errorMsg: 'Tiempo de espera excedido al contactar con Meshy.',
        showConfigButton: false
      });
      return;
    }

    try {
      const taskData = await executeMeshyRequest(`/text-to-3d/${taskId}`, {
        method: 'GET'
      });

      const status = taskData.status;
      const progress = typeof taskData.progress === 'number' ? taskData.progress : 20;

      if (status === 'IN_PROGRESS' || status === 'PENDING') {
        const stageMessage = progress < 50 
          ? 'Calculando nubes de puntos y geometría...'
          : 'Refinando malla poligonal y optimizando topología...';

        showStatusCard({
          title: 'Generando modelo 3D con IA...',
          desc: `${stageMessage} (${progress}%)`,
          progress: Math.max(15, progress),
          showSpinner: true,
          errorMsg: null
        });
      } else if (status === 'SUCCEEDED') {
        clearInterval(pollingInterval);
        pollingInterval = null;

        showStatusCard({
          title: '¡Modelo 3D generado con éxito!',
          desc: 'Descargando y renderizando en el visualizador...',
          progress: 100,
          showSpinner: true,
          errorMsg: null
        });

        // Obtener URL del archivo GLB
        const modelUrls = taskData.model_urls || {};
        const glbUrl = modelUrls.glb || modelUrls.gltf;

        if (glbUrl) {
          currentGLBUrl = glbUrl;
          loadAndRenderGLB(glbUrl);
        } else {
          throw new Error('La tarea finalizó pero no se encontró un enlace al archivo .GLB.');
        }

      } else if (status === 'FAILED' || status === 'CANCELED' || status === 'EXPIRED') {
        clearInterval(pollingInterval);
        pollingInterval = null;
        const errorDetail = taskData.task_error?.message || taskData.message || 'La tarea fue rechazada por la API de Meshy.';
        showStatusCard({
          title: 'Generación fallida en Meshy',
          desc: 'La IA no pudo procesar esta solicitud.',
          progress: 0,
          showSpinner: false,
          errorMsg: errorDetail,
          showConfigButton: true
        });
      }
    } catch (err) {
      console.warn('Fallo en intento de sondeo:', err);
    }
  }, 3500);
}

/**
 * Ejecutor HTTP para la API de Meshy (con soporte automático para Proxy CORS)
 * @param {string} endpoint 
 * @param {RequestInit} options 
 */
async function executeMeshyRequest(endpoint, options = {}) {
  const apiKey = getApiKey();
  const connMode = localStorage.getItem(STORAGE_KEY_CONN_MODE) || 'auto';

  const defaultHeaders = {
    'Authorization': `Bearer ${apiKey.trim()}`,
    'Content-Type': 'application/json'
  };

  options.headers = { ...defaultHeaders, ...(options.headers || {}) };

  const targetUrl = `${MESHY_API_BASE}${endpoint}`;

  // Si el modo configurado es directamente 'corsproxy'
  if (connMode === 'corsproxy') {
    const proxiedUrl = `${CORS_PROXY_PREFIX}${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxiedUrl, options);
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Error API (${res.status}): ${errBody || res.statusText}`);
    }
    return await res.json();
  }

  // Intento directo
  try {
    const res = await fetch(targetUrl, options);
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Error API (${res.status}): ${errBody || res.statusText}`);
    }
    return await res.json();
  } catch (directErr) {
    // Si falla por CORS ("Failed to fetch" o error de red) y el modo es 'auto', intentar por Proxy CORS
    if (connMode === 'auto') {
      try {
        const proxiedUrl = `${CORS_PROXY_PREFIX}${encodeURIComponent(targetUrl)}`;
        const proxyRes = await fetch(proxiedUrl, options);
        if (!proxyRes.ok) {
          const errBody = await proxyRes.text();
          throw new Error(`Error API por Proxy (${proxyRes.status}): ${errBody}`);
        }
        return await proxyRes.json();
      } catch (proxyErr) {
        throw new Error(`Error de conexión con Meshy: ${proxyErr.message}`);
      }
    }
    throw directErr;
  }
}

// ========================================================
// 3. Renderizado del Modelo 3D (GLB / GLTF) en Canvas
// ========================================================
function loadAndRenderGLB(modelUrl) {
  if (typeof THREE.GLTFLoader === 'undefined') {
    showStatusCard({
      title: 'Librería GLTFLoader no disponible',
      desc: 'No se pudo cargar el módulo GLTFLoader de Three.js.',
      progress: 0,
      showSpinner: false,
      errorMsg: 'Verifica tu conexión a internet para cargar los scripts de Three.js.',
      showConfigButton: false
    });
    return;
  }

  const loader = new THREE.GLTFLoader();

  loader.load(
    modelUrl,
    (gltf) => {
      // 1. Limpiar modelo anterior si existe
      if (currentLoadedMesh) {
        scene.remove(currentLoadedMesh);
        currentLoadedMesh = null;
      }

      const model = gltf.scene || gltf.scenes[0];

      // 2. Configurar sombras y materiales en cada malla
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
            // Optimizar brillo y metalicidad si es necesario
            if (child.material.roughness !== undefined) {
              child.material.roughness = Math.max(0.2, child.material.roughness);
            }
          }
        }
      });

      // 3. Centrar el modelo y apoyar la base en la cuadrícula (y = 0)
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // Desplazar para centrar en X y Z, y situar la base en Y = 0
      model.position.x = -center.x;
      model.position.y = -box.min.y;
      model.position.z = -center.z;

      // Grupo contenedor
      const wrapperGroup = new THREE.Group();
      wrapperGroup.add(model);
      scene.add(wrapperGroup);
      currentLoadedMesh = wrapperGroup;

      // 4. Adaptar distancia óptima de la cámara según el tamaño del objeto
      const maxDim = Math.max(size.x, size.y, size.z) || 20;
      const fov = camera.fov * (Math.PI / 180);
      let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.8;
      cameraDistance = Math.max(25, Math.min(200, cameraDistance));

      camera.position.set(cameraDistance * 0.75, cameraDistance * 0.6, cameraDistance * 0.85);
      if (controls) {
        controls.target.set(0, size.y / 2, 0);
        controls.minDistance = maxDim * 0.4;
        controls.maxDistance = maxDim * 6;
        controls.update();
      }

      // 5. Ocultar tarjeta de estado de carga
      hideStatusCard();

      // Notificación amigable
      if (typeof showToastNotification === 'function') {
        showToastNotification('¡Modelo 3D cargado e interactivo!');
      }
    },
    (xhr) => {
      // Progreso de descarga del binario GLB
      if (xhr.lengthComputable && xhr.total > 0) {
        const percent = Math.round((xhr.loaded / xhr.total) * 100);
        const label = document.getElementById('progressPercentLabel');
        const fill = document.getElementById('progressBarFill');
        if (label) label.textContent = `${percent}%`;
        if (fill) fill.style.width = `${percent}%`;
      }
    },
    (error) => {
      console.error('Error cargando archivo GLB:', error);
      showStatusCard({
        title: 'Error al interpretar archivo .GLB',
        desc: 'El archivo descargado no pudo ser renderizado por Three.js.',
        progress: 0,
        showSpinner: false,
        errorMsg: error.message || 'Error de lectura del archivo GLB.',
        showConfigButton: false
      });
    }
  );
}

/**
 * Carga un modelo 3D emblemático de demostración sin necesidad de consumir créditos
 */
function loadDemoModel() {
  if (currentLoadedMesh) {
    scene.remove(currentLoadedMesh);
    currentLoadedMesh = null;
  }

  showStatusCard({
    title: 'Generando Geometría de Demostración...',
    desc: 'Renderizando pieza de alta precisión de Abella Print Tech...',
    progress: 80,
    showSpinner: true,
    errorMsg: null
  });

  setTimeout(() => {
    // Crear un poliedro o anillo mecánico complejo y llamativo
    const group = new THREE.Group();

    // 1. Núcleo Torus Knot con acabado cobre/bronce Abella
    const knotGeo = new THREE.TorusKnotGeometry(12, 3.8, 128, 32, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0xc27835,
      metalness: 0.85,
      roughness: 0.25
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    knotMesh.castShadow = true;
    knotMesh.receiveShadow = true;
    group.add(knotMesh);

    // 2. Anillo orbital exterior
    const ringGeo = new THREE.TorusGeometry(20, 1.2, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.9,
      roughness: 0.3
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.castShadow = true;
    group.add(ringMesh);

    // Calcular medidas y posicionar sobre la cuadrícula
    const box = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    box.getSize(size);
    group.position.y = size.y / 2 + 2;

    scene.add(group);
    currentLoadedMesh = group;

    camera.position.set(35, 30, 45);
    if (controls) {
      controls.target.set(0, group.position.y, 0);
      controls.update();
    }

    hideStatusCard();

    if (typeof showToastNotification === 'function') {
      showToastNotification('Modelo de demostración cargado');
    }
  }, 600);
}

// ========================================================
// 4. Controles de Interfaz & Modales
// ========================================================
function toggleAutoRotate() {
  isAutoRotating = !isAutoRotating;
  const btn = document.getElementById('btnAutoRotate');
  if (btn) btn.classList.toggle('active', isAutoRotating);
}

function resetCameraView() {
  if (!controls) return;
  controls.reset();
  if (currentLoadedMesh) {
    const box = new THREE.Box3().setFromObject(currentLoadedMesh);
    const center = new THREE.Vector3();
    box.getCenter(center);
    controls.target.copy(center);
  } else {
    controls.target.set(0, 12, 0);
  }
  camera.position.set(0, 35, 65);
  controls.update();
}

function toggleGrid() {
  if (!gridHelper) return;
  gridHelper.visible = !gridHelper.visible;
  const btn = document.getElementById('btnToggleGrid');
  if (btn) btn.classList.toggle('active', gridHelper.visible);
}

function downloadCurrentModel() {
  if (currentGLBUrl) {
    const a = document.createElement('a');
    a.href = currentGLBUrl;
    a.download = `Modelo_Meshy_${Date.now()}.glb`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    alert('No hay ningún archivo GLB generado para descargar en este momento.');
  }
}

// ========================================================
// 4b. Modal de Dimensiones para Impresión 3D
// ========================================================
let dimBaseRatios = { x: 1, y: 1, z: 1 };
let currentDimensions = { x: 100, y: 100, z: 100 };
let currentCalculatedUnitPrice = 19.90;
let currentCalculatedTotalPrice = 19.90;

function openDimensionsModal() {
  const modal = document.getElementById('dimensionsModal');
  if (!modal) return;

  // Medir el modelo 3D actual en la escena para calibrar proporciones
  if (currentLoadedMesh) {
    try {
      const box = new THREE.Box3().setFromObject(currentLoadedMesh);
      const size = new THREE.Vector3();
      box.getSize(size);

      // En Three.js: X = ancho, Y = altura, Z = profundidad
      const rawX = Math.max(0.1, size.x);
      const rawY = Math.max(0.1, size.z); // Profundidad en plano horizontal
      const rawZ = Math.max(0.1, size.y); // Altura vertical

      const maxAxis = Math.max(rawX, rawY, rawZ) || 1;
      dimBaseRatios = {
        x: rawX / maxAxis,
        y: rawY / maxAxis,
        z: rawZ / maxAxis
      };

      // Escala por defecto a 100 mm para el eje mayor
      currentDimensions = {
        x: Math.max(10, Math.round(dimBaseRatios.x * 100)),
        y: Math.max(10, Math.round(dimBaseRatios.y * 100)),
        z: Math.max(10, Math.round(dimBaseRatios.z * 100))
      };
    } catch (e) {
      console.warn('No se pudo medir la malla con Three.js', e);
      dimBaseRatios = { x: 1, y: 1, z: 0.8 };
      currentDimensions = { x: 100, y: 100, z: 80 };
    }
  } else {
    dimBaseRatios = { x: 1, y: 0.8, z: 0.6 };
    currentDimensions = { x: 100, y: 80, z: 60 };
  }

  // Actualizar inputs del modal
  const inputX = document.getElementById('dimXInput');
  const inputY = document.getElementById('dimYInput');
  const inputZ = document.getElementById('dimZInput');
  if (inputX) inputX.value = currentDimensions.x;
  if (inputY) inputY.value = currentDimensions.y;
  if (inputZ) inputZ.value = currentDimensions.z;

  // Restaurar chip activo (100 mm por defecto)
  const chips = document.querySelectorAll('.dim-preset-chip');
  chips.forEach(c => {
    const size = parseInt(c.getAttribute('data-size'), 10);
    c.classList.toggle('active', size === 100);
  });

  // Resetear unidades a 1
  const unitsInput = document.getElementById('dimUnitsInput');
  if (unitsInput) unitsInput.value = 1;

  recalculateDimPrice();
  modal.classList.add('open');
}

function closeDimensionsModal() {
  const modal = document.getElementById('dimensionsModal');
  if (modal) modal.classList.remove('open');
}

function applyPresetSize(targetMax) {
  currentDimensions.x = Math.max(10, Math.round(dimBaseRatios.x * targetMax));
  currentDimensions.y = Math.max(10, Math.round(dimBaseRatios.y * targetMax));
  currentDimensions.z = Math.max(10, Math.round(dimBaseRatios.z * targetMax));

  const inputX = document.getElementById('dimXInput');
  const inputY = document.getElementById('dimYInput');
  const inputZ = document.getElementById('dimZInput');
  if (inputX) inputX.value = currentDimensions.x;
  if (inputY) inputY.value = currentDimensions.y;
  if (inputZ) inputZ.value = currentDimensions.z;

  const chips = document.querySelectorAll('.dim-preset-chip');
  chips.forEach(c => {
    const size = parseInt(c.getAttribute('data-size'), 10);
    c.classList.toggle('active', size === targetMax);
  });

  recalculateDimPrice();
}

function onDimensionManualChange(axis) {
  const inputX = document.getElementById('dimXInput');
  const inputY = document.getElementById('dimYInput');
  const inputZ = document.getElementById('dimZInput');
  if (!inputX || !inputY || !inputZ) return;

  const rawX = parseFloat(String(inputX.value).replace(',', '.'));
  const rawY = parseFloat(String(inputY.value).replace(',', '.'));
  const rawZ = parseFloat(String(inputZ.value).replace(',', '.'));

  const valX = (!isNaN(rawX) && rawX > 0) ? rawX : currentDimensions.x;
  const valY = (!isNaN(rawY) && rawY > 0) ? rawY : currentDimensions.y;
  const valZ = (!isNaN(rawZ) && rawZ > 0) ? rawZ : currentDimensions.z;

  const proportionalLock = document.getElementById('proportionalLockCheck');
  const isProportional = proportionalLock ? proportionalLock.checked : true;

  if (isProportional) {
    if (axis === 'x') {
      const scale = valX / Math.max(0.01, dimBaseRatios.x);
      currentDimensions.x = Math.round(valX * 10) / 10;
      currentDimensions.y = Math.max(1, Math.round(dimBaseRatios.y * scale * 10) / 10);
      currentDimensions.z = Math.max(1, Math.round(dimBaseRatios.z * scale * 10) / 10);
      inputY.value = currentDimensions.y;
      inputZ.value = currentDimensions.z;
    } else if (axis === 'y') {
      const scale = valY / Math.max(0.01, dimBaseRatios.y);
      currentDimensions.y = Math.round(valY * 10) / 10;
      currentDimensions.x = Math.max(1, Math.round(dimBaseRatios.x * scale * 10) / 10);
      currentDimensions.z = Math.max(1, Math.round(dimBaseRatios.z * scale * 10) / 10);
      inputX.value = currentDimensions.x;
      inputZ.value = currentDimensions.z;
    } else if (axis === 'z') {
      const scale = valZ / Math.max(0.01, dimBaseRatios.z);
      currentDimensions.z = Math.round(valZ * 10) / 10;
      currentDimensions.x = Math.max(1, Math.round(dimBaseRatios.x * scale * 10) / 10);
      currentDimensions.y = Math.max(1, Math.round(dimBaseRatios.y * scale * 10) / 10);
      inputX.value = currentDimensions.x;
      inputY.value = currentDimensions.y;
    }
  } else {
    // Escala libre manual por eje independiente
    if (!isNaN(rawX) && rawX > 0) currentDimensions.x = rawX;
    if (!isNaN(rawY) && rawY > 0) currentDimensions.y = rawY;
    if (!isNaN(rawZ) && rawZ > 0) currentDimensions.z = rawZ;
  }

  // Desactivar chips de preset
  document.querySelectorAll('.dim-preset-chip').forEach(c => c.classList.remove('active'));

  recalculateDimPrice();
}

function onProportionalToggle() {
  const lock = document.getElementById('proportionalLockCheck');
  const inputX = document.getElementById('dimXInput');
  const inputY = document.getElementById('dimYInput');
  const inputZ = document.getElementById('dimZInput');

  if (inputX && inputX.value) {
    const px = parseFloat(String(inputX.value).replace(',', '.'));
    if (!isNaN(px) && px > 0) currentDimensions.x = px;
  }
  if (inputY && inputY.value) {
    const py = parseFloat(String(inputY.value).replace(',', '.'));
    if (!isNaN(py) && py > 0) currentDimensions.y = py;
  }
  if (inputZ && inputZ.value) {
    const pz = parseFloat(String(inputZ.value).replace(',', '.'));
    if (!isNaN(pz) && pz > 0) currentDimensions.z = pz;
  }

  if (lock && lock.checked) {
    const maxAxis = Math.max(currentDimensions.x, currentDimensions.y, currentDimensions.z) || 1;
    dimBaseRatios = {
      x: currentDimensions.x / maxAxis,
      y: currentDimensions.y / maxAxis,
      z: currentDimensions.z / maxAxis
    };
  }

  recalculateDimPrice();
}

function adjustDimUnits(delta) {
  const input = document.getElementById('dimUnitsInput');
  if (!input) return;
  let val = parseInt(input.value, 10) || 1;
  val = Math.max(1, Math.min(999, val + delta));
  input.value = val;
  recalculateDimPrice();
}

function recalculateDimPrice() {
  const inputX = document.getElementById('dimXInput');
  const inputY = document.getElementById('dimYInput');
  const inputZ = document.getElementById('dimZInput');

  let x = inputX && inputX.value ? parseFloat(String(inputX.value).replace(',', '.')) : currentDimensions.x;
  let y = inputY && inputY.value ? parseFloat(String(inputY.value).replace(',', '.')) : currentDimensions.y;
  let z = inputZ && inputZ.value ? parseFloat(String(inputZ.value).replace(',', '.')) : currentDimensions.z;

  if (isNaN(x) || x <= 0) x = currentDimensions.x || 10;
  if (isNaN(y) || y <= 0) y = currentDimensions.y || 10;
  if (isNaN(z) || z <= 0) z = currentDimensions.z || 10;

  currentDimensions.x = x;
  currentDimensions.y = y;
  currentDimensions.z = z;

  // Volumen estimado en cm3 (considerando ~22% infill y paredes)
  const volCm3 = Math.max(0.1, (x * y * z * 0.22) / 1000);

  // Material extra
  const matSelect = document.getElementById('dimMaterialSelect');
  let extraMaterial = 0;
  if (matSelect && matSelect.selectedIndex >= 0) {
    extraMaterial = parseFloat(matSelect.options[matSelect.selectedIndex].getAttribute('data-extra')) || 0;
  }

  // Coste base de preparación de máquina + material
  const basePrep = 3.50;
  const materialRate = 0.22; // € / cm3
  let unitPrice = basePrep + (volCm3 * materialRate) + extraMaterial;
  unitPrice = Math.max(4.90, Math.round(unitPrice * 10) / 10);

  const unitsInput = document.getElementById('dimUnitsInput');
  let units = unitsInput ? (parseInt(unitsInput.value, 10) || 1) : 1;
  if (units < 1) units = 1;

  // Descuento por volumen
  let discount = 0;
  if (units >= 25) discount = 0.15;
  else if (units >= 10) discount = 0.10;
  else if (units >= 5) discount = 0.05;

  const subtotal = unitPrice * units;
  const total = subtotal * (1 - discount);

  currentCalculatedUnitPrice = unitPrice;
  currentCalculatedTotalPrice = total;

  const volEl = document.getElementById('dimVolumeDisplay');
  const unitEl = document.getElementById('dimUnitPriceDisplay');
  const totalEl = document.getElementById('dimTotalPriceDisplay');

  if (volEl) volEl.textContent = `~${volCm3.toFixed(1)} cm³`;
  if (unitEl) unitEl.textContent = `${unitPrice.toFixed(2)} €`;
  if (totalEl) totalEl.textContent = `${total.toFixed(2)} €`;
}

function confirmDimensionsAndAddToCart() {
  const promptName = currentPromptText || 'Diseño generado con Meshy AI';
  const unitsInput = document.getElementById('dimUnitsInput');
  const units = unitsInput ? (parseInt(unitsInput.value, 10) || 1) : 1;

  const matSelect = document.getElementById('dimMaterialSelect');
  const materialId = matSelect ? matSelect.value : 'pla';
  const materialName = matSelect && matSelect.selectedIndex >= 0
    ? matSelect.options[matSelect.selectedIndex].text.split('(')[0].trim()
    : 'PLA+ Premium';

  const dimX = currentDimensions.x;
  const dimY = currentDimensions.y;
  const dimZ = currentDimensions.z;
  const dimStr = `${dimX} × ${dimY} × ${dimZ} mm`;

  const itemData = {
    productId: 'ia_3d_' + Date.now(),
    name: `Objeto 3D IA (${dimStr})`,
    basePrice: currentCalculatedUnitPrice,
    unitPrice: currentCalculatedUnitPrice,
    color: 'Bronce Abella',
    colorHex: '#c27835',
    materialId: materialId,
    materialName: materialName,
    dimensions: dimStr,
    customText: `Medidas: ${dimStr} • Prompt: "${promptName}"`,
    quantity: units,
    category: 'personalizado'
  };

  if (typeof addToCart === 'function') {
    addToCart(itemData);
    closeDimensionsModal();
    if (typeof openCartDrawer === 'function') {
      openCartDrawer();
    }
  } else {
    alert(`"${itemData.name}" añadido al carrito.`);
    closeDimensionsModal();
  }
}

// Redireccionar llamada original a la nueva experiencia
function addMeshyModelToCart() {
  openDimensionsModal();
}

// UI: Tarjeta de Estado
function showStatusCard({ title, desc, progress, showSpinner, errorMsg, showConfigButton }) {
  const card = document.getElementById('meshyStatusCard');
  if (!card) return;

  card.classList.remove('hidden');

  const titleEl = document.getElementById('statusTitle');
  const descEl = document.getElementById('statusDesc');
  const spinnerRing = document.getElementById('statusSpinnerRing');
  const fill = document.getElementById('progressBarFill');
  const percentLabel = document.getElementById('progressPercentLabel');
  const errBox = document.getElementById('statusErrorBox');
  const btnConfig = document.getElementById('btnConfigKeyInCard');

  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;
  if (spinnerRing) spinnerRing.style.display = showSpinner ? 'block' : 'none';

  if (fill) fill.style.width = `${progress}%`;
  if (percentLabel) percentLabel.textContent = `${progress}%`;

  if (errBox) {
    if (errorMsg) {
      errBox.textContent = errorMsg;
      errBox.classList.remove('hidden');
    } else {
      errBox.classList.add('hidden');
    }
  }

  if (btnConfig) {
    btnConfig.style.display = showConfigButton ? 'inline-block' : 'none';
  }
}

function hideStatusCard() {
  const card = document.getElementById('meshyStatusCard');
  if (card) card.classList.add('hidden');
}

// ========================================================
// 5. Gestión de API Key & Modales
// ========================================================
function getApiKey() {
  return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
}

function saveApiKey(key, mode) {
  if (key) {
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
  }
  if (mode) {
    localStorage.setItem(STORAGE_KEY_CONN_MODE, mode);
  }
  updateApiKeyStatusUI();
}

function updateApiKeyStatusUI() {
  const key = getApiKey();
  const dot = document.getElementById('apiKeyStatusDot');
  const text = document.getElementById('apiKeyStatusText');

  if (key) {
    if (dot) dot.classList.add('active');
    if (text) text.textContent = 'Meshy AI Conectado';
  } else {
    if (dot) dot.classList.remove('active');
    if (text) text.textContent = 'Configurar API Key';
  }
}

function openApiKeyModal() {
  const modal = document.getElementById('apiKeyModal');
  const input = document.getElementById('apiKeyInput');
  const modeSelect = document.getElementById('corsProxySelect');

  if (input) input.value = getApiKey();
  if (modeSelect) modeSelect.value = localStorage.getItem(STORAGE_KEY_CONN_MODE) || 'auto';
  if (modal) modal.classList.add('open');
}

function closeApiKeyModal() {
  const modal = document.getElementById('apiKeyModal');
  if (modal) modal.classList.remove('open');
}

function saveApiKeyFromModal() {
  const input = document.getElementById('apiKeyInput');
  const modeSelect = document.getElementById('corsProxySelect');

  const keyVal = input ? input.value.trim() : '';
  const modeVal = modeSelect ? modeSelect.value : 'auto';

  saveApiKey(keyVal, modeVal);
  closeApiKeyModal();

  if (keyVal) {
    if (typeof showToastNotification === 'function') {
      showToastNotification('API Key de Meshy guardada');
    }
    // Si hay un prompt activo, iniciar generación de inmediato
    if (currentPromptText) {
      startTextTo3DGeneration(currentPromptText);
    }
  }
}

// Modal de Nuevo Prompt
function openNewPromptModal() {
  const modal = document.getElementById('newPromptModal');
  const input = document.getElementById('newPromptInput');
  if (input) input.value = currentPromptText;
  if (modal) modal.classList.add('open');
}

function closeNewPromptModal() {
  const modal = document.getElementById('newPromptModal');
  if (modal) modal.classList.remove('open');
}

function submitNewPromptFromModal() {
  const input = document.getElementById('newPromptInput');
  const val = input ? input.value.trim() : '';

  if (!val) {
    alert('Por favor, escribe una descripción para la IA.');
    return;
  }

  currentPromptText = val;
  sessionStorage.setItem('abellaConsultaQuery', val);

  const display = document.getElementById('promptDisplay');
  if (display) display.textContent = val;

  closeNewPromptModal();
  startTextTo3DGeneration(val);
}

function regenerateCurrentPrompt() {
  if (!currentPromptText) {
    openNewPromptModal();
    return;
  }
  startTextTo3DGeneration(currentPromptText);
}
