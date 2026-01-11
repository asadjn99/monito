import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  // Get all orders
  const orders = await prisma.order.findMany({
    select: { orderId: true, email: true, userId: true, customer: true }
  });

  return NextResponse.json({
    totalOrders: orders.length,
    orders: orders.map(o => ({
      ID: o.orderId,
      // ⚠️ Look closely at this email in the browser
      SavedEmail: `"${o.email}"`, 
      LinkedUser: o.userId ? "✅ Linked" : "❌ Unlinked (Orphan)",
      CustomerName: o.customer
    }))
  });
}