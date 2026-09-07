import { NextResponse } from 'next/server'

export function getFastApiBase(): string {
  let raw = process.env.FASTAPI_BASE_URL || 'http://127.0.0.1:8000'
  if (raw && !raw.startsWith('http://') && !raw.startsWith('https://')) {
    raw = `http://${raw}`
  }
  return raw.replace(/\/$/, '')
}

const FASTAPI_BASE = getFastApiBase()

export async function forwardGet(endpoint: string, fallbackData: any = {}) {
  try {
    const res = await fetch(`${FASTAPI_BASE}${endpoint}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (err) {
    // If FastAPI offline, return fallback
  }
  return NextResponse.json(fallbackData)
}

export async function forwardPost(endpoint: string, body: any, fallbackData: any = {}) {
  try {
    const res = await fetch(`${FASTAPI_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (err) {
    // If FastAPI offline, return fallback
  }
  return NextResponse.json(fallbackData)
}
