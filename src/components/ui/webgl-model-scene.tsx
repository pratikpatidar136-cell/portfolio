"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { motion, AnimatePresence } from "framer-motion";

interface WebGLModelSceneProps {
  modelPath: string;
}

export const WebGLModelScene = ({ modelPath }: WebGLModelSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. SCENE SETUP WITH HIGH-END TONE MAPPING
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    camera.position.set(0, 0.5, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    
    // Modern Tone Mapping for GLTF/GLB models to look vivid and realistic
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // 2. PREMIUM STUDIO LIGHTING setup
    // Soft overall ambient fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // Dynamic front/key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Cyberpunk indigo fill light
    const fillLight = new THREE.DirectionalLight(0x818cf8, 2.5);
    fillLight.position.set(-6, 2, 4);
    scene.add(fillLight);

    // Cyberpunk purple/magenta rim light for edge glowing
    const rimLight = new THREE.DirectionalLight(0xc084fc, 2.0);
    rimLight.position.set(0, -3, -6);
    scene.add(rimLight);

    // Top spotlight to draw focus on details
    const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);

    // 3. CURSOR TRACKING VARIABLES
    const targetRot = { x: 0, y: 0 };
    const currentRot = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRot.y = x * 0.8;
      targetRot.x = y * 0.4;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 4. LOAD GLB MODEL AND EMBEDDED ANIMATIONS
    let mixer: THREE.AnimationMixer | null = null;
    const gltfLoader = new GLTFLoader();

    const onError = (err: unknown) => {
      console.error("GLTF model load error:", err);
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setHasError(true);
    };

    gltfLoader.load(
      modelPath,
      (gltf) => {
        const object = gltf.scene;

        // Apply shadows and standard material enhancements
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Make sure embedded materials interact well with lighting
            if (child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((m) => {
                if (m instanceof THREE.MeshStandardMaterial) {
                  m.roughness = Math.max(m.roughness, 0.3);
                  m.metalness = Math.min(m.metalness, 0.85);
                }
              });
            }
          }
        });

        // Auto-center the model geometry
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        object.position.sub(center);

        // Scale model appropriately to fit viewport beautifully
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.6 / maxDim; // Fits standard hero section layout
        object.scale.setScalar(scale);

        // Setup animations if present
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(object);
          // Play the primary animation track automatically
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        modelGroup.add(object);
        setIsLoaded(true);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      onError
    );

    // 5. WINDOW RESIZE HANDLER
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 6. RENDER & ANIMATION LOOP
    let animId: number;
    let lastTime = performance.now();
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Compute frame delta time safely
      const currentTime = performance.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Update animation mixer if animations are playing
      if (mixer) {
        mixer.update(delta);
      }

      // Smooth cursor follow rotation lerping
      currentRot.y += (targetRot.y - currentRot.y) * 0.07;
      currentRot.x += (targetRot.x - currentRot.x) * 0.07;
      modelGroup.rotation.y = currentRot.y;
      modelGroup.rotation.x = currentRot.x;

      // Premium subtle floating/breathing animation
      const t = (currentTime - startTime) / 1000;
      modelGroup.position.y = Math.sin(t * 1.2) * 0.12;

      renderer.render(scene, camera);
    };
    animate();

    // 7. CLEANUP AND DISPOSAL OF WEBGL RESOURCES
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      modelGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelPath]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Loading Overlay */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md rounded-2xl"
          >
            <div className="relative flex h-28 w-28 items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute h-24 w-24 rounded-full border border-dashed border-indigo-500/30"
              />
              <div className="spinner relative z-10" />
            </div>
            <h4 className="mt-5 text-xs font-bold tracking-widest text-indigo-400 uppercase">
              👒 Rendering Model
            </h4>
            <div className="mt-3 w-44 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ type: "spring", stiffness: 80 }}
              />
            </div>
            <p className="mt-2 text-[10px] text-zinc-500 font-semibold tracking-widest uppercase">
              {loadingProgress}% — Rendering Mesh
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-900">
          <span className="text-6xl mb-4">👒</span>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">3D Model Stream Error</h4>
          <p className="mt-2 text-xs text-zinc-500 max-w-xs leading-relaxed">
            Could not render 3D GLB model. Check file path or console logs.
          </p>
          {errorMsg && (
            <p className="mt-3 text-[10px] text-red-400/70 font-mono max-w-xs truncate bg-black/35 px-2 py-1 rounded">
              {errorMsg}
            </p>
          )}
        </div>
      )}

      {/* THREE.js Canvas Mount Node */}
      <div
        ref={mountRef}
        className="w-full h-full overflow-hidden"
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 1.2s ease" }}
      />
    </div>
  );
};
