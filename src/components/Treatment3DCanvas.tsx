import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Layers, RotateCcw, Eye } from 'lucide-react';
import { TreatmentOption } from '../constants/dentalData';
import {
  createAnatomicalToothGroup,
  createDentalMaterialPalette,
  detectSoftwareGl,
} from '../three/dental3DModels';

interface Treatment3DCanvasProps {
  selectedTreatment: TreatmentOption;
}

export type CameraViewPreset = 'front' | 'isometric' | 'occlusal';

export const Treatment3DCanvas: React.FC<Treatment3DCanvasProps> = ({
  selectedTreatment,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isExploded, setIsExploded] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<CameraViewPreset>('isometric');

  // Mutable state ref for the Three.js scene updater
  const stateRef = useRef({
    treatment: selectedTreatment,
    exploded: isExploded,
    preset: cameraPreset,
    userYaw: 0.35,
    userPitch: 0.18,
  });

  const requestRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    stateRef.current.treatment = selectedTreatment;
    stateRef.current.exploded = isExploded;
    stateRef.current.preset = cameraPreset;
    requestRenderRef.current?.();
  }, [selectedTreatment, isExploded, cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x13112c);
    scene.fog = new THREE.FogExp2(0x13112c, 0.045);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 6.8);
    camera.lookAt(0, 0.2, 0);

    // 3-Point Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xdbe6ff, 0x1e1750, 1.1);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.6);
    keyLight.position.set(4.5, 6.5, 5.0);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x5cd6c0, 1.8);
    rimLight.position.set(-5.0, 3.0, -4.0);
    scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xf28b5b, 1.6, 12);
    warmFill.position.set(2.5, -1.5, 3.5);
    scene.add(warmFill);

    const palette = createDentalMaterialPalette(renderer, isSoftwareGl);

    // Master showcase group
    const showcaseRoot = new THREE.Group();
    scene.add(showcaseRoot);

    // Ground platform & contact shadow ring
    const pedestalDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 2.8, 0.12, 48),
      palette.indigoDark
    );
    pedestalDisc.position.y = -1.65;
    scene.add(pedestalDisc);

    const laserRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.45, 0.022, 12, 64),
      palette.mintEmissive
    );
    laserRing.rotation.x = Math.PI / 2;
    laserRing.position.y = -1.57;
    scene.add(laserRing);

    // --- GROUP 1: 3D TITANIUM IMPLANT + ABUTMENT + ZIRCONIA CROWN ASSEMBLY ---
    const implantGroup = new THREE.Group();
    showcaseRoot.add(implantGroup);

    // Alveolar Gingiva Base
    const boneBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.35, 0.72, 32),
      palette.gingiva
    );
    boneBase.position.y = -1.15;
    implantGroup.add(boneBase);

    // Socket recess ring
    const socketRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.06, 14, 32),
      palette.coralAccent
    );
    socketRing.rotation.x = Math.PI / 2;
    socketRing.position.y = -0.78;
    implantGroup.add(socketRing);

    // Grade-5 Titanium Fixture + Helical Threads
    const fixtureSubGroup = new THREE.Group();
    const fixtureShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.22, 1.15, 28),
      palette.titanium
    );
    fixtureSubGroup.add(fixtureShaft);

    for (let i = 0; i < 6; i++) {
      const threadRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.35 - i * 0.018, 0.035, 12, 28),
        palette.chrome
      );
      threadRing.rotation.x = Math.PI / 2 + 0.1;
      threadRing.position.y = 0.42 - i * 0.16;
      fixtureSubGroup.add(threadRing);
    }
    implantGroup.add(fixtureSubGroup);

    // Gold-Anodized Trans-Gingival Collar & Milled Titanium Abutment Post
    const abutmentSubGroup = new THREE.Group();
    const goldNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.36, 0.22, 28),
      palette.goldAnodized
    );
    abutmentSubGroup.add(goldNeck);

    const milledPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.32, 0.56, 24),
      palette.titanium
    );
    milledPost.position.y = 0.36;
    abutmentSubGroup.add(milledPost);
    implantGroup.add(abutmentSubGroup);

    // Monolithic Zirconia Crown (Top part)
    const crownSubGroup = createAnatomicalToothGroup(palette, false);
    crownSubGroup.scale.setScalar(1.65);
    implantGroup.add(crownSubGroup);

    // --- GROUP 2: 3D FULL DENTAL ARCH (Whitening, Aligners, Braces, Veneers, Cleaning) ---
    const archGroup = new THREE.Group();
    showcaseRoot.add(archGroup);

    // Curved Gingiva Arch U-Shape
    const gumArch = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.34, 18, 42, Math.PI * 0.85),
      palette.gingiva
    );
    gumArch.rotation.x = Math.PI / 2;
    gumArch.rotation.z = Math.PI * 0.075;
    gumArch.position.set(0, -0.45, -0.2);
    archGroup.add(gumArch);

    // 8 Sculpted Teeth arranged along the parabolic dental arch
    const teethMeshes: THREE.Group[] = [];
    const veneerShellMeshes: THREE.Mesh[] = [];
    const bracketMeshes: THREE.Mesh[] = [];

    const toothAngles = [-1.05, -0.75, -0.45, -0.15, 0.15, 0.45, 0.75, 1.05];
    toothAngles.forEach((angle, idx) => {
      const isFrontIncisor = idx >= 2 && idx <= 5;
      const tooth = createAnatomicalToothGroup(palette, isFrontIncisor);
      const radius = 1.55;
      const tx = Math.sin(angle) * radius;
      const tz = Math.cos(angle) * radius - 0.25;
      tooth.position.set(tx, -0.28, tz);
      tooth.rotation.y = angle;
      tooth.scale.setScalar(isFrontIncisor ? 0.92 : 0.85);
      archGroup.add(tooth);
      teethMeshes.push(tooth);

      // Porcelain Veneer Shell on front 4 incisors
      if (isFrontIncisor) {
        const veneerGeo = new THREE.BoxGeometry(0.54, 0.76, 0.08);
        const veneer = new THREE.Mesh(veneerGeo, palette.veneerShell);
        veneer.position.set(
          Math.sin(angle) * (radius + 0.25),
          0.12,
          Math.cos(angle) * (radius + 0.25) - 0.25
        );
        veneer.rotation.y = angle;
        archGroup.add(veneer);
        veneerShellMeshes.push(veneer);
      }

      // Orthodontic Bracket on each tooth
      const bracket = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.14, 0.09),
        palette.chrome
      );
      bracket.position.set(
        Math.sin(angle) * (radius + 0.22),
        0.12,
        Math.cos(angle) * (radius + 0.22) - 0.25
      );
      bracket.rotation.y = angle;
      archGroup.add(bracket);
      bracketMeshes.push(bracket);
    });

    // Orthodontic NiTi Archwire connecting brackets
    const archWire = new THREE.Mesh(
      new THREE.TorusGeometry(1.78, 0.022, 10, 48, Math.PI * 0.76),
      palette.chrome
    );
    archWire.rotation.x = Math.PI / 2;
    archWire.rotation.z = Math.PI * 0.12;
    archWire.position.set(0, 0.12, -0.25);
    archGroup.add(archWire);

    // Clear Aligner Polymer Tray hovering above arch
    const alignerTray = new THREE.Mesh(
      new THREE.TorusGeometry(1.62, 0.42, 18, 42, Math.PI * 0.82),
      palette.alignerClear
    );
    alignerTray.rotation.x = Math.PI / 2;
    alignerTray.rotation.z = Math.PI * 0.09;
    alignerTray.position.set(0, 0.55, -0.22);
    archGroup.add(alignerTray);

    // LED Whitening Laser Arc
    const whiteningArc = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.045, 14, 48, Math.PI * 0.65),
      palette.mintEmissive
    );
    whiteningArc.rotation.x = Math.PI / 2;
    whiteningArc.rotation.z = Math.PI * 0.175;
    whiteningArc.position.set(0, 0.15, 0.1);
    archGroup.add(whiteningArc);

    // Update scene configuration based on active treatment and exploded toggle
    const syncSceneToState = () => {
      const { treatment, exploded, preset, userYaw, userPitch } = stateRef.current;
      const mode = treatment.modelMode;

      // Position camera based on preset
      if (preset === 'front') {
        camera.position.set(0, 0.45, 6.2);
      } else if (preset === 'occlusal') {
        camera.position.set(0, 5.2, 3.2);
      } else {
        camera.position.set(1.4, 1.55, 6.2);
      }
      camera.lookAt(0, 0.1, 0);

      showcaseRoot.rotation.y = userYaw;
      showcaseRoot.rotation.x = userPitch;

      const isImplantOrRoot =
        mode === 'implant-assembly' || mode === 'root-canal-molar';

      implantGroup.visible = isImplantOrRoot;
      archGroup.visible = !isImplantOrRoot;

      if (isImplantOrRoot) {
        fixtureSubGroup.position.y = exploded ? -0.25 : -0.82;
        abutmentSubGroup.position.y = exploded ? 0.55 : -0.18;
        crownSubGroup.position.y = exploded ? 1.25 : 0.25;
        goldNeck.material =
          mode === 'root-canal-molar' ? palette.coralAccent : palette.goldAnodized;
      } else {
        const showVeneers = mode === 'veneer-incisors';
        const showBraces = mode === 'braces-arch';
        const showAligner = mode === 'aligner-arch';
        const showLaser =
          mode === 'whitening-arch' ||
          mode === 'airflow-arch' ||
          mode === 'laser-gum-arch';

        veneerShellMeshes.forEach((v, idx) => {
          v.visible = showVeneers;
          const angle = toothAngles[idx + 2];
          const r = exploded ? 2.18 : 1.78;
          v.position.x = Math.sin(angle) * r;
          v.position.z = Math.cos(angle) * r - 0.25;
        });

        bracketMeshes.forEach((b) => {
          b.visible = showBraces;
        });
        archWire.visible = showBraces;

        alignerTray.visible = showAligner;
        alignerTray.position.y = exploded ? 0.82 : 0.15;

        whiteningArc.visible = showLaser;
        whiteningArc.position.y = exploded ? 0.35 : 0.12;
      }
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        renderDirty = false;
        syncSceneToState();
        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (renderDirty) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    requestRenderRef.current = requestRender;
    requestRender();

    // Gentle auto-orbit only on hardware GPU
    let gpuAnimId = 0;
    if (!isSoftwareGl) {
      const clock = new THREE.Clock();
      const animateGpu = () => {
        const dt = clock.getDelta();
        stateRef.current.userYaw += dt * 0.28;
        syncSceneToState();
        renderer.render(scene, camera);
        gpuAnimId = requestAnimationFrame(animateGpu);
      };
      gpuAnimId = requestAnimationFrame(animateGpu);
    }

    // Pointer drag orbit support
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      stateRef.current.userYaw += dx * 0.008;
      stateRef.current.userPitch = THREE.MathUtils.clamp(
        stateRef.current.userPitch + dy * 0.006,
        -0.45,
        0.65
      );
      requestRender();
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(gpuAnimId);
      clearTimeout(frameId);
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      palette.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Dedicated WebGL Mount Container */}
      <div
        ref={mountRef}
        data-testid="bento-3d-canvas"
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Interactive 3D Viewport Controls Bar (Top-Center/Right floating pill) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[46%] sm:top-[48%] z-20 flex items-center gap-2 rounded-full bg-[#14122E]/88 border border-white/20 px-3.5 py-1.5 shadow-xl">
        <button
          type="button"
          onClick={() => setIsExploded((prev) => !prev)}
          aria-pressed={isExploded}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
            isExploded
              ? 'bg-[#5CD6C0] text-[#1E1750] font-semibold'
              : 'text-white/85 hover:bg-white/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isExploded ? 'Exploded 3D' : 'Assembled 3D'}</span>
        </button>

        <div className="w-px h-4 bg-white/20" />

        {(['isometric', 'front', 'occlusal'] as CameraViewPreset[]).map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setCameraPreset(preset)}
            className={`px-2.5 py-1 rounded-full text-[11px] capitalize transition-colors cursor-pointer ${
              cameraPreset === preset
                ? 'bg-white text-[#1E1750] font-semibold'
                : 'text-white/75 hover:text-white'
            }`}
          >
            {preset}
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            stateRef.current.userYaw += 0.55;
            requestRenderRef.current?.();
          }}
          aria-label="Rotate 3D dental model"
          className="p-1.5 rounded-full text-white/80 hover:bg-white/15 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
