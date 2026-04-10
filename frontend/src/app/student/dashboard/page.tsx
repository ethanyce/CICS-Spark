"use client"

import Link from 'next/link'
import { AlertTriangle, CheckCircle2, Clock, FileText, FilePlus2, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { adminRepository } from '@/lib/admin/admin-repository'
import { getStudentSession } from '@/lib/student/session'
import type { SubmissionStatus } from '@/types/admin'

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const styles: Record<SubmissionStatus, string> = {
    'Pending Review':      'bg-amber-50 text-amber-700 border border-amber-200',
    'Approved':            'bg-green-50 text-green-700 border border-green-200',
    'Rejected':            'bg-red-50 text-red-700 border border-red-200',
    'Revision Requested':  'bg-violet-50 text-violet-700 border border-violet-200',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

export default function StudentDashboardPage() {
  const session = getStudentSession()
  const all = adminRepository.listSubmissions()
  const mine = all.filter((item) => item.authorEmail === session?.email)

  const pending  = mine.filter((s) => s.status === 'Pending Review').length
  const approved = mine.filter((s) => s.status === 'Approved').length
  const rejected = mine.filter((s) => s.status === 'Rejected').length

  const needsRevision = mine.filter((s) => s.status === 'Revision Requested')

  const stats = [
    { label: 'Total Submissions', value: mine.length,  icon: FileText,     color: 'text-[#0f766e]',  bg: 'bg-[#f0fdf9]' },
    { label: 'Pending Review',    value: pending,       icon: Clock,        color: 'text-amber-600',  bg: 'bg-amber-50'  },
    { label: 'Approved',          value: approved,      icon: CheckCircle2, color: 'text-green-600',  bg: 'bg-green-50'  },
    { label: 'Rejected',          value: rejected,      icon: XCircle,      color: 'text-red-600',    bg: 'bg-red-50'    },
  ]

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-[28px] font-semibold text-navy leading-tight">
          Welcome back{session?.name ? `, ${session.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-sm text-grey-500 mt-0.5">Upload materials and monitor your review status.</p>
      </header>

      {/* Revision alert */}
      {needsRevision.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
          <div className="text-sm">
            <p className="font-medium text-violet-800">
              {needsRevision.length} submission{needsRevision.length > 1 ? 's' : ''} require{needsRevision.length === 1 ? 's' : ''} revision
            </p>
            <p className="mt-0.5 text-violet-700">
              Please review the feedback and resubmit your work.
            </p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border border-grey-200 shadow-none">
            <CardContent className="p-4">
              <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className={`text-2xl font-semibold ${color}`}>{value}</p>
              <p className="mt-0.5 text-xs text-grey-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Quick action */}
      <Card className="border border-grey-200 shadow-none">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium text-grey-700">Ready to submit your thesis or capstone?</p>
            <p className="mt-0.5 text-xs text-grey-500">New uploads go through admin review before publication.</p>
          </div>
          <Link
            href="/student/submissions/new/permission"
            className="inline-flex items-center gap-1.5 rounded-md bg-[#0f766e] px-4 py-2 text-sm font-medium text-white no-underline hover:bg-[#0d6460] hover:text-white"
          >
            <FilePlus2 className="h-4 w-4" />
            New Submission
          </Link>
        </CardContent>
      </Card>

      {/* Submissions table */}
      <Card className="border border-grey-200 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-navy">My Submissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {mine.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <FileText className="h-8 w-8 text-grey-300" />
              <p className="text-sm text-grey-500">No submissions yet.</p>
              <Link
                href="/student/submissions/new/permission"
                className="text-xs text-[#0f766e] hover:underline"
              >
                Start your first submission →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-grey-100 bg-grey-50">
                    <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-grey-500">Title</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-grey-500">Department</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-grey-500">Date</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-grey-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-grey-100">
                  {mine.map((item) => (
                    <tr key={item.id} className="hover:bg-grey-50">
                      <td className="max-w-[320px] px-4 py-3">
                        <p className="line-clamp-2 text-grey-700">{item.title}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-grey-500">{item.department}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-grey-500">{item.date}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
