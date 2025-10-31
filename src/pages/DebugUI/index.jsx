import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil-gui";

const Box = () => {
  const meshRef = useRef();
  const materialRef = useRef();

  useEffect(() => {
    if (!meshRef.current || !materialRef.current) return;

    const mesh = meshRef.current;
    const material = materialRef.current;

    // GUI
    const gui = new dat.GUI();
    gui.add(mesh.position, "x", -3, 3, 0.01);
    gui.add(mesh.position, "y", -3, 3, 0.01).name("elevation");
    gui.add(mesh, "visible");
    gui.add(material, "wireframe");

    const parameters = {
      color: "#f00",
      spin: () => {
        gsap.fromTo(mesh.rotation, { y: 0 }, { y: 10, duration: 2 });
        gsap.fromTo(mesh.rotation, { x: 0 }, { x: 10, duration: 2 });
        gsap.fromTo(mesh.rotation, { z: 0 }, { z: 10, duration: 2 });
      },
    };

    gui.addColor(parameters, "color").onChange((value) => {
      material.color.set(value);
    });

    gui.add(parameters, "spin");
  }, []);

  useFrame(() => {
    // Rotate slightly each frame
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial ref={materialRef} color={0xff0000} />
    </mesh>
  );
};

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 75 }} style={{ width: "100%", height: "100%", background: '#000' }}>
      <ambientLight />
      <Box />
      <OrbitControls enableDamping />
    </Canvas>
  );
}
