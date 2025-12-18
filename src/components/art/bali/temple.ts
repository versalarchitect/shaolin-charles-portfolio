import * as THREE from 'three'
import { BaliMaterials } from './materials'

/**
 * Balinese Temple Architecture
 *
 * Implements the iconic temple structures:
 * - Candi Bentar (Split Gate) - The V-shaped entrance gate
 * - Meru Tower - Multi-tiered shrine towers
 * - Temple Base Platform
 * - Guardian Statues
 */

/**
 * Candi Bentar - The iconic split gate of Balinese temples
 *
 * Represents a mountain split in two, symbolizing the duality
 * of good and evil, the path between which leads to enlightenment
 */
export function createCandiBentar(
  materials: BaliMaterials,
  height: number = 8,
  gateWidth: number = 3,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const gate = new THREE.Group()

  // Each half of the split gate
  const createGateHalf = (side: 1 | -1): THREE.Group => {
    const half = new THREE.Group()

    // Base platform with decorative steps
    const baseWidth = 2.8
    const baseDepth = 2.8
    const baseHeight = 0.8
    const baseGeometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth)
    const base = new THREE.Mesh(baseGeometry, materials.templeStone)
    base.position.y = baseHeight / 2
    base.castShadow = true
    base.receiveShadow = true
    half.add(base)

    // Decorative base relief panels
    for (let i = 0; i < 2; i++) {
      const reliefGeometry = new THREE.BoxGeometry(baseWidth * 0.35, baseHeight * 0.6, 0.08)
      const relief = new THREE.Mesh(reliefGeometry, materials.mossStone)
      relief.position.set(
        (i - 0.5) * baseWidth * 0.45,
        baseHeight * 0.5,
        baseDepth / 2 + 0.04
      )
      half.add(relief)
    }

    // Stepped platform levels with moldings
    for (let i = 0; i < 4; i++) {
      const stepWidth = baseWidth - i * 0.25
      const stepDepth = baseDepth - i * 0.25
      const stepHeight = 0.2
      const stepGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth)
      const step = new THREE.Mesh(stepGeometry, materials.templeStone)
      step.position.y = baseHeight + i * stepHeight + stepHeight / 2
      step.castShadow = true
      step.receiveShadow = true
      half.add(step)

      // Gold trim on each step
      if (i % 2 === 0) {
        const trimGeometry = new THREE.BoxGeometry(stepWidth + 0.05, 0.03, stepDepth + 0.05)
        const trim = new THREE.Mesh(trimGeometry, materials.templeGold)
        trim.position.y = baseHeight + (i + 1) * stepHeight
        half.add(trim)
      }
    }

    const startY = baseHeight + 0.8

    // Main tower body - tapered shape with more detail
    const towerSegments = 6
    const segmentHeight = (height - startY) / towerSegments

    for (let i = 0; i < towerSegments; i++) {
      const taper = 1 - i * 0.1
      const segWidth = 2.0 * taper
      const segDepth = 2.0 * taper

      // Main segment
      const segGeometry = new THREE.BoxGeometry(segWidth, segmentHeight * 0.8, segDepth)
      const segment = new THREE.Mesh(segGeometry, materials.templeStone)
      segment.position.y = startY + i * segmentHeight + segmentHeight * 0.4
      segment.castShadow = true
      segment.receiveShadow = true
      half.add(segment)

      // Carved relief panel on front face
      const reliefGeometry = new THREE.BoxGeometry(segWidth * 0.5, segmentHeight * 0.5, 0.06)
      const relief = new THREE.Mesh(reliefGeometry, materials.mossStone)
      relief.position.set(0, startY + i * segmentHeight + segmentHeight * 0.4, segDepth / 2 + 0.03)
      half.add(relief)

      // Decorative molding between segments
      const moldingGeometry = new THREE.BoxGeometry(
        segWidth + 0.15,
        segmentHeight * 0.12,
        segDepth + 0.15
      )
      const molding = new THREE.Mesh(moldingGeometry, materials.templeGold)
      molding.position.y = startY + (i + 1) * segmentHeight - segmentHeight * 0.1
      half.add(molding)

      // Corner pillars on lower segments
      if (i < 3) {
        const pillarRadius = 0.06
        const pillarHeight = segmentHeight * 0.75
        const pillarGeometry = new THREE.CylinderGeometry(pillarRadius, pillarRadius * 1.2, pillarHeight, 6)
        const corners = [
          [segWidth / 2 - 0.1, segDepth / 2 - 0.1],
          [-segWidth / 2 + 0.1, segDepth / 2 - 0.1],
        ]
        corners.forEach(([cx, cz]) => {
          const pillar = new THREE.Mesh(pillarGeometry, materials.templeGold)
          pillar.position.set(cx, startY + i * segmentHeight + pillarHeight / 2 + 0.05, cz)
          half.add(pillar)
        })
      }

      // Decorative niches with small statues
      if (i < towerSegments - 2 && i > 0) {
        const nicheWidth = segWidth * 0.35
        const nicheHeight = segmentHeight * 0.55
        const nicheGeometry = new THREE.BoxGeometry(nicheWidth, nicheHeight, 0.2)
        const niche = new THREE.Mesh(nicheGeometry, materials.volcanicStone)
        niche.position.set(
          side * -segWidth * 0.15,
          startY + i * segmentHeight + segmentHeight * 0.45,
          segDepth / 2 - 0.05
        )
        half.add(niche)

        // Mini statue in niche
        const statueGeometry = new THREE.ConeGeometry(nicheWidth * 0.25, nicheHeight * 0.6, 6)
        const statue = new THREE.Mesh(statueGeometry, materials.templeGold)
        statue.position.set(
          side * -segWidth * 0.15,
          startY + i * segmentHeight + segmentHeight * 0.4,
          segDepth / 2 + 0.02
        )
        half.add(statue)
      }
    }

    // Crown/finial at top - more elaborate
    const crownBase = new THREE.CylinderGeometry(0.5, 0.6, 0.3, 8)
    const crownBaseMesh = new THREE.Mesh(crownBase, materials.templeGold)
    crownBaseMesh.position.y = height + 0.15
    half.add(crownBaseMesh)

    const crownGeometry = new THREE.ConeGeometry(0.35, 1.4, 8)
    const crown = new THREE.Mesh(crownGeometry, materials.templeGold)
    crown.position.y = height + 1
    half.add(crown)

    // Ornamental orb at very top
    const orbGeometry = new THREE.SphereGeometry(0.12, 8, 8)
    const orb = new THREE.Mesh(orbGeometry, materials.templeGold)
    orb.position.y = height + 1.8
    half.add(orb)

    // Carved details - side wing projections
    for (let i = 0; i < 4; i++) {
      const projY = startY + 1.2 + i * 1.5
      const projWidth = 0.5 - i * 0.08
      const projHeight = 0.4 - i * 0.05

      // Main projection
      const projGeometry = new THREE.BoxGeometry(projWidth, projHeight, 0.9)
      const proj = new THREE.Mesh(projGeometry, materials.templeStone)
      proj.position.set(side * 1.2, projY, 0)
      proj.castShadow = true
      half.add(proj)

      // Decorative end piece
      const endGeometry = new THREE.ConeGeometry(0.1, 0.2, 6)
      const end = new THREE.Mesh(endGeometry, materials.templeGold)
      end.position.set(side * 1.4, projY, 0)
      end.rotation.z = side * -Math.PI / 2
      half.add(end)
    }

    // Position half to one side
    half.position.x = side * (gateWidth / 2 + 1.4)

    return half
  }

  // Create both halves
  gate.add(createGateHalf(-1))
  gate.add(createGateHalf(1))

  // Ground pathway between gate halves
  const pathGeometry = new THREE.BoxGeometry(gateWidth + 2, 0.1, 4)
  const path = new THREE.Mesh(pathGeometry, materials.volcanicStone)
  path.position.y = 0.05
  path.receiveShadow = true
  gate.add(path)

  // Steps leading up to gate
  for (let i = 0; i < 3; i++) {
    const stepGeometry = new THREE.BoxGeometry(gateWidth + 2 + i * 0.5, 0.15, 0.4)
    const step = new THREE.Mesh(stepGeometry, materials.templeStone)
    step.position.set(0, 0.075 - i * 0.15, 2.2 + i * 0.4)
    step.receiveShadow = true
    gate.add(step)
  }

  gate.position.copy(position)

  return gate
}

/**
 * Meru Tower - Multi-tiered shrine
 *
 * The iconic tiered towers (usually 3, 5, 7, 9, or 11 tiers)
 * representing Mount Meru, the cosmic mountain
 */
export function createMeruTower(
  materials: BaliMaterials,
  tiers: number = 5, // Must be odd number
  baseSize: number = 3,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const tower = new THREE.Group()

  // Ensure odd number of tiers (traditional)
  const actualTiers = tiers % 2 === 0 ? tiers + 1 : tiers

  // Stone base platform
  const baseHeight = 1.2
  const baseGeometry = new THREE.BoxGeometry(baseSize * 1.5, baseHeight, baseSize * 1.5)
  const base = new THREE.Mesh(baseGeometry, materials.templeStone)
  base.position.y = baseHeight / 2
  base.castShadow = true
  base.receiveShadow = true
  tower.add(base)

  // Decorated base molding
  const moldingGeometry = new THREE.BoxGeometry(baseSize * 1.6, 0.15, baseSize * 1.6)
  const baseMolding = new THREE.Mesh(moldingGeometry, materials.templeGold)
  baseMolding.position.y = baseHeight + 0.075
  tower.add(baseMolding)

  // Inner shrine chamber
  const shrineHeight = 1.8
  const shrineGeometry = new THREE.BoxGeometry(baseSize, shrineHeight, baseSize)
  const shrine = new THREE.Mesh(shrineGeometry, materials.templeStone)
  shrine.position.y = baseHeight + shrineHeight / 2
  shrine.castShadow = true
  shrine.receiveShadow = true
  tower.add(shrine)

  // Door opening (visual only)
  const doorGeometry = new THREE.BoxGeometry(baseSize * 0.4, shrineHeight * 0.7, 0.15)
  const door = new THREE.Mesh(doorGeometry, materials.volcanicStone)
  door.position.set(0, baseHeight + shrineHeight * 0.4, baseSize / 2 + 0.05)
  tower.add(door)

  // Gold door frame
  const frameThickness = 0.08
  const frameGeometry = new THREE.BoxGeometry(
    baseSize * 0.5,
    shrineHeight * 0.75,
    0.1
  )
  const doorFrame = new THREE.Mesh(frameGeometry, materials.templeGold)
  doorFrame.position.set(0, baseHeight + shrineHeight * 0.42, baseSize / 2 + 0.1)
  tower.add(doorFrame)

  let currentY = baseHeight + shrineHeight
  let currentSize = baseSize

  // Create thatched roof tiers
  for (let tier = 0; tier < actualTiers; tier++) {
    // Scale decreases with each tier
    const tierScale = 1 - tier * (0.6 / actualTiers)
    currentSize = baseSize * tierScale

    // Roof tier height decreases
    const tierHeight = 0.8 - tier * 0.04

    // Create roof with curved eaves (ijuk/palm fiber style)
    const roofGroup = new THREE.Group()

    // Main roof shape - curved downward at edges
    const roofShape = new THREE.Shape()
    const roofWidth = currentSize * 1.4
    const roofOverhang = 0.4

    // Create curved profile
    roofShape.moveTo(-roofWidth / 2 - roofOverhang, 0)
    roofShape.quadraticCurveTo(-roofWidth / 2, tierHeight, 0, tierHeight)
    roofShape.quadraticCurveTo(roofWidth / 2, tierHeight, roofWidth / 2 + roofOverhang, 0)
    roofShape.lineTo(roofWidth / 2, 0)
    roofShape.lineTo(-roofWidth / 2, 0)
    roofShape.closePath()

    const roofExtrudeSettings = {
      depth: roofWidth * 1.1,
      bevelEnabled: false,
    }

    const roofGeometry = new THREE.ExtrudeGeometry(roofShape, roofExtrudeSettings)
    roofGeometry.center()
    roofGeometry.rotateY(Math.PI / 2)

    const roof = new THREE.Mesh(roofGeometry, materials.thatch)
    roof.castShadow = true
    roof.receiveShadow = true
    roofGroup.add(roof)

    // Gold edge trim
    const trimWidth = 0.05
    const trimGeometry = new THREE.BoxGeometry(roofWidth * 1.2, trimWidth, trimWidth)

    // Front and back trim
    const frontTrim = new THREE.Mesh(trimGeometry, materials.templeGold)
    frontTrim.position.set(0, tierHeight * 0.1, roofWidth * 0.55)
    roofGroup.add(frontTrim)

    const backTrim = frontTrim.clone()
    backTrim.position.z = -roofWidth * 0.55
    roofGroup.add(backTrim)

    roofGroup.position.y = currentY + tierHeight / 2

    tower.add(roofGroup)

    currentY += tierHeight + 0.1

    // Small pillar between tiers (except last)
    if (tier < actualTiers - 1) {
      const pillarHeight = 0.3
      const pillarGeometry = new THREE.CylinderGeometry(0.08, 0.1, pillarHeight, 8)
      const pillar = new THREE.Mesh(pillarGeometry, materials.templeGold)
      pillar.position.y = currentY + pillarHeight / 2
      tower.add(pillar)

      currentY += pillarHeight
    }
  }

  // Final spire/finial
  const spireGeometry = new THREE.ConeGeometry(0.15, 0.8, 8)
  const spire = new THREE.Mesh(spireGeometry, materials.templeGold)
  spire.position.y = currentY + 0.4
  tower.add(spire)

  // Top ornament
  const ornamentGeometry = new THREE.SphereGeometry(0.08, 8, 8)
  const ornament = new THREE.Mesh(ornamentGeometry, materials.templeGold)
  ornament.position.y = currentY + 0.85
  tower.add(ornament)

  tower.position.copy(position)

  return tower
}

/**
 * Guardian Statue (Dwarapala)
 *
 * Fierce guardian figures that protect temple entrances
 */
export function createGuardianStatue(
  materials: BaliMaterials,
  height: number = 2,
  position: THREE.Vector3 = new THREE.Vector3(),
  facingRight: boolean = true
): THREE.Group {
  const statue = new THREE.Group()

  // Base pedestal
  const pedestalGeometry = new THREE.BoxGeometry(1, 0.5, 1)
  const pedestal = new THREE.Mesh(pedestalGeometry, materials.templeStone)
  pedestal.position.y = 0.25
  pedestal.castShadow = true
  pedestal.receiveShadow = true
  statue.add(pedestal)

  // Seated body (simplified)
  const bodyGeometry = new THREE.BoxGeometry(0.8, height * 0.5, 0.6)
  const body = new THREE.Mesh(bodyGeometry, materials.mossStone)
  body.position.y = 0.5 + height * 0.25
  body.castShadow = true
  body.receiveShadow = true
  statue.add(body)

  // Torso
  const torsoGeometry = new THREE.BoxGeometry(0.9, height * 0.3, 0.5)
  const torso = new THREE.Mesh(torsoGeometry, materials.mossStone)
  torso.position.y = 0.5 + height * 0.6
  torso.castShadow = true
  statue.add(torso)

  // Head
  const headGeometry = new THREE.BoxGeometry(0.5, height * 0.25, 0.4)
  const head = new THREE.Mesh(headGeometry, materials.mossStone)
  head.position.y = 0.5 + height * 0.85
  head.castShadow = true
  statue.add(head)

  // Crown/headdress
  const crownGeometry = new THREE.ConeGeometry(0.35, 0.4, 8)
  const crown = new THREE.Mesh(crownGeometry, materials.templeGold)
  crown.position.y = 0.5 + height + 0.1
  statue.add(crown)

  // Arms (holding club/mace)
  const armGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.6, 8)

  const leftArm = new THREE.Mesh(armGeometry, materials.mossStone)
  leftArm.position.set(-0.5, 0.5 + height * 0.55, 0)
  leftArm.rotation.z = Math.PI / 4
  statue.add(leftArm)

  const rightArm = new THREE.Mesh(armGeometry, materials.mossStone)
  rightArm.position.set(0.5, 0.5 + height * 0.55, 0)
  rightArm.rotation.z = -Math.PI / 4
  statue.add(rightArm)

  // Club/mace
  const clubGeometry = new THREE.CylinderGeometry(0.08, 0.06, 1, 6)
  const club = new THREE.Mesh(clubGeometry, materials.templeStone)
  club.position.set(facingRight ? 0.65 : -0.65, 0.5 + height * 0.4, 0.3)
  club.rotation.z = facingRight ? -Math.PI / 6 : Math.PI / 6
  statue.add(club)

  // Rotate to face direction
  statue.rotation.y = facingRight ? -Math.PI / 6 : Math.PI / 6

  statue.position.copy(position)

  return statue
}

/**
 * Temple Compound - Complete temple complex
 */
export function createTempleCompound(
  materials: BaliMaterials,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const compound = new THREE.Group()

  // Main entrance gate
  const mainGate = createCandiBentar(materials, 10, 4, new THREE.Vector3(0, 0, 15))
  compound.add(mainGate)

  // Guardian statues flanking gate
  const leftGuardian = createGuardianStatue(
    materials,
    2.5,
    new THREE.Vector3(-5, 0, 12),
    true
  )
  compound.add(leftGuardian)

  const rightGuardian = createGuardianStatue(
    materials,
    2.5,
    new THREE.Vector3(5, 0, 12),
    false
  )
  compound.add(rightGuardian)

  // Main Meru tower (center, tallest)
  const mainMeru = createMeruTower(
    materials,
    11,
    4,
    new THREE.Vector3(0, 0, -5)
  )
  compound.add(mainMeru)

  // Secondary Meru towers
  const leftMeru = createMeruTower(
    materials,
    7,
    3,
    new THREE.Vector3(-8, 0, -3)
  )
  compound.add(leftMeru)

  const rightMeru = createMeruTower(
    materials,
    7,
    3,
    new THREE.Vector3(8, 0, -3)
  )
  compound.add(rightMeru)

  // Smaller shrines
  const smallMeru1 = createMeruTower(
    materials,
    5,
    2,
    new THREE.Vector3(-12, 0, 0)
  )
  compound.add(smallMeru1)

  const smallMeru2 = createMeruTower(
    materials,
    5,
    2,
    new THREE.Vector3(12, 0, 0)
  )
  compound.add(smallMeru2)

  // Temple platform/courtyard
  const courtyardGeometry = new THREE.BoxGeometry(35, 0.3, 40)
  const courtyard = new THREE.Mesh(courtyardGeometry, materials.volcanicStone)
  courtyard.position.y = -0.15
  courtyard.receiveShadow = true
  compound.add(courtyard)

  // Stone pathway
  const pathGeometry = new THREE.BoxGeometry(4, 0.05, 20)
  const path = new THREE.Mesh(pathGeometry, materials.templeStone)
  path.position.set(0, 0.02, 5)
  path.receiveShadow = true
  compound.add(path)

  compound.position.copy(position)

  return compound
}
