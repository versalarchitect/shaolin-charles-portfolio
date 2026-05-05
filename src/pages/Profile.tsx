import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Loader2, Save, Settings, User, Lock, Mail, Trash2, Zap, Flame, Trophy, Palette, Share2, Check, Star, SlidersHorizontal, Volume2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { StreakFreezeCard } from '@/components/gamification/streak-freeze-card'
import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppLayout } from '@/components/app-layout'
import { LevelIcon } from '@/components/gamification/shared'
import { ThemeSelector } from '@/components/gamification/theme-selector'
import { ShareButton } from '@/components/gamification/share-button'
import { useProgress, getLevel, getOverallProgress, getStreakMultiplier, setActiveTitle, getActiveTitle } from '@/stores/progress'
import { ACHIEVEMENTS, TITLES, TOTAL_XP } from '@/data/curriculum'
import { getSoundSettings, setSoundEnabled, setSoundVolume, getNotificationSettings, setNotificationSetting, playSound } from '@/lib/sounds'

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <>
      <h3 className="text-sm font-semibold text-foreground/80 mb-1">{title}</h3>
      <p className="text-xs font-mono text-foreground/40 mb-5">{description}</p>
    </>
  )
}

function ProfileSection() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const meta = user?.user_metadata ?? {}
  const [firstName, setFirstName] = useState(meta.first_name ?? '')
  const [lastName, setLastName] = useState(meta.last_name ?? '')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(meta.avatar_url ?? null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const initials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : user?.email?.split('@')[0].slice(0, 2).toUpperCase() ?? '?'
  const displayName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2 MB'); return }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = `${publicUrl}?t=${Date.now()}`
      setAvatarUrl(url)
      await supabase.auth.updateUser({ data: { avatar_url: url } })
      toast.success('Photo updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleRemoveAvatar() {
    if (!user) return
    setUploading(true)
    try {
      const { data: files } = await supabase.storage.from('avatars').list(user.id)
      if (files?.length) {
        await supabase.storage.from('avatars').remove(files.map(f => `${user.id}/${f.name}`))
      }
      await supabase.auth.updateUser({ data: { avatar_url: null } })
      setAvatarUrl(null)
      toast.success('Photo removed')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Remove failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!user) return
    setSaving(true)
    try {
      const dn = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') || undefined
      const { error } = await supabase.auth.updateUser({
        data: { first_name: firstName.trim(), last_name: lastName.trim(), display_name: dn },
      })
      if (error) throw error
      // Also update user_progress.display_name for leaderboard/public profile
      if (dn) {
        await supabase
          .from('user_progress')
          .upsert({ user_id: user.id, display_name: dn }, { onConflict: 'user_id' })
      }
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Avatar card */}
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <SectionHeader title="Photo" description="This will be displayed on your profile and in the community." />
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative group cursor-pointer shrink-0"
            disabled={uploading}
          >
            <Avatar size="lg" className="!size-20">
              {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile photo" />}
              <AvatarFallback className="bg-foreground/10 text-foreground/80 text-xl font-mono font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading
                ? <Loader2 className="w-5 h-5 text-white animate-spin" />
                : <Camera className="w-5 h-5 text-white" />}
            </div>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="font-mono text-xs"
            >
              <Camera className="w-3.5 h-3.5 mr-1.5" />
              Upload photo
            </Button>
            {avatarUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveAvatar}
                disabled={uploading}
                className="font-mono text-xs text-foreground/40 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Remove
              </Button>
            )}
            <p className="text-[10px] font-mono text-foreground/30">JPG, PNG or WebP. Max 2 MB.</p>
          </div>
        </div>
      </div>

      {/* Name card */}
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <SectionHeader title="Personal information" description="Update your name as it appears across the platform." />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-xs font-mono text-foreground/60">First name</Label>
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" maxLength={50} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-xs font-mono text-foreground/60">Last name</Label>
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" maxLength={50} />
          </div>
        </div>

        {displayName && (
          <p className="text-xs font-mono text-foreground/30 mb-2">
            Display name: <span className="text-foreground/50">{displayName}</span>
          </p>
        )}
        <p className="text-[10px] font-mono text-foreground/25 mb-4">
          This name appears on the leaderboard and your public profile.
        </p>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="sm" className="font-mono text-xs">
            {saving
              ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving...</>
              : <><Save className="w-3.5 h-3.5 mr-1.5" /> Save changes</>}
          </Button>
        </div>
      </div>

      {/* Email card (read-only) */}
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <SectionHeader title="Email address" description="Your email is used for sign-in and cannot be changed." />
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06]">
          <Mail className="w-4 h-4 text-foreground/30 shrink-0" />
          <span className="text-sm font-mono text-foreground/60 truncate">{user?.email}</span>
          <Lock className="w-3.5 h-3.5 text-foreground/20 shrink-0 ml-auto" />
        </div>
      </div>
    </div>
  )
}

function FeaturedAchievementPicker({ unlockedAchievements }: { unlockedAchievements: string[] }) {
  const [featuredId, setFeaturedId] = useState<string | null>(() => {
    try { return localStorage.getItem('featured-achievement') } catch { return null }
  })

  function selectFeatured(id: string) {
    const newId = featuredId === id ? null : id
    setFeaturedId(newId)
    try {
      if (newId) {
        localStorage.setItem('featured-achievement', newId)
      } else {
        localStorage.removeItem('featured-achievement')
      }
    } catch {}
    toast.success(newId ? 'Featured achievement updated' : 'Featured achievement cleared')
  }

  const unlocked = ACHIEVEMENTS.filter((a) => unlockedAchievements.includes(a.id))

  return (
    <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
      <SectionHeader title="Featured Achievement" description="Select an achievement to showcase on your public profile." />

      {unlocked.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-8 h-8 mx-auto mb-3 text-foreground/20" />
          <p className="text-sm text-foreground/40">Earn achievements to feature one on your profile</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {unlocked.map((a) => {
            const isSelected = featuredId === a.id
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => selectFeatured(a.id)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-foreground/10 border-foreground/15'
                    : 'bg-foreground/[0.02] border-foreground/[0.08] hover:bg-foreground/[0.05] hover:border-foreground/10'
                }`}
              >
                <span className="text-2xl shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono font-medium text-foreground/80 truncate">{a.name}</p>
                  <p className="text-[10px] font-mono text-foreground/40 truncate">{a.description}</p>
                </div>
                {isSelected && (
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground/15 shrink-0">
                    <Check className="w-3 h-3 text-foreground/80" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TitleSelector({ unlockedTitles, activeTitle }: { unlockedTitles: string[]; activeTitle: string }) {
  function handleSelectTitle(titleId: string) {
    if (!unlockedTitles.includes(titleId)) return
    setActiveTitle(titleId)
    const title = TITLES.find(t => t.id === titleId)
    if (title) toast.success(`Title set to "${title.name}"`)
  }

  return (
    <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
      <SectionHeader title="Title" description="Choose a title to display alongside your name." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TITLES.map((title) => {
          const isUnlocked = unlockedTitles.includes(title.id)
          const isActive = activeTitle === title.id
          return (
            <button
              key={title.id}
              type="button"
              onClick={() => handleSelectTitle(title.id)}
              disabled={!isUnlocked}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-foreground/10 border-foreground/15'
                  : isUnlocked
                    ? 'bg-foreground/[0.02] border-foreground/[0.08] hover:bg-foreground/[0.05] hover:border-foreground/10'
                    : 'bg-foreground/[0.02] border-foreground/[0.06] opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground/[0.05] border border-foreground/[0.08] shrink-0">
                {isUnlocked ? (
                  <Trophy className="w-4 h-4 text-foreground/60" />
                ) : (
                  <Lock className="w-4 h-4 text-foreground/30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-mono font-medium truncate ${isUnlocked ? 'text-foreground/80' : 'text-foreground/40'}`}>
                  {title.name}
                </p>
                <p className="text-[10px] font-mono text-foreground/40 truncate">
                  {isUnlocked ? title.description : title.description}
                </p>
              </div>
              {isActive && (
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground/15 shrink-0">
                  <Check className="w-3 h-3 text-foreground/80" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function GamificationSection() {
  const progress = useProgress()
  const level = getLevel()
  const overall = getOverallProgress()
  const { multiplier, label } = getStreakMultiplier()

  return (
    <div className="space-y-8">
      {/* Level & XP card */}
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <SectionHeader title="Level & Progress" description="Your current rank and XP breakdown." />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {([
            { icon: <LevelIcon levelName={level.name} className="w-6 h-6 mx-auto mb-2 text-foreground/60" />, value: level.name, label: 'Current Rank' },
            { icon: <Zap className="w-6 h-6 mx-auto mb-2 text-foreground/60" />, value: progress.totalXp.toString(), label: `/ ${TOTAL_XP} XP` },
            { icon: <Flame className="w-6 h-6 mx-auto mb-2 text-foreground/60" />, value: progress.currentStreak.toString(), label: 'Day Streak' },
            { icon: <Trophy className="w-6 h-6 mx-auto mb-2 text-foreground/60" />, value: `${overall.percent}%`, label: 'Complete' },
          ] as const).map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06]">
              {stat.icon}
              <p className="text-lg font-bold font-mono">{stat.value}</p>
              <p className="text-[10px] font-mono text-foreground/40">{stat.label}</p>
            </div>
          ))}
        </div>

        {multiplier > 1 && (
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground/[0.04] border border-foreground/[0.08]">
            <Flame className="w-4 h-4 text-foreground/50" />
            <span className="text-xs font-mono text-foreground/60">
              Active streak bonus: <span className="font-semibold text-foreground/80">{label}</span> XP multiplier
            </span>
          </div>
        )}
      </div>

      {/* Records card */}
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <SectionHeader title="Personal Records" description="Your best achievements and all-time stats." />

        <div className="space-y-3">
          {([
            { label: 'Longest Streak', value: `${progress.longestStreak} days` },
            { label: 'Total Lessons Completed', value: overall.completed.toString() },
            { label: 'Achievements Unlocked', value: `${progress.unlockedAchievements.length} / ${ACHIEVEMENTS.length}` },
            { label: 'Active Days', value: progress.streakDates.length.toString() },
            { label: 'Daily XP Goal', value: `${progress.dailyXpGoal} XP` },
          ]).map((r) => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-foreground/[0.05] last:border-b-0">
              <span className="text-sm text-foreground/60">{r.label}</span>
              <span className="text-sm font-mono font-semibold">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges showcase */}
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <SectionHeader title="Badges" description="Earned achievements displayed on your profile." />

        {progress.unlockedAchievements.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-8 h-8 mx-auto mb-3 text-foreground/20" />
            <p className="text-sm text-foreground/40">Complete lessons to earn badges</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {ACHIEVEMENTS.filter((a) => progress.unlockedAchievements.includes(a.id)).map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground/[0.04] border border-foreground/[0.08]"
                title={a.description}
              >
                <span className="text-lg">{a.icon}</span>
                <span className="text-xs font-mono text-foreground/70">{a.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Streak Freeze */}
      <StreakFreezeCard compact />

      {/* Featured Achievement picker */}
      <FeaturedAchievementPicker unlockedAchievements={progress.unlockedAchievements} />

      {/* Title Selector */}
      <TitleSelector unlockedTitles={progress.unlockedTitles} activeTitle={progress.activeTitle} />
    </div>
  )
}

function AppearanceSection() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <SectionHeader title="Cosmetic Themes" description="Unlock and apply visual themes as you progress." />
        <ThemeSelector />
      </div>
    </div>
  )
}

function ShareSection() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <SectionHeader title="Share Your Progress" description="Generate a shareable card or view your public profile." />
        <div className="flex flex-col sm:flex-row gap-3">
          <ShareButton />
          {user && (
            <a
              href={`/profile/${user.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/[0.05] border border-foreground/[0.08] text-sm font-mono text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors"
            >
              <User className="w-4 h-4" />
              View Public Profile
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        enabled ? 'bg-foreground/30' : 'bg-foreground/10'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-background border border-foreground/20 transition-transform ${
          enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  )
}

function PreferencesSection() {
  const [soundEnabled, _setSoundEnabled] = useState(() => getSoundSettings().enabled)
  const [volume, _setVolume] = useState(() => Math.round(getSoundSettings().volume * 100))
  const [notifications, setNotifications] = useState(() => getNotificationSettings())

  function handleSoundToggle() {
    const next = !soundEnabled
    _setSoundEnabled(next)
    setSoundEnabled(next)
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value)
    _setVolume(val)
    setSoundVolume(val / 100)
  }

  function handleTestSound() {
    // Temporarily ensure sound is enabled for the test
    const wasEnabled = getSoundSettings().enabled
    if (!wasEnabled) setSoundEnabled(true)
    playSound('xp')
    if (!wasEnabled) setSoundEnabled(false)
  }

  function handleNotificationToggle(key: keyof typeof notifications) {
    const next = !notifications[key]
    setNotifications((prev) => ({ ...prev, [key]: next }))
    setNotificationSetting(key, next)
  }

  return (
    <div className="space-y-8">
      {/* Sound section */}
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <SectionHeader title="Sound" description="Control audio feedback for interactions and achievements." />

        <div className="space-y-5">
          {/* Sound enabled toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-foreground/50" />
              <div>
                <p className="text-sm font-mono text-foreground/80">Sound Effects</p>
                <p className="text-[10px] font-mono text-foreground/40">Play sounds for XP, achievements, and combos</p>
              </div>
            </div>
            <ToggleSwitch enabled={soundEnabled} onToggle={handleSoundToggle} />
          </div>

          {/* Volume slider - only shown when sounds enabled */}
          {soundEnabled && (
            <div className="pl-7 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-foreground/60">Volume</label>
                <span className="text-xs font-mono text-foreground/40">{volume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 rounded-full appearance-none bg-foreground/10 accent-foreground/50 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground/60 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-foreground/20"
              />
            </div>
          )}

          {/* Test sound button */}
          <div className="pl-7">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestSound}
              className="font-mono text-xs"
            >
              Test Sound
            </Button>
          </div>
        </div>
      </div>

      {/* Notification section */}
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <SectionHeader title="Notifications" description="Choose which in-app notifications and popups to display." />

        <div className="space-y-4">
          {([
            { key: 'smartTips' as const, label: 'Smart Tips', description: 'Contextual learning nudges' },
            { key: 'streakWarnings' as const, label: 'Streak Warnings', description: 'Evening streak reminders' },
            { key: 'dailyReward' as const, label: 'Daily Reward', description: 'Daily login bonus popup' },
            { key: 'explorerToasts' as const, label: 'Explorer Toasts', description: 'XP notifications when exploring' },
          ]).map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-foreground/80">{item.label}</p>
                <p className="text-[10px] font-mono text-foreground/40">{item.description}</p>
              </div>
              <ToggleSwitch
                enabled={notifications[item.key]}
                onToggle={() => handleNotificationToggle(item.key)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'stats', label: 'Stats & Badges', icon: Trophy },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { id: 'share', label: 'Share', icon: Share2 },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('profile')

  return (
    <AppLayout>
      <div className="max-w-4xl px-6 py-10 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-foreground/[0.05] border border-foreground/[0.08]">
              <Settings className="w-4.5 h-4.5 text-foreground/60" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
              <p className="text-xs font-mono text-foreground/40">Manage your account and preferences</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <nav className="sm:w-48 shrink-0">
              <div className="flex sm:flex-col gap-1">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-mono font-medium transition-colors text-left w-full ${activeSection === section.id ? 'bg-foreground/10 text-foreground' : 'text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.03]'}`}
                  >
                    <section.icon className="w-4 h-4 shrink-0" />
                    {section.label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="flex-1 min-w-0">
              {activeSection === 'profile' && <ProfileSection />}
              {activeSection === 'stats' && <GamificationSection />}
              {activeSection === 'appearance' && <AppearanceSection />}
              {activeSection === 'preferences' && <PreferencesSection />}
              {activeSection === 'share' && <ShareSection />}
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  )
}
