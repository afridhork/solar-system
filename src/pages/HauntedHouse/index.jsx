// HauntedHouse.tsx
import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { GUI } from "lil-gui"

function HauntedHouseScene() {
  const { scene } = useThree()
  const ghost1 = useRef()
  const ghost2 = useRef()
  const ghost3 = useRef()

  /** 🌫️ Fog */
  scene.fog = new THREE.Fog("#262837", 1, 15)

  /** 🧱 Textures */
  const [
    doorColor,
    doorAlpha,
    doorAO,
    doorNormal,
    doorMetal,
    doorRough,
    doorHeight,
    bricksColor,
    bricksAO,
    bricksNormal,
    bricksRough,
    grassColor,
    grassAO,
    grassNormal,
    grassRough
  ] = useTexture([
    "/assets/textures/house/door/color.jpg",
    "/assets/textures/house/door/alpha.jpg",
    "/assets/textures/house/door/ambientOcclusion.jpg",
    "/assets/textures/house/door/normal.jpg",
    "/assets/textures/house/door/metalness.jpg",
    "/assets/textures/house/door/roughness.jpg",
    "/assets/textures/house/door/height.jpg",
    "/assets/textures/house/bricks/color.jpg",
    "/assets/textures/house/bricks/ambientOcclusion.jpg",
    "/assets/textures/house/bricks/normal.jpg",
    "/assets/textures/house/bricks/roughness.jpg",
    "/assets/textures/house/grass/color.jpg",
    "/assets/textures/house/grass/ambientOcclusion.jpg",
    "/assets/textures/house/grass/normal.jpg",
    "/assets/textures/house/grass/roughness.jpg"
  ])

  /** 🪴 Grass Repeat */
  useMemo(() => {
    [grassColor, grassAO, grassNormal, grassRough].forEach((t) => {
      t.repeat.set(8, 8)
      t.wrapS = t.wrapT = THREE.RepeatWrapping
    })
  }, [grassColor, grassAO, grassNormal, grassRough])

  /** 💡 GUI for debugging */
  useMemo(() => {
    const gui = new GUI()
    gui.domElement.style.position = "absolute"
    gui.domElement.style.top = "0"
    gui.domElement.style.right = "0"
    return () => gui.destroy()
  }, [])

  /** 👻 Animate ghosts */
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    const g1 = ghost1.current
    const g2 = ghost2.current
    const g3 = ghost3.current
    if (!g1 || !g2 || !g3) return

    g1.position.x = Math.cos(elapsedTime * 0.5) * 4
    g1.position.z = Math.sin(elapsedTime * 0.5) * 4
    g1.position.y = Math.sin(elapsedTime * 3)

    g2.position.x = Math.cos(-elapsedTime * 0.32) * 5
    g2.position.z = Math.sin(-elapsedTime * 0.32) * 5
    g2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    g3.position.x = Math.cos(-elapsedTime * 0.18) * (7 + Math.sin(elapsedTime * 0.32))
    g3.position.z = Math.sin(-elapsedTime * 0.18) * (7 + Math.sin(elapsedTime * 0.5))
    g3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
  })

  /** ⚰️ Graves geometry */
  const graves = useMemo(() => {
    const arr = []
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 4 + Math.random() * 5
      const x = Math.sin(angle) * radius
      const z = Math.cos(angle) * radius
      const rotZ = (Math.random() - 0.5) * 0.4
      const rotY = (Math.random() - 0.5) * 0.4
      arr.push({ x, z, rotZ, rotY })
    }
    return arr
  }, [])

  return (
    <>
      {/* 🌗 Lights */}
      <ambientLight color={"#b9d5ff"} intensity={0.12} />
      <directionalLight
        color={"#b9d5ff"}
        intensity={0.12}
        position={[4, 5, -2]}
        castShadow
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
      />
      <pointLight color={"#ff7d46"} intensity={1} distance={7} position={[0, 2.2, 2.7]} castShadow />

      {/* 👻 Ghosts */}
      <pointLight ref={ghost1} color={"#f0f"} intensity={2} distance={3} castShadow />
      <pointLight ref={ghost2} color={"#0ff"} intensity={2} distance={3} castShadow />
      <pointLight ref={ghost3} color={"#ff0"} intensity={2} distance={3} castShadow />

      {/* 🏠 House */}
      <group position={[0, 0, 0]}>
        {/* Walls */}
        <mesh
          castShadow
          receiveShadow
          position={[0, 1.25, 0]}
        >
          <boxGeometry args={[4, 2.5, 4]} />
          <meshStandardMaterial
            map={bricksColor}
            aoMap={bricksAO}
            normalMap={bricksNormal}
            roughnessMap={bricksRough}
          />
        </mesh>

        {/* Roof */}
        <mesh position={[0, 3, 0]} rotation={[0, Math.PI * 0.25, 0]}>
          <coneGeometry args={[3.5, 1, 4]} />
          <meshStandardMaterial color={"#b35f45"} />
        </mesh>

        {/* Door */}
        <mesh position={[0, 1, 2.01]}>
          <planeGeometry args={[2.2, 2.2, 100, 100]} />
          <meshStandardMaterial
            map={doorColor}
            alphaMap={doorAlpha}
            transparent
            aoMap={doorAO}
            displacementMap={doorHeight}
            displacementScale={0.1}
            normalMap={doorNormal}
            metalnessMap={doorMetal}
            roughnessMap={doorRough}
          />
        </mesh>

        {/* Bushes */}
        <mesh position={[0.8, 0.2, 2.2]} scale={0.5}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={"#89c854"} />
        </mesh>
        <mesh position={[1.4, 0.1, 2.1]} scale={0.25}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={"#89c854"} />
        </mesh>
        <mesh position={[-0.8, 0.1, 2.2]} scale={0.4}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={"#89c854"} />
        </mesh>
        <mesh position={[-1, 0.05, 2.6]} scale={0.15}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={"#89c854"} />
        </mesh>
      </group>

      {/* ⚰️ Graves */}
      <group>
        {graves.map((g, i) => (
          <mesh
            key={i}
            castShadow
            position={[g.x, 0.3, g.z]}
            rotation={[0, g.rotY, g.rotZ]}
          >
            <boxGeometry args={[0.6, 0.8, 0.2]} />
            <meshStandardMaterial color={"#b2b6b1"} />
          </mesh>
        ))}
      </group>

      {/* 🌿 Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          map={grassColor}
          aoMap={grassAO}
          normalMap={grassNormal}
          roughnessMap={grassRough}
        />
      </mesh>

      <OrbitControls enableDamping />
    </>
  )
}

export default function HauntedHouse() {
  return (
    <Canvas
      shadows
      camera={{ position: [4, 2, 5], fov: 75, near: 0.1, far: 100 }}
      style={{ width: "100%", height: "100%", background: "#262837" }}
    >
      <HauntedHouseScene />
    </Canvas>
  )
}
