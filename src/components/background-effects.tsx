import {
  AmbientGlowZones,
  GradientBlobs,
  GradientMesh,
  GradientWash,
  NoiseTexture,
  SpotlightCones,
} from '@/components/ui/gradient-background'

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-background">
      <GradientWash />
      <AmbientGlowZones />
      <SpotlightCones />
      <GradientMesh />
      <GradientBlobs />
      <NoiseTexture />
    </div>
  )
}
