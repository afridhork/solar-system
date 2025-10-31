import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { HDRJPGLoader } from '@monogrid/gainmap-js'
import * as THREE from "three";
import { useControls } from "leva";

export default function TexturedScene() {
  return (
    <Canvas
      camera={{ position: [1, 1, 2], fov: 75 }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 3, 4]} intensity={0.5} />

        <SceneObjects />

        <OrbitControls enableDamping />
      </Suspense>
    </Canvas>
  );
}

function SceneObjects() {
  const sphereRef = useRef();
  const planeRef = useRef();
  const torusRef = useRef();

  const { scene, gl } = useThree();

  // GUI controls (using Leva instead of lil-gui)
  const { metalness, roughness, aoMapIntensity, displacementScale } = useControls({
    metalness: { value: 0.7, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0.2, min: 0, max: 1, step: 0.01 },
    aoMapIntensity: { value: 1, min: 0, max: 10, step: 0.1 },
    displacementScale: { value: 0.05, min: 0, max: 1, step: 0.01 },
  });

  // Load Textures
  const textureLoader = useLoader(THREE.TextureLoader, [
    "/assets/textures/door/color.jpg",
    "/assets/textures/door/alpha.jpg",
    "/assets/textures/door/height.jpg",
    "/assets/textures/door/ambientOcclusion.jpg",
    "/assets/textures/door/normal.jpg",
    "/assets/textures/door/metalness.jpg",
    "/assets/textures/door/roughness.jpg",
  ]);

  const [
    colorTexture,
    alphaTexture,
    heightTexture,
    aoTexture,
    normalTexture,
    metalnessTexture,
    roughnessTexture,
  ] = textureLoader;


//   const urls = [
//   "/assets/textures/environmentMaps/1/px.jpg",
//   "/assets/textures/environmentMaps/1/nx.jpg",
//   "/assets/textures/environmentMaps/1/py.jpg",
//   "/assets/textures/environmentMaps/1/ny.jpg",
//   "/assets/textures/environmentMaps/1/pz.jpg",
//   "/assets/textures/environmentMaps/1/nz.jpg",
// ];

// const cubeTexture = useLoader(THREE.CubeTextureLoader, urls);
// console.log(cubeTexture);


  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.8;
    gl.shadowMap.enabled = true;

    const hdrLoader = new HDRJPGLoader(gl);
    hdrLoader.load("/assets/venice_sunset_1k.hdr.jpg", (texture) => {
      const envMap = texture.renderTarget.texture;
      envMap.mapping = THREE.EquirectangularReflectionMapping;

      scene.environment = envMap;
      // scene.background = envMap;
      // scene.backgroundBlurriness = 0.5;

      console.log("✅ HDR environment loaded");
    });
  }, [gl, scene]);

  // Shared material
  const material = new THREE.MeshStandardMaterial({
    // map: colorTexture,
    map: alphaTexture,
    alphaMap: alphaTexture,
    aoMap: aoTexture,
    aoMapIntensity,
    // displacementMap: heightTexture,
    displacementScale,
    // metalnessMap: metalnessTexture,
    // roughnessMap: roughnessTexture,
    // normalMap: normalTexture,
    transparent: true,
    side: THREE.DoubleSide,
    // envMap: environmentMapTexture,
    metalness,
    roughness,
  });

  // Animation loop
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    sphereRef.current.rotation.y = planeRef.current.rotation.y = torusRef.current.rotation.y =
      0.1 * elapsed;
    sphereRef.current.rotation.x = planeRef.current.rotation.x = torusRef.current.rotation.x =
      0.15 * elapsed;
  });

  return (
    <>
      {/* Sphere */}
      <mesh ref={sphereRef} position={[-1.5, 0, 0]} geometry={new THREE.SphereGeometry(0.5, 16, 16)}>
        <primitive object={material} attach="material" />
      </mesh>

      {/* Plane */}
      <mesh ref={planeRef} geometry={new THREE.PlaneGeometry(1, 1, 128, 128)}>
        <primitive object={material} attach="material" />
      </mesh>

      {/* Torus */}
      <mesh
        ref={torusRef}
        position={[1.5, 0, 0]}
        geometry={new THREE.TorusGeometry(0.3, 0.2, 64, 128)}
      >
        <primitive object={material} attach="material" />
      </mesh>

      {/* Optional environment reflections */}
      {/* <Environment files="/assets/textures/environmentMaps/1/" path="" /> */}
    </>
  );
}
