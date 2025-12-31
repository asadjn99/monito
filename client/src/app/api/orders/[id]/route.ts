import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// Define the type for route context
type RouteContext = {
  params: Promise<{ id: string }>
};

// 1. UPDATE ORDER STATUS (PATCH)
export async function PATCH(req: Request, context: RouteContext) {
  try {
    // 🛑 FIX: Await the params object
    const { id } = await context.params; 
    
    const body = await req.json();
    const { status, reason, paymentStatus } = body;

    console.log(`🔄 Request to update Order: ${id} | Status: ${status} | Payment: ${paymentStatus}`);

    if (!id) {
        return NextResponse.json({ error: "Order ID is missing" }, { status: 400 });
    }

    // Prepare Update Data
    const updateData: any = {};

    // 1. If Status is provided, update it
    if (status) {
        updateData.status = status;
        
        // Handle Cancellation Reason
        if (status === 'Cancelled') {
           updateData.cancellationReason = reason || "Order cancelled by admin.";
        } else {
           updateData.cancellationReason = null; // Clear reason if re-activated
        }
    }

    // 2. If Payment Status is provided (e.g. "Verified"), update it
    if (paymentStatus) {
        updateData.paymentStatus = paymentStatus;
    }

    let orderToUpdate;

    // Check if ID looks like a MongoDB ID (24 chars hex)
    if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
        orderToUpdate = await prisma.order.update({
            where: { id: id },
            data: updateData
        });
    } else {
        // Assume it is a custom orderId (e.g. ORD-1234)
        orderToUpdate = await prisma.order.update({
            where: { orderId: id },
            data: updateData
        });
    }

    console.log("✅ Update Success:", orderToUpdate.orderId);
    return NextResponse.json({ success: true, order: orderToUpdate });

  } catch (error: any) {
    console.error("❌ ORDER UPDATE FAILED:", error.message);
    if (error.code === 'P2025') {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}

// 2. GET SINGLE ORDER (GET)
export async function GET(req: Request, context: RouteContext) {
  try {
    // 🛑 FIX: Await the params object here too
    const { id } = await context.params;

    let order;
    
    if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
        order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    } else {
        order = await prisma.order.findUnique({ where: { orderId: id }, include: { items: true } });
    }

    if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}