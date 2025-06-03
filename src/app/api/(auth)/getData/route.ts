// app/api/sensors/route.ts (Next.js 13/14 API Route)
import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch('https://crocus.sagecontinuum.org/api/node/W08D/latest')
  const data = await res.json()
  return NextResponse.json(data)
}
