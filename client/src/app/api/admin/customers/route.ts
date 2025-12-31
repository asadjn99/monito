// import { NextResponse } from "next/server";
// import prisma from "@/src/lib/prisma";

// export const dynamic = 'force-dynamic'; // Ensure it always fetches fresh data

// export async function GET() {
//   try {
//     // 1. Fetch Real Users from Database
//     const users = await prisma.user.findMany({
//       orderBy: { createdAt: 'desc' }, // Show newest customers first
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         phone: true,
//         image: true,
//         createdAt: true,
//         address: true,
//         city: true,
//         country: true,
//         // Optional: Count their orders if you have the relation
//         _count: {
//           select: { orders: true }
//         }
//       }
//     });

//     // 2. Calculate Real-Time Stats
//     const totalUsers = users.length;
//     const admins = users.filter(u => u.role === 'admin').length;
    
//     // Count users joined in last 30 days
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//     const newUsers = users.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length;

//     return NextResponse.json({ 
//       success: true, 
//       users,
//       stats: { totalUsers, admins, newUsers }
//     });

//   } catch (error) {
//     console.error("Failed to fetch customers:", error);
//     return NextResponse.json({ success: false, error: "Failed to load customers" }, { status: 500 });
//   }
// }







import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch Users with Order Counts
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        image: true,
        createdAt: true,
        address: true,
        city: true,
        country: true,
        orders: { 
            select: { id: true, total: true } // Fetch orders to calculate value if needed
        }, 
        _count: {
          select: { orders: true }
        }
      }
    });

    // 2. Calculate Stats
    const totalUsers = users.length;
    const admins = users.filter(u => u.role === 'admin').length;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = users.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length;

    // 3. Calculate Top 10 Customers (By Order Count)
    const topCustomers = users
      .filter(u => u.role !== 'admin') // Exclude admins from top customers
      .sort((a, b) => (b._count?.orders || 0) - (a._count?.orders || 0))
      .slice(0, 10);

    return NextResponse.json({ 
      success: true, 
      users,
      topCustomers, // 👈 Sending this new list
      stats: { totalUsers, admins, newUsers }
    });

  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json({ success: false, error: "Failed to load customers" }, { status: 500 });
  }
}