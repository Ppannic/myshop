import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items, total, slipImage, fullName, phone, address } = await request.json();

  const order = await prisma.order.create({
    data: {
      userId: token.sub,
      total,
      slipImage,
      fullName,
      phone,
      address,
      status: "pending",
      items: {
        create: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  return NextResponse.json(order);
}

export async function GET(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { searchParams } = new URL(request.url);
  const mine = searchParams.get("mine");

  const where = mine === "true" ? { userId: token?.sub } : {};

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true, image: true } },
        },
      },
    },
  });
  return NextResponse.json(orders);
}