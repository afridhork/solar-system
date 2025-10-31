import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const Box = ({ cursor }) => {
  const meshRef = useRef();

  useFrame(({ clock, camera }) => {
    const elapsedTime = clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.y = elapsedTime;
      meshRef.current.position.x = Math.sin(elapsedTime);
      meshRef.current.position.z = Math.cos(elapsedTime);
    }

    // Update camera based on cursor
    camera.position.x = cursor.x * 5;
    camera.position.y = cursor.y * 5;
    camera.position.z = 3;
    camera.lookAt(new THREE.Vector3());
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1, 5, 5, 5]} />
      <meshBasicMaterial color={0xff0000} />
    </mesh>
  );
};

export default function App() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  // Update cursor position
  useEffect(() => {
    const handleMouseMove = (event) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setCursor({
        x: (event.clientX / width - 0.5) * 2,
        y: -(event.clientY / height - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fullscreen on double click
  useEffect(() => {
    const handleDblClick = () => {
      const canvas = document.querySelector("canvas");
      const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement;

      if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
          canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
          canvas.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    };
    window.addEventListener("dblclick", handleDblClick);
    return () => window.removeEventListener("dblclick", handleDblClick);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 100 }}
      style={{ width: "100%", height: "100%", background: "#000" }}
    >
      {/* Axes Helper */}
      <axesHelper args={[2]} />
      {/* OrbitControls */}
      <OrbitControls enableDamping />
      {/* Animated Box */}
      <Box cursor={cursor} />
    </Canvas>
  );
}
