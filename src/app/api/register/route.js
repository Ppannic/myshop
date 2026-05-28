import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // เช็คว่า email ซ้ำไหม
    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'อีเมลนี้มีผู้ใช้งานแล้ว' },
        { status: 400 }
      )
    }

    // เข้ารหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10)

    // สร้าง user ใหม่
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })

    return NextResponse.json(
      { message: 'สมัครสมาชิกสำเร็จ', userId: user.id },
      { status: 201 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
      { status: 500 }
    )
  }
}