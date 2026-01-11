// import { NextResponse } from "next/server";
// import prisma from "@/src/lib/prisma";

// export const dynamic = 'force-dynamic';

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const email = searchParams.get('email'); // ?email=abc@gmail.com

//   if (!email) return NextResponse.json({ error: "Please add ?email=... to url" });

//   // 1. Find the User
//   const user = await prisma.user.findFirst({
//     where: { email: { equals: email, mode: 'insensitive' } }
//   });

//   // 2. Find Orders with that Email
//   const ordersByEmail = await prisma.order.findMany({
//     where: { email: { equals: email, mode: 'insensitive' } }
//   });

//   return NextResponse.json({
//     analysis: {
//       emailSearched: email,
//       userFound: user ? `✅ Yes (ID: ${user.id})` : "❌ No User Found",
//       totalOrdersWithThisEmail: ordersByEmail.length,
      
//       // 🔍 THIS IS THE PROBLEM CHECKER 👇
//       breakdown: ordersByEmail.map(order => ({
//         orderId: order.orderId,
//         hasUserIdLinked: order.userId ? "✅ Linked" : "❌ BROKEN LINK (UserId is null)",
//         userIdInOrder: order.userId
//       }))
//     }
//   });
// }







// import { NextResponse } from 'next/server';
// import prisma from '@/src/lib/prisma';

// export const dynamic = 'force-dynamic';

// export async function GET() {
//   try {
//     // 1. Fetch from 'Order' (Capitalized - Default)
//     const ordersDefault = await prisma.order.findMany();
    
//     return NextResponse.json({
//       status: "Online",
//       totalOrders: ordersDefault.length,
//       sampleIDs: ordersDefault.map(o => ({ mongo: o.id, readable: o.orderId })),
//     });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message });
//   }
// }