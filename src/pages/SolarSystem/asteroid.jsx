import * as THREE from 'three'
import { useMemo } from 'react'

export default function AsteroidBelt( {count = 1000, ...props}) {
  // Precompute asteroid data once (so it doesn’t re-randomize on each render)
  const asteroids = useMemo(() => {
    const items = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 9.5 + Math.random() * 3.5 // between 9.5 and 13
      const yOffset = (Math.random() - 0.5) * 0.5
      const rotation = [Math.random(), Math.random(), Math.random()]

      items.push({
        position: [Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius],
        rotation,
      })
    }
    return items
  }, [count])

  const geometry = useMemo(() => new THREE.SphereGeometry(0.07, 6, 6), [])
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x888888 }), [])

  return (
    <group {...props}>
      {asteroids.map((asteroid, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={material}
          position={asteroid.position}
          rotation={asteroid.rotation}
        />
      ))}
    </group>
  )
}
