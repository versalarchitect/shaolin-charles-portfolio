import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { Check, ArrowRight, Mail, BookOpen } from 'lucide-react'
import { BlurFadeIn } from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

export default function EnrollSuccess() {
  return (
    <>
      <SEO
        title="Welcome — You're Enrolled"
        description="Welcome to The Agentic SaaS Course. Your enrollment is confirmed."
        path="/enroll/success"
        noindex
      />

      <Section id="success" className="relative min-h-screen flex items-center overflow-hidden">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <BlurFadeIn delay={0} immediate>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 mb-8"
              >
                <Check className="w-10 h-10 text-green-500" />
              </motion.div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1} immediate>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                You're in.
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Your enrollment in The Agentic SaaS Course is confirmed. Welcome to the journey from zero to directing teams of AI agents.
              </p>
              <p className="text-muted-foreground mb-10">
                Check your email for login credentials and next steps. The Prework module is ready for you.
              </p>
            </BlurFadeIn>

            <BlurFadeIn delay={0.3} immediate>
              <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto mb-10">
                <div className="p-5 rounded-xl border border-foreground/10 bg-foreground/[0.02] text-left">
                  <Mail className="w-5 h-5 text-muted-foreground mb-3" />
                  <h3 className="text-sm font-semibold mb-1">Check Your Email</h3>
                  <p className="text-xs text-muted-foreground">Login credentials and course access link sent to your email.</p>
                </div>
                <div className="p-5 rounded-xl border border-foreground/10 bg-foreground/[0.02] text-left">
                  <BookOpen className="w-5 h-5 text-muted-foreground mb-3" />
                  <h3 className="text-sm font-semibold mb-1">Start Prework</h3>
                  <p className="text-xs text-muted-foreground">Set up your environment, install Claude Code, configure MCP.</p>
                </div>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.4} immediate>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="font-mono group" asChild>
                  <Link to="/course/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="font-mono" asChild>
                  <Link to="/course/community">Join the Community</Link>
                </Button>
              </div>
            </BlurFadeIn>
          </div>
        </div>
      </Section>
    </>
  )
}
