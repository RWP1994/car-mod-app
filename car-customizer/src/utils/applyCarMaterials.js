import * as THREE from 'three'
import { proOverrides } from './proOverrides'

const finishPresets = {
  glossy: { metalness: 0.6, roughness: 0.3 },
  matte: { metalness: 0.1, roughness: 0.8 },
  chrome: { metalness: 1.0, roughness: 0.05 },
}

/**
 * Applies materials to the car scene based on proMaterialOverrides.
 * This is now used for both Simple and Pro Mode, with overrides always required.
 */
export function applyCarMaterials(scene, {
  proMaterialOverrides = {},
}) {
  scene.traverse((child) => {
    if (!child.isMesh) return

    const name = child.name

    // Match override from either active overrides or defaults
    const override = proMaterialOverrides[name]
    const base = proOverrides[name]

    if (override || base) {
      const color = override?.color || base?.defaultColor || '#ffffff'
      const finish = override?.finish || base?.finish || 'glossy'
      const { metalness, roughness } = finishPresets[finish] || finishPresets.glossy

      child.material = new THREE.MeshStandardMaterial({
        color,
        metalness,
        roughness,
      })

      child.material.needsUpdate = true
    }
  })
}
