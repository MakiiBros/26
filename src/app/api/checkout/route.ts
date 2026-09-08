import { NextResponse } from 'next/server';
// Endpoint depreciado, mantenido temporalmente por caché de Next.js
export async function POST() {
  return NextResponse.json({ error: 'Use /api/process_payment instead' }, { status: 410 });
}
