import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useHelper } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default function LightsDemo() {
  return (
    <Canvas
      shadows
      camera={{ position: [1, 1, 2], fov: 75 }}
      style={{ width: "100vw", height: "100vh", background: "#111" }}
    >
      <LightsScene />
      <OrbitControls enableDamping />
      <axesHelper args={[2]} />
    </Canvas>
  );
}

function LightsScene() {
  const sphereRef = useRef();
  const cubeRef = useRef();
  const torusRef = useRef();

  // Light refs
  const directionalRef = useRef();
  const hemisphereRef = useRef();
  const pointRef = useRef();
  const rectRef = useRef();
  const spotRef = useRef();

  // Leva UI controls
  const { showHelpers } = useControls({
    showHelpers: true,
  });

  // Attach helpers dynamically
  useHelper(showHelpers && directionalRef, THREE.DirectionalLightHelper, 0.2, "red");
  useHelper(showHelpers && hemisphereRef, THREE.HemisphereLightHelper, 0.2);
  useHelper(showHelpers && pointRef, THREE.PointLightHelper, 0.3, "orange");
  useHelper(showHelpers && spotRef, THREE.SpotLightHelper, "lime");
  useHelper(showHelpers && rectRef, RectAreaLightHelper);

  // Common material
  const material = new THREE.MeshStandardMaterial({ roughness: 0.4 });

  // Animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    sphereRef.current.rotation.y = cubeRef.current.rotation.y = torusRef.current.rotation.y = 0.1 * t;
    sphereRef.current.rotation.x = cubeRef.current.rotation.x = torusRef.current.rotation.x = 0.15 * t;
  });

  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.5} />

      {/* Directional Light */}
      <directionalLight
        ref={directionalRef}
        color={0x00fffc}
        intensity={0.3}
        position={[1, 0.25, 0]}
      />

      {/* Hemisphere Light */}
      <hemisphereLight
        ref={hemisphereRef}
        skyColor={0xff0000}
        groundColor={0x0000ff}
        intensity={0.3}
      />

      {/* Point Light */}
      <pointLight
        ref={pointRef}
        color={0xff9000}
        intensity={0.5}
        distance={10}
        decay={2}
        position={[1, -0.5, 1]}
      />

      {/* Rect Area Light */}
      <rectAreaLight
        ref={rectRef}
        color={0x4e00ff}
        intensity={2}
        width={5}
        height={5}
        position={[-1.5, 0, 1.5]}
        lookAt={[0, 0, 0]}
      />

      {/* Spot Light */}
      <spotLight
        ref={spotRef}
        color={0x78ff00}
        intensity={0.5}
        distance={7}
        angle={Math.PI * 0.1}
        penumbra={0.25}
        decay={1}
        position={[0, 2, 3]}
      />

      {/* Objects */}
      <mesh ref={sphereRef} position={[-1.5, 0, 0]} material={material}>
        <sphereGeometry args={[0.5, 32, 32]} />
      </mesh>

      <mesh ref={cubeRef} position={[0, 0, 0]} material={material}>
        <boxGeometry args={[0.75, 0.75, 0.75]} />
      </mesh>

      <mesh ref={torusRef} position={[1.5, 0, 0]} material={material}>
        <torusGeometry args={[0.3, 0.2, 32, 64]} />
      </mesh>

      <mesh rotation-x={-Math.PI * 0.5} position={[0, -0.65, 0]} material={material}>
        <planeGeometry args={[5, 5]} />
      </mesh>
    </>
  );
}
