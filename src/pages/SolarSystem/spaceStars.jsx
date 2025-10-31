import * as THREE from 'three'
import { useMemo } from 'react'

export default function SpaceStars({ count = 10000, radius = 500, ...props }) {
  const positions = useMemo(() => {
    const vertices = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Random spherical coordinates
      const theta = Math.random() * 2 * Math.PI // horizontal angle
      const phi = Math.acos(2 * Math.random() - 1) // vertical angle

      // Convert spherical to Cartesian
      vertices[i3] = radius * Math.sin(phi) * Math.cos(theta)
      vertices[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      vertices[i3 + 2] = radius * Math.cos(phi)
    }
    return vertices
  }, [count, radius])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  const material = useMemo(() => new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 }), [])

  return <points geometry={geometry} material={material} {...props} />
}
