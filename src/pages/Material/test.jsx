import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { useEffect, useState } from "react";

function SafeEnvironmentMap() {
  const [validUrls, setValidUrls] = useState([]);
  const [errorUrls, setErrorUrls] = useState([]);

  const urls = [
    "/assets/textures/environmentMaps/1/px.jpg",
    "/assets/textures/environmentMaps/1/nx.jpg",
    "/assets/textures/environmentMaps/1/py.jpg",
    "/assets/textures/environmentMaps/1/ny.jpg",
    "/assets/textures/environmentMaps/1/pz.jpg",
    "/assets/textures/environmentMaps/1/nz.jpg",
  ];

  useEffect(() => {
    const loadImages = async () => {
      const valid = [];
      const errors = [];

      // test each URL before using CubeTextureLoader
      await Promise.all(
        urls.map(
          (url) =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () => {
                valid.push(url);
                resolve();
              };
              img.onerror = () => {
                errors.push(url);
                resolve();
              };
              img.src = url;
            })
        )
      );

      setValidUrls(valid.length === 6 ? valid : []);
      setErrorUrls(errors);
    };

    loadImages();
  }, []);

  // load only if all 6 images are valid
  const environmentMap =
    validUrls.length === 6
      ? useLoader(THREE.CubeTextureLoader, validUrls)
      : null;

  useEffect(() => {
    if (errorUrls.length > 0) {
      console.warn("❌ Some environment map images failed to load:", errorUrls);
    } else if (validUrls.length === 6) {
      console.log("✅ Environment map loaded successfully");
    }
  }, [errorUrls, validUrls]);

  return (
    <>
      {/* if all good */}
      {environmentMap && (
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial envMap={environmentMap} metalness={1} roughness={0.2} />
        </mesh>
      )}

      {/* fallback grey sphere if error */}
      {!environmentMap && (
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      )}
    </>
  );
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} />
      <SafeEnvironmentMap />
    </Canvas>
  );
}
