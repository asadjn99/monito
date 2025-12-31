
// import { NextResponse } from 'next/server';
// import prisma from '@/src/lib/prisma';

// // 1. GET ALL PETS (Real Data)
// export async function GET() {
//   try {
//     const pets = await prisma.pet.findMany({
//       orderBy: { createdAt: 'desc' } // Newest first
//     });
//     return NextResponse.json(pets);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 });
//   }
// }

// // 2. CREATE PET
// export async function POST(req) {
//   try {
//     const body = await req.json();

//     // Validation: Ensure required fields exist
//     if (!body.id || !body.title || !body.price) {
//         return NextResponse.json({ error: "Missing required fields (ID, Title, Price)" }, { status: 400 });
//     }

//     const newPet = await prisma.pet.create({
//       data: {
//         code: body.id,
//         name: body.title,
//         category: body.category,
//         breed: body.breed,
//         gender: body.gender,
//         age: body.age,
//         price: body.price,
//         color: body.color,
//         description: body.description,
//         imageUrl: body.imageUrl,
//         images: body.images || [],
//         healthGuarantee: body.healthGuarantee,
//         status: 'Available'
//       }
//     });

//     return NextResponse.json({ success: true, pet: newPet });
//   } catch (error) {
//     console.error("Create Error:", error); // Check your terminal for this!
//     if (error.code === 'P2002') {
//       return NextResponse.json({ error: "A pet with this ID (MO...) already exists." }, { status: 400 });
//     }
//     return NextResponse.json({ error: error.message || "Failed to create pet" }, { status: 500 });
//   }
// }









// import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/src/lib/prisma'; // 👈 Check this path. Try '@/lib/prisma' or '../lib/prisma' if red.

// // 1. GET ALL PETS
// export async function GET() {
//   try {
//     const pets = await prisma.pet.findMany({
//       orderBy: { createdAt: 'desc' }
//     });
//     return NextResponse.json(pets);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 });
//   }
// }

// // 2. CREATE PET
// export async function POST(req: NextRequest) { // 👈 Added type ': NextRequest'
//   try {
//     const body = await req.json();

//     // Validation
//     if (!body.id || !body.title || !body.price) {
//         return NextResponse.json({ error: "Missing required fields (ID, Title, Price)" }, { status: 400 });
//     }

//     const newPet = await prisma.pet.create({
//       data: {
//         code: body.id,        // Make sure your DB model uses 'code', not 'id' for the manual ID
//         name: body.title,
//         category: body.category,
//         breed: body.breed,
//         gender: body.gender,
//         age: Number(body.age),      // 👈 Converted to Number to be safe
//         price: Number(body.price),  // 👈 Converted to Number to be safe
//         color: body.color,
//         description: body.description,
//         imageUrl: body.imageUrl,
//         images: body.images || [],
//         healthGuarantee: body.healthGuarantee,
//         status: 'Available'
//       }
//     });

//     return NextResponse.json({ success: true, pet: newPet });
//   } catch (error: any) { // 👈 Added ': any' to fix "Object is of type unknown"
//     console.error("Create Error:", error); 
    
//     // Now TypeScript allows accessing .code because we used 'any'
//     if (error.code === 'P2002') {
//       return NextResponse.json({ error: "A pet with this ID already exists." }, { status: 400 });
//     }
    
//     return NextResponse.json({ error: error.message || "Failed to create pet" }, { status: 500 });
//   }
// }










import { NextRequest, NextResponse } from 'next/server';
// 👇 Check this import path. If you moved files to 'src', it might be '@/lib/prisma'
import prisma from '@/src/lib/prisma'; 

// 1. GET ALL PETS
export async function GET() {
  try {
    const pets = await prisma.pet.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(pets);
  } catch (error) {
    console.error("GET Error:", error); // 👈 Check your VS Code terminal for this log
    return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 });
  }
}

// 2. CREATE PET
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newPet = await prisma.pet.create({
      data: {
        code: body.id,        
        name: body.title,
        category: body.category,
        breed: body.breed,
        gender: body.gender,
        age: Number(body.age),      // 👈 Must be Number now
        price: Number(body.price),  // 👈 Must be Number now
        color: body.color,
        description: body.description,
        imageUrl: body.imageUrl,
        images: body.images || [],
        healthGuarantee: body.healthGuarantee,
        status: 'Available'
      }
    });

    return NextResponse.json({ success: true, pet: newPet });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create pet" }, { status: 500 });
  }
}