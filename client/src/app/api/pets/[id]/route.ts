import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// 1. DELETE PET
export async function DELETE(req, { params }) {
  try {
    // FIX: Await params in Next.js 15+
    const { id } = await params; 
    
    await prisma.pet.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete pet" }, { status: 500 });
  }
}

// 2. UPDATE PET
export async function PUT(req, { params }) {
  try {
    // FIX: Await params in Next.js 15+
    const { id } = await params;
    
    const body = await req.json();

    // Check if ID is valid (basic check)
    if (!id) {
      return NextResponse.json({ error: "Missing Pet ID" }, { status: 400 });
    }

    const updatedPet = await prisma.pet.update({
      where: { id: id }, // This targets the MongoDB _id
      data: {
        code: body.id,       // Maps form 'id' to schema 'code'
        name: body.title,    // Maps form 'title' to schema 'name'
        category: body.category,
        breed: body.breed,
        gender: body.gender,
        age: body.age,
        price: body.price,
        color: body.color,
        description: body.description,
        imageUrl: body.imageUrl,
        images: body.images,
        healthGuarantee: body.healthGuarantee,
        status: body.status || 'Available'
      }
    });

    return NextResponse.json({ success: true, pet: updatedPet });
  } catch (error) {
    console.error("Detailed Update Error:", error); // LOOK IN TERMINAL IF THIS FAILS
    
    // Common Prisma Error: Record not found
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Pet not found in database" }, { status: 404 });
    }
    
    return NextResponse.json({ error: error.message || "Failed to update pet" }, { status: 500 });
  }
}