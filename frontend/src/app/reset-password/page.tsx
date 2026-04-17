'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Label } from '@/components/ui'
import Image from 'next/image'

type Stage = 'loading' | 'form' | 'success' | 'error'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('loading')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Supabase puts the access_token in the URL hash after redirecting
    const hash = window.location.hash
    if (hash.includes('access_token') && hash.includes('type=recovery')) {
      // Supabase client automatically picks up the session from the URL hash
      const supabase = createClient()
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setStage('form')
        } else {
          setStage('error')
        }
      })
    } else {
      setStage('error')
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }

    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setSubmitting(false)
    } else {
      setStage('success')
    }
  }

  return (
    <div className="min-h-screen bg-bg-grey flex items-center justify-center px-4">
      <div className="w-full max-w-[420px] rounded-xl border border-grey-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <Image src="/images/CICS SEAL.png" alt="CICS Seal" width={48} height={60} className="h-14 w-auto object-contain" />
          <h1 className="text-[18px] font-semibold text-cics-maroon">SPARK Repository</h1>
          <p className="text-xs text-grey-500">University of Santo Tomas — CICS</p>
        </div>

        {stage === 'loading' && (
          <p className="text-center text-sm text-grey-500">Verifying your link…</p>
        )}

        {stage === 'error' && (
          <div className="text-center space-y-4">
            <p className="text-sm text-red-600">This password reset link is invalid or has expired.</p>
            <Button className="w-full bg-cics-maroon hover:bg-cics-maroon-600" onClick={() => router.push('/')}>
              Go to Homepage
            </Button>
          </div>
        )}

        {stage === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-[16px] font-semibold text-grey-700">Set Your Password</h2>
              <p className="text-xs text-grey-500 mt-1">Choose a password to activate your account.</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm text-grey-700">New Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="h-11"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirm" className="text-sm text-grey-700">Confirm Password *</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                className="h-11"
              />
            </div>

            {error && <p className="text-xs text-red-600 rounded-md border border-red-200 bg-red-50 px-3 py-2">{error}</p>}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-cics-maroon hover:bg-cics-maroon-600"
            >
              {submitting ? 'Saving…' : 'Set Password & Activate Account'}
            </Button>
          </form>
        )}

        {stage === 'success' && (
          <div className="text-center space-y-4">
            <div className="text-4xl">✓</div>
            <h2 className="text-[16px] font-semibold text-grey-700">Password Set Successfully!</h2>
            <p className="text-sm text-grey-500">Your account is now active. You can log in.</p>
            <div className="flex flex-col gap-2">
              <Button className="w-full bg-cics-maroon hover:bg-cics-maroon-600" onClick={() => router.push('/login')}>
                Go to Admin Login
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push('/student/login')}>
                Go to Student Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
