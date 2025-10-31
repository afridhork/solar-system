import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three"; // <— import THREE for helpers like AxesHelper
import { useRef } from "react";

function CubesGroup() {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.rotation.x += 0.01;
    }
  });
  return (
    <group position={[0, 0, 0]}>
      {/* Cube 1 */}
      <mesh ref={groupRef} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="red" />
      </mesh>

      {/* Cube 2 */}
      <mesh ref={groupRef} position={[2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="blue" />
      </mesh>

      {/* Cube 3 */}
      <mesh ref={groupRef} position={[-2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="green" />
      </mesh>
    </group>
  );
}

export default function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 75 }}
      style={{ width: "100%", height: "100%" }}
    >
      <axesHelper args={[3]} />
      <CubesGroup />
      <OrbitControls />
    </Canvas>
  );
}
