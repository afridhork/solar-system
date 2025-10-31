import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three"; // <— import THREE for helpers like AxesHelper

function Box() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}

// Optional wireframe cube
function WireframeBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  return (
    <lineSegments>
      <wireframeGeometry args={[geometry]} />
      <lineBasicMaterial depthTest={false} opacity={1} transparent />
    </lineSegments>
  );
}

// ✅ Custom Axes Helper wrapper
function Axes() {
  const axes = new THREE.AxesHelper(2);
  return <primitive object={axes} />;
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 75 }}
      style={{ width: "100%", height: "100%", background: "#f0f0f0" }}
    >
      <Suspense fallback={null}>
        {/* Axes helper */}
        <Axes />

        {/* Box geometry */}
        <Box />
        <WireframeBox />

        {/* Controls */}
        <OrbitControls enableDamping />
      </Suspense>
    </Canvas>
  );
}
