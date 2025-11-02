import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stats, useTexture } from '@react-three/drei'
import { useRef, useMemo, useState, useEffect } from 'react'
import { useControls } from 'leva'
import sunTexture from '@/assets/textures/planets/sun.jpg'
import AsteroidBelt from './asteroid'
import SpaceStars from './spaceStars'
import TextSprite from './textSprite'

// 🪐 Planet component
function Planet({ data, onClick, selectedPlanet }) {    
    const planetRef = useRef();
    const textRef = useRef()
    const texture = useTexture(`/assets/textures/planets/${data.name}.jpg`);
    const ringTexture = useTexture("/assets/textures/planets/saturn-ring.png");
    
    // 🪐 Saturn ring setup
    const ringGeometry = useMemo(() => {
        if (data.name !== "saturn") return null;
        
        const g = new THREE.RingGeometry(1.5, 2.5, 64);
        const uv = g.attributes.uv;
        for (let i = 0; i < uv.count; i++) {
            const x = uv.getX(i) - 0.5;
            const y = uv.getY(i) - 0.5;
            const angle = Math.atan2(y, x);
            const radius = Math.sqrt(x * x + y * y);
            uv.setXY(i, (angle + Math.PI) / (2 * Math.PI), radius * 2);
        }
        uv.needsUpdate = true;
        return g;
    }, [data.name]);
    
    useMemo(() => {
        if (data.name !== "saturn" || !ringTexture) return;
        ringTexture.center.set(0.5, 0.5);
        ringTexture.rotation = Math.PI;
        ringTexture.wrapS = THREE.ClampToEdgeWrapping;
        ringTexture.wrapT = THREE.ClampToEdgeWrapping;
        ringTexture.repeat.set(10, 1);
        ringTexture.needsUpdate = true;
    }, [data.name, ringTexture]);

    const { rotateionSpeed } = useControls('Rotation', {
        rotateionSpeed: { value: 30, min: 0, max: 100, step: 5 },
      })
    
    // 🌀 Orbit animation
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const x = Math.cos(t * data.speed * rotateionSpeed) * data.radius
        const z = Math.sin(t * data.speed * rotateionSpeed) * data.radius
        planetRef.current.position.set(x, 0, z)
        
        // planetRef.current.position.x = Math.cos(t * data.speed * 30) * data.radius;
        // planetRef.current.position.z = Math.sin(t * data.speed * 30) * data.radius;

        if (textRef.current) {
            textRef.current.position.set(x, data.size + 0.1, z)
            textRef.current.lookAt(state.camera.position)
        }
    });
    
    // ✅ click handler
    const handleClick = () => {
        if (planetRef.current) onClick(planetRef.current);
    };
    
    // 🧠 check if this planet is selected
    const isSelected = selectedPlanet === planetRef.current;
    
    
    return (
        <group>
            {/* Orbit Line */}
            <mesh rotation-x={Math.PI / 2}>
                <ringGeometry args={[data.radius - 0.02, data.radius + 0.02, 64]} />
                <meshBasicMaterial
                color="white"
                transparent
                opacity={0.2}
                side={THREE.DoubleSide}
                />
            </mesh>

            {/* Planet */}
            <mesh ref={planetRef} onClick={handleClick}>
                <sphereGeometry args={[data.size, 32, 32]} />
                <meshStandardMaterial map={texture} />

                {/* Saturn Ring */}
                {data.name === "saturn" && ringGeometry && (
                    <mesh geometry={ringGeometry} rotation={[Math.PI / 1.8, 0, 0]}>
                    <meshBasicMaterial
                    map={ringTexture}
                    side={THREE.DoubleSide}
                    transparent
                    />
                </mesh>
                )}

                {/* Label only when selected */}
            </mesh>
            {isSelected && (
                <TextSprite
                    ref={textRef}
                    message={data.name.toUpperCase()}
                    position={[0, data.size + 0.5, 0]}
                    fontsize={40}
                    scaleFactor={0.4}
                />
            )}
        </group>
  );
}

// 🎥 Smooth camera follow
function CameraControls({ target }) {
  const controls = useRef()
  const { camera } = useThree()

  const defaultPosition = new THREE.Vector3(1, 8, 8)
  const defaultTarget = new THREE.Vector3(0, 0, 0)
  const sunPosition = new THREE.Vector3(0, 0, ) // 🌞 The Sun is at origin

  const lastTarget = useRef(null)
  const resetting = useRef(false)

  useFrame(() => {
    controls.current?.update()

    if (target && target.isVector3) {

        const planetPos = target.clone();
        const dirFromSun = planetPos.clone().normalize();
        const camPos = planetPos.clone().add(dirFromSun.multiplyScalar(-4)); // stay Sun-side
      // 🪐 When a planet is selected:
      // Move camera to Sun and look toward the planet
      camera.position.lerp(camPos, 0.05)
      controls.current.target.lerp(target, 0.05) // look at the planet
      controls.current.enabled = false
      resetting.current = false
    }

    // 🌀 Smoothly return to default view when target is cleared
    else if (resetting.current) {
      camera.position.lerp(defaultPosition, 0.03)
      controls.current.target.lerp(defaultTarget, 0.03)

      if (
        camera.position.distanceTo(defaultPosition) < 0.1 &&
        controls.current.target.distanceTo(defaultTarget) < 0.1
      ) {
        camera.position.copy(defaultPosition)
        controls.current.target.copy(defaultTarget)
        resetting.current = false
      }
    } else {
      controls.current.enabled = true
    }
  })

  // Detect when we click outside planets
  useEffect(() => {
    if (!target && lastTarget.current !== null) {
      resetting.current = true
    }
    lastTarget.current = target
  }, [target])

  return <OrbitControls ref={controls} enableDamping />
}

// 🌌 Main Scene
function SolarSystemScene({selectedPlanet, setSelectedPlanet}) {
    //   const [selectedPlanet, setSelectedPlanet] = useState()
    
    const planetsData = useMemo(
        () => [
            { name: 'mercury', radius: 4, size: 0.32, speed: 0.04 },
            { name: 'venus', radius: 5, size: 0.55, speed: 0.015 },
            { name: 'earth', radius: 6.5, size: 0.6, speed: 0.01 },
            { name: 'mars', radius: 9, size: 0.23, speed: 0.008 },
            { name: 'jupiter', radius: 17, size: 1.2, speed: 0.002 },
            { name: 'saturn', radius: 20, size: 1.0, speed: 0.0015 },
            { name: 'uranus', radius: 24, size: 0.7, speed: 0.001 },
            { name: 'neptune', radius: 28, size: 0.65, speed: 0.0005 },
        ],
        []
    )
    
    return (
        <>
      {/* Lights */}
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 0, 0]} intensity={100} color="#fff" />
      {/* <directionalLight position={[0, 3, 0]} intensity={0.8} /> */}

      {/* Sun */}
      <mesh>
        <sphereGeometry args={[3, 32, 64]} />
        <meshBasicMaterial map={useTexture(sunTexture)} />
      </mesh>

      {/* Planets */}
      {planetsData.map((data, i) => (
          <Planet 
            key={i} 
            data={data} 
            onClick={(p) => setSelectedPlanet(p)} 
            selectedPlanet={selectedPlanet} 
          />
        ))
      }

      {/* Extras */}
      <AsteroidBelt count={1000} />
      <SpaceStars />

      {/* <Stats /> */}
      <CameraControls target={selectedPlanet ? selectedPlanet.position : null} />
    </>
  )
}

// 🎮 Canvas entry point
export default function App() {
    const [selectedPlanet, setSelectedPlanet] = useState(null)
    return (
        <Canvas
        camera={{ position: [1, 8, 8], fov: 75 }}
        style={{ width: '100%', height: '100%', background: '#000' }}
        onPointerMissed={() => setSelectedPlanet(null)}
        >
            <SolarSystemScene 
                selectedPlanet={selectedPlanet}
                setSelectedPlanet={setSelectedPlanet}
            />
        </Canvas>
    )
}
