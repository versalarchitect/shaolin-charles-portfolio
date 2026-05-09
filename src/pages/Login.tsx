import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'motion/react'
import { ArrowLeft, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function Login() {
  const { isLoggedIn } = useAuth()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/course/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'magic'>('signin')

  if (isLoggedIn) return <Navigate to={redirect} replace />

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Signed in successfully')
      window.location.href = redirect
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Check your email to confirm your account')
      setMode('signin')
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password reset link sent to your email')
      setMode('signin')
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${redirect}` },
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Magic link sent — check your email')
    }
  }

  return (
    <>
      <SEO
        title="Log In — The Agentic SaaS Course"
        description="Sign in to access your course materials, track your progress, and submit capstones."
        path="/login"
        noindex
      />

      <div className="min-h-screen flex">
        {/* Left panel — branding */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-foreground/[0.03] border-r border-foreground/10 flex-col justify-between p-12">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-foreground/[0.04]"
                style={{
                  width: 200 + i * 80,
                  height: 200 + i * 80,
                  left: `${10 + i * 12}%`,
                  top: `${15 + i * 10}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 6 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          <div className="relative z-10" />

          <div className="relative z-10 max-w-md">
            <h1 className="text-4xl font-bold tracking-tight mb-6 leading-[1.1]">
              The tools change.{' '}
              <span className="text-muted-foreground">The principles don't.</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              52 hours. 4 capstones. 8 principles that outlast the next model release. Sign in to access your course materials and track your progress.
            </p>
            <div className="flex gap-8 text-sm">
              <div>
                <div className="text-2xl font-bold font-mono">52h</div>
                <div className="text-muted-foreground">Instruction</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono">51</div>
                <div className="text-muted-foreground">Lessons</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono">4</div>
                <div className="text-muted-foreground">Capstones</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Charles Jackson. All rights reserved.
          </div>
        </div>

        {/* Right panel — auth form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden mb-8">
              <Link to="/" className="flex items-center gap-2">
                <Logo size="sm" className="text-foreground" />
                <span className="text-lg font-bold">Charles</span>
              </Link>
            </div>

            {/* Back link */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-2">
                {mode === 'signin' && 'Welcome back'}
                {mode === 'signup' && 'Create your account'}
                {mode === 'forgot' && 'Reset your password'}
                {mode === 'magic' && 'Sign in with magic link'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'signin' && 'Sign in to access your course materials'}
                {mode === 'signup' && 'Get started with the Agentic SaaS Course'}
                {mode === 'forgot' && 'Enter your email and we\'ll send you a reset link'}
                {mode === 'magic' && 'Enter your email and we\'ll send you a sign-in link'}
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={
                mode === 'signin'
                  ? handleSignIn
                  : mode === 'signup'
                    ? handleSignUp
                    : mode === 'magic'
                      ? handleMagicLink
                      : handleForgotPassword
              }
              className="space-y-4"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              {mode !== 'forgot' && mode !== 'magic' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signin' && (
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setMode('magic')}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Use magic link instead
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button type="submit" className="w-full h-11 font-mono" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {mode === 'signin' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Send Reset Link'}
                {mode === 'magic' && 'Send Magic Link'}
              </Button>
            </motion.form>

            {/* Toggle mode */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-center text-sm text-muted-foreground"
            >
              {mode === 'signin' && (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-foreground hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </>
              )}
              {mode === 'signup' && (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-foreground hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
              {mode === 'forgot' && (
                <>
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-foreground hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
              {mode === 'magic' && (
                <>
                  Prefer to use a password?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-foreground hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
