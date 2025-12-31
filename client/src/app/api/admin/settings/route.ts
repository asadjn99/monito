// import { NextResponse } from "next/server";
// import prisma from "@/src/lib/prisma";

// export const dynamic = 'force-dynamic';

// // GET: Fetch Settings (Create default if missing)
// export async function GET() {
//   try {
//     let settings = await prisma.storeSettings.findFirst();

//     if (!settings) {
//       settings = await prisma.storeSettings.create({
//         data: {
//           storeName: "Monito Pet Shop",
//           supportEmail: "support@monito.com",
//           supportPhone: "+92 307 5993029",
//           bankName: "Meezan Bank",
//           bankAccount: "0101-239482-01",
//           bankTitle: "Monito Pets Pvt Ltd"
//         }
//       });
//     }

//     return NextResponse.json({ success: true, settings });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: "Failed to load settings" }, { status: 500 });
//   }
// }

// // PUT: Update Settings
// export async function PUT(req: Request) {
//   try {
//     const body = await req.json();
//     const { id, ...data } = body; // Exclude ID from update data

//     // Update the first record found (since we only have one settings row)
//     const settings = await prisma.storeSettings.findFirst();

//     if (!settings) {
//         return NextResponse.json({ success: false, message: "Settings not initialized" }, { status: 404 });
//     }

//     const updated = await prisma.storeSettings.update({
//       where: { id: settings.id },
//       data: data,
//     });

//     return NextResponse.json({ success: true, settings: updated });

//   } catch (error) {
//     console.error("Update Error:", error);
//     return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
//   }
// }






import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export const dynamic = 'force-dynamic';

// GET: Fetch Settings (Create default if missing)
export async function GET() {
  try {
    // 👈 FIX: Cast to 'any' to bypass TS error until you run 'npx prisma generate'
    let settings = await (prisma as any).storeSettings.findFirst();

    if (!settings) {
      settings = await (prisma as any).storeSettings.create({
        data: {
          storeName: "Monito Pet Shop",
          supportEmail: "support@monito.com",
          supportPhone: "+92 307 5993029",
          bankName: "Meezan Bank",
          bankAccount: "0101-239482-01",
          bankTitle: "Monito Pets Pvt Ltd"
        }
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to load settings" }, { status: 500 });
  }
}

// PUT: Update Settings
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    
    const { id, ...data } = body; 

    // Update the first record found
    const settings = await (prisma as any).storeSettings.findFirst();

    if (!settings) {
        return NextResponse.json({ success: false, message: "Settings not initialized" }, { status: 404 });
    }

    const updated = await (prisma as any).storeSettings.update({
      where: { id: settings.id },
      data: data,
    });

    return NextResponse.json({ success: true, settings: updated });

  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}