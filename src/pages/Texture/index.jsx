import React, { useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const TexturedBox = () => {
  // Load textures using useLoader
  const [
    colorTexture,
    alphaTexture,
    heightTexture,
    normalTexture,
    aoTexture,
    metalnessTexture,
    roughnessTexture,
  ] = useLoader(THREE.TextureLoader, [
    "/assets/textures/door/minecraft.png",
    "/assets/textures/door/alpha.jpg",
    "/assets/textures/door/height.jpg",
    "/assets/textures/door/normal.jpg",
    "/assets/textures/door/ambientOcclusion.jpg",
    "/assets/textures/door/metalness.jpg",
    "/assets/textures/door/roughness.jpg",
  ]);

  // Optional: set filters like in original
  //for not blur texture
  colorTexture.generateMipmaps = false;
  colorTexture.minFilter = THREE.NearestFilter;
  colorTexture.magFilter = THREE.NearestFilter;

  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial map={colorTexture} />
    </mesh>
  );
};

export default function App() {
  return (
    <Canvas camera={{ position: [1, 1, 4], fov: 100 }} style={{ width: "100%", height: "100%", background:'#000' }}>
      {/* Axes Helper */}
      <axesHelper args={[2]} />
      {/* Textured Box */}
      <TexturedBox />
      {/* OrbitControls */}
      <OrbitControls enableDamping />
    </Canvas>
  );
}
