




// import { NextResponse } from 'next/server';
// import prisma from '@/src/lib/prisma';

// // Define the context type for Next.js 15+
// type RouteContext = {
//   params: Promise<{ id: string }>
// };

// // 1. GET SINGLE ORDER
// export async function GET(req: Request, context: RouteContext) {
//   try {
//     // 🛑 FIX: Await the params object (Crucial for Next.js 15/16)
//     const { id } = await context.params;

//     if (!id) return NextResponse.json({ error: "ID Required" }, { status: 400 });

//     // Try finding by MongoDB ID (24 chars) OR custom Order ID (ORD-123)
//     let order;
    
//     // Check if it's a valid MongoDB ObjectID format
//     if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
//         order = await prisma.order.findUnique({ 
//             where: { id }, 
//             include: { items: true, user: true } 
//         });
//     } else {
//         order = await prisma.order.findUnique({ 
//             where: { orderId: id }, 
//             include: { items: true, user: true } 
//         });
//     }

//     if (!order) {
//         return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     return NextResponse.json(order);
//   } catch (error: any) {
//     console.error("GET Order Error:", error);
//     return NextResponse.json({ error: "Server Error" }, { status: 500 });
//   }
// }

// // 2. UPDATE ORDER (PATCH)
// export async function PATCH(req: Request, context: RouteContext) {
//   try {
//     const { id } = await context.params;
//     const body = await req.json();
//     const { status, paymentStatus } = body;

//     console.log(`🔄 UPDATING ORDER ${id} -> Status: ${status}, Payment: ${paymentStatus}`);

//     // Determine how to find the order (ID vs OrderID)
//     const whereClause = (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id))
//         ? { id }
//         : { orderId: id };

//     const updatedOrder = await prisma.order.update({
//         where: whereClause,
//         data: {
//             // Only update fields if they are provided
//             ...(status && { status }),
//             ...(paymentStatus && { paymentStatus }),
//         }
//     });

//     return NextResponse.json({ success: true, order: updatedOrder });

//   } catch (error: any) {
//     console.error("UPDATE Order Error:", error);
//     return NextResponse.json({ error: error.message || "Update Failed" }, { status: 500 });
//   }
// }













import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// Define the context for dynamic routes
type RouteContext = {
  params: Promise<{ id: string }>
};

export async function GET(req: Request, context: RouteContext) {
  try {
    // 1. Await params (Required for Next.js 15)
    const { id } = await context.params;

    console.log(`🚀 DEBUG: Fetching Order ID: ${id}`);

    if (!id) return NextResponse.json({ error: "ID Missing" }, { status: 400 });

    // 2. Safe Database Query
    // We check if the incoming ID looks like a Mongo ID (24 hex chars)
    // If YES -> Search by 'id'
    // If NO (e.g. ORD-1234) -> Search by 'orderId'
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

    const order = await prisma.order.findUnique({
        where: isMongoId 
            ? { id: id }          // Search by _id
            : { orderId: id },    // Search by orderId
        include: { 
            items: true, 
            user: true 
        }
    });

    // 3. Handle Not Found
    if (!order) {
        console.log("❌ DEBUG: Order not found in DB");
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("✅ DEBUG: Order Found!", order.orderId);
    return NextResponse.json(order);

  } catch (error: any) {
    console.error("🔥 DEBUG CRASH:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    
    console.log(`🔄 PATCHING: ${id}`, body);

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    
    const updatedOrder = await prisma.order.update({
        where: isMongoId ? { id } : { orderId: id },
        data: body
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}