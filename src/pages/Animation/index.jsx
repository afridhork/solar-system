import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function RotatingBox() {
  const meshRef = useRef();

  useEffect(() => {
    if (!meshRef.current) return;

    // Infinite GSAP rotation
    gsap.fromTo(
      meshRef.current.rotation,
      { y: Math.PI * 2, x: Math.PI * 2 },
      { y: 0, x: 0, repeat: -1, duration: 1, ease: "none" }
    );
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(t);
    meshRef.current.position.x = Math.cos(t);
  });

  return (
    <>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <axesHelper args={[2]} />
    </>
  );
}

function MovingTorus() {
  const meshRef = useRef();
  const cameraRef = useRef();
  const clockRef = useRef(new THREE.Clock());

  useEffect(() => {
    if (!meshRef.current) return;

    // Torus rotation like your vanilla GSAP
    gsap.fromTo(
      meshRef.current.rotation,
      { y: Math.PI * 2, x: Math.PI * 2 },
      { y: 0, x: 0, repeat: -1, duration: 1, ease: "none" }
    );

    // Camera GSAP ticker
    const camera = cameraRef.current;
    const clock = clockRef.current;

    gsap.ticker.add(() => {
      const elapsed = clock.getElapsedTime();
      const radius = 3;

      // Move camera in circular orbit
      camera.position.x = Math.cos(elapsed) * radius;
      camera.position.y = Math.sin(elapsed) * radius;
      // camera.position.z = Math.sin(elapsed) * radius;

      // 👈 Important: Look at torus center each frame
      // camera.lookAt(0, 0, 0);
    });

    return () => gsap.ticker.remove(() => {});
  }, []);

  return (
    <>
      {/* Orbiting camera */}
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 5]} />
      {/* Torus mesh */}
      <mesh ref={meshRef}>
        <torusGeometry args={[0.3, 0.2, 64, 128]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <axesHelper args={[2]} />
    </>
  );
}

export default function DualScene() {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#111",
      }}
    >
      {/* Scene 1 */}
      <Canvas
        style={{ width: "50%", height: "100%", background: "#000" }}
        camera={{ position: [0, 0, 3], fov: 75 }}
      >
        <OrbitControls enableDamping />
        <RotatingBox />
      </Canvas>

      {/* Scene 2 */}
      <Canvas
        style={{ width: "50%", height: "100%", background: "#000" }}
        camera={{ position: [0, 0, 3], fov: 75 }}
      >
        <OrbitControls enableDamping />
        <MovingTorus />
      </Canvas>
    </div>
  );
}
