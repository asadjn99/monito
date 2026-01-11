// import { NextResponse } from 'next/server';
// import prisma from '@/src/lib/prisma';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log("📦 Incoming Order Data:", JSON.stringify(body, null, 2));

//     const { customer, items, total, paymentMethod } = body; // Destructure paymentMethod

//     if (!items || items.length === 0) {
//         throw new Error("No items in cart");
//     }

//     const shortId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

//     const order = await prisma.order.create({
//       data: {
//         orderId: shortId,
//         customer: customer.name,
//         email: customer.email,
//         phone: customer.phone,
//         address: customer.address,
//         city: customer.city,
//         total: total,
//         status: 'New',
        
//         // 👇 CORRECTED PAYMENT FIELDS
//         paymentMethod: paymentMethod || 'COD', // Use the value from the frontend
//         paymentStatus: 'Unverified',           // Default status
//         bankName: customer.bankName || null,
//         transactionId: customer.transactionId || null,

//         // ❌ DELETED: payment: 'COD' (This line caused the error!)

//         // Link to User if logged in (Optional)
//         // userId: body.userId || null, 

//         items: {
//           create: items.map((item: any) => ({
//             petId: item.id,
//             petName: item.name,
//             price: item.price,
//             image: item.imageUrl
//           }))
//         }
//       }
//     });

//     console.log("✅ Order Created:", order.id);
//     return NextResponse.json({ success: true, orderId: order.orderId });

//   } catch (error: any) {
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
















// import { NextResponse } from 'next/server';
// import prisma from '@/src/lib/prisma';

// // ⚠️ FIX 1: Force dynamic to stop Next.js from caching old data
// export const dynamic = 'force-dynamic';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log("📦 Incoming Order Data:", JSON.stringify(body, null, 2));

//     const { customer, items, total, paymentMethod, userId } = body; // Added userId

//     if (!items || items.length === 0) {
//         throw new Error("No items in cart");
//     }

//     const shortId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

//     const order = await prisma.order.create({
//       data: {
//         orderId: shortId,
//         customer: customer.name,
//         email: customer.email,
//         phone: customer.phone,
//         address: customer.address,
//         city: customer.city,
//         total: total, // Ensure this is a Float/Int in your Schema
//         status: 'New',
        
//         // Payment Logic
//         paymentMethod: paymentMethod || 'COD', 
//         paymentStatus: 'Unverified',
//         bankName: customer.bankName || null,
//         transactionId: customer.transactionId || null,

//         // 👇 OPTIONAL: Link to User if they are logged in
//         // (Make sure your Prisma Schema has 'userId' on the Order model)
//         ...(userId && { userId: userId }),

//         items: {
//           create: items.map((item: any) => ({
//             petId: item.id,
//             petName: item.name,
//             price: item.price,
//             image: item.imageUrl
//           }))
//         }
//       }
//     });

//     console.log("✅ Order Created:", order.id);
//     return NextResponse.json({ success: true, orderId: order.orderId });

//   } catch (error: any) {
//     console.error("❌ ORDER API CRASH:", error.message, error);
//     return NextResponse.json(
//         { error: error.message || "Database Error" }, 
//         { status: 500 }
//     );
//   }
// }















// import { NextResponse } from 'next/server';
// import prisma from '@/src/lib/prisma';

// export const dynamic = 'force-dynamic';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { customer, items, total, paymentMethod, userId } = body;

//     if (!items || items.length === 0) throw new Error("No items in cart");

//     // 1. 🔍 AUTO-LINK LOGIC: Find user by ID (if sent) OR by Email
//     let finalUserId = userId; // Start with what frontend sent

//     if (!finalUserId) {
//         // If frontend didn't send ID, try to find user by email
//         const existingUser = await prisma.user.findUnique({
//             where: { email: customer.email }
//         });
//         if (existingUser) {
//             finalUserId = existingUser.id; // Found them! Link the order.
//         }
//     }

//     const shortId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

//     // 2. Create Order with the Link
//     const order = await prisma.order.create({
//       data: {
//         orderId: shortId,
//         customer: customer.name,
//         email: customer.email,
//         phone: customer.phone,
//         address: customer.address,
//         city: customer.city,
//         total: total, 
//         status: 'New',
//         paymentMethod: paymentMethod || 'COD', 
//         paymentStatus: 'Unverified',
//         bankName: customer.bankName || null,
//         transactionId: customer.transactionId || null,

//         // 🔗 THE MAGIC LINK
//         // If we found a user, connect them. Otherwise, leave null.
//         ...(finalUserId && { user: { connect: { id: finalUserId } } }),

//         items: {
//           create: items.map((item: any) => ({
//             petId: item.id,
//             petName: item.name,
//             price: item.price,
//             image: item.imageUrl
//           }))
//         }
//       }
//     });

//     return NextResponse.json({ success: true, orderId: order.orderId });

//   } catch (error: any) {
//     console.error("Order Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }










// export async function GET() {
//     try {
//         const orders = await prisma.order.findMany({
//             orderBy: { createdAt: 'desc' },
//             include: { 
//                 items: true,
//                 user: { select: { name: true, email: true } } // Include user details if connected
//             }
//         });

//         // ⚠️ FIX 2: Return the structure your Dashboard expects
//         return NextResponse.json({ 
//             success: true, 
//             orders: orders,
//             count: orders.length 
//         });

//     } catch (error) {
//         console.error("GET Error:", error);
//         return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
//     }
// }






































// import { NextResponse } from 'next/server';
// import prisma from '@/src/lib/prisma';

// export const dynamic = 'force-dynamic';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { customer, items, total, paymentMethod, userId } = body;

//     // Basic Validation
//     if (!items || items.length === 0) throw new Error("No items in cart");
//     if (!customer.email) throw new Error("Customer email is required");

//     // 1. 🧹 CLEAN THE EMAIL (Crucial Step)
//     // Remove spaces and make lowercase to ensure a perfect match
//     const cleanEmail = customer.email.trim().toLowerCase();

//     console.log("------------------------------------------------");
//     console.log(`🛒 NEW ORDER: ${cleanEmail}`);

//     // 2. 🔍 SMART LINK LOGIC
//     let finalUserId = userId; // Start with ID from frontend (if logged in)

//     // If frontend didn't send ID, search DB by Email
//     if (!finalUserId) {
//         console.log("🔍 Searching for existing user by email...");
        
//         // Try to find user (Case Insensitive search is safer)
//         const existingUser = await prisma.user.findFirst({
//             where: { 
//                 email: { 
//                     equals: cleanEmail, 
//                     mode: 'insensitive' // 👈 This fixes the Capital Letter issue
//                 } 
//             }
//         });

//         if (existingUser) {
//             console.log(`✅ FOUND USER: Linked to ID ${existingUser.id}`);
//             finalUserId = existingUser.id;
//         } else {
//             console.log("❌ NO USER FOUND: Order will be Guest Checkout");
//         }
//     } else {
//         console.log(`✅ USER ID PROVIDED: ${finalUserId}`);
//     }

//     const shortId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

//     // 3. CREATE THE ORDER
//     const order = await prisma.order.create({
//       data: {
//         orderId: shortId,
//         customer: customer.name,
//         email: customer.email, // Save original input for display
//         phone: customer.phone,
//         address: customer.address,
//         city: customer.city,
//         total: total, 
//         status: 'New',
//         paymentMethod: paymentMethod || 'COD', 
//         paymentStatus: 'Unverified',
//         bankName: customer.bankName || null,
//         transactionId: customer.transactionId || null,

//         // 🔗 THE MAGIC LINK
//         ...(finalUserId && { user: { connect: { id: finalUserId } } }),

//         items: {
//           create: items.map((item: any) => ({
//             petId: item.id,
//             petName: item.name,
//             price: item.price,
//             image: item.imageUrl
//           }))
//         }
//       }
//     });

//     console.log(`🎉 ORDER CREATED: ${shortId}`);
//     console.log("------------------------------------------------");

//     return NextResponse.json({ success: true, orderId: order.orderId });

//   } catch (error: any) {
//     console.error("❌ ORDER ERROR:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function GET() {
//     try {
//         const orders = await prisma.order.findMany({
//             orderBy: { createdAt: 'desc' },
//             include: { 
//                 items: true,
//                 user: { select: { name: true, email: true } } 
//             }
//         });

//         return NextResponse.json({ 
//             success: true, 
//             orders: orders,
//             count: orders.length 
//         });

//     } catch (error) {
//         console.error("GET Error:", error);
//         return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
//     }
// }



















// import { NextResponse } from 'next/server';
// import prisma from '@/src/lib/prisma';

// export const dynamic = 'force-dynamic';

// // Helper to check if a string is a valid MongoDB ObjectID
// function isValidObjectID(id: string) {
//   return /^[0-9a-fA-F]{24}$/.test(id);
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { customer, items, total, paymentMethod, userId } = body;

//     // Basic Validation
//     if (!items || items.length === 0) throw new Error("No items in cart");
//     if (!customer.email) throw new Error("Customer email is required");

//     // 1. 🧹 CLEAN THE EMAIL
//     const cleanEmail = customer.email.trim().toLowerCase();

//     console.log("------------------------------------------------");
//     console.log(`🛒 NEW ORDER: ${cleanEmail}`);

//     // 2. 🔍 SMART LINK LOGIC
//     let finalUserId = null;

//     // A. Check provided ID first
//     if (userId) {
//       if (isValidObjectID(userId)) {
//         finalUserId = userId;
//         console.log(`✅ VALID MONGO ID PROVIDED: ${finalUserId}`);
//       } else {
//         console.warn(`⚠️ INVALID ID FORMAT DETECTED: ${userId}`);
//         console.warn(`ℹ️  Likely a Google Account ID. Ignoring it to prevent crash.`);
//         // finalUserId remains null, so we will look up by email below
//       }
//     }

//     // B. If no valid ID yet, search DB by Email
//     if (!finalUserId) {
//         console.log("🔍 Searching for existing user by email...");
        
//         const existingUser = await prisma.user.findFirst({
//             where: { 
//                 email: { 
//                     equals: cleanEmail, 
//                     mode: 'insensitive' 
//                 } 
//             }
//         });

//         if (existingUser) {
//             console.log(`✅ FOUND USER IN DB: Linked to ${existingUser.id}`);
//             finalUserId = existingUser.id;
//         } else {
//             console.log("❌ NO USER FOUND: Order will be Guest Checkout");
//         }
//     }

//     const shortId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

//     // 3. CREATE THE ORDER
//     const order = await prisma.order.create({
//       data: {
//         orderId: shortId,
//         customer: customer.name,
//         email: customer.email,
//         phone: customer.phone,
//         address: customer.address,
//         city: customer.city,
//         total: total, 
//         status: 'New',
//         paymentMethod: paymentMethod || 'COD', 
//         paymentStatus: 'Unverified',
//         bankName: customer.bankName || null,
//         transactionId: customer.transactionId || null,

//         // 🔗 THE MAGIC LINK
//         // Only connect if we have a VALID finalUserId (Mongo format)
//         ...(finalUserId && { user: { connect: { id: finalUserId } } }),

//         items: {
//           create: items.map((item: any) => ({
//             petId: item.id,
//             petName: item.name,
//             price: item.price,
//             image: item.imageUrl
//           }))
//         }
//       }
//     });

//     console.log(`🎉 ORDER CREATED: ${shortId}`);
//     console.log("------------------------------------------------");

//     return NextResponse.json({ success: true, orderId: order.orderId });

//   } catch (error: any) {
//     console.error("❌ ORDER ERROR:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function GET() {
//     try {
//         const orders = await prisma.order.findMany({
//             orderBy: { createdAt: 'desc' },
//             include: { 
//                 items: true,
//                 user: { select: { name: true, email: true } } 
//             }
//         });

//         return NextResponse.json({ 
//             success: true, 
//             orders: orders,
//             count: orders.length 
//         });

//     } catch (error) {
//         console.error("GET Error:", error);
//         return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
//     }
// }



















// import { NextResponse } from 'next/server';
// import prisma from '@/src/lib/prisma';

// export const dynamic = 'force-dynamic';

// // Helper to check if a string is a valid MongoDB ObjectID
// function isValidObjectID(id: string) {
//   return /^[0-9a-fA-F]{24}$/.test(id);
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { customer, items, total, paymentMethod, userId } = body;

//     // Basic Validation
//     if (!items || items.length === 0) throw new Error("No items in cart");
//     if (!customer.email) throw new Error("Customer email is required");

//     // 1. 🧹 CLEAN THE EMAIL (Crucial for matching)
//     const cleanEmail = customer.email.trim().toLowerCase();

//     console.log("------------------------------------------------");
//     console.log(`🛒 NEW ORDER: ${cleanEmail}`);

//     // 2. 🔍 SMART LINK LOGIC
//     let finalUserId = null;

//     // A. Check provided ID first
//     if (userId) {
//       if (isValidObjectID(userId)) {
//         finalUserId = userId;
//         console.log(`✅ VALID MONGO ID PROVIDED: ${finalUserId}`);
//       } else {
//         console.warn(`⚠️ INVALID ID FORMAT DETECTED: ${userId}`);
//         console.warn(`ℹ️  Likely a Google Account ID. Ignoring it to prevent crash.`);
//       }
//     }

//     // B. If no valid ID yet, search DB by Email
//     // (This catches "Ghost Sessions" or manually registered users)
//     if (!finalUserId) {
//         console.log("🔍 Searching for existing user by email...");
        
//         const existingUser = await prisma.user.findFirst({
//             where: { 
//                 email: { 
//                     equals: cleanEmail, 
//                     mode: 'insensitive' 
//                 } 
//             }
//         });

//         if (existingUser) {
//             console.log(`✅ FOUND USER IN DB: Linked to ${existingUser.id}`);
//             finalUserId = existingUser.id;
//         } else {
//             console.log("❌ NO USER FOUND: Order will be Guest Checkout");
//         }
//     }

//     const shortId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

//     // 3. CREATE THE ORDER
//     const order = await prisma.order.create({
//       data: {
//         orderId: shortId,
//         customer: customer.name,
//         email: cleanEmail, // Use the cleaned email
//         phone: customer.phone,
//         address: customer.address,
//         city: customer.city,
//         total: total, 
//         status: 'New',
//         paymentMethod: paymentMethod || 'COD', 
//         paymentStatus: 'Unverified',
//         bankName: customer.bankName || null,
//         transactionId: customer.transactionId || null,

//         // 🔗 THE MAGIC LINK
//         // Only connect if we have a VALID finalUserId (Mongo format)
//         ...(finalUserId && { user: { connect: { id: finalUserId } } }),

//         items: {
//           create: items.map((item: any) => ({
//             petId: item.id,
//             petName: item.name,
//             price: item.price,
//             image: item.imageUrl
//           }))
//         }
//       }
//     });

//     console.log(`🎉 ORDER CREATED: ${shortId}`);
//     console.log("------------------------------------------------");

//     return NextResponse.json({ success: true, orderId: order.orderId });

//   } catch (error: any) {
//     console.error("❌ ORDER ERROR:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function GET() {
//     try {
//         const orders = await prisma.order.findMany({
//             orderBy: { createdAt: 'desc' },
//             include: { 
//                 items: true,
//                 user: { select: { name: true, email: true } } 
//             }
//         });

//         return NextResponse.json({ 
//             success: true, 
//             orders: orders,
//             count: orders.length 
//         });

//     } catch (error) {
//         console.error("GET Error:", error);
//         return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
//     }
// }











// import { NextResponse } from "next/server";
// import prisma from "@/src/lib/prisma";

// export const dynamic = 'force-dynamic';

// export async function GET() {
//   try {
//     const orders = await prisma.order.findMany({
//       orderBy: { createdAt: 'desc' },
//       include: {
//         // Include user to get the name/email for the table
//         user: { 
//             select: { name: true, email: true, image: true } 
//         },
//         items: true,
//       },
//     });

//     console.log(`📊 ADMIN FETCH: Found ${orders.length} orders`);

//     // Return in the format the Dashboard expects
//     return NextResponse.json({ 
//         success: true, 
//         orders: orders 
//     });

//   } catch (error: any) {
//     console.error("❌ ADMIN ORDERS ERROR:", error);
//     return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
//   }
// }


























import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

// 1. HELPER: Validate Mongo ID
function isValidObjectID(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// 2. HELPER: Clean Numbers (Removes commas like "3,500" -> 3500)
function cleanNumber(value: any) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value.replace(/,/g, ''));
  return 0;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Destructure everything carefully
    const { 
        customer, 
        items, 
        total, 
        paymentMethod, 
        userId, 
        paymentStatus,
        paymentScreenshot 
    } = body;

    console.log("📝 PROCESSING ORDER FOR:", customer?.email);

    // --- VALIDATION ---
    if (!items || items.length === 0) throw new Error("No items in cart");
    if (!customer?.email) throw new Error("Customer email is required");

    // --- DATA CLEANING ---
    const cleanEmail = customer.email.trim().toLowerCase();
    const finalTotal = cleanNumber(total);

    // --- USER LINKING LOGIC ---
    let finalUserId = null;

    // A. Check if valid Mongo ID was sent
    if (userId && isValidObjectID(userId)) {
        finalUserId = userId;
    } else {
        // B. Fallback: Search DB by Email (Handles "Ghost Sessions")
        const existingUser = await prisma.user.findFirst({
            where: { email: { equals: cleanEmail, mode: 'insensitive' } }
        });
        if (existingUser) finalUserId = existingUser.id;
    }

    const shortId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // --- CREATE ORDER ---
    const order = await prisma.order.create({
      data: {
        orderId: shortId,
        
        // Customer Info
        customer: customer.name,
        email: cleanEmail,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        
        // Financials (Cleaned)
        total: finalTotal,
        status: 'New', 
        
        // Payment Info
        paymentMethod: paymentMethod || 'Bank Transfer',
        paymentStatus: paymentStatus || 'Unverified',
        bankName: customer.bankName || null,
        transactionId: customer.transactionId || null,

        // ⚠️ IMAGE HANDLING
        // Only saving this if your schema supports it. If this crashes, comment it out.
        // paymentScreenshot: paymentScreenshot || null, 

        // Link User (if found)
        ...(finalUserId && { user: { connect: { id: finalUserId } } }),

        // Create Items
        items: {
          create: items.map((item: any) => ({
            petId: item.id || item._id, // Handle different ID formats
            petName: item.name,
            price: cleanNumber(item.price), // Clean price too
            image: item.imageUrl
          }))
        }
      }
    });

    console.log(`✅ ORDER CREATED: ${order.orderId}`);
    
    return NextResponse.json({ success: true, orderId: order.orderId });

  } catch (error: any) {
    console.error("❌ ORDER API CRASH:", error);
    // Return proper JSON error so frontend doesn't say "Non-JSON response"
    return NextResponse.json(
        { error: error.message || "Internal Server Error" }, 
        { status: 500 }
    );
  }
}

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: { 
                items: true,
                user: { select: { name: true, email: true } } 
            }
        });

        return NextResponse.json({ success: true, orders, count: orders.length });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}