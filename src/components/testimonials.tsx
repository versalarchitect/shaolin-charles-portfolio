import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Quote, Star } from 'lucide-react'
import { Card } from './ui/card'
import { useRef, useState, type MouseEvent } from 'react'

interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  avatar?: string
  rating: number
}

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function Testimonials() {
  const { t } = useTranslation()

  const testimonialItems = t('home.testimonials.items', { returnObjects: true }) as Array<{
    quote: string
    author: string
    role: string
    company: string
  }>

  const testimonials: Testimonial[] = testimonialItems.map((item) => ({
    ...item,
    rating: 5,
  }))

  return (
    <motion.div
      className="grid md:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {testimonials.map((testimonial, index) => (
        <motion.div key={index} variants={itemVariants}>
          <TestimonialCard testimonial={testimonial} index={index} />
        </motion.div>
      ))}
    </motion.div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial; index: number }) {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReducedMotion) return
    const rect = ref.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Generate initials for avatar
  const initials = testimonial.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Card className="relative h-full p-6 bg-card border-border hover:border-foreground/20 transition-all duration-300 group cursor-default overflow-hidden">
        {/* Spotlight effect */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute pointer-events-none -inset-px rounded-[inherit]"
            style={{
              background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 60%)`,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {/* Quote icon with gradient */}
          <div className="relative mb-4">
            <Quote className="w-10 h-10 text-foreground/5 absolute -top-1 -left-1" />
            <Quote className="w-8 h-8 text-foreground/10 group-hover:text-foreground/20 transition-colors" />
          </div>

          {/* Rating stars */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Star className="w-4 h-4 fill-yellow-500/80 text-yellow-500/80" />
              </motion.div>
            ))}
          </div>

          {/* Quote text */}
          <blockquote className="text-sm text-muted-foreground leading-relaxed mb-6 group-hover:text-muted-foreground/90 transition-colors">
            "{testimonial.quote}"
          </blockquote>

          {/* Author section */}
          <div className="border-t border-border pt-4 flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center border border-foreground/10 group-hover:border-foreground/20 transition-colors">
              <span className="text-xs font-bold text-foreground/60 group-hover:text-foreground/80 transition-colors">
                {initials}
              </span>
            </div>

            <div className="flex-1">
              <div className="font-medium text-foreground text-sm">{testimonial.author}</div>
              <div className="text-xs text-muted-foreground">
                {testimonial.role} {t('home.testimonials.at')} {testimonial.company}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Marquee variant for continuous scrolling
export function TestimonialMarquee() {
  const { t } = useTranslation()
  const prefersReducedMotion = useReducedMotion()

  const testimonialItems = t('home.testimonials.items', { returnObjects: true }) as Array<{
    quote: string
    author: string
    role: string
    company: string
  }>

  const testimonials: Testimonial[] = testimonialItems.map((item) => ({
    ...item,
    rating: 5,
  }))

  const duplicatedTestimonials = [...testimonials, ...testimonials]

  if (prefersReducedMotion) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} index={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden py-4">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

      <motion.div
        className="flex gap-6"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div key={index} className="flex-shrink-0 w-[380px]">
            <Card className="p-6 bg-card border-border h-full hover:border-foreground/20 transition-colors">
              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-500/80 text-yellow-500/80" />
                ))}
              </div>

              <blockquote className="text-sm text-muted-foreground leading-relaxed mb-4">
                "{testimonial.quote}"
              </blockquote>

              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                  <span className="text-xs font-bold text-foreground/60">
                    {testimonial.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="font-medium text-foreground">{testimonial.author}</span>
                  <span className="text-muted-foreground"> · {testimonial.company}</span>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
