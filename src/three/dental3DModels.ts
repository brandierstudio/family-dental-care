import * as THREE from 'three';

/**
 * Detect software WebGL (SwiftShader, llvmpipe, etc.) from GPU renderer string.
 */
export function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

/**
 * Create a procedural subtle enamel/travertine micro-relief CanvasTexture.
 */
export function createMicroReliefTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 128, 128);

  for (let i = 0; i < 600; i++) {
    const x = (i * 37) % 128;
    const y = (i * 73) % 128;
    const v = 115 + (i % 26);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

export interface DentalMaterialPalette {
  enamel: THREE.MeshPhysicalMaterial;
  enamelBright: THREE.MeshPhysicalMaterial;
  veneerShell: THREE.MeshPhysicalMaterial;
  titanium: THREE.MeshPhysicalMaterial;
  goldAnodized: THREE.MeshStandardMaterial;
  chrome: THREE.MeshStandardMaterial;
  gingiva: THREE.MeshStandardMaterial;
  alignerClear: THREE.MeshPhysicalMaterial;
  ceramicWhite: THREE.MeshStandardMaterial;
  warmWood: THREE.MeshStandardMaterial;
  coralAccent: THREE.MeshStandardMaterial;
  mintEmissive: THREE.MeshStandardMaterial;
  indigoDark: THREE.MeshStandardMaterial;
  dispose: () => void;
}

export function createDentalMaterialPalette(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean
): DentalMaterialPalette {
  const bumpTex = createMicroReliefTexture(renderer);

  const enamel = new THREE.MeshPhysicalMaterial({
    color: 0xfbf9f5,
    roughness: 0.14,
    metalness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    reflectivity: 0.9,
    bumpMap: bumpTex,
    bumpScale: 0.004,
  });

  const enamelBright = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.09,
    metalness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    emissive: 0x1a2636,
    emissiveIntensity: 0.12,
  });

  const veneerShell = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.08,
    metalness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    transparent: true,
    opacity: 0.92,
  });

  const titanium = new THREE.MeshPhysicalMaterial({
    color: 0x9aa3b2,
    roughness: 0.24,
    metalness: 0.92,
    clearcoat: 0.35,
    bumpMap: bumpTex,
    bumpScale: 0.008,
  });

  const goldAnodized = new THREE.MeshStandardMaterial({
    color: 0xe5b95b,
    roughness: 0.22,
    metalness: 0.88,
  });

  const chrome = new THREE.MeshStandardMaterial({
    color: 0xe6ecf5,
    roughness: 0.12,
    metalness: 0.95,
  });

  const gingiva = new THREE.MeshStandardMaterial({
    color: 0xe07a86,
    roughness: 0.48,
    metalness: 0.04,
    bumpMap: bumpTex,
    bumpScale: 0.01,
  });

  const alignerClear = new THREE.MeshPhysicalMaterial({
    color: 0xdff8ff,
    roughness: 0.08,
    metalness: 0.0,
    transmission: isSoftwareGl ? 0 : 0.85,
    transparent: true,
    opacity: isSoftwareGl ? 0.36 : 0.78,
    ior: 1.49,
    thickness: 0.4,
    clearcoat: 1.0,
    depthWrite: false,
  });

  const ceramicWhite = new THREE.MeshStandardMaterial({
    color: 0xf5f6fc,
    roughness: 0.32,
    metalness: 0.06,
  });

  const warmWood = new THREE.MeshStandardMaterial({
    color: 0xc88a56,
    roughness: 0.58,
    metalness: 0.05,
  });

  const coralAccent = new THREE.MeshStandardMaterial({
    color: 0xf28b5b,
    roughness: 0.3,
    metalness: 0.15,
    emissive: 0xf28b5b,
    emissiveIntensity: 0.25,
  });

  const mintEmissive = new THREE.MeshStandardMaterial({
    color: 0x5cd6c0,
    roughness: 0.2,
    metalness: 0.1,
    emissive: 0x5cd6c0,
    emissiveIntensity: 0.65,
  });

  const indigoDark = new THREE.MeshStandardMaterial({
    color: 0x1e1750,
    roughness: 0.42,
    metalness: 0.25,
  });

  return {
    enamel,
    enamelBright,
    veneerShell,
    titanium,
    goldAnodized,
    chrome,
    gingiva,
    alignerClear,
    ceramicWhite,
    warmWood,
    coralAccent,
    mintEmissive,
    indigoDark,
    dispose: () => {
      bumpTex.dispose();
      enamel.dispose();
      enamelBright.dispose();
      veneerShell.dispose();
      titanium.dispose();
      goldAnodized.dispose();
      chrome.dispose();
      gingiva.dispose();
      alignerClear.dispose();
      ceramicWhite.dispose();
      warmWood.dispose();
      coralAccent.dispose();
      mintEmissive.dispose();
      indigoDark.dispose();
    },
  };
}

/**
 * Build a multi-part sculpted anatomical tooth (Crown + 4 Cusps + Cervical Neck + Root)
 */
export function createAnatomicalToothGroup(
  palette: DentalMaterialPalette,
  isIncisor = false
): THREE.Group {
  const group = new THREE.Group();

  if (isIncisor) {
    // Sculpted central/lateral incisor crown
    const crownGeo = new THREE.BoxGeometry(0.62, 0.86, 0.38, 6, 6, 4);
    // Taper cervical and incisal edges
    const pos = crownGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const widthScale = y > 0 ? 1.06 : 0.78 + (y + 0.43) * 0.3;
      const depthScale = y > 0.2 ? 0.65 : 1.0;
      const curveZ = z > 0 ? Math.cos(x * 1.8) * 0.06 : 0;
      pos.setXYZ(i, x * widthScale, y, z * depthScale + curveZ);
    }
    crownGeo.computeVertexNormals();
    const crownMesh = new THREE.Mesh(crownGeo, palette.enamel);
    crownMesh.position.y = 0.42;
    group.add(crownMesh);
  } else {
    // Sculpted Molar Crown with Lathe profile + 4 occlusal cusps
    const points = [
      new THREE.Vector2(0.01, -0.45),
      new THREE.Vector2(0.28, -0.42),
      new THREE.Vector2(0.38, -0.15),
      new THREE.Vector2(0.42, 0.18),
      new THREE.Vector2(0.35, 0.42),
      new THREE.Vector2(0.14, 0.36),
      new THREE.Vector2(0.0, 0.32),
    ];
    const latheGeo = new THREE.LatheGeometry(points, 24);
    const crownBase = new THREE.Mesh(latheGeo, palette.enamel);
    crownBase.position.y = 0.38;
    group.add(crownBase);

    // 4 anatomical occlusal cusps
    const cuspGeo = new THREE.SphereGeometry(0.18, 16, 12);
    const cuspOffsets = [
      [-0.15, 0.72, -0.14],
      [0.15, 0.72, -0.14],
      [-0.15, 0.7, 0.14],
      [0.15, 0.7, 0.14],
    ];
    cuspOffsets.forEach(([cx, cy, cz]) => {
      const cusp = new THREE.Mesh(cuspGeo, palette.enamel);
      cusp.scale.set(1.1, 0.75, 1.1);
      cusp.position.set(cx, cy, cz);
      group.add(cusp);
    });
  }

  return group;
}

/**
 * Build a 10-part 3D Ergonomic Dental Chair & Overhead Surgical Light Unit
 */
export function create3DDentalChairSuite(palette: DentalMaterialPalette): {
  root: THREE.Group;
  haloLightRing: THREE.Mesh;
  floatingToothHero: THREE.Group;
} {
  const root = new THREE.Group();

  // 1. Floor Pedestal Base
  const basePedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.85, 0.12, 28),
    palette.indigoDark
  );
  basePedestal.position.set(0, 0.06, 0);
  root.add(basePedestal);

  // 2. Brushed Titanium Hydraulic Column
  const column = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.28, 0.85, 20),
    palette.titanium
  );
  column.position.set(0, 0.48, 0);
  column.rotation.z = 0.12;
  root.add(column);

  // 3. Contoured Seat Cushion (Indigo leather upholstery over ceramic shell)
  const seatShell = new THREE.Mesh(
    new THREE.BoxGeometry(1.38, 0.08, 0.94),
    palette.ceramicWhite
  );
  seatShell.position.set(0.25, 0.84, 0);
  seatShell.rotation.z = -0.05;
  root.add(seatShell);

  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(1.34, 0.14, 0.9),
    palette.indigoDark
  );
  seat.position.set(0.25, 0.92, 0);
  seat.rotation.z = -0.05;
  root.add(seat);

  // 4. Reclined Ergonomic Backrest (Indigo leather over ceramic shell)
  const backShell = new THREE.Mesh(
    new THREE.BoxGeometry(1.48, 0.08, 0.9),
    palette.ceramicWhite
  );
  backShell.position.set(-0.86, 1.34, 0);
  backShell.rotation.z = -0.68;
  root.add(backShell);

  const backrest = new THREE.Mesh(
    new THREE.BoxGeometry(1.42, 0.14, 0.86),
    palette.indigoDark
  );
  backrest.position.set(-0.8, 1.41, 0);
  backrest.rotation.z = -0.68;
  root.add(backrest);

  // 5. Articulated Headrest Cushion
  const headrest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.56, 20),
    palette.coralAccent
  );
  headrest.rotation.x = Math.PI / 2;
  headrest.position.set(-1.48, 1.88, 0);
  root.add(headrest);

  // 6. Legrest Extension
  const legrest = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.14, 0.84),
    palette.indigoDark
  );
  legrest.position.set(1.22, 0.62, 0);
  legrest.rotation.z = 0.48;
  root.add(legrest);

  // 7. Brushed Chrome Armrests
  const armGeo = new THREE.TorusGeometry(0.32, 0.045, 12, 24, Math.PI);
  const leftArm = new THREE.Mesh(armGeo, palette.chrome);
  leftArm.position.set(-0.15, 1.05, 0.48);
  leftArm.rotation.z = -0.2;
  root.add(leftArm);

  const rightArm = leftArm.clone();
  rightArm.position.z = -0.48;
  root.add(rightArm);

  // 8. Articulated Overhead Surgical Lamp Post & Arm
  const lampPost = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 2.85, 16),
    palette.chrome
  );
  lampPost.position.set(-0.9, 1.42, -0.72);
  root.add(lampPost);

  const lampBoom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 1.55, 12),
    palette.chrome
  );
  lampBoom.rotation.z = Math.PI / 2 - 0.18;
  lampBoom.rotation.y = 0.45;
  lampBoom.position.set(-0.32, 2.72, -0.35);
  root.add(lampBoom);

  // 9. Glowing Surgical Halo Light Ring
  const haloLightRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.055, 16, 32),
    palette.mintEmissive
  );
  haloLightRing.rotation.x = Math.PI / 2 + 0.22;
  haloLightRing.position.set(0.22, 2.52, 0);
  root.add(haloLightRing);

  // 10. Chairside Digital Intraoral Scanner Console
  const consoleStand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 1.4, 12),
    palette.titanium
  );
  consoleStand.position.set(0.55, 0.95, 0.68);
  root.add(consoleStand);

  const monitorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.44, 0.05),
    palette.indigoDark
  );
  monitorFrame.position.set(0.55, 1.68, 0.68);
  monitorFrame.rotation.y = -0.45;
  root.add(monitorFrame);

  const monitorScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.58, 0.34),
    palette.mintEmissive
  );
  monitorScreen.position.set(0.53, 1.68, 0.71);
  monitorScreen.rotation.y = -0.45;
  root.add(monitorScreen);

  // 11. Clean Architectural Instrument Side-Cabinet inside the clinic suite (no giant floating tooth)
  const floatingToothHero = new THREE.Group();
  const cabinetBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.88, 0.58),
    palette.ceramicWhite
  );
  cabinetBody.position.set(0, 0.44, 0);
  floatingToothHero.add(cabinetBody);

  const cabinetTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.22, 0.06, 0.64),
    palette.warmWood
  );
  cabinetTop.position.set(0, 0.91, 0);
  floatingToothHero.add(cabinetTop);

  floatingToothHero.position.set(2.15, 0.0, -0.35);
  root.add(floatingToothHero);

  return { root, haloLightRing, floatingToothHero };
}
