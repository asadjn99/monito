import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        total: true,       
        paymentStatus: true,
        paymentMethod: true,
        transactionId: true,
        status: true,      
      }
    });

    // 2. Calculate Stats
    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    const pendingAmount = orders
      .filter((o) => o.paymentStatus === 'Unverified' && o.status !== 'Cancelled')
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    return NextResponse.json({
      success: true,
      totalRevenue: totalRevenue,
      pendingAmount: pendingAmount,
      totalSales: orders.length,
      recentTransactions: orders.slice(0, 10).map(order => ({
        _id: order.id,
        createdAt: order.createdAt,
        totalPrice: order.total,
        paymentInfo: {
            transactionId: order.transactionId || 'N/A',
            type: order.paymentMethod,
            status: order.paymentStatus
        },
        orderStatus: order.status 
      }))
    });

  } catch (error) {
    console.error("Finance API Error:", error);
    return NextResponse.json({ error: "Failed to fetch finance data" }, { status: 500 });
  }
}