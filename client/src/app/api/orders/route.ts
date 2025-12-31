// // import { NextResponse } from 'next/server';
// // import prisma from '@/src/lib/prisma';

// // export async function POST(req: Request) {
// //   try {
// //     const body = await req.json();
// //     const { customer, items, total } = body;

// //     // 1. Generate a Short Order ID (e.g., ORD-7382)
// //     const shortId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

// //     // 2. Create Order in DB
// //     const order = await prisma.order.create({
// //       data: {
// //         orderId: shortId,
// //         customer: customer.name,
// //         email: customer.email,
// //         phone: customer.phone,
// //         address: customer.address,
// //         city: customer.city,
// //         total: total,
// //         status: 'New', // Default status
// //         payment: 'COD',
// //         items: {
// //           create: items.map((item: any) => ({
// //             petId: item.id,
// //             petName: item.name,
// //             price: item.price,
// //             image: item.imageUrl
// //           }))
// //         }
// //       }
// //     });

// //     return NextResponse.json({ success: true, orderId: order.orderId });
// //   } catch (error) {
// //     console.error("Order Error:", error);
// //     return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
// //   }
// // }

// // // Also allow fetching orders (for Admin Panel)
// // export async function GET() {
// //     try {
// //         const orders = await prisma.order.findMany({
// //             orderBy: { createdAt: 'desc' },
// //             include: { items: true }
// //         });
// //         return NextResponse.json(orders);
// //     } catch (error) {
// //         return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
// //     }
// // }










// import { NextResponse } from 'next/server';
// import prisma from '@/src/lib/prisma';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log("📦 Incoming Order Data:", JSON.stringify(body, null, 2)); // Debug Log

//     const { customer, items, total } = body;

//     if (!items || items.length === 0) {
//         throw new Error("No items in cart");
//     }

//     const shortId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;



//     const order = await prisma.order.create({
//       data: {
//          paymentMethod: body.paymentMethod, // Save method
//     bankName: body.customer.bankName || null,
//     transactionId: body.customer.transactionId || null,
//         orderId: shortId,
//         customer: customer.name,
//         email: customer.email,
//         phone: customer.phone,
//         address: customer.address,
//         city: customer.city,
//         total: total,
//         status: 'New',
//         payment: 'COD',
//         items: {
//           create: items.map((item: any) => ({
//             petId: item.id, // Now accepts any string because we fixed Schema
//             petName: item.name,
//             price: item.price,
//             image: item.imageUrl
//           }))
//         }
//       }
//     });

//     console.log("✅ Order Created:", order.id); // Success Log
//     return NextResponse.json({ success: true, orderId: order.orderId });

//   } catch (error: any) {
//     // 👇 THIS LOG IS WHAT WE NEED TO SEE IN TERMINAL
//     console.error("❌ ORDER API CRASH:", error.message, error); 
    
//     return NextResponse.json(
//         { error: error.message || "Database Error" }, 
//         { status: 500 }
//     );
//   }
// }

// export async function GET() {
//     try {
//         const orders = await prisma.order.findMany({
//             orderBy: { createdAt: 'desc' },
//             include: { items: true }
//         });
//         return NextResponse.json(orders);
//     } catch (error) {
//         return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
//     }
// }






import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📦 Incoming Order Data:", JSON.stringify(body, null, 2));

    const { customer, items, total, paymentMethod } = body; // Destructure paymentMethod

    if (!items || items.length === 0) {
        throw new Error("No items in cart");
    }

    const shortId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderId: shortId,
        customer: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        total: total,
        status: 'New',
        
        // 👇 CORRECTED PAYMENT FIELDS
        paymentMethod: paymentMethod || 'COD', // Use the value from the frontend
        paymentStatus: 'Unverified',           // Default status
        bankName: customer.bankName || null,
        transactionId: customer.transactionId || null,

        // ❌ DELETED: payment: 'COD' (This line caused the error!)

        // Link to User if logged in (Optional)
        // userId: body.userId || null, 

        items: {
          create: items.map((item: any) => ({
            petId: item.id,
            petName: item.name,
            price: item.price,
            image: item.imageUrl
          }))
        }
      }
    });

    console.log("✅ Order Created:", order.id);
    return NextResponse.json({ success: true, orderId: order.orderId });

  } catch (error: any) {
    console.error("❌ ORDER API CRASH:", error.message, error);
    return NextResponse.json(
        { error: error.message || "Database Error" }, 
        { status: 500 }
    );
  }
}

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: { items: true }
        });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}