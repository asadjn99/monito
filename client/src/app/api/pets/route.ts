
// import { NextRequest, NextResponse } from 'next/server';
// // 👇 Check this import path. If you moved files to 'src', it might be '@/lib/prisma'
// import prisma from '@/src/lib/prisma'; 

// // 1. GET ALL PETS
// export async function GET() {
//   try {
//     const pets = await prisma.pet.findMany({
//       orderBy: { createdAt: 'desc' }
//     });
//     return NextResponse.json(pets);
//   } catch (error) {
//     console.error("GET Error:", error); // 👈 Check your VS Code terminal for this log
//     return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 });
//   }
// }

// // 2. CREATE PET
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const newPet = await prisma.pet.create({
//       data: {
//         code: body.id,        
//         name: body.title,
//         category: body.category,
//         breed: body.breed,
//         gender: body.gender,
//         age: Number(body.age),      
//         price: Number(body.price),  
//         color: body.color,
//         description: body.description,
//         imageUrl: body.imageUrl,
//         images: body.images || [],
//         healthGuarantee: body.healthGuarantee,
//         status: 'Available'
//       }
//     });

//     return NextResponse.json({ success: true, pet: newPet });
//   } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
//     console.error("POST Error:", error);
//     return NextResponse.json({ error: error.message || "Failed to create pet" }, { status: 500 });
//   }
// }






import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// 1. GET ALL PETS
export async function GET() {
  try {
    const pets = await prisma.pet.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(pets);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 });
  }
}

// 2. CREATE PET
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📝 Incoming Data:", body); // Debug Log

    // Validation: Ensure required fields exist
    if (!body.name || !body.category || !body.price) {
        return NextResponse.json({ error: "Missing required fields (name, category, or price)" }, { status: 400 });
    }

    const newPet = await prisma.pet.create({
      data: {
        code: body.code || `SKU-${Date.now()}`, // Auto-generate if missing
        name: body.name,        // Changed from body.title to body.name to match form
        category: body.category,
        breed: body.breed,
        gender: body.gender,
        
        // ⚠️ CRITICAL FIX: Your Schema says String, so we use String()
        age: body.age ? String(body.age) : undefined,      
        price: String(body.price),   
        
        color: body.color,
        description: body.description,
        imageUrl: body.imageUrl,
        images: body.images || [],
        healthGuarantee: Boolean(body.healthGuarantee),
        status: 'Available'
      }
    });

    console.log("✅ Pet Created:", newPet.id);
    return NextResponse.json({ success: true, pet: newPet });

  } catch (error: any) {
    console.error("❌ POST Error:", error);
    
    // Check for Duplicate Code Error (P2002)
    if (error.code === 'P2002') {
        return NextResponse.json({ error: "A pet with this SKU Code already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: error.message || "Failed to create pet" }, { status: 500 });
  }
}