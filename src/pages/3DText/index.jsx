import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Text3D } from "@react-three/drei";
import * as THREE from "three";

export default function DonutTextScene() {
  return (
    <Canvas
      camera={{ position: [-2, 2, 5], fov: 75 }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 3]} intensity={1} />

        <DonutText />

        <OrbitControls enableDamping />
        <axesHelper args={[2]} />
      </Suspense>
    </Canvas>
  );
}

function DonutText() {
    const ref = useRef()

    useEffect(() => {
        if (ref.current) {
        ref.current.geometry.center() // 👈 same as in vanilla three.js
        }
    }, [])
  // Load matcap texture
  const matcapTexture = useLoader(
    THREE.TextureLoader,
    "/assets/textures/matcaps/5.png"
  );

  // Memoize geometry and material to reuse for all donuts
  const donutGeometry = useMemo(
    () => new THREE.TorusGeometry(0.3, 0.2, 20, 45),
    []
  );

  const material = useMemo(
    () => new THREE.MeshMatcapMaterial({ matcap: matcapTexture }),
    [matcapTexture]
  );

  // Create 100 random donuts
  const donuts = useMemo(() => {    
    return new Array(100).fill().map(() => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: Math.random(),
    }));
  }, []);

  return (
    <>
      {/* 3D Text */}
        <Text3D
            font="/assets/fonts/helvetiker_regular.typeface.json"
            size={0.5}
            height={0.2}
            curveSegments={6}
            bevelEnabled
            bevelThickness={0.03}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={4}
            material={material}
            center
            ref={ref}
        >
            Afridho R Kartawiria
        </Text3D>
      {/* <group position={[-3,0,0]}>
      </group> */}

      {/* Donuts */}
      {donuts.map((donut, i) => (
        <mesh
          key={i}
          geometry={donutGeometry}
          material={material}
          position={donut.position}
          rotation={donut.rotation}
          scale={donut.scale}
        />
      ))}
    </>
  );
}
