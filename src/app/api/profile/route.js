import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcryptjs";

export async function PUT(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, currentPassword, newPassword } = await request.json();

  const user = await prisma.user.findUnique({ where: { id: token.sub } });
  if (!user)
    return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });

  const updateData = {};

  // แก้ชื่อ
  if (name && name !== user.name) {
    updateData.name = name;
  }

  // แก้รหัสผ่าน
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: "กรุณากรอกรหัสผ่านปัจจุบัน" },
        { status: 400 },
      );
    }
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" },
        { status: 400 },
      );
    }
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" },
        { status: 400 },
      );
    }
    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "ไม่มีข้อมูลที่ต้องอัปเดต" },
      { status: 400 },
    );
  }

  const updated = await prisma.user.update({
    where: { id: token.sub },
    data: updateData,
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json(updated);
}
