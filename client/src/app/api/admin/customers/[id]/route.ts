// import { NextResponse } from "next/server";
// import prisma from "@/src/lib/prisma";

// // Next.js 15+ requires awaiting params
// type RouteParams = {
//   params: Promise<{ id: string }>;
// };

// export async function DELETE(
//   req: Request,
//   { params }: RouteParams
// ) {
//   try {
//     // 1. You MUST await params in the new Next.js version
//     const { id } = await params;

//     if (!id) {
//         return NextResponse.json({ success: false, message: "ID is missing" }, { status: 400 });
//     }

//     // 2. Find User
//     const user = await prisma.user.findUnique({
//       where: { id },
//     });

//     if (!user) {
//       return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
//     }

//     // 3. Prevent deleting Admin
//     if (user.role === 'admin') {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Security Alert: You cannot delete Administrator accounts." 
//       }, { status: 403 });
//     }

//     // 4. Delete the User
//     // Note: This will delete their Account/Session data via Cascade if set in schema.
//     // However, we should manually delete orders if you don't want to keep history.
//     // For now, let's just delete the user.
//     await prisma.user.delete({
//       where: { id },
//     });

//     return NextResponse.json({ success: true, message: "User deleted successfully" });

//   } catch (error: any) {
//     console.error("Delete Error:", error);
//     // If you get a Prisma error about foreign keys (Orders), we need to know
//     return NextResponse.json({ success: false, message: error.message || "Failed to delete" }, { status: 500 });
//   }
// }

















// import { NextResponse } from "next/server";
// import prisma from "@/src/lib/prisma";

// // 1. Define the correct type for Next.js 15+
// type RouteParams = {
//   params: Promise<{ id: string }>;
// };

// export async function DELETE(
//   req: Request,
//   { params }: RouteParams // 👈 Apply the Promise type here
// ) {
//   try {
//     // 2. ⚠️ You must await params now
//     const { id } = await params;
//     const userId = id;

//     // 3. Find User First
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
//     }

//     // 4. SECURITY: Prevent Deleting Admins
//     if (user.role === 'admin') {
//       return NextResponse.json({ success: false, message: "Cannot delete Administrator accounts." }, { status: 403 });
//     }

//     // 5. Delete the User
//     await prisma.user.delete({
//       where: { id: userId },
//     });

//     return NextResponse.json({ success: true, message: "User deleted successfully" });

//   } catch (error) {
//     console.error("Delete Error:", error);
//     return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
//   }
// }














// import { NextResponse } from "next/server";
// import prisma from "@/src/lib/prisma";

// // Next.js 15+ syntax for dynamic params
// type RouteParams = {
//   params: Promise<{ id: string }>;
// };

// export async function DELETE(
//   req: Request,
//   { params }: RouteParams
// ) {
//   try {
//     // 1. Await the ID (Required in newer Next.js)
//     const { id } = await params;

//     // 2. Check if user exists
//     const user = await prisma.user.findUnique({
//       where: { id },
//     });

//     if (!user) {
//       return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
//     }

//     // 3. Security Check
//     if (user.role === 'admin') {
//       return NextResponse.json({ success: false, message: "Cannot delete Admins." }, { status: 403 });
//     }

//     // 4. Delete
//     await prisma.user.delete({
//       where: { id },
//     });

//     return NextResponse.json({ success: true });

//   } catch (error) {
//     return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//   }
// }


























// import { NextResponse } from "next/server";
// import prisma from "@/src/lib/prisma";

// type RouteParams = {
//   params: Promise<{ id: string }>;
// };

// export async function DELETE(
//   req: Request,
//   { params }: RouteParams
// ) {
//   try {
//     const { id } = await params; // 👈 Await params (Next.js 15 Requirement)

//     if (!id) return NextResponse.json({ success: false, message: "Missing User ID" }, { status: 400 });

//     // 1. Security Check: Find User
//     const user = await prisma.user.findUnique({ where: { id } });

//     if (!user) {
//       return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
//     }

//     if (user.role === 'admin') {
//       return NextResponse.json({ success: false, message: "Cannot delete Admin accounts." }, { status: 403 });
//     }

//     // 2. 🛡️ THE FIX: Delete Related Data First
//     // We use a Transaction to ensure everything is deleted together (or nothing is).
//     await prisma.$transaction([
//       // Step A: Delete all orders belonging to this user
//       prisma.order.deleteMany({
//         where: { userId: id }
//       }),
      
//       // Step B: Delete the User (Accounts & Sessions delete automatically via Cascade)
//       prisma.user.delete({
//         where: { id }
//       })
//     ]);

//     return NextResponse.json({ success: true, message: "User and their history deleted successfully" });

//   } catch (error: any) {
//     console.error("Delete Error:", error);
//     return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
//   }
// }












import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  req: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    if (!id) return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });

    // 1. Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (user.role === 'admin') {
      return NextResponse.json({ success: false, message: "Cannot delete Admin." }, { status: 403 });
    }

    // 2. Perform Clean Delete (Transaction)
    await prisma.$transaction([
      // Delete their orders first
      prisma.order.deleteMany({ where: { userId: id } }),
      // Then delete the user
      prisma.user.delete({ where: { id } })
    ]);

    return NextResponse.json({ success: true, message: "Deleted successfully" });

  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}