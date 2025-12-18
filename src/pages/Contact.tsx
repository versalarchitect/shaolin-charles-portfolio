import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/SEO'
import { Github, Mail, Send, Loader2, Clock, ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { motion, useReducedMotion } from 'framer-motion'
import { toast } from 'sonner'
import {
  BlurFadeIn,
  ScrollFadeIn,
  Magnetic,
  HoverCard3D,
  RevealOnScroll,
  TypingEffect,
  GlitchText,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'


export default function Contact() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const prefersReducedMotion = useReducedMotion()

  // Contact methods data with translations
  const contactMethods = [
    {
      icon: Mail,
      title: t('contact.direct.email.title'),
      desc: t('contact.direct.email.description'),
      link: 'mailto:hello@charlesjackson.dev',
      handle: 'hello@charlesjackson.dev',
      external: false,
    },
    {
      icon: Github,
      title: t('contact.direct.github.title'),
      desc: t('contact.direct.github.description'),
      link: 'https://github.com/versalarchitect',
      handle: 'github.com/versalarchitect',
      external: true,
    },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t('contact.form.validation.nameRequired')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contact.form.validation.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.form.validation.emailInvalid')
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('contact.form.validation.subjectRequired')
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact.form.validation.messageRequired')
    } else if (formData.message.length < 10) {
      newErrors.message = t('contact.form.validation.messageTooShort')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error(t('contact.form.validation.fixErrors'))
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Success
    toast.success(t('contact.form.success.title'), {
      description: t('contact.form.success.description'),
    })

    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' })
    setErrors({})
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <>
      <SEO
        title={t('contact.meta.title')}
        description={t('contact.meta.description')}
        path="/contact"
        image="/og-contact.png"
        imageAlt="Contact Charles Jackson - Available for projects and consulting worldwide"
        keywords="contact charles jackson, hire full stack developer, consulting, freelance developer montreal, software development services"
      />

      {/* Hero Section */}
      <Section id="contact-hero" className="relative min-h-[50vh] flex items-center overflow-hidden">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <BlurFadeIn delay={0} immediate>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-full mb-8">
                <motion.div
                  animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <span className="text-xs font-mono text-foreground/60">{t('contact.hero.badge')}</span>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1} immediate>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                {t('contact.hero.title')}{' '}
                <GlitchText intensity={1.5}>{t('contact.hero.titleHighlight')}</GlitchText>
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                <TypingEffect
                  text={t('contact.hero.subtitle')}
                  speed={20}
                  delay={800}
                  cursor={false}
                />
              </p>
            </BlurFadeIn>
          </div>
        </div>
      </Section>

      {/* Quick Info Bar */}
      <Section id="contact-info" className="py-8 border-y border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{t('contact.info.responseTime')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{t('contact.info.availability')}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Main Content */}
      <Section id="contact-main" className="py-16 lg:py-24 relative overflow-hidden">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">
            {/* Contact Form */}
            <RevealOnScroll direction="left">
              <HoverCard3D
                className="rounded-xl"
                glowColor="rgba(255, 255, 255, 0.1)"
                depth={30}
              >
                <Card className="border-foreground/10">
                  <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">{t('contact.form.title')}</h2>
                      <p className="text-sm text-muted-foreground">
                        {t('contact.form.subtitle')}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                          {t('contact.form.name')}
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t('contact.form.namePlaceholder')}
                          className={`bg-background ${errors.name ? 'border-red-500' : 'border-foreground/10'}`}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                          {t('contact.form.email')}
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t('contact.form.emailPlaceholder')}
                          className={`bg-background ${errors.email ? 'border-red-500' : 'border-foreground/10'}`}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                        {t('contact.form.subject')}
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder={t('contact.form.subjectPlaceholder')}
                        className={`bg-background ${errors.subject ? 'border-red-500' : 'border-foreground/10'}`}
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-500">{errors.subject}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                        {t('contact.form.message')}
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t('contact.form.messagePlaceholder')}
                        rows={5}
                        className={`bg-background resize-none ${errors.message ? 'border-red-500' : 'border-foreground/10'}`}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-500">{errors.message}</p>
                      )}
                    </div>

                    <Magnetic strength={0.1}>
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full font-mono gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t('contact.form.sending')}
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            {t('contact.form.send')}
                          </>
                        )}
                      </Button>
                    </Magnetic>
                  </form>
                </Card>
              </HoverCard3D>
            </RevealOnScroll>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Direct contact */}
              <RevealOnScroll direction="right">
                <h2 className="text-2xl font-bold mb-6">{t('contact.direct.title')}</h2>

                <div className="space-y-4">
                  {contactMethods.map(({ icon: Icon, title, desc, link, handle, external }, index) => (
                    <motion.div
                      key={title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <a
                        href={link}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="block"
                      >
                        <HoverCard3D
                          className="rounded-lg"
                          glowColor="rgba(255, 255, 255, 0.08)"
                          depth={20}
                        >
                          <Card className="p-5 bg-background border-foreground/10 hover:border-foreground/20 transition-all group cursor-pointer">
                            <div className="flex items-start gap-4">
                              <motion.div
                                whileHover={{ rotate: 12, scale: 1.1 }}
                                className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors"
                              >
                                <Icon className="h-5 w-5 text-foreground/60 group-hover:text-foreground/80 transition-colors" />
                              </motion.div>
                              <div className="flex-1">
                                <h3 className="font-bold mb-1">{title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{desc}</p>
                                <p className="text-sm font-mono text-foreground/60 group-hover:text-foreground transition-colors">
                                  {handle}
                                </p>
                              </div>
                              <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                          </Card>
                        </HoverCard3D>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </RevealOnScroll>

              {/* Availability Card */}
              <RevealOnScroll direction="up">
                <HoverCard3D
                  className="rounded-lg"
                  glowColor="rgba(34, 197, 94, 0.1)"
                  depth={15}
                >
                  <Card className="p-6 bg-foreground/5 border-foreground/10">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 animate-pulse" />
                      <div>
                        <h3 className="font-bold mb-2">{t('contact.availability.title')}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {t('contact.availability.description')}
                        </p>
                      </div>
                    </div>
                  </Card>
                </HoverCard3D>
              </RevealOnScroll>

              {/* What to expect */}
              <RevealOnScroll direction="up">
                <HoverCard3D
                  className="rounded-lg"
                  glowColor="rgba(255, 255, 255, 0.08)"
                  depth={15}
                >
                  <Card className="p-6 border-foreground/10">
                    <h3 className="font-bold mb-4">{t('contact.expectations.title')}</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {(t('contact.expectations.items', { returnObjects: true }) as string[]).map((item, index) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 mt-2" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </Card>
                </HoverCard3D>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section id="contact-cta" className="py-24 lg:py-32 relative">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              {t('contact.cta.title')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t('contact.cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Magnetic strength={0.15}>
                <Button size="lg" className="font-mono gap-2" asChild>
                  <a href="mailto:hello@charlesjackson.dev">
                    <Mail className="h-4 w-4" />
                    hello@charlesjackson.dev
                  </a>
                </Button>
              </Magnetic>
              <Magnetic strength={0.15}>
                <Button size="lg" variant="outline" className="font-mono" asChild>
                  <Link to="/projects">{t('common.viewMyWork')}</Link>
                </Button>
              </Magnetic>
            </div>

          </ScrollFadeIn>
        </div>
      </Section>
    </>
  )
}
