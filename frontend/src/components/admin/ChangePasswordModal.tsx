'use client'

import { useState } from 'react'
import { Button, Input, Label } from '@/components/ui'
import AdminModal from '@/components/admin/AdminModal'
import { getAdminSession } from '@/lib/admin/session'
import { getStudentSession } from '@/lib/student/session'

type Props = {
  onClose: () => void
  accentColor?: string
  sessionType?: 'admin' | 'student'
}

export default function ChangePasswordModal({ onClose, accentColor = '#800000', sessionType = 'admin' }: Props) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const tooShort = next.length > 0 && next.length < 8
  const mismatch = confirm.length > 0 && next !== confirm
  const disabled = !current || next.length < 8 || next !== confirm || submitting

  async function handleSubmit() {
    setError(null)
    setSubmitting(true)

    const session = sessionType === 'student' ? getStudentSession() : getAdminSession()
    const token = session?.token
    if (!token) { setError('Session not found. Please log in again.'); setSubmitting(false); return }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000'
    const res = await fetch(`${backendUrl}/api/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.message ?? 'Failed to change password. Try again.')
      setSubmitting(false)
      return
    }

    setDone(true)
    setSubmitting(false)
  }

  return (
    <AdminModal
      title="Change Password"
      subtitle="Enter your current password, then choose a new one."
      onClose={onClose}
      widthClassName="max-w-[440px]"
    >
      {done ? (
        <div className="space-y-4 py-2 text-center">
          <p className="text-2xl">✓</p>
          <p className="text-sm font-medium text-grey-700">Password changed successfully!</p>
          <Button className="w-full h-10" onClick={onClose} style={{ backgroundColor: accentColor }}>
            Done
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="cp-current" className="text-sm text-navy">Current Password</Label>
            <Input
              id="cp-current"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Your current password"
              className="h-10"
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="cp-new" className="text-sm text-navy">New Password</Label>
            <Input
              id="cp-new"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Minimum 8 characters"
              className="h-10"
              autoComplete="new-password"
            />
            {tooShort && <p className="text-xs text-red-500">Password must be at least 8 characters.</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="cp-confirm" className="text-sm text-navy">Confirm New Password</Label>
            <Input
              id="cp-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              className="h-10"
              autoComplete="new-password"
            />
            {mismatch && <p className="text-xs text-red-500">Passwords do not match.</p>}
          </div>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-grey-200 pt-3">
            <Button variant="outline" className="h-10 px-5" onClick={onClose}>Cancel</Button>
            <Button
              className="h-10 px-5 text-white"
              disabled={disabled}
              onClick={handleSubmit}
              style={disabled ? undefined : { backgroundColor: accentColor }}
            >
              {submitting ? 'Saving…' : 'Change Password'}
            </Button>
          </div>
        </div>
      )}
    </AdminModal>
  )
}
