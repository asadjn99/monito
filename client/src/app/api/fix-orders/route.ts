// import { NextResponse } from "next/server";
// import prisma from "@/src/lib/prisma";

// export const dynamic = 'force-dynamic';

// export async function GET() {
//   try {
//     // 1. Get all orders that have NO user linked
//     const orphanOrders = await prisma.order.findMany({
//       where: { userId: { isSet: false } } // or userId: null
//     });

//     let fixedCount = 0;

//     // 2. Loop through them and try to find a matching user
//     for (const order of orphanOrders) {
//       if (!order.email) continue;

//       // Find user with this email
//       const user = await prisma.user.findUnique({
//         where: { email: order.email }
//       });

//       // If user exists, update the order to point to them
//       if (user) {
//         await prisma.order.update({
//           where: { id: order.id },
//           data: { userId: user.id }
//         });
//         fixedCount++;
//       }
//     }

//     return NextResponse.json({ 
//       success: true, 
//       message: `Fixed ${fixedCount} orders. They are now linked to users.` 
//     });

//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }