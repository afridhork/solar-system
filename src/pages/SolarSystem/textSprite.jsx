import * as THREE from 'three'
import { useMemo } from 'react'

export default function TextSprite({
  message,
  fontface = 'Arial',
  fontsize = 32,
  borderThickness = 4,
  borderColor = { r: 0, g: 0, b: 0, a: 0 },
  backgroundColor = { r: 0, g: 0, b: 0, a: 0 },
  color = 'white',
  scaleFactor = 0.5,
  ...props
}) {
  const { texture, textWidth } = useMemo(() => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    context.font = `${fontsize}px ${fontface}`
    const metrics = context.measureText(message)
    const textWidth = metrics.width

    // background
    context.fillStyle = `rgba(${backgroundColor.r * 255},${backgroundColor.g * 255},${backgroundColor.b * 255},${backgroundColor.a})`
    context.fillRect(0, 0, textWidth + borderThickness * 2, fontsize + borderThickness * 2)

    // border
    context.strokeStyle = `rgba(${borderColor.r * 255},${borderColor.g * 255},${borderColor.b * 255},${borderColor.a})`
    context.lineWidth = borderThickness
    context.strokeRect(0, 0, textWidth + borderThickness * 2, fontsize + borderThickness * 2)

    // text
    context.fillStyle = color
    context.fillText(message, borderThickness, fontsize + borderThickness / 2)

    // texture
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    return { texture, textWidth }
  }, [message, fontface, fontsize, borderThickness, borderColor, backgroundColor, color])

  const spriteMaterial = useMemo(() => new THREE.SpriteMaterial({ map: texture, transparent: true }), [texture])

  return (
    <sprite
      material={spriteMaterial}
      scale={[textWidth / 10 * scaleFactor, fontsize / 10 * scaleFactor, 1]}
      name={message}
      {...props}
    />
  )
}
