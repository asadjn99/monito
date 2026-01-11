
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    console.log("🔎 ADMIN ORDER FETCH START");
    console.log("➡️ Requested ID:", id);

    // 🔐 Find order using BOTH possible identifiers
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id },          // Prisma Mongo ID
          { orderId: id }, // Human readable order ID
        ],
      },
      include: {
        items: true,
        user: true,
      },
    });

    // ❌ Not found (real case)
    if (!order) {
      console.warn("❌ ORDER NOT FOUND:", id);
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    console.log("✅ ORDER FOUND:", order.id);

    // 🔁 NORMALIZE DATA (MATCHES my-orders API)
    const formattedOrder = {
      _id: order.id,
      createdAt: order.createdAt,
      totalPrice: order.total,
      orderStatus: order.status,
      cancellationReason: order.cancellationReason,

      orderItems: order.items.map(item => ({
        name: item.petName,
        price: item.price,
        quantity: 1,
        image: item.image,
      })),

      paymentInfo: {
        type: order.paymentMethod,
        status: order.paymentStatus,
        transactionId: order.transactionId,
      },

      shippingInfo: {
        address: order.address,
        city: order.city,
        phone: order.phone,
      },

      user: order.user,
    };

    console.log("📦 ORDER SENT TO ADMIN UI");

    return NextResponse.json({
      success: true,
      order: formattedOrder,
    });

  } catch (error) {
    console.error("🔥 ADMIN ORDER FETCH ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
