import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const EcoGlobe3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interactiveMode, setInteractiveMode] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Multi-Colored Vibrant Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const lightEmerald = new THREE.PointLight(0x10b981, 4, 60);
    lightEmerald.position.set(12, 12, 12);
    scene.add(lightEmerald);

    const lightCyan = new THREE.PointLight(0x06b6d4, 3.5, 60);
    lightCyan.position.set(-12, -8, 12);
    scene.add(lightCyan);

    const lightMagenta = new THREE.PointLight(0xd946ef, 3.5, 60);
    lightMagenta.position.set(8, -12, -10);
    scene.add(lightMagenta);

    const lightGold = new THREE.PointLight(0xfbbf24, 3, 50);
    lightGold.position.set(-8, 12, -8);
    scene.add(lightGold);

    // 4. Globe Core Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Core Sphere with iridescent deep gradient
    const sphereGeo = new THREE.SphereGeometry(5, 40, 40);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x092f2c,
      emissive: 0x0d5c4e,
      emissiveIntensity: 0.45,
      roughness: 0.2,
      metalness: 0.85,
      transparent: true,
      opacity: 0.92,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(coreSphere);

    // Holographic Wireframe Outer Mesh (Electric Cyan & Emerald)
    const wireGeo = new THREE.IcosahedronGeometry(5.25, 3);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // Secondary Geo Lattice (Neon Violet)
    const latticeGeo = new THREE.DodecahedronGeometry(5.4, 1);
    const latticeMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    globeGroup.add(latticeMesh);

    // Atmospheric Glow Ring (Radiant Emerald/Cyan)
    const atmosphereGeo = new THREE.SphereGeometry(5.75, 32, 32);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // 5. Multi-Colored Vibrant Orbiting Torus Rings
    const ringGroup = new THREE.Group();
    globeGroup.add(ringGroup);

    // Ring 1: Neon Emerald
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(7.6, 0.05, 16, 120),
      new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
    );
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    ringGroup.add(ring1);

    // Ring 2: Electric Cyan
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(8.3, 0.04, 16, 120),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
    );
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 3;
    ringGroup.add(ring2);

    // Ring 3: Radiant Magenta / Purple
    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(8.9, 0.035, 16, 120),
      new THREE.MeshBasicMaterial({ color: 0xe879f9, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
    );
    ring3.rotation.y = Math.PI / 2;
    ring3.rotation.x = Math.PI / 5;
    ringGroup.add(ring3);

    // 6. Floating Multi-Colored 3D Gem Particles (Gold, Ruby, Sapphire, Emerald, Amethyst)
    const particleNodes: THREE.Mesh[] = [];
    const vibrantMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.95, roughness: 0.15, emissive: 0xd97706, emissiveIntensity: 0.3 }), // Vibrant Gold
      new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.85, roughness: 0.2, emissive: 0x059669, emissiveIntensity: 0.3 }),  // Neon Emerald
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.15, emissive: 0x0284c7, emissiveIntensity: 0.35 }), // Electric Cyan
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, metalness: 0.9, roughness: 0.2, emissive: 0xe11d48, emissiveIntensity: 0.35 }),  // Hot Ruby
      new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.9, roughness: 0.15, emissive: 0x7e22ce, emissiveIntensity: 0.35 }), // Radiant Violet
      new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.95, roughness: 0.15, emissive: 0xc2410c, emissiveIntensity: 0.3 }), // Sunset Amber
    ];

    const boxGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
    const octaGeo = new THREE.OctahedronGeometry(0.35, 0);
    const tetraGeo = new THREE.TetrahedronGeometry(0.32, 0);

    for (let i = 0; i < 42; i++) {
      const geoType = i % 3;
      const geo = geoType === 0 ? boxGeo : geoType === 1 ? octaGeo : tetraGeo;
      const mat = vibrantMaterials[i % vibrantMaterials.length];
      const mesh = new THREE.Mesh(geo, mat);

      const radius = 6.2 + Math.random() * 3.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
      mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
      mesh.position.z = radius * Math.cos(phi);

      globeGroup.add(mesh);
      particleNodes.push(mesh);
    }

    // 7. Mouse Interaction & Parallax Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        globeGroup.rotation.y += deltaX * 0.008;
        globeGroup.rotation.x += deltaY * 0.008;
      } else {
        mouseX = x * 1.6;
        mouseY = y * 1.6;
      }

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setInteractiveMode(true);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // 9. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        globeGroup.rotation.y += 0.005;
        wireMesh.rotation.y -= 0.003;
        latticeMesh.rotation.x += 0.002;
        ringGroup.rotation.z += 0.006;
        ringGroup.rotation.x += 0.003;

        targetX += (mouseX - targetX) * 0.06;
        targetY += (mouseY - targetY) * 0.06;
        globeGroup.rotation.x = THREE.MathUtils.lerp(globeGroup.rotation.x, targetY * 0.8, 0.05);
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX * 3.5, 0.05);
        camera.lookAt(scene.position);
      }

      // Rotate individual multi-colored floating nodes
      particleNodes.forEach((node, idx) => {
        node.rotation.x += 0.015 * ((idx % 3) + 1);
        node.rotation.y += 0.02;
        node.position.y += Math.sin(elapsedTime * 2.5 + idx) * 0.006;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      latticeGeo.dispose();
      latticeMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
      
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating Vibrant 3D HUD Badges */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-emerald-400/40 text-white text-xs font-black shadow-xl shadow-emerald-500/10">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-ping" />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
            Interactive 3D Eco Globe
          </span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none">
        <span className="text-[11px] font-extrabold text-slate-200 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-md">
          ✨ Drag mouse to rotate 3D Earth
        </span>
      </div>

    </div>
  );
};
