import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const WireframeMesh = () => {
  const meshRef = useRef();

  // Generate geometry positions once
  const geometry = useMemo(() => {
    const count = 500;
    const positionsArray = new Float32Array(count * 3 * 3); // 500 triangles * 3 vertices * 3 coordinates
    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positionsArray, 3));
    return geometry;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color={0xff0000} wireframe />
    </mesh>
  );
};

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 75 }} style={{ width: "100%", height: "100%", background: '#000' }}>
      <ambientLight />
      <WireframeMesh />
      <OrbitControls enableDamping />
    </Canvas>
  );
}
