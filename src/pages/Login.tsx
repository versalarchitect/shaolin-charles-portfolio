import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Signed in successfully')
      window.location.href = '/'
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

  const handleOAuth = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    })
    if (error) toast.error(error.message)
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

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo size="sm" className="text-foreground" />
              <span className="text-xl font-bold">Charles</span>
            </Link>
          </div>

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
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'signin' && 'Sign in to access your course materials'}
                {mode === 'signup' && 'Get started with the Agentic SaaS Course'}
                {mode === 'forgot' && 'Enter your email and we\'ll send you a reset link'}
              </p>
            </motion.div>

            {/* OAuth buttons */}
            {mode !== 'forgot' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="space-y-3 mb-6"
              >
                <Button
                  variant="outline"
                  className="w-full h-11 font-mono text-sm gap-3"
                  onClick={() => handleOAuth('github')}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11 font-mono text-sm gap-3"
                  onClick={() => handleOAuth('google')}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </Button>
              </motion.div>
            )}

            {/* Divider */}
            {mode !== 'forgot' && (
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-foreground/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-4 text-muted-foreground font-mono">or</span>
                </div>
              </div>
            )}

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

              {mode !== 'forgot' && (
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
                <div className="flex justify-end">
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
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
