// Local copy for standalone deployment (Vercel can't access monorepo shared libs)
const SIZE_CONFIG = {
  sm: { size: 32, textSize: 'text-lg' },
  md: { size: 40, textSize: 'text-xl' },
  lg: { size: 56, textSize: 'text-2xl' },
}

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  withText?: boolean
  text?: string
}

export function Logo({ size = 'md', className = '', withText = false, text = 'CJ' }: LogoProps) {
  const config = SIZE_CONFIG[size]
  const iconSize = config.size

  // Simple monogram logo for Charles Jackson
  const icon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <rect
        width="40"
        height="40"
        rx="8"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* Border */}
      <rect
        x="0.5"
        y="0.5"
        width="39"
        height="39"
        rx="7.5"
        stroke="currentColor"
        strokeOpacity="0.2"
      />
      {/* CJ monogram */}
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fill="currentColor"
        fontWeight="600"
        fontSize="18"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
      >
        CJ
      </text>
    </svg>
  )

  if (!withText) {
    return icon
  }

  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className={`font-semibold font-mono ${config.textSize}`}>
        {text}
      </span>
    </div>
  )
}
