// import { NextResponse } from 'next/server';
// import prisma from '@/src/lib/prisma';

// export const dynamic = 'force-dynamic';

// // Helper to check for valid Mongo ID
// function isValidObjectID(id: string) {
//   return /^[0-9a-fA-F]{24}$/.test(id);
// }

// // Helper to clean numbers (remove commas)
// function cleanNumber(value: any) {
//   if (typeof value === 'number') return value;
//   if (typeof value === 'string') return parseFloat(value.replace(/,/g, ''));
//   return 0;
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
    
//     // 1. DESTRUCTURE & LOG (To debug what is coming in)
//     const { 
//         customer, 
//         items, 
//         total, 
//         paymentMethod, 
//         userId, 
//         paymentStatus,
//         paymentScreenshot // ⚠️ This might cause crashes if not in DB schema
//     } = body;

//     console.log("📝 PROCESSING ORDER FOR:", customer?.email);

//     // 2. VALIDATION
//     if (!items || items.length === 0) throw new Error("No items in cart");
//     if (!customer?.email) throw new Error("Customer email is required");

//     // 3. CLEAN DATA
//     const cleanEmail = customer.email.trim().toLowerCase();
//     const finalTotal = cleanNumber(total);

//     // 4. FIND USER (Smart Link Logic)
//     let finalUserId = null;

//     if (userId && isValidObjectID(userId)) {
//         finalUserId = userId;
//     } else {
//         // Try finding by email if ID is missing or invalid
//         const existingUser = await prisma.user.findFirst({
//             where: { email: { equals: cleanEmail, mode: 'insensitive' } }
//         });
//         if (existingUser) finalUserId = existingUser.id;
//     }

//     const shortId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

//     // 5. CREATE ORDER (With Safety Checks)
//     const order = await prisma.order.create({
//       data: {
//         orderId: shortId,
        
//         // Customer Info
//         customer: customer.name,
//         email: cleanEmail,
//         phone: customer.phone,
//         address: customer.address,
//         city: customer.city,
        
//         // Financials
//         total: finalTotal,
//         status: 'New', // Default status
        
//         // Payment Info
//         paymentMethod: paymentMethod || 'Bank Transfer',
//         paymentStatus: paymentStatus || 'Unverified',
//         bankName: customer.bankName || null,
//         transactionId: customer.transactionId || null,
        
//         // ⚠️ SAFETY: Only add screenshot if your DB supports it. 
//         // If your Prisma Schema doesn't have 'paymentScreenshot', 
//         // this line would crash the server. We'll try to use a generic field or skip it.
//         // Uncomment the next line ONLY if you added it to schema.prisma
//         // paymentScreenshot: paymentScreenshot || null,

//         // Link User if found
//         ...(finalUserId && { user: { connect: { id: finalUserId } } }),

//         // Create Items
//         items: {
//           create: items.map((item: any) => ({
//             petId: item.id || item._id, // Handle potential ID mismatch
//             petName: item.name,
//             price: cleanNumber(item.price),
//             image: item.imageUrl
//           }))
//         }
//       }
//     });

//     console.log(`✅ ORDER CREATED: ${order.orderId}`);
    
//     return NextResponse.json({ success: true, orderId: order.orderId });

//   } catch (error: any) {
//     console.error("❌ ORDER API CRASH:", error);
//     // Return a clean JSON error even if it crashes, so frontend doesn't get "Non-JSON response"
//     return NextResponse.json(
//         { error: error.message || "Internal Server Error" }, 
//         { status: 500 }
//     );
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

//         return NextResponse.json({ success: true, orders, count: orders.length });
//     } catch (error) {
//         return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
//     }
// }





















import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

// Helper: Check valid ID format
function isValidObjectID(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Helper: Force numbers to Integers (Prisma Int Requirement)
function cleanInt(value: any) {
  let num = 0;
  if (typeof value === 'number') num = value;
  else if (typeof value === 'string') num = parseFloat(value.replace(/,/g, ''));
  
  // ⚠️ CRITICAL FIX: Round to nearest whole number to satisfy Prisma 'Int'
  return Math.round(num);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
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

    // 1. VALIDATION
    if (!items || items.length === 0) throw new Error("No items in cart");
    if (!customer?.email) throw new Error("Customer email is required");

    // 2. CLEAN DATA (Fix Int vs Float crash)
    const cleanEmail = customer.email.trim().toLowerCase();
    const finalTotal = cleanInt(total); // Force Integer

    // 3. SAFE USER LINKING (Fix Ghost User crash)
    let finalUserId = null;

    // A. Check provided ID first
    if (userId && isValidObjectID(userId)) {
        // 🛡️ DOUBLE CHECK: Does this user actually exist in the DB?
        // (Prevents crash if session has old ID from deleted DB)
        const userExists = await prisma.user.findUnique({ 
            where: { id: userId },
            select: { id: true } 
        });
        
        if (userExists) {
            finalUserId = userId;
        } else {
            console.warn(`⚠️ Session User ID ${userId} not found in DB. Treating as Guest.`);
        }
    } 

    // B. If not found by ID, try Email
    if (!finalUserId) {
        const existingUser = await prisma.user.findFirst({
            where: { email: { equals: cleanEmail, mode: 'insensitive' } }
        });
        if (existingUser) finalUserId = existingUser.id;
    }

    const shortId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. CREATE ORDER
    const order = await prisma.order.create({
      data: {
        orderId: shortId,
        
        // Customer Info
        customer: customer.name,
        email: cleanEmail,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        
        // Financials
        total: finalTotal, // Now guaranteed to be Int
        status: 'New', 
        
        // Payment Info
        paymentMethod: paymentMethod || 'Bank Transfer',
        paymentStatus: paymentStatus || 'Unverified',
        bankName: customer.bankName || null,
        transactionId: customer.transactionId || null,
        paymentScreenshot: paymentScreenshot || null, 

        // Link User (Only if verified existing user)
        ...(finalUserId && { user: { connect: { id: finalUserId } } }),

        // Create Items
        items: {
          create: items.map((item: any) => ({
            petId: item.id || item._id, 
            petName: item.name,
            price: cleanInt(item.price), // Force Integer here too
            image: item.imageUrl
          }))
        }
      }
    });

    console.log(`✅ ORDER CREATED: ${order.orderId}`);
    
    return NextResponse.json({ success: true, orderId: order.orderId });

  } catch (error: any) {
    console.error("❌ ORDER API CRASH:", error);
    // Return valid JSON error
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