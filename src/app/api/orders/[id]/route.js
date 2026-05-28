import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderApprovedEmail } from "@/lib/mailer";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { status } = await request.json();

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  // ส่ง email เมื่ออนุมัติ
  if (status === "approved") {
    await sendOrderApprovedEmail({
      to: order.user.email,
      name: order.user.name,
      orderId: order.id,
      total: order.total,
    });
  }

  return NextResponse.json(order);
}
