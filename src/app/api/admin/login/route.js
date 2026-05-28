import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  const { email, password } = await request.json()

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { error: 'Email หรือ Password ไม่ถูกต้อง' },
      { status: 401 }
    )
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_token', 'authenticated', {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 วัน
    path: '/',
  })

  return NextResponse.json({ success: true })
}