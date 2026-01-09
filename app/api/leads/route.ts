import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

async function forwardToSheets(lead: Record<string, any>) {
  const url = process.env.LEADS_SHEETS_WEBHOOK_URL
  if (!url) return { forwarded: false as const, ok: true as const }

  const secret = process.env.LEADS_SHEETS_WEBHOOK_SECRET

  // Forward server-side to an Apps Script (or similar) webhook that appends rows to Google Sheets.
  // This keeps credentials out of the client and avoids bundling Google SDKs.
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'X-BHX-Lead-Secret': secret } : {}),
      },
      body: JSON.stringify(lead),
      signal: controller.signal,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { forwarded: true as const, ok: false as const, status: res.status, text }
    }
    return { forwarded: true as const, ok: true as const }
  } finally {
    clearTimeout(timeout)
  }
}

type LeadPayload = {
  serviceType?: string
  serviceSlug?: string
  location?: string
  locationSlug?: string
  name?: string
  email?: string
  phone?: string
  address?: string
  message?: string
  sourceUrl?: string
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

export async function POST(req: Request) {
  let body: LeadPayload | null = null
  try {
    body = (await req.json()) as LeadPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const requiredFields: Array<keyof LeadPayload> = ['serviceType', 'location', 'name', 'email', 'phone', 'message', 'sourceUrl']
  for (const field of requiredFields) {
    if (!isNonEmptyString(body?.[field])) {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 })
    }
  }

  const lead = {
    timestamp: new Date().toISOString(),
    serviceType: body!.serviceType!.trim(),
    serviceSlug: (body!.serviceSlug || '').trim(),
    location: body!.location!.trim(),
    locationSlug: (body!.locationSlug || '').trim(),
    name: body!.name!.trim(),
    email: body!.email!.trim(),
    phone: body!.phone!.trim(),
    address: (body!.address || '').trim(),
    message: body!.message!.trim(),
    sourceUrl: body!.sourceUrl!.trim(),
  }

  // Always log server-side for observability.
  console.log('[BHX lead]', lead)

  // If configured, forward to Google Sheets webhook.
  const forwarded = await forwardToSheets(lead)
  if (forwarded.forwarded && !forwarded.ok) {
    console.error('[BHX lead] Sheets forward failed', forwarded)
    // Do not leak internal forwarding details to the client.
    return NextResponse.json({ error: 'We could not submit your request right now. Please try again.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
