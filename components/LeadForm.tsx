'use client'

import { useMemo, useState } from 'react'

type LeadFormProps = {
  serviceName: string
  serviceSlug: string
  locationName: string
  locationSlug: string
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function LeadForm({
  serviceName,
  serviceSlug,
  locationName,
  locationSlug,
}: LeadFormProps) {
  const [status, setStatus] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')

  const sourceUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return window.location.href
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

    setStatus('submitting')
    setError(null)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: serviceName,
          serviceSlug,
          location: locationName,
          locationSlug,
          name,
          email,
          phone,
          address: address || undefined,
          message,
          sourceUrl,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      setName('')
      setEmail('')
      setPhone('')
      setAddress('')
      setMessage('')
    } catch (err: any) {
      setStatus('error')
      setError(err?.message || 'Something went wrong. Please try again.')
    }
  }

  const disabled = status === 'submitting'

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3">
        <div>
          <label className="block text-sm font-medium text-[#cbd5e1] mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#cbd5e1] mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="w-full rounded-xl bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#cbd5e1] mb-1">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-xl bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(212) 555-0123"
            autoComplete="tel"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#cbd5e1] mb-1">Address (optional)</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123 Main St, Apt 4B"
            autoComplete="street-address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#cbd5e1] mb-1">Brief description of your need</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full rounded-xl bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Tell us what you’re looking for in ${locationName} (timing, constraints, etc.).`}
          />
        </div>
      </div>

      {status === 'success' ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          Thanks — we received your request. We’ll follow up shortly.
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error || 'Something went wrong. Please try again.'}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center justify-center w-full px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:hover:bg-blue-600 transition font-semibold"
      >
        {status === 'submitting' ? 'Submitting…' : `Request ${serviceName}`}
      </button>

      <p className="text-xs text-[#64748b] leading-relaxed">
        By submitting, you agree to be contacted about your request. We’ll only use your info to respond.
      </p>
    </form>
  )
}
