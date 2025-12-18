import * as THREE from 'three'
import { BaliMaterials, createIncenseShader } from './materials'

/**
 * Balinese Cultural Elements
 *
 * The spiritual and ceremonial objects that make Bali unique:
 * - Canang Sari (daily offerings)
 * - Penjor (decorated bamboo poles)
 * - Tedung (ceremonial umbrellas)
 * - Incense with smoke
 */

/**
 * Canang Sari - Daily offering basket
 *
 * Small woven palm leaf baskets containing:
 * - Flowers (frangipani, marigold, hibiscus)
 * - Rice
 * - Incense stick
 * - Small crackers/sweets
 */
export function createCanangSari(
  materials: BaliMaterials,
  scale: number = 1,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const canang = new THREE.Group()

  // Woven basket base (square with pinched corners)
  const basketSize = 0.15 * scale
  const basketHeight = 0.03 * scale

  // Base tray
  const baseGeometry = new THREE.BoxGeometry(basketSize, basketHeight, basketSize)
  const base = new THREE.Mesh(baseGeometry, materials.canangBasket)
  base.position.y = basketHeight / 2
  base.receiveShadow = true
  canang.add(base)

  // Raised edges
  const edgeGeometry = new THREE.BoxGeometry(basketSize, basketHeight * 2, basketHeight)

  for (let i = 0; i < 4; i++) {
    const edge = new THREE.Mesh(edgeGeometry, materials.canangBasket)
    const angle = (i * Math.PI) / 2

    if (i % 2 === 0) {
      edge.position.set(0, basketHeight * 1.5, (i === 0 ? 1 : -1) * basketSize / 2)
    } else {
      edge.rotation.y = Math.PI / 2
      edge.position.set((i === 1 ? 1 : -1) * basketSize / 2, basketHeight * 1.5, 0)
    }

    canang.add(edge)
  }

  // Inner palm leaf lining (green)
  const liningGeometry = new THREE.PlaneGeometry(basketSize * 0.9, basketSize * 0.9)
  const liningMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a7a3a,
    roughness: 0.8,
    side: THREE.DoubleSide,
  })
  const lining = new THREE.Mesh(liningGeometry, liningMaterial)
  lining.rotation.x = -Math.PI / 2
  lining.position.y = basketHeight + 0.005
  canang.add(lining)

  // Flowers - arranged in colorful pattern
  const flowerColors = [
    0xffffff,  // White frangipani
    0xff6600,  // Orange marigold
    0xffff00,  // Yellow
    0xff3366,  // Pink
    0xff0000,  // Red hibiscus
  ]

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const radius = basketSize * 0.3

    const flowerGeometry = new THREE.SphereGeometry(0.015 * scale, 6, 6)
    const flowerMaterial = new THREE.MeshBasicMaterial({
      color: flowerColors[i % flowerColors.length],
    })
    const flower = new THREE.Mesh(flowerGeometry, flowerMaterial)
    flower.position.set(
      Math.cos(angle) * radius,
      basketHeight + 0.02 * scale,
      Math.sin(angle) * radius
    )
    flower.scale.y = 0.5
    canang.add(flower)
  }

  // Central yellow rice mound
  const riceGeometry = new THREE.SphereGeometry(0.02 * scale, 8, 8)
  const riceMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffcc,
    roughness: 0.9,
  })
  const rice = new THREE.Mesh(riceGeometry, riceMaterial)
  rice.position.y = basketHeight + 0.02 * scale
  rice.scale.y = 0.6
  canang.add(rice)

  // Incense stick (standing)
  const incenseGeometry = new THREE.CylinderGeometry(
    0.002 * scale,
    0.002 * scale,
    0.08 * scale,
    4
  )
  const incense = new THREE.Mesh(incenseGeometry, materials.incenseStick)
  incense.position.set(
    basketSize * 0.25,
    basketHeight + 0.04 * scale,
    0
  )
  incense.rotation.z = 0.1
  canang.add(incense)

  // Glowing ember tip
  const emberGeometry = new THREE.SphereGeometry(0.004 * scale, 6, 6)
  const ember = new THREE.Mesh(emberGeometry, materials.incenseEmber)
  ember.position.set(
    basketSize * 0.25 + 0.003,
    basketHeight + 0.08 * scale,
    0
  )
  canang.add(ember)

  // Point light for ember glow
  const emberLight = new THREE.PointLight(0xff4400, 0.5, 0.5)
  emberLight.position.copy(ember.position)
  canang.add(emberLight)

  canang.position.copy(position)

  return canang
}

/**
 * Create incense smoke particles
 */
export function createIncenseSmoke(
  timeUniform: { value: number },
  position: THREE.Vector3 = new THREE.Vector3(),
  particleCount: number = 50
): THREE.Points {
  const positions = new Float32Array(particleCount * 3)
  const scales = new Float32Array(particleCount)
  const lifes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3

    // Start near the incense tip
    positions[i3] = (Math.random() - 0.5) * 0.02
    positions[i3 + 1] = 0
    positions[i3 + 2] = (Math.random() - 0.5) * 0.02

    scales[i] = 0.5 + Math.random() * 1
    lifes[i] = Math.random() // Staggered lifecycle
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('aLife', new THREE.BufferAttribute(lifes, 1))

  const material = createIncenseShader(timeUniform)

  const smoke = new THREE.Points(geometry, material)
  smoke.position.copy(position)

  return smoke
}

/**
 * Penjor - Decorated bamboo pole
 *
 * Tall curved bamboo poles decorated with coconut leaves,
 * placed at entrances during Galungan festival
 */
export function createPenjor(
  materials: BaliMaterials,
  height: number = 8,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const penjor = new THREE.Group()

  // Main bamboo pole - curved at top
  const segmentCount = 16
  const segmentHeight = height / segmentCount

  let currentY = 0
  let currentX = 0
  let currentAngle = 0

  for (let i = 0; i < segmentCount; i++) {
    const t = i / segmentCount

    // Taper towards top
    const bottomRadius = 0.06 * (1 - t * 0.5)
    const topRadius = 0.06 * (1 - (t + 1 / segmentCount) * 0.5)

    // Curve increases towards top
    const bendAngle = t > 0.5 ? (t - 0.5) * 2 * Math.PI * 0.4 : 0

    const segmentGeometry = new THREE.CylinderGeometry(
      topRadius,
      bottomRadius,
      segmentHeight,
      6
    )

    const segment = new THREE.Mesh(segmentGeometry, materials.bamboo)
    segment.position.set(currentX, currentY + segmentHeight / 2, 0)
    segment.rotation.z = currentAngle + bendAngle * 0.3

    segment.castShadow = true
    segment.receiveShadow = true
    penjor.add(segment)

    // Update position for next segment
    currentY += segmentHeight * Math.cos(currentAngle + bendAngle * 0.3)
    currentX += segmentHeight * Math.sin(currentAngle + bendAngle * 0.3)
    currentAngle = bendAngle * 0.3
  }

  // Decorative palm leaf curtain (lamak)
  const lamakLength = height * 0.6
  const lamakWidth = 0.4

  // Simplified lamak as layered planes
  for (let layer = 0; layer < 3; layer++) {
    const layerOffset = layer * 0.03

    for (let i = 0; i < 8; i++) {
      const t = i / 8
      const y = height * 0.4 + t * lamakLength * 0.8
      const x = currentX * (y / height) * 0.8 - layerOffset

      const stripWidth = lamakWidth * (1 - t * 0.3)
      const stripHeight = lamakLength * 0.08

      const stripGeometry = new THREE.PlaneGeometry(stripWidth, stripHeight)
      const strip = new THREE.Mesh(stripGeometry, materials.driedPalm)
      strip.position.set(x, y, layerOffset * 2)

      // Hang downward slightly
      strip.rotation.x = 0.2 + t * 0.3

      penjor.add(strip)
    }
  }

  // Decorative ornaments
  // Top ornament (sampian)
  const ornamentGeometry = new THREE.ConeGeometry(0.15, 0.3, 6)
  const ornament = new THREE.Mesh(ornamentGeometry, materials.driedPalm)
  ornament.position.set(
    currentX + 0.1,
    height * 0.95,
    0
  )
  ornament.rotation.z = Math.PI / 4
  penjor.add(ornament)

  // Hanging coconut decoration
  const coconutGeometry = new THREE.SphereGeometry(0.12, 8, 8)
  const coconutMaterial = new THREE.MeshStandardMaterial({
    color: 0x5a4a2a,
    roughness: 0.85,
  })
  const coconut = new THREE.Mesh(coconutGeometry, coconutMaterial)
  coconut.position.set(currentX, height * 0.8, 0)
  coconut.scale.y = 1.2
  penjor.add(coconut)

  // Gold tinsel/ribbon decorations
  for (let i = 0; i < 5; i++) {
    const ribbonGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.5, 4)
    const ribbon = new THREE.Mesh(ribbonGeometry, materials.templeGold)
    ribbon.position.set(
      currentX * 0.5,
      height * 0.5 + i * 0.2,
      0.1
    )
    ribbon.rotation.z = Math.PI / 2 + Math.random() * 0.3
    penjor.add(ribbon)
  }

  // Base support
  const baseGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.3, 8)
  const base = new THREE.Mesh(baseGeometry, materials.volcanicStone)
  base.position.y = 0.15
  base.castShadow = true
  base.receiveShadow = true
  penjor.add(base)

  penjor.position.copy(position)

  return penjor
}

/**
 * Tedung - Ceremonial umbrella
 *
 * Three-tiered parasol used in temple ceremonies
 */
export function createTedung(
  materials: BaliMaterials,
  height: number = 3,
  tiers: number = 3,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const tedung = new THREE.Group()

  // Central pole
  const poleGeometry = new THREE.CylinderGeometry(0.03, 0.04, height, 8)
  const poleMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a6a4a,
    roughness: 0.7,
  })
  const pole = new THREE.Mesh(poleGeometry, poleMaterial)
  pole.position.y = height / 2
  pole.castShadow = true
  tedung.add(pole)

  // Umbrella tiers
  for (let i = 0; i < tiers; i++) {
    const tierY = height * (0.5 + i * 0.2)
    const tierRadius = 0.6 - i * 0.15

    // Create conical umbrella canopy
    const canopyGeometry = new THREE.ConeGeometry(tierRadius, 0.15, 16, 1, true)

    // Alternating red and gold tiers
    const canopyMaterial = i % 2 === 0 ? materials.tedungRed : materials.tedungGold
    const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial)
    canopy.position.y = tierY
    canopy.rotation.x = Math.PI
    canopy.castShadow = true
    tedung.add(canopy)

    // Fringe decoration
    const fringeCount = 24
    for (let j = 0; j < fringeCount; j++) {
      const angle = (j / fringeCount) * Math.PI * 2
      const fringeGeometry = new THREE.CylinderGeometry(0.005, 0.002, 0.08, 3)
      const fringe = new THREE.Mesh(fringeGeometry, materials.templeGold)
      fringe.position.set(
        Math.cos(angle) * tierRadius * 0.95,
        tierY - 0.12,
        Math.sin(angle) * tierRadius * 0.95
      )
      tedung.add(fringe)
    }

    // Gold ring at tier junction
    const ringGeometry = new THREE.TorusGeometry(0.04, 0.01, 8, 16)
    const ring = new THREE.Mesh(ringGeometry, materials.templeGold)
    ring.position.y = tierY + 0.05
    ring.rotation.x = Math.PI / 2
    tedung.add(ring)
  }

  // Top finial
  const finialGeometry = new THREE.ConeGeometry(0.05, 0.15, 6)
  const finial = new THREE.Mesh(finialGeometry, materials.templeGold)
  finial.position.y = height * 0.95
  tedung.add(finial)

  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.1, 8)
  const base = new THREE.Mesh(baseGeometry, materials.volcanicStone)
  base.position.y = 0.05
  base.receiveShadow = true
  tedung.add(base)

  tedung.position.copy(position)

  return tedung
}

/**
 * Create a row of offerings placed along a path
 */
export function createOfferingPath(
  materials: BaliMaterials,
  length: number,
  spacing: number = 2,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const path = new THREE.Group()

  const count = Math.floor(length / spacing)

  for (let i = 0; i < count; i++) {
    const offsetX = (Math.random() - 0.5) * 0.5
    const offsetZ = (Math.random() - 0.5) * 0.3

    const canang = createCanangSari(
      materials,
      0.8 + Math.random() * 0.4,
      new THREE.Vector3(
        offsetX,
        0,
        i * spacing + offsetZ
      )
    )
    canang.rotation.y = Math.random() * Math.PI * 2

    path.add(canang)
  }

  path.position.copy(position)

  return path
}

/**
 * Create a festive Galungan scene with penjors
 */
export function createGalunganDecoration(
  materials: BaliMaterials,
  roadLength: number,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const decoration = new THREE.Group()

  // Penjors on both sides of road
  const penjorSpacing = 8
  const count = Math.floor(roadLength / penjorSpacing)

  for (let i = 0; i < count; i++) {
    // Left side penjors
    const leftPenjor = createPenjor(
      materials,
      7 + Math.random() * 2,
      new THREE.Vector3(-3, 0, i * penjorSpacing)
    )
    leftPenjor.rotation.y = Math.PI / 4
    decoration.add(leftPenjor)

    // Right side penjors (mirrored)
    const rightPenjor = createPenjor(
      materials,
      7 + Math.random() * 2,
      new THREE.Vector3(3, 0, i * penjorSpacing)
    )
    rightPenjor.rotation.y = -Math.PI / 4
    rightPenjor.scale.x = -1
    decoration.add(rightPenjor)

    // Offerings at base of some penjors
    if (Math.random() > 0.5) {
      const offering = createCanangSari(
        materials,
        1,
        new THREE.Vector3(-2.5, 0, i * penjorSpacing)
      )
      decoration.add(offering)
    }
  }

  decoration.position.copy(position)

  return decoration
}
