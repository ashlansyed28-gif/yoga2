/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCcw,
  Compass,
  Sparkles,
  Maximize2,
  Minimize2,
  Eye,
  CheckCircle2,
  Info
} from 'lucide-react';

export type YogaPoseCategory =
  | 'stillness'
  | 'spine'
  | 'heart'
  | 'prana'
  | 'grounding'
  | 'downdog'
  | 'warrior2'
  | 'tree'
  | 'balasana'
  | 'sphinx'
  | 'bridge'
  | 'savasana';

interface ThreeYogaHumanProps {
  poseType: string;
  expansion?: number; // 0 to 1 breath expansion
  time?: number; // continuous animation seconds
  className?: string;
  showChakras?: boolean;
  showMat?: boolean;
  showAura?: boolean;
  title?: string;
}

export const ThreeYogaHuman: React.FC<ThreeYogaHumanProps> = ({
  poseType: rawType,
  expansion = 0.5,
  time = 0,
  className = '',
  showChakras = true,
  showMat = true,
  showAura = true,
  title
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'front' | 'side' | 'top'>('perspective');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const chakrasGroupRef = useRef<THREE.Group | null>(null);

  // Normalize pose type to 12 distinct yogic archetypes
  const activeType: YogaPoseCategory = ((): YogaPoseCategory => {
    const k = (rawType || '').toLowerCase();
    if (k.includes('dog') || k.includes('adho') || k.includes('down')) return 'downdog';
    if (k.includes('warrior') || k.includes('virabh')) return 'warrior2';
    if (k.includes('tree') || k.includes('vrks')) return 'tree';
    if (k.includes('child') || k.includes('bala') || k.includes('thread')) return 'balasana';
    if (k.includes('sphinx') || k.includes('cobra') || k.includes('bhujang')) return 'sphinx';
    if (k.includes('bridge') || k.includes('setu')) return 'bridge';
    if (k.includes('savasana') || k.includes('corpse') || k.includes('twist') || k.includes('baddha')) return 'savasana';
    if (k.includes('spine') || k.includes('cat') || k.includes('cow') || k.includes('marjar')) return 'spine';
    if (k.includes('heart') || k.includes('anahat') || k.includes('puppy')) return 'heart';
    if (k.includes('prana') || k.includes('wall') || k.includes('vipar')) return 'prana';
    if (k.includes('ground') || k.includes('mountain') || k.includes('tadas')) return 'grounding';
    return 'stillness';
  })();

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 380;

    // 1. Scene & Background
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f1418);
    scene.fog = new THREE.FogExp2(0x0f1418, 0.1);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.4, 1.4, 2.6);
    camera.lookAt(0, 0.6, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.04; // Keep above floor
    controls.minDistance = 1.1;
    controls.maxDistance = 6.8;
    controls.target.set(0, 0.55, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.4;
    controlsRef.current = controls;

    // 5. Studio Lighting Rig
    // Soft ambient
    const ambientLight = new THREE.AmbientLight(0xfff6ec, 0.75);
    scene.add(ambientLight);

    // Key Light (Warm golden sunlight)
    const keyLight = new THREE.DirectionalLight(0xffecd2, 1.9);
    keyLight.position.set(3.5, 4.5, 3.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0008;
    scene.add(keyLight);

    // Fill Light (Calm sage bounce)
    const fillLight = new THREE.DirectionalLight(0xb5cebe, 0.9);
    fillLight.position.set(-3.5, 2.5, -2.5);
    scene.add(fillLight);

    // Rim / Backlight (Rose halo accent for depth separation)
    const rimLight = new THREE.PointLight(0xe8b4a2, 1.6, 10);
    rimLight.position.set(0, 2.8, -2.2);
    scene.add(rimLight);

    // 6. Studio Floor & 3D Yoga Mat
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x13191f,
      roughness: 0.88,
      metalness: 0.08
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    if (showMat) {
      // 3D Yoga Mat
      const matGeo = new THREE.BoxGeometry(1.05, 0.02, 2.3);
      const matMat = new THREE.MeshStandardMaterial({
        color: 0x22303c,
        roughness: 0.6,
        metalness: 0.12
      });
      const mat = new THREE.Mesh(matGeo, matMat);
      mat.position.set(0, 0.01, 0);
      mat.receiveShadow = true;
      scene.add(mat);

      // Mat Alignment Center Line
      const lineGeo = new THREE.BoxGeometry(0.02, 0.021, 2.1);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0x3d5264 });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(0, 0.011, 0);
      scene.add(line);
    }

    // 7. Prana Floating Particle Swarm (3D Energy Field)
    if (showAura) {
      const particleCount = 220;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const baseColor1 = new THREE.Color(0xd4a373);
      const baseColor2 = new THREE.Color(0xe0afa0);

      for (let i = 0; i < particleCount; i++) {
        const radius = 0.35 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = 0.15 + Math.random() * 1.6;
        positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

        const mixed = baseColor1.clone().lerp(baseColor2, Math.random());
        colors[i * 3] = mixed.r;
        colors[i * 3 + 1] = mixed.g;
        colors[i * 3 + 2] = mixed.b;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.038,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);
      particlesRef.current = particles;
    }

    // 8. 3D Human Mannequin Group
    const humanGroup = new THREE.Group();
    scene.add(humanGroup);
    modelGroupRef.current = humanGroup;

    // 9. 3D Chakras Group
    const chakrasGroup = new THREE.Group();
    scene.add(chakrasGroup);
    chakrasGroupRef.current = chakrasGroup;

    const chakraColors = [
      0xce4257, // Muladhara Root
      0xf4a261, // Svadhisthana Sacral
      0xffd166, // Manipura Solar
      0x6c7a4d, // Anahata Heart
      0x4a90e2, // Vishuddha Throat
      0x6c5ce7, // Ajna Third Eye
      0xd4a373  // Sahasrara Crown
    ];

    chakraColors.forEach((col, idx) => {
      const cGeo = new THREE.SphereGeometry(0.032, 16, 16);
      const cMat = new THREE.MeshBasicMaterial({ color: col });
      const cMesh = new THREE.Mesh(cGeo, cMat);

      // Glow halo
      const hGeo = new THREE.SphereGeometry(0.055, 16, 16);
      const hMat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.38,
        blending: THREE.AdditiveBlending
      });
      const hMesh = new THREE.Mesh(hGeo, hMat);
      cMesh.add(hMesh);

      cMesh.position.set(0, 0.2 + idx * 0.14, 0);
      chakrasGroup.add(cMesh);
    });

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0025;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 380;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Handle Camera Presets
  const setPresetAngle = (preset: 'perspective' | 'front' | 'side' | 'top') => {
    setCameraPreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    controls.autoRotate = false;
    setAutoRotate(false);

    if (preset === 'front') {
      camera.position.set(0, 0.9, 3.2);
    } else if (preset === 'side') {
      camera.position.set(3.2, 0.8, 0);
    } else if (preset === 'top') {
      camera.position.set(0.05, 4.2, 0.05);
    } else {
      camera.position.set(2.4, 1.4, 2.6);
    }
    controls.target.set(0, 0.55, 0);
    controls.update();
  };

  // Re-build and Animate 3D Human Model on Pose / Breath Change
  useEffect(() => {
    const group = modelGroupRef.current;
    const chakras = chakrasGroupRef.current;
    if (!group) return;

    // Clear old meshes cleanly
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }

    // Material library: Natural organic yogic materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xead8c3,
      roughness: 0.52,
      metalness: 0.08
    });

    const topLinenMat = new THREE.MeshStandardMaterial({
      color: 0xf9f6f0,
      roughness: 0.82,
      metalness: 0.04
    });

    const pantsLinenMat = new THREE.MeshStandardMaterial({
      color: 0xcbbda9,
      roughness: 0.85,
      metalness: 0.05
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x3d2f26,
      roughness: 0.9
    });

    // Helper: Create segment (Cylinder or Capsule with rounded look)
    const createLimb = (radius: number, length: number, mat: THREE.Material): THREE.Mesh => {
      const geo = new THREE.CylinderGeometry(radius * 0.92, radius, length, 16);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    const createJoint = (radius: number, mat: THREE.Material): THREE.Mesh => {
      const geo = new THREE.SphereGeometry(radius, 16, 16);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    const breathScale = 1 + expansion * 0.1;
    const breathLift = expansion * 0.05;

    // =========================================================================
    // 1. STILLNESS (Seated Padmasana / Sukhasana)
    // =========================================================================
    if (activeType === 'stillness') {
      const rootY = 0.14;

      const pelvis = createJoint(0.16, pantsLinenMat);
      pelvis.position.set(0, rootY + 0.08, 0);
      group.add(pelvis);

      for (let side = -1; side <= 1; side += 2) {
        const thigh = createLimb(0.08, 0.45, pantsLinenMat);
        thigh.position.set(side * 0.22, rootY + 0.05, 0.08);
        thigh.rotation.z = side * 1.25;
        thigh.rotation.y = side * 0.35;
        thigh.rotation.x = 0.25;
        group.add(thigh);

        const knee = createJoint(0.075, skinMat);
        knee.position.set(side * 0.42, rootY + 0.04, 0.15);
        group.add(knee);

        const calf = createLimb(0.07, 0.42, pantsLinenMat);
        calf.position.set(side * 0.22, rootY + 0.04, 0.22);
        calf.rotation.z = -side * 1.35;
        calf.rotation.y = -side * 0.4;
        group.add(calf);

        const foot = createJoint(0.055, skinMat);
        foot.position.set(-side * 0.08, rootY + 0.05, 0.24);
        group.add(foot);
      }

      const torsoY = rootY + 0.26 + breathLift;
      const torsoGeo = new THREE.CylinderGeometry(0.14 * breathScale, 0.12, 0.36, 20);
      const torso = new THREE.Mesh(torsoGeo, topLinenMat);
      torso.position.set(0, torsoY, 0);
      torso.castShadow = true;
      group.add(torso);

      const chestGeo = new THREE.SphereGeometry(0.15 * breathScale, 20, 20);
      const chest = new THREE.Mesh(chestGeo, topLinenMat);
      chest.position.set(0, torsoY + 0.12, 0.02);
      group.add(chest);

      const shoulderY = torsoY + 0.18;
      for (let side = -1; side <= 1; side += 2) {
        const shoulder = createJoint(0.065, topLinenMat);
        shoulder.position.set(side * 0.2, shoulderY, 0);
        group.add(shoulder);

        const upperArm = createLimb(0.055, 0.32, skinMat);
        upperArm.position.set(side * 0.28, shoulderY - 0.14, 0.06);
        upperArm.rotation.z = -side * 0.55;
        upperArm.rotation.x = 0.35;
        group.add(upperArm);

        const elbow = createJoint(0.05, skinMat);
        elbow.position.set(side * 0.36, shoulderY - 0.28, 0.12);
        group.add(elbow);

        const forearm = createLimb(0.048, 0.28, skinMat);
        forearm.position.set(side * 0.38, shoulderY - 0.36, 0.18);
        forearm.rotation.z = -side * 0.2;
        forearm.rotation.x = 0.5;
        group.add(forearm);

        const hand = createJoint(0.045, skinMat);
        hand.position.set(side * 0.4, rootY + 0.08, 0.22);
        group.add(hand);

        // Golden mudra spark
        const spark = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffd166 }));
        spark.position.copy(hand.position);
        group.add(spark);
      }

      const neck = createLimb(0.045, 0.1, skinMat);
      neck.position.set(0, shoulderY + 0.1, 0);
      group.add(neck);

      const head = createJoint(0.11, skinMat);
      head.position.set(0, shoulderY + 0.23, 0);
      group.add(head);

      const bun = createJoint(0.06, hairMat);
      bun.position.set(0, shoulderY + 0.34, -0.02);
      group.add(bun);

      if (chakras) {
        chakras.visible = showChakras;
        const heights = [0.15, 0.25, 0.37, 0.52 + breathLift, 0.65 + breathLift, 0.78 + breathLift, 0.92 + breathLift];
        chakras.children.forEach((c, idx) => {
          c.position.set(0, heights[idx] || 0.5, 0);
        });
      }
    }

    // =========================================================================
    // 2. SPINE (Cat-Cow Wave)
    // =========================================================================
    else if (activeType === 'spine') {
      const cowToCat = 0.5 - 0.5 * Math.cos(expansion * Math.PI);
      const groundY = 0.05;

      const handZ = -0.55;
      const handY = groundY;
      const shoulderY = groundY + 0.52 - cowToCat * 0.06;
      const shoulderZ = handZ + 0.05;

      const kneeZ = 0.45;
      const kneeY = groundY;
      const hipY = groundY + 0.52 + (1 - cowToCat) * 0.08;
      const hipZ = kneeZ - 0.05;

      const midY = groundY + 0.44 + cowToCat * 0.24;
      const midZ = (shoulderZ + hipZ) / 2;

      const headY = shoulderY + 0.05 - cowToCat * 0.22;
      const headZ = shoulderZ - 0.22 + cowToCat * 0.1;

      for (let side = -1; side <= 1; side += 2) {
        const hand = createJoint(0.05, skinMat);
        hand.position.set(side * 0.2, handY + 0.02, handZ);
        group.add(hand);

        const arm = createLimb(0.05, shoulderY - handY, skinMat);
        arm.position.set(side * 0.2, (shoulderY + handY) / 2, handZ);
        group.add(arm);

        const knee = createJoint(0.065, pantsLinenMat);
        knee.position.set(side * 0.18, kneeY + 0.05, kneeZ);
        group.add(knee);

        const shin = createLimb(0.055, 0.4, pantsLinenMat);
        shin.position.set(side * 0.18, kneeY + 0.03, kneeZ + 0.2);
        shin.rotation.x = Math.PI / 2;
        group.add(shin);

        const thigh = createLimb(0.07, hipY - kneeY, pantsLinenMat);
        thigh.position.set(side * 0.18, (hipY + kneeY) / 2, hipZ);
        group.add(thigh);
      }

      const pelvis = createJoint(0.14, pantsLinenMat);
      pelvis.position.set(0, hipY, hipZ);
      group.add(pelvis);

      const spinePoints = [
        new THREE.Vector3(0, hipY, hipZ),
        new THREE.Vector3(0, midY, midZ),
        new THREE.Vector3(0, shoulderY, shoulderZ)
      ];
      const spineCurve = new THREE.CatmullRomCurve3(spinePoints);
      const spineGeo = new THREE.TubeGeometry(spineCurve, 20, 0.13, 16, false);
      const torso = new THREE.Mesh(spineGeo, topLinenMat);
      torso.castShadow = true;
      group.add(torso);

      const neck = createLimb(0.045, 0.12, skinMat);
      neck.position.set(0, (shoulderY + headY) / 2, (shoulderZ + headZ) / 2);
      neck.rotation.x = cowToCat * 0.8 - 0.4;
      group.add(neck);

      const head = createJoint(0.11, skinMat);
      head.position.set(0, headY, headZ);
      group.add(head);

      const bun = createJoint(0.055, hairMat);
      bun.position.set(0, headY + 0.06, headZ + 0.08);
      group.add(bun);

      if (chakras) {
        chakras.visible = showChakras;
        for (let i = 0; i < 7; i++) {
          const t = i / 6;
          const pos = spineCurve.getPoint(t);
          if (chakras.children[i]) {
            chakras.children[i].position.copy(pos);
          }
        }
      }
    }

    // =========================================================================
    // 3. DOWNWARD DOG (Adho Mukha Svanasana)
    // =========================================================================
    else if (activeType === 'downdog') {
      const groundY = 0.05;
      const handZ = -0.75;
      const footZ = 0.75;
      const hipY = groundY + 0.95 + expansion * 0.05;
      const hipZ = 0.0;

      // Hands planted
      for (let side = -1; side <= 1; side += 2) {
        const hand = createJoint(0.05, skinMat);
        hand.position.set(side * 0.22, groundY + 0.02, handZ);
        group.add(hand);

        // Arms straight diagonal
        const arm = createLimb(0.05, 0.65, skinMat);
        arm.position.set(side * 0.2, groundY + 0.38, handZ + 0.32);
        arm.rotation.x = 0.75;
        group.add(arm);

        // Feet flat/reaching down
        const foot = createJoint(0.055, skinMat);
        foot.position.set(side * 0.16, groundY + 0.03, footZ);
        group.add(foot);

        // Legs straight diagonal to hips
        const leg = createLimb(0.065, 0.85, pantsLinenMat);
        leg.position.set(side * 0.16, groundY + 0.48, footZ - 0.35);
        leg.rotation.x = -0.7;
        group.add(leg);
      }

      // Elevated Pelvis Apex
      const pelvis = createJoint(0.15, pantsLinenMat);
      pelvis.position.set(0, hipY, hipZ);
      group.add(pelvis);

      // Torso descending toward floor
      const torsoGeo = new THREE.CylinderGeometry(0.13, 0.15, 0.42, 16);
      const torso = new THREE.Mesh(torsoGeo, topLinenMat);
      torso.position.set(0, hipY - 0.25, hipZ - 0.22);
      torso.rotation.x = 0.75;
      group.add(torso);

      // Relaxed Head between biceps
      const head = createJoint(0.11, skinMat);
      head.position.set(0, hipY - 0.5, hipZ - 0.45);
      group.add(head);

      if (chakras) {
        chakras.visible = showChakras;
        for (let i = 0; i < 7; i++) {
          const t = i / 6;
          const y = hipY - t * 0.45;
          const z = hipZ - t * 0.42;
          if (chakras.children[i]) chakras.children[i].position.set(0, y, z);
        }
      }
    }

    // =========================================================================
    // 4. WARRIOR II (Virabhadrasana II)
    // =========================================================================
    else if (activeType === 'warrior2') {
      const groundY = 0.05;
      const frontZ = -0.55;
      const backZ = 0.65;
      const hipY = groundY + 0.65;

      // Front Foot (Facing forward -Z)
      const frontFoot = createJoint(0.055, skinMat);
      frontFoot.position.set(0, groundY + 0.03, frontZ);
      group.add(frontFoot);

      // Front Shin vertical (90 degrees)
      const frontShin = createLimb(0.06, 0.4, pantsLinenMat);
      frontShin.position.set(0, groundY + 0.22, frontZ);
      group.add(frontShin);

      // Front Knee
      const frontKnee = createJoint(0.07, pantsLinenMat);
      frontKnee.position.set(0, groundY + 0.42, frontZ);
      group.add(frontKnee);

      // Front Thigh parallel to earth
      const frontThigh = createLimb(0.07, 0.5, pantsLinenMat);
      frontThigh.position.set(0, groundY + 0.45, (frontZ + 0) / 2);
      frontThigh.rotation.x = Math.PI / 2;
      group.add(frontThigh);

      // Back Foot grounded perpendicular
      const backFoot = createJoint(0.055, skinMat);
      backFoot.position.set(0.1, groundY + 0.03, backZ);
      group.add(backFoot);

      // Back Leg long straight diagonal
      const backLeg = createLimb(0.065, 0.78, pantsLinenMat);
      backLeg.position.set(0.05, groundY + 0.38, (backZ + 0) / 2);
      backLeg.rotation.x = -0.45;
      group.add(backLeg);

      // Pelvis centered & open to the side
      const pelvis = createJoint(0.15, pantsLinenMat);
      pelvis.position.set(0, hipY, 0);
      group.add(pelvis);

      // Torso stacked vertically over pelvis
      const torsoGeo = new THREE.CylinderGeometry(0.14 * breathScale, 0.12, 0.38, 16);
      const torso = new THREE.Mesh(torsoGeo, topLinenMat);
      torso.position.set(0, hipY + 0.25, 0);
      group.add(torso);

      // Outstretched Warrior Arms parallel to mat
      const shoulderY = hipY + 0.42;

      // Front Arm reaching over front leg
      const frontArm = createLimb(0.048, 0.6, skinMat);
      frontArm.position.set(0, shoulderY, -0.32);
      frontArm.rotation.x = Math.PI / 2;
      group.add(frontArm);

      const frontHand = createJoint(0.045, skinMat);
      frontHand.position.set(0, shoulderY, -0.62);
      group.add(frontHand);

      // Back Arm reaching backward
      const backArm = createLimb(0.048, 0.6, skinMat);
      backArm.position.set(0, shoulderY, 0.32);
      backArm.rotation.x = -Math.PI / 2;
      group.add(backArm);

      const backHand = createJoint(0.045, skinMat);
      backHand.position.set(0, shoulderY, 0.62);
      group.add(backHand);

      // Head gazing over front fingers (Drishti)
      const head = createJoint(0.11, skinMat);
      head.position.set(0, shoulderY + 0.18, 0);
      head.rotation.y = Math.PI / 2;
      group.add(head);

      const bun = createJoint(0.055, hairMat);
      bun.position.set(0, shoulderY + 0.28, 0.04);
      group.add(bun);

      if (chakras) {
        chakras.visible = showChakras;
        chakras.children.forEach((c, idx) => {
          c.position.set(0, hipY + idx * 0.11, 0);
        });
      }
    }

    // =========================================================================
    // 5. TREE POSE (Vrksasana)
    // =========================================================================
    else if (activeType === 'tree') {
      const groundY = 0.05;

      // Standing Leg (Left) - rooted into earth
      const standFoot = createJoint(0.055, skinMat);
      standFoot.position.set(-0.08, groundY + 0.03, 0);
      group.add(standFoot);

      const standLeg = createLimb(0.065, 0.75, pantsLinenMat);
      standLeg.position.set(-0.08, groundY + 0.4, 0);
      group.add(standLeg);

      // Bent Leg (Right) - foot pressed to inner thigh
      const bentThigh = createLimb(0.065, 0.35, pantsLinenMat);
      bentThigh.position.set(0.12, groundY + 0.58, 0);
      bentThigh.rotation.z = -0.9;
      group.add(bentThigh);

      const bentKnee = createJoint(0.065, pantsLinenMat);
      bentKnee.position.set(0.26, groundY + 0.52, 0);
      group.add(bentKnee);

      const bentCalf = createLimb(0.055, 0.32, pantsLinenMat);
      bentCalf.position.set(0.12, groundY + 0.48, 0);
      bentCalf.rotation.z = 0.9;
      group.add(bentCalf);

      const bentFoot = createJoint(0.045, skinMat);
      bentFoot.position.set(-0.02, groundY + 0.45, 0);
      group.add(bentFoot);

      // Pelvis
      const pelvis = createJoint(0.14, pantsLinenMat);
      pelvis.position.set(0, groundY + 0.78, 0);
      group.add(pelvis);

      // Torso tall & serene
      const torsoY = groundY + 1.0 + breathLift;
      const torsoGeo = new THREE.CylinderGeometry(0.13 * breathScale, 0.11, 0.38, 16);
      const torso = new THREE.Mesh(torsoGeo, topLinenMat);
      torso.position.set(0, torsoY, 0);
      group.add(torso);

      // Anjali Mudra Prayer Hands at Heart Center
      const shoulderY = torsoY + 0.18;
      for (let side = -1; side <= 1; side += 2) {
        const arm = createLimb(0.048, 0.32, skinMat);
        arm.position.set(side * 0.14, shoulderY - 0.1, 0.1);
        arm.rotation.z = -side * 0.5;
        arm.rotation.x = 0.6;
        group.add(arm);
      }

      const hands = createJoint(0.055, skinMat);
      hands.position.set(0, shoulderY - 0.12, 0.18);
      group.add(hands);

      // Golden Heart Spark
      const spark = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffd166 }));
      spark.position.copy(hands.position);
      group.add(spark);

      // Head
      const head = createJoint(0.11, skinMat);
      head.position.set(0, shoulderY + 0.18, 0);
      group.add(head);

      const bun = createJoint(0.055, hairMat);
      bun.position.set(0, shoulderY + 0.28, -0.02);
      group.add(bun);

      if (chakras) {
        chakras.visible = showChakras;
        chakras.children.forEach((c, idx) => {
          c.position.set(0, 0.8 + idx * 0.12, 0);
        });
      }
    }

    // =========================================================================
    // 6. BALASANA (Child's Pose)
    // =========================================================================
    else if (activeType === 'balasana') {
      const groundY = 0.05;
      const heelZ = 0.45;
      const headZ = -0.35;
      const handZ = -0.75;

      // Folded Knees & Shins
      for (let side = -1; side <= 1; side += 2) {
        const knee = createJoint(0.065, pantsLinenMat);
        knee.position.set(side * 0.16, groundY + 0.04, 0.05);
        group.add(knee);

        const shin = createLimb(0.055, 0.42, pantsLinenMat);
        shin.position.set(side * 0.16, groundY + 0.03, 0.25);
        shin.rotation.x = Math.PI / 2;
        group.add(shin);

        // Extended straight arms along mat
        const arm = createLimb(0.048, 0.5, skinMat);
        arm.position.set(side * 0.2, groundY + 0.03, (headZ + handZ) / 2);
        arm.rotation.x = Math.PI / 2;
        group.add(arm);

        const hand = createJoint(0.045, skinMat);
        hand.position.set(side * 0.2, groundY + 0.02, handZ);
        group.add(hand);
      }

      // Hips resting on heels
      const pelvis = createJoint(0.14, pantsLinenMat);
      pelvis.position.set(0, groundY + 0.18, heelZ);
      group.add(pelvis);

      // Torso folded flat onto thighs
      const torsoGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.42, 16);
      const torso = new THREE.Mesh(torsoGeo, topLinenMat);
      torso.position.set(0, groundY + 0.14, (heelZ + headZ) / 2);
      torso.rotation.x = Math.PI / 2;
      group.add(torso);

      // Forehead resting gently on the mat
      const head = createJoint(0.11, skinMat);
      head.position.set(0, groundY + 0.08, headZ);
      group.add(head);

      if (chakras) {
        chakras.visible = showChakras;
        for (let i = 0; i < 7; i++) {
          const t = i / 6;
          chakras.children[i]?.position.set(0, groundY + 0.14, heelZ - t * 0.7);
        }
      }
    }

    // =========================================================================
    // 7. SPHINX / COBRA POSE
    // =========================================================================
    else if (activeType === 'sphinx') {
      const groundY = 0.05;

      // Legs extending back along mat
      for (let side = -1; side <= 1; side += 2) {
        const leg = createLimb(0.065, 0.8, pantsLinenMat);
        leg.position.set(side * 0.12, groundY + 0.04, 0.45);
        leg.rotation.x = Math.PI / 2;
        group.add(leg);

        const foot = createJoint(0.05, skinMat);
        foot.position.set(side * 0.12, groundY + 0.03, 0.85);
        group.add(foot);

        // Forearms planted forward
        const forearm = createLimb(0.05, 0.35, skinMat);
        forearm.position.set(side * 0.2, groundY + 0.03, -0.35);
        forearm.rotation.x = Math.PI / 2;
        group.add(forearm);

        const elbow = createJoint(0.05, skinMat);
        elbow.position.set(side * 0.2, groundY + 0.03, -0.18);
        group.add(elbow);

        // Upper arm supporting chest
        const upperArm = createLimb(0.05, 0.32, skinMat);
        upperArm.position.set(side * 0.2, groundY + 0.18, -0.18);
        group.add(upperArm);
      }

      // Pelvis rooted on mat
      const pelvis = createJoint(0.14, pantsLinenMat);
      pelvis.position.set(0, groundY + 0.06, 0.05);
      group.add(pelvis);

      // Torso curving upwards
      const chestY = groundY + 0.34 + expansion * 0.06;
      const torsoGeo = new THREE.CylinderGeometry(0.13, 0.12, 0.38, 16);
      const torso = new THREE.Mesh(torsoGeo, topLinenMat);
      torso.position.set(0, (groundY + chestY) / 2, -0.06);
      torso.rotation.x = -0.55;
      group.add(torso);

      // Head lifted proud with open throat
      const head = createJoint(0.11, skinMat);
      head.position.set(0, chestY + 0.18, -0.18);
      group.add(head);

      const bun = createJoint(0.055, hairMat);
      bun.position.set(0, chestY + 0.28, -0.14);
      group.add(bun);

      if (chakras) {
        chakras.visible = showChakras;
        for (let i = 0; i < 7; i++) {
          const t = i / 6;
          chakras.children[i]?.position.set(0, groundY + 0.06 + t * (chestY - groundY + 0.15), 0.05 - t * 0.2);
        }
      }
    }

    // =========================================================================
    // 8. BRIDGE POSE (Setu Bandha)
    // =========================================================================
    else if (activeType === 'bridge') {
      const groundY = 0.05;
      const shoulderZ = 0.45;
      const footZ = -0.35;
      const hipY = groundY + 0.45 + expansion * 0.08;

      // Shoulders & Head grounded
      const head = createJoint(0.11, skinMat);
      head.position.set(0, groundY + 0.08, shoulderZ + 0.22);
      group.add(head);

      for (let side = -1; side <= 1; side += 2) {
        // Feet flat on mat
        const foot = createJoint(0.055, skinMat);
        foot.position.set(side * 0.16, groundY + 0.03, footZ);
        group.add(foot);

        // Shins vertical
        const shin = createLimb(0.06, 0.38, pantsLinenMat);
        shin.position.set(side * 0.16, groundY + 0.22, footZ);
        group.add(shin);

        // Knees at apex
        const knee = createJoint(0.065, pantsLinenMat);
        knee.position.set(side * 0.16, hipY, footZ);
        group.add(knee);

        // Thighs descending to hips
        const thigh = createLimb(0.065, 0.42, pantsLinenMat);
        thigh.position.set(side * 0.16, hipY - 0.04, (footZ + 0.05) / 2);
        thigh.rotation.x = -0.3;
        group.add(thigh);

        // Arms clasped along mat under bridge
        const arm = createLimb(0.048, 0.48, skinMat);
        arm.position.set(side * 0.08, groundY + 0.03, (shoulderZ + 0) / 2);
        arm.rotation.x = Math.PI / 2;
        group.add(arm);
      }

      // Lifted Pelvis & Heart Bridge
      const pelvis = createJoint(0.15, pantsLinenMat);
      pelvis.position.set(0, hipY, 0.05);
      group.add(pelvis);

      const torsoGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.45, 16);
      const torso = new THREE.Mesh(torsoGeo, topLinenMat);
      torso.position.set(0, (hipY + groundY) / 2 + 0.06, (0.05 + shoulderZ) / 2);
      torso.rotation.x = 0.65;
      group.add(torso);

      if (chakras) {
        chakras.visible = showChakras;
        for (let i = 0; i < 7; i++) {
          const t = i / 6;
          chakras.children[i]?.position.set(0, hipY - t * (hipY - groundY), 0.05 + t * 0.4);
        }
      }
    }

    // =========================================================================
    // 9. SAVASANA (Corpse Pose)
    // =========================================================================
    else if (activeType === 'savasana') {
      const groundY = 0.05;
      const headZ = -0.65;
      const footZ = 0.75;

      for (let side = -1; side <= 1; side += 2) {
        // Legs slightly open and relaxed outwards
        const leg = createLimb(0.065, 0.82, pantsLinenMat);
        leg.position.set(side * 0.18, groundY + 0.04, 0.35);
        leg.rotation.x = Math.PI / 2;
        leg.rotation.y = side * 0.2;
        group.add(leg);

        const foot = createJoint(0.05, skinMat);
        foot.position.set(side * 0.26, groundY + 0.03, footZ);
        group.add(foot);

        // Arms at 30 degrees, palms facing ceiling
        const arm = createLimb(0.048, 0.52, skinMat);
        arm.position.set(side * 0.32, groundY + 0.03, -0.22);
        arm.rotation.x = Math.PI / 2;
        arm.rotation.z = side * 0.45;
        group.add(arm);

        const hand = createJoint(0.045, skinMat);
        hand.position.set(side * 0.45, groundY + 0.03, 0.02);
        group.add(hand);
      }

      // Pelvis grounded
      const pelvis = createJoint(0.14, pantsLinenMat);
      pelvis.position.set(0, groundY + 0.05, 0);
      group.add(pelvis);

      // Torso breathing gently
      const chestY = groundY + 0.08 + expansion * 0.04;
      const torsoGeo = new THREE.BoxGeometry(0.28 * breathScale, 0.12, 0.45);
      const torso = new THREE.Mesh(torsoGeo, topLinenMat);
      torso.position.set(0, chestY, -0.26);
      group.add(torso);

      // Head grounded
      const head = createJoint(0.11, skinMat);
      head.position.set(0, groundY + 0.08, headZ);
      group.add(head);

      if (chakras) {
        chakras.visible = showChakras;
        chakras.children.forEach((c, idx) => {
          c.position.set(0, groundY + 0.09, headZ + (6 - idx) * 0.11);
        });
      }
    }

    // =========================================================================
    // 10. HEART (Melting Heart / Anahatasana)
    // =========================================================================
    else if (activeType === 'heart') {
      const melt = 1 - expansion;
      const groundY = 0.05;
      const kneeZ = 0.55;
      const hipY = groundY + 0.52;
      const hipZ = kneeZ;
      const handZ = -0.75;
      const chestY = groundY + 0.12 - melt * 0.08;
      const chestZ = -0.15;

      for (let side = -1; side <= 1; side += 2) {
        const knee = createJoint(0.065, pantsLinenMat);
        knee.position.set(side * 0.18, groundY + 0.04, kneeZ);
        group.add(knee);

        const shin = createLimb(0.055, 0.4, pantsLinenMat);
        shin.position.set(side * 0.18, groundY + 0.03, kneeZ + 0.2);
        shin.rotation.x = Math.PI / 2;
        group.add(shin);

        const thigh = createLimb(0.07, hipY - groundY, pantsLinenMat);
        thigh.position.set(side * 0.18, (hipY + groundY) / 2, hipZ);
        group.add(thigh);

        const arm = createLimb(0.05, 0.65, skinMat);
        arm.position.set(side * 0.18, (chestY + groundY) / 2, (chestZ + handZ) / 2);
        arm.rotation.x = -Math.PI / 2 + 0.15;
        group.add(arm);

        const hand = createJoint(0.045, skinMat);
        hand.position.set(side * 0.18, groundY + 0.02, handZ);
        group.add(hand);
      }

      const pelvis = createJoint(0.14, pantsLinenMat);
      pelvis.position.set(0, hipY, hipZ);
      group.add(pelvis);

      const torsoCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, hipY, hipZ),
        new THREE.Vector3(0, (hipY + chestY) / 2 - 0.05, (hipZ + chestZ) / 2),
        new THREE.Vector3(0, chestY, chestZ)
      ]);
      const torsoGeo = new THREE.TubeGeometry(torsoCurve, 16, 0.12, 16, false);
      const torso = new THREE.Mesh(torsoGeo, topLinenMat);
      group.add(torso);

      const head = createJoint(0.11, skinMat);
      head.position.set(0, groundY + 0.1, chestZ - 0.18);
      group.add(head);

      if (chakras) {
        chakras.visible = showChakras;
        for (let i = 0; i < 7; i++) {
          const t = i / 6;
          const pos = torsoCurve.getPoint(t);
          if (chakras.children[i]) chakras.children[i].position.copy(pos);
        }
      }
    }

    // =========================================================================
    // 11. PRANA (Viparita Karani - Legs Up The Wall)
    // =========================================================================
    else if (activeType === 'prana') {
      const groundY = 0.05;
      const wallZ = -0.7;

      const wallGeo = new THREE.BoxGeometry(2.0, 1.8, 0.06);
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x1f2933, roughness: 0.9 });
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set(0, 0.9, wallZ - 0.03);
      group.add(wall);

      const bolsterGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.6, 16);
      const bolsterMat = new THREE.MeshStandardMaterial({ color: 0x73532c, roughness: 0.8 });
      const bolster = new THREE.Mesh(bolsterGeo, bolsterMat);
      bolster.rotation.z = Math.PI / 2;
      bolster.position.set(0, groundY + 0.08, wallZ + 0.28);
      group.add(bolster);

      const hipY = groundY + 0.18;
      const hipZ = wallZ + 0.26;

      for (let side = -1; side <= 1; side += 2) {
        const leg = createLimb(0.07, 0.82, pantsLinenMat);
        leg.position.set(side * 0.12, hipY + 0.42, wallZ + 0.05);
        group.add(leg);

        const foot = createJoint(0.05, skinMat);
        foot.position.set(side * 0.12, hipY + 0.84, wallZ + 0.04);
        group.add(foot);

        const arm = createLimb(0.048, 0.45, skinMat);
        arm.position.set(side * 0.38, groundY + 0.04, hipZ + 0.4);
        arm.rotation.z = side * 1.3;
        group.add(arm);

        const hand = createJoint(0.045, skinMat);
        hand.position.set(side * 0.58, groundY + 0.04, hipZ + 0.4);
        group.add(hand);
      }

      const chestY = groundY + 0.08 + expansion * 0.04;
      const headZ = hipZ + 0.65;

      const torsoGeo = new THREE.BoxGeometry(0.28, 0.12, 0.45);
      const torso = new THREE.Mesh(torsoGeo, topLinenMat);
      torso.position.set(0, chestY, (hipZ + headZ) / 2);
      torso.rotation.x = -0.15;
      group.add(torso);

      const head = createJoint(0.11, skinMat);
      head.position.set(0, groundY + 0.1, headZ);
      group.add(head);

      if (chakras) {
        chakras.visible = showChakras;
        chakras.children.forEach((c, idx) => {
          c.position.set(0, groundY + 0.1, hipZ + (6 - idx) * 0.09);
        });
      }
    }

    // =========================================================================
    // 12. GROUNDING (Tadasana to Upward Salute)
    // =========================================================================
    else {
      const groundY = 0.05;
      const armAngle = expansion * Math.PI * 0.85;

      for (let side = -1; side <= 1; side += 2) {
        const foot = createJoint(0.055, skinMat);
        foot.position.set(side * 0.11, groundY + 0.03, 0);
        group.add(foot);

        const leg = createLimb(0.065, 0.72, pantsLinenMat);
        leg.position.set(side * 0.11, groundY + 0.4, 0);
        group.add(leg);
      }

      const pelvis = createJoint(0.14, pantsLinenMat);
      pelvis.position.set(0, groundY + 0.78, 0);
      group.add(pelvis);

      const torsoY = groundY + 1.0 + breathLift;
      const torsoGeo = new THREE.CylinderGeometry(0.13 * breathScale, 0.11, 0.38, 20);
      const torso = new THREE.Mesh(torsoGeo, topLinenMat);
      torso.position.set(0, torsoY, 0);
      group.add(torso);

      const neck = createLimb(0.045, 0.1, skinMat);
      neck.position.set(0, torsoY + 0.24, 0);
      group.add(neck);

      const head = createJoint(0.11, skinMat);
      head.position.set(0, torsoY + 0.35, 0);
      group.add(head);

      const bun = createJoint(0.055, hairMat);
      bun.position.set(0, torsoY + 0.46, -0.02);
      group.add(bun);

      const shoulderY = torsoY + 0.18;
      for (let side = -1; side <= 1; side += 2) {
        const shoulder = createJoint(0.06, topLinenMat);
        shoulder.position.set(side * 0.18, shoulderY, 0);
        group.add(shoulder);

        const armLength = 0.55;
        const armEndX = side * 0.18 + Math.sin(armAngle) * side * (expansion > 0.8 ? -0.1 : 0.25);
        const armEndY = shoulderY - Math.cos(armAngle) * armLength;

        const arm = createLimb(0.048, armLength, skinMat);
        arm.position.set((side * 0.18 + armEndX) / 2, (shoulderY + armEndY) / 2, 0);
        arm.rotation.z = side * (Math.PI - armAngle);
        group.add(arm);

        const hand = createJoint(0.045, skinMat);
        hand.position.set(armEndX, armEndY, 0);
        group.add(hand);
      }

      if (chakras) {
        chakras.visible = showChakras;
        const heights = [0.8, 0.92, 1.05, 1.18 + breathLift, 1.28 + breathLift, 1.38 + breathLift, 1.5 + breathLift];
        chakras.children.forEach((c, idx) => {
          c.position.set(0, heights[idx] || 1.0, 0);
        });
      }
    }
  }, [activeType, expansion, time, showChakras]);

  return (
    <div
      className={`relative w-full h-[380px] bg-[#0F1418] rounded-2xl overflow-hidden select-none border border-[#24303C] shadow-lg ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : ''
      } ${className}`}
    >
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

      {/* Top Bar HUD: Title & 3D Camera Angles */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 bg-[#12161A]/90 backdrop-blur-md p-1 rounded-xl border border-[#2D3944] text-[11px]">
        {title && (
          <span className="px-2 font-serif text-[#D4A373] font-medium border-r border-[#2D3944] hidden sm:inline">
            {title}
          </span>
        )}
        <button
          onClick={() => setPresetAngle('perspective')}
          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
            cameraPreset === 'perspective' ? 'bg-[#FFFFFF] text-[#12161A] font-semibold' : 'text-[#8C9AA8] hover:text-white'
          }`}
        >
          3D Orbit
        </button>
        <button
          onClick={() => setPresetAngle('front')}
          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
            cameraPreset === 'front' ? 'bg-[#FFFFFF] text-[#12161A] font-semibold' : 'text-[#8C9AA8] hover:text-white'
          }`}
        >
          Front
        </button>
        <button
          onClick={() => setPresetAngle('side')}
          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
            cameraPreset === 'side' ? 'bg-[#FFFFFF] text-[#12161A] font-semibold' : 'text-[#8C9AA8] hover:text-white'
          }`}
        >
          Side Profile
        </button>
        <button
          onClick={() => setPresetAngle('top')}
          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
            cameraPreset === 'top' ? 'bg-[#FFFFFF] text-[#12161A] font-semibold' : 'text-[#8C9AA8] hover:text-white'
          }`}
        >
          Top Down
        </button>
      </div>

      {/* Top Right: Auto-Rotate, Reset & Fullscreen */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
            autoRotate
              ? 'bg-[#D4A373] text-[#12161A] border-[#D4A373] font-semibold shadow-xs'
              : 'bg-[#12161A]/85 text-[#A8B2BD] border-[#2D3944] hover:bg-[#1E2730]'
          }`}
          title="Toggle 360° Turntable Rotation"
        >
          <Compass className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span>360° Spin: {autoRotate ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => setPresetAngle('perspective')}
          className="p-2 rounded-xl bg-[#12161A]/85 border border-[#2D3944] text-[#A8B2BD] hover:text-white transition-colors cursor-pointer"
          title="Reset Camera View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-[#12161A]/85 border border-[#2D3944] text-[#A8B2BD] hover:text-white transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D Studio'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Bottom Center: Gesture Instructions */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-[#12161A]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#2D3944] text-[10px] text-[#A8B2BD] pointer-events-none whitespace-nowrap flex items-center gap-2">
        <Sparkles className="w-3 h-3 text-[#D4A373]" />
        <span>Click & drag to rotate 360° · Scroll/pinch to zoom</span>
      </div>
    </div>
  );
};
