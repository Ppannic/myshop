import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") || "newest";

  const where = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      minPrice ? { price: { gte: parseFloat(minPrice) } } : {},
      maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {},
    ],
  };

  const orderBy =
    sort === "newest"
      ? { createdAt: "desc" }
      : sort === "oldest"
        ? { createdAt: "asc" }
        : sort === "price_asc"
          ? { price: "asc" }
          : sort === "price_desc"
            ? { price: "desc" }
            : { createdAt: "desc" };

  const products = await prisma.product.findMany({ where, orderBy });
  return NextResponse.json(products);
}
