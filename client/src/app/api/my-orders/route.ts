import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Get Email from URL
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
    }

    console.log(`🔎 Fetching orders for: ${email}`);

    // 2. Fetch from Prisma
    const orders = await prisma.order.findMany({
      where: {
        email: { equals: email, mode: 'insensitive' } 
      },
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });

    return NextResponse.json({ success: true, orders });

  } catch (error) {
    console.error("My-Orders API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
