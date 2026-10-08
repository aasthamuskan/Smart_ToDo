/* ═══════════════════════════════════════════════
   3D METAVERSE BACKGROUND — Three.js
   Floating grid + particles + wireframe objects
═══════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bg-canvas');

  // ── Renderer ──────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // ── Scene & Camera ────────────────────────────
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.045);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(0, 3.5, 8);
  camera.lookAt(0, 0, -10);

  // ── Perspective Grid Floor ─────────────────────
  // Custom moving grid: two planes of lines for depth effect
  function makeGridLines(count, spacing, color, opacity) {
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    const group = new THREE.Group();
    const half = (count * spacing) / 2;

    // longitudinal (z-direction)
    for (let i = 0; i <= count; i++) {
      const x = -half + i * spacing;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0, -half * 3),
        new THREE.Vector3(x, 0, half),
      ]);
      group.add(new THREE.Line(geo, mat));
    }
    // lateral (x-direction)
    for (let j = 0; j <= count * 3; j++) {
      const z = -half * 3 + j * spacing;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-half, 0, z),
        new THREE.Vector3(half, 0, z),
      ]);
      group.add(new THREE.Line(geo, mat));
    }
    return group;
  }

  const gridGroup = makeGridLines(28, 1.4, 0x22c55e, 0.12);
  gridGroup.position.y = -1.8;
  scene.add(gridGroup);

  // Bright horizon strip — glowing center line
  const horizonMat = new THREE.LineBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.5 });
  const horizonGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-60, -1.8, -40),
    new THREE.Vector3(60, -1.8, -40),
  ]);
  scene.add(new THREE.Line(horizonGeo, horizonMat));

  // ── Particles ─────────────────────────────────
  const PARTICLE_COUNT = 700;
  const pPositions = new Float32Array(PARTICLE_COUNT * 3);
  const pSpeeds    = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pPositions[i * 3]     = (Math.random() - 0.5) * 50;
    pPositions[i * 3 + 1] = Math.random() * 18 - 2;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    pSpeeds[i] = Math.random() * 0.012 + 0.004;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.055,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
  });
  const particleSystem = new THREE.Points(pGeo, pMat);
  scene.add(particleSystem);

  // ── Floating Wireframe Objects ─────────────────
  const floatObjs = [];
  const wfColors = [0x22c55e, 0x38bdf8, 0xa855f7, 0xec4899];

  const geoTypes = [
    () => new THREE.IcosahedronGeometry(0.45, 0),
    () => new THREE.OctahedronGeometry(0.4),
    () => new THREE.TetrahedronGeometry(0.45),
    () => new THREE.TorusGeometry(0.35, 0.10, 6, 14),
    () => new THREE.BoxGeometry(0.55, 0.55, 0.55),
  ];

  for (let i = 0; i < 14; i++) {
    const geo = geoTypes[Math.floor(Math.random() * geoTypes.length)]();
    const col = wfColors[Math.floor(Math.random() * wfColors.length)];
    const mat = new THREE.MeshBasicMaterial({
      color: col,
      wireframe: true,
      transparent: true,
      opacity: 0.18 + Math.random() * 0.15,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 22,
      Math.random() * 8 - 1,
      (Math.random() - 0.5) * 22
    );
    mesh.userData = {
      rx: (Math.random() - 0.5) * 0.008,
      ry: (Math.random() - 0.5) * 0.012,
      rz: (Math.random() - 0.5) * 0.006,
      floatAmp:    0.003 + Math.random() * 0.005,
      floatOffset: Math.random() * Math.PI * 2,
      baseY:       mesh.position.y,
    };
    scene.add(mesh);
    floatObjs.push(mesh);
  }

  // ── Glowing Connecting Lines between close particles ──
  // (static, just for decoration)
  const linePositions = [];
  const pArr = pPositions;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    for (let j = i + 1; j < PARTICLE_COUNT; j++) {
      const dx = pArr[i*3]   - pArr[j*3];
      const dy = pArr[i*3+1] - pArr[j*3+1];
      const dz = pArr[i*3+2] - pArr[j*3+2];
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (dist < 3.5 && linePositions.length < 900) {
        linePositions.push(
          pArr[i*3], pArr[i*3+1], pArr[i*3+2],
          pArr[j*3], pArr[j*3+1], pArr[j*3+2]
        );
      }
    }
  }
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  const lMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.06 });
  scene.add(new THREE.LineSegments(lGeo, lMat));

  // ── Animation Loop ─────────────────────────────
  let t = 0;
  let gridZ = 0;

  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    // Camera gentle drift
    camera.position.x = Math.sin(t * 0.07) * 1.2;
    camera.position.y = 3.5 + Math.sin(t * 0.05) * 0.4;
    camera.lookAt(Math.sin(t * 0.04) * 0.5, 0, -10);

    // Move grid forward (tunnelling effect)
    gridZ = (gridZ + 0.012) % 1.4;
    gridGroup.position.z = gridZ;

    // Rotate particle cloud slowly
    particleSystem.rotation.y += 0.0004;

    // Animate floating objects
    floatObjs.forEach((obj) => {
      obj.rotation.x += obj.userData.rx;
      obj.rotation.y += obj.userData.ry;
      obj.rotation.z += obj.userData.rz;
      obj.position.y =
        obj.userData.baseY +
        Math.sin(t + obj.userData.floatOffset) * obj.userData.floatAmp * 60;
    });

    renderer.render(scene, camera);
  }

  animate();

  // ── Resize handler ─────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
