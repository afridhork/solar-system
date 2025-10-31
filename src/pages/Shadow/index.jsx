import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, useHelper } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'

function Scene() {
  // Texture loaders
  const bakedShadow = useLoader(THREE.TextureLoader, '/assets/textures/shadow/bakedShadow.jpg')
  const simpleShadow = useLoader(THREE.TextureLoader, '/assets/textures/shadow/simpleShadow.jpg')

  // Material settings
  const material = new THREE.MeshStandardMaterial({ roughness: 0.7 })
  const { metalness, roughness } = useControls('Material', {
    metalness: { value: 0, min: 0, max: 1, step: 0.001 },
    roughness: { value: 0.7, min: 0, max: 1, step: 0.001 },
  })
  material.metalness = metalness
  material.roughness = roughness

  // Lights
  const dirLightRef = useRef()
  const spotLightRef = useRef()
  const pointLightRef = useRef()

  useEffect(() => {
    if (!dirLightRef.current) return;
        const light = dirLightRef.current;

        // Adjust shadow camera bounds
        const cam = light.shadow.camera;
        cam.left = -10;
        cam.right = 10;
        cam.top = 10;
        cam.bottom = -10;
        cam.near = 0.5;
        cam.far = 50;
        cam.updateProjectionMatrix();

        // Optional: increase map size for better shadow resolution
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
    }, []);

  const { ambientIntensity, dirIntensity, spotIntensity, pointIntensity } = useControls('Lights', {
    ambientIntensity: { value: 0.4, min: 0, max: 1, step: 0.001 },
    dirIntensity: { value: 0.4, min: 0, max: 1, step: 0.001 },
    spotIntensity: { value: 0.4, min: 0, max: 1, step: 0.001 },
    pointIntensity: { value: 0.3, min: 0, max: 1, step: 0.001 },
  })

  useHelper(dirLightRef, THREE.DirectionalLightHelper, 0.2, 'yellow')
  // useHelper(spotLightRef, THREE.SpotLightHelper)
  // useHelper(pointLightRef, THREE.PointLightHelper)

  // Animated objects
  const sphereRef = useRef()
  const shadowRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (sphereRef.current && shadowRef.current) {
      const x = Math.cos(t) * 1.5
      const z = Math.sin(t) * 1.5
      const y = Math.abs(Math.sin(t * 3))
      sphereRef.current.position.set(x, y, z)
      shadowRef.current.position.set(x, 0.01 - 0.5, z)
      shadowRef.current.material.opacity = (1 - y) * 0.3
    }
  })

  return (
    <>
      {/* Helpers */}
      <axesHelper args={[3]} />

      {/* Lights */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        ref={dirLightRef}
        position={[4, 2, 0]}
        intensity={dirIntensity}
        castShadow
      />
      <spotLight
        ref={spotLightRef}
        position={[0, 2, 2]}
        intensity={spotIntensity}
        castShadow
        angle={Math.PI * 0.3}
        distance={10}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-fov={30}
        shadow-camera-near={1}
        shadow-camera-far={6}
      />
      <pointLight
        ref={pointLightRef}
        position={[-1, 1, 0]}
        intensity={pointIntensity}
        castShadow
      />

      {/* Objects */}
      <mesh ref={sphereRef} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial metalness={metalness} roughness={roughness} />
      </mesh>

      <mesh rotation-x={-Math.PI * 0.5} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial metalness={metalness} roughness={roughness} />
      </mesh>

      {/* Fake shadow */}
      <mesh
        ref={shadowRef}
        rotation-x={-Math.PI * 0.5}
        position={[0, -0.49, 0]}
      >
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial
          transparent
          color="black"
          alphaMap={simpleShadow}
          opacity={0.3}
        />
      </mesh>
    </>
  )
}

export default function App() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 10, 0], fov: 75 }}
      style={{ width: '100%', height: '100%', background: '#111' }}
    >
      <Scene />
      <OrbitControls enableDamping />
    </Canvas>
  )
}
