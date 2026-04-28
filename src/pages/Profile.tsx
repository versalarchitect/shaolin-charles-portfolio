import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Loader2, Save, Settings, User, Lock, Mail, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppLayout } from '@/components/app-layout'

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

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2 MB')
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path)

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
      const { data: files } = await supabase.storage
        .from('avatars')
        .list(user.id)
      if (files?.length) {
        await supabase.storage
          .from('avatars')
          .remove(files.map(f => `${user.id}/${f.name}`))
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
        <h3 className="text-sm font-semibold text-foreground/80 mb-1">Photo</h3>
        <p className="text-xs font-mono text-foreground/40 mb-5">
          This will be displayed on your profile and in the community.
        </p>
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
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
        <h3 className="text-sm font-semibold text-foreground/80 mb-1">Personal information</h3>
        <p className="text-xs font-mono text-foreground/40 mb-5">
          Update your name as it appears across the platform.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-xs font-mono text-foreground/60">First name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-xs font-mono text-foreground/60">Last name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              maxLength={50}
            />
          </div>
        </div>

        {displayName && (
          <p className="text-xs font-mono text-foreground/30 mb-4">
            Display name: <span className="text-foreground/50">{displayName}</span>
          </p>
        )}

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
        <h3 className="text-sm font-semibold text-foreground/80 mb-1">Email address</h3>
        <p className="text-xs font-mono text-foreground/40 mb-5">
          Your email is used for sign-in and cannot be changed.
        </p>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06]">
          <Mail className="w-4 h-4 text-foreground/30 shrink-0" />
          <span className="text-sm font-mono text-foreground/60 truncate">{user?.email}</span>
          <Lock className="w-3.5 h-3.5 text-foreground/20 shrink-0 ml-auto" />
        </div>
      </div>
    </div>
  )
}

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
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
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-foreground/[0.05] border border-foreground/[0.08]">
              <Settings className="w-4.5 h-4.5 text-foreground/60" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
              <p className="text-xs font-mono text-foreground/40">Manage your account and preferences</p>
            </div>
          </div>

          {/* Layout: sidebar tabs + content */}
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Section tabs */}
            <nav className="sm:w-48 shrink-0">
              <div className="flex sm:flex-col gap-1">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-mono font-medium transition-colors text-left w-full
                      ${activeSection === section.id
                        ? 'bg-foreground/10 text-foreground'
                        : 'text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.03]'}
                    `}
                  >
                    <section.icon className="w-4 h-4 shrink-0" />
                    {section.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {activeSection === 'profile' && <ProfileSection />}
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  )
}
