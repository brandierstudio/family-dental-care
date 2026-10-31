import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { motion } from 'motion/react';
import { HERO_CONTENT, TreatmentId } from '../constants/dentalData';
import {
  create3DDentalChairSuite,
  createDentalMaterialPalette,
  detectSoftwareGl,
} from '../three/dental3DModels';

interface ClinicArchitectureSceneProps {
  selectedTreatment: TreatmentId;
}

export const ClinicArchitectureScene: React.FC<ClinicArchitectureSceneProps> = ({
  selectedTreatment,
}) => {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const requestRenderRef = useRef<(() => void) | null>(null);
  const selectedTreatmentRef = useRef<TreatmentId>(selectedTreatment);

  const wordsLine1 = HERO_CONTENT.headlineLines[0].split(' ');
  const wordsLine2 = HERO_CONTENT.headlineLines[1].split(' ');

  useEffect(() => {
    selectedTreatmentRef.current = selectedTreatment;
    requestRenderRef.current?.();
  }, [selectedTreatment]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    const width = container.clientWidth || 1440;
    const height = container.clientHeight || 900;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Studio PBR environment reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 120);
    camera.position.set(0, 2.35, 9.6);
    camera.lookAt(0, 1.35, 0);

    // Warm/Cool Architectural Dusk Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xc8d4ff, 0x241d46, 1.15);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff0db, 2.4);
    keyLight.position.set(6, 9, 7);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    // Warm Golden Interior Suite Point Lights
    const suiteInteriorLight = new THREE.PointLight(0xffb86c, 4.2, 14);
    suiteInteriorLight.position.set(-0.2, 2.2, 0.4);
    scene.add(suiteInteriorLight);

    const implantRimLight = new THREE.PointLight(0x5cd6c0, 3.2, 10);
    implantRimLight.position.set(3.2, 2.6, 2.2);
    scene.add(implantRimLight);

    const palette = createDentalMaterialPalette(renderer, isSoftwareGl);

    // Master 3D Architectural Pavilion + Dental Suite Group (positioned so the roofline sits cleanly below the headline)
    const worldGroup = new THREE.Group();
    worldGroup.position.set(0, -0.52, 0);
    scene.add(worldGroup);

    // 1. Reflective Dusk Water Terrace Floor
    const waterFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(16, 16, 0.24, 64),
      new THREE.MeshStandardMaterial({
        color: 0x181634,
        roughness: 0.18,
        metalness: 0.6,
      })
    );
    waterFloor.position.set(0, -0.5, 0);
    worldGroup.add(waterFloor);

    // 2. Travertine Clinic Plinth Deck
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(5.6, 6.0, 0.34, 64),
      palette.ceramicWhite
    );
    plinth.position.set(0, -0.18, -0.4);
    worldGroup.add(plinth);

    // 3. Smooth Architectural Warm-Lit Interior Back Wall & Ceiling Soffit
    const warmWallMat = new THREE.MeshStandardMaterial({
      color: 0xe69c5a,
      roughness: 0.42,
      metalness: 0.06,
      emissive: 0xd97b38,
      emissiveIntensity: 0.35,
    });
    const backWallPanel = new THREE.Mesh(
      new THREE.BoxGeometry(7.6, 2.75, 0.32),
      warmWallMat
    );
    backWallPanel.position.set(0, 1.36, -1.65);
    worldGroup.add(backWallPanel);

    // Architectural Wood-Slat Vertical Accent Columns inside the Suite
    for (let s = -5; s <= 5; s++) {
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 2.7, 0.08),
        palette.warmWood
      );
      slat.position.set(s * 0.65, 1.36, -1.46);
      worldGroup.add(slat);
    }

    // 4. Sweeping Futuristic Curved White Ceramic Cantilever Roof Canopy
    const roofCanopy = new THREE.Mesh(
      new THREE.CylinderGeometry(5.5, 5.8, 0.32, 64),
      palette.ceramicWhite
    );
    roofCanopy.scale.set(1.08, 1, 0.62);
    roofCanopy.position.set(0, 2.82, -0.35);
    worldGroup.add(roofCanopy);

    // Sweeping Curved Arch Fascia
    const archCurveGeo = new THREE.TorusGeometry(4.95, 0.32, 24, 72, Math.PI);
    const roofArch = new THREE.Mesh(archCurveGeo, palette.ceramicWhite);
    roofArch.scale.set(1.18, 0.56, 1.15);
    roofArch.position.set(0, 0.12, -0.15);
    worldGroup.add(roofArch);

    // Warm Architectural Cove Light Strip under Canopy
    const coveStrip = new THREE.Mesh(
      new THREE.BoxGeometry(7.4, 0.06, 0.22),
      new THREE.MeshStandardMaterial({
        color: 0xffe8b8,
        emissive: 0xffc670,
        emissiveIntensity: 0.95,
      })
    );
    coveStrip.position.set(0, 2.64, -0.35);
    worldGroup.add(coveStrip);

    // 5. 10-Part Ergonomic Dental Chair + Overhead Halo Light + Suite Cabinet (Centered inside the pavilion)
    const { root: suiteGroup } = create3DDentalChairSuite(palette);
    suiteGroup.position.set(-0.15, 0.02, 0.35);
    worldGroup.add(suiteGroup);

    // 6. Panoramic Curved Glass Curtain Wall Mullions
    for (let m = -2; m <= 2; m++) {
      const mullion = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 2.68, 12),
        palette.chrome
      );
      mullion.position.set(m * 1.55, 1.34, 1.05 - Math.abs(m) * 0.16);
      worldGroup.add(mullion);
    }

    let pointerX = 0;
    let pointerY = 0;

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

    function applyScenePose() {
      const targetRotY = pointerX * 0.14;
      const targetRotX = pointerY * 0.06;
      worldGroup.rotation.y = targetRotY;
      worldGroup.rotation.x = targetRotX;
    }

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        renderDirty = false;
        applyScenePose();
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

    // Hardware GPU smooth animation loop
    let gpuLoopId = 0;
    if (!isSoftwareGl) {
      const tickGpu = () => {
        worldGroup.rotation.y = THREE.MathUtils.lerp(
          worldGroup.rotation.y,
          pointerX * 0.14,
          0.08
        );
        renderer.render(scene, camera);
        gpuLoopId = requestAnimationFrame(tickGpu);
      };
      gpuLoopId = requestAnimationFrame(tickGpu);
    }

    const onPointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = (e.clientY / window.innerHeight) * 2 - 1;
      if (isSoftwareGl) {
        requestRender();
      }
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(gpuLoopId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      palette.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-screen overflow-hidden select-none">
      {/* LAYER 1 (z-0): Rich Periwinkle-Indigo Dusk Atmosphere */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 28%, #8F94D4 0%, #575B9E 38%, #282454 74%, #13112B 100%)',
        }}
      />

      {/* LAYER 2 (z-10): Giant Centred Headline "A New Way To Smile" sitting behind the 3D Pavilion Arch */}
      <div className="absolute inset-x-0 top-[76px] sm:top-[82px] lg:top-[72px] z-10 flex flex-col items-center justify-center pointer-events-none px-4">
        <h1
          aria-label="A New Way To Smile"
          className="font-display font-light text-[50px] sm:text-[78px] lg:text-[106px] leading-[0.9] tracking-[-0.03em] text-white/80 text-center"
          style={{
            textShadow: '0 16px 44px rgba(18, 14, 52, 0.45)',
            textWrap: 'balance',
          }}
        >
          <span className="block">
            {wordsLine1.map((word, idx) => (
              <motion.span
                key={`l1-${word}`}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.12 + idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block mr-[0.22em] last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block mt-0.5">
            {wordsLine2.map((word, idx) => (
              <motion.span
                key={`l2-${word}`}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.34 + idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block mr-[0.22em] last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>
      </div>

      {/* LAYER 3 (z-20): Real-Time Three.js 3D WebGL Dental Pavilion, Chair Suite & Floating 3D Tooth Implant */}
      <div
        ref={canvasMountRef}
        data-testid="hero-3d-canvas"
        className="absolute inset-0 z-20"
      />

      {/* Contrast Scrim for Foreground UI Cards */}
      <div
        className="absolute inset-0 z-25 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(16,14,38,0.22) 0%, rgba(16,14,38,0.0) 40%, rgba(14,12,32,0.58) 82%, rgba(14,12,32,0.88) 100%)',
        }}
      />
    </div>
  );
};
