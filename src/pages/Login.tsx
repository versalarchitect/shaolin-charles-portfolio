import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Link, Navigate } from '@/lib/localized-router'
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
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/course/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'magic'>('signin')

  if (isLoggedIn) return <Navigate to={redirect} replace />

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    })
    if (error) toast.error(error.message)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(t('login.signedIn'))
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
      toast.success(t('login.checkEmail'))
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
      toast.success(t('login.resetLinkSent'))
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
      toast.success(t('login.magicLinkSent'))
    }
  }

  return (
    <>
      <SEO
        title={t('login.meta.title')}
        description={t('login.meta.description')}
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
              {t('login.branding.title')}{' '}
              <span className="text-muted-foreground">{t('login.branding.titleHighlight')}</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t('login.branding.subtitle')}
            </p>
            <div className="flex gap-8 text-sm">
              <div>
                <div className="text-2xl font-bold font-mono">52h</div>
                <div className="text-muted-foreground">{t('login.branding.instruction')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono">51</div>
                <div className="text-muted-foreground">{t('login.branding.lessons')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono">4</div>
                <div className="text-muted-foreground">{t('login.branding.capstones')}</div>
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
              {t('login.backToHome')}
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-2">
                {mode === 'signin' && t('login.welcomeBack')}
                {mode === 'signup' && t('login.createAccount')}
                {mode === 'forgot' && t('login.resetPassword')}
                {mode === 'magic' && t('login.magicLinkTitle')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'signin' && t('login.signinSubtitle')}
                {mode === 'signup' && t('login.signupSubtitle')}
                {mode === 'forgot' && t('login.forgotSubtitle')}
                {mode === 'magic' && t('login.magicSubtitle')}
              </p>
            </motion.div>

            {/* Google OAuth */}
            {(mode === 'signin' || mode === 'signup') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 font-mono gap-3"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {t('login.continueWithGoogle')}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">{t('login.or')}</span>
                  </div>
                </div>
              </motion.div>
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
                    : mode === 'magic'
                      ? handleMagicLink
                      : handleForgotPassword
              }
              className="space-y-4"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t('login.email')}
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
                    {t('login.password')}
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
                    {t('login.useMagicLink')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('login.forgotPassword')}
                  </button>
                </div>
              )}

              <Button type="submit" className="w-full h-11 font-mono" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {mode === 'signin' && t('login.signIn')}
                {mode === 'signup' && t('login.createAccountBtn')}
                {mode === 'forgot' && t('login.sendResetLink')}
                {mode === 'magic' && t('login.sendMagicLink')}
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
                  {t('login.noAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-foreground hover:underline font-medium"
                  >
                    {t('login.signUp')}
                  </button>
                </>
              )}
              {mode === 'signup' && (
                <>
                  {t('login.hasAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-foreground hover:underline font-medium"
                  >
                    {t('login.signIn')}
                  </button>
                </>
              )}
              {mode === 'forgot' && (
                <>
                  {t('login.rememberPassword')}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-foreground hover:underline font-medium"
                  >
                    {t('login.signIn')}
                  </button>
                </>
              )}
              {mode === 'magic' && (
                <>
                  {t('login.preferPassword')}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-foreground hover:underline font-medium"
                  >
                    {t('login.signIn')}
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
