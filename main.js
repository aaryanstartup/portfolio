// Initialize Lucide Icons
lucide.createIcons();

/* =========================================================
   THREE.JS 3D BACKGROUND ENGINE
   ========================================================= */
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 24;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Dynamic 3D Outer Polyhedron
const geometry = new THREE.IcosahedronGeometry(7, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00f7ff,
  wireframe: true,
  transparent: true,
  opacity: 0.4
});
const coreMesh = new THREE.Mesh(geometry, material);
coreMesh.position.set(10, -1, 0);
scene.add(coreMesh);

// Inner Wireframe Sphere
const innerGeo = new THREE.SphereGeometry(4, 16, 16);
const innerMat = new THREE.MeshBasicMaterial({
  color: 0x0062ff,
  wireframe: true,
  transparent: true,
  opacity: 0.25
});
const innerMesh = new THREE.Mesh(innerGeo, innerMat);
coreMesh.add(innerMesh);

// Floating 3D Star / Particle System
const particleCount = 2000;
const pGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

const cCyan = new THREE.Color(0x00f7ff);
const cRed = new THREE.Color(0xff003c);

for (let i = 0; i < particleCount * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 90;
  positions[i + 1] = (Math.random() - 0.5) * 90;
  positions[i + 2] = (Math.random() - 0.5) * 90;

  const clr = Math.random() > 0.85 ? cRed : cCyan;
  colors[i] = clr.r;
  colors[i + 1] = clr.g;
  colors[i + 2] = clr.b;
}

pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const pMat = new THREE.PointsMaterial({
  size: 0.16,
  vertexColors: true,
  transparent: true,
  opacity: 0.65
});

const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);

// Mouse Movement Depth Tracking
let targetX = 0;
let targetY = 0;
window.addEventListener('mousemove', (e) => {
  targetX = (e.clientX / window.innerWidth) * 2 - 1;
  targetY = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Speed Multiplier (Altered via Overclock trigger)
let warpSpeed = 1;

function renderLoop() {
  requestAnimationFrame(renderLoop);

  coreMesh.rotation.x += 0.003 * warpSpeed;
  coreMesh.rotation.y += 0.005 * warpSpeed;
  particles.rotation.y -= 0.0006 * warpSpeed;

  coreMesh.position.x += (8 + targetX * 3 - coreMesh.position.x) * 0.05;
  coreMesh.position.y += (-1 + targetY * 2 - coreMesh.position.y) * 0.05;

  renderer.render(scene, camera);
}
renderLoop();

/* =========================================================
   UNIQUE VIDEO INTERACTION ENGINE (OVERCLOCK BREACH)
   ========================================================= */
const video = document.getElementById('heroVideo');
const containerEl = document.getElementById('videoContainer');
const hudState = document.getElementById('hudState');
const hudStatusDot = document.getElementById('hudStatusDot');
const actionBadge = document.getElementById('actionBadge');
const modeDesc = document.getElementById('modeDescription');

let isOverclocked = false;

// Hover interaction: Play / Pause
containerEl.addEventListener('mouseenter', () => {
  if (!isOverclocked) {
    video.play().catch(() => {});
    hudState.textContent = "[STATUS: PLAYING // CHROMATIC]";
    hudStatusDot.className = "w-2 h-2 rounded-full bg-cyber-cyan animate-ping";
  }
});

containerEl.addEventListener('mouseleave', () => {
  if (!isOverclocked) {
    video.pause();
    hudState.textContent = "[STATUS: STANDBY / B&W]";
    hudStatusDot.className = "w-2 h-2 rounded-full bg-gray-400";
  }
});

// Unique Click Trigger: Overclock / Dimension Warp
containerEl.addEventListener('click', () => {
  isOverclocked = !isOverclocked;

  if (isOverclocked) {
    // Boost playback rate & unleash 3D Warp
    video.playbackRate = 1.75;
    video.play().catch(() => {});
    containerEl.classList.add('overclocked');
    warpSpeed = 7.5; // Accelerates Three.js core and particles
    material.color.setHex(0xff003c);

    hudState.textContent = "[ALERT: CORE BREACH // WARP 1.75x]";
    hudStatusDot.className = "w-2 h-2 rounded-full bg-red-500 animate-ping";
    actionBadge.innerHTML = `<span class="text-red-500 font-bold block">⚠️ OVERCLOCK ENGAGED</span> Click again to restore stable state`;
    modeDesc.textContent = "CORE MODE: HYPER-FREQUENCY BREACH ACTIVATED";
    modeDesc.classList.add('text-red-400');
  } else {
    // Return to normal
    video.playbackRate = 1.0;
    containerEl.classList.remove('overclocked');
    warpSpeed = 1;
    material.color.setHex(0x00f7ff);

    hudState.textContent = "[STATUS: CHROMATIC STABLE]";
    hudStatusDot.className = "w-2 h-2 rounded-full bg-cyber-cyan";
    actionBadge.innerHTML = `<span class="text-cyber-cyan font-bold block flex items-center gap-1.5"><i data-lucide="mouse-pointer-click" class="w-3.5 h-3.5"></i> CLICK TO ENGAGE OVERCLOCK</span> Hover preview • Click to breach core`;
    modeDesc.textContent = "CORE MODE: STABLE // HOVER FOR SPECTRUM // CLICK FOR WARP";
    modeDesc.classList.remove('text-red-400');
    lucide.createIcons();
  }
});