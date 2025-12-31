// app/api/seed/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Pet from '@/models/Pet';

export async function GET() {
  try {
    await connectDB();

    // 1. Clear existing data to avoid duplicates (Optional)
    await Pet.deleteMany({});

    // 2. The data from your design
    const petsData = [
      {
        id: "MO231",
        title: "Pomeranian White",
        gender: "Male",
        age: "02 months",
        price: "6.900.000 VND",
        imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800"
      },
      {
        id: "MO502",
        title: "Poodle Tiny Yellow",
        gender: "Female",
        age: "02 months",
        price: "3.900.000 VND",
        imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800"
      },
      {
        id: "MO102",
        title: "Poodle Tiny Sepia",
        gender: "Male",
        age: "02 months",
        price: "4.000.000 VND",
        imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800"
      },
      {
        id: "MO512",
        title: "Alaskan Malamute Grey",
        gender: "Male",
        age: "02 months",
        price: "8.900.000 VND",
        imageUrl: "https://images.unsplash.com/photo-1563889958749-6256580e556e?w=800"
      }
    ];

    // 3. Insert the data
    await Pet.insertMany(petsData);

    return NextResponse.json({ message: "Database successfully seeded with pets!" });

  } catch (error: any) {
    // This will print the REAL error to your terminal
    console.error("SEEDING ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}