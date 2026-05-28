import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request) {
  const { name, description, price, image, stock } = await request.json();
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      image,
      stock: parseInt(stock),
    },
  });
  return NextResponse.json(product);
}

// toggle featured
export async function PATCH(request) {
  const { id, featured } = await request.json();
  const product = await prisma.product.update({
    where: { id },
    data: { featured },
  });
  return NextResponse.json(product);
}

// แก้ไขสินค้า
export async function PUT(request) {
  const { id, name, description, price, image, stock } = await request.json();
  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description: description || "",
      price: parseFloat(price),
      stock: parseInt(stock),
      image: image || "",
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(request) {
  const { id } = await request.json();
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
