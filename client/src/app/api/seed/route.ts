import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
  try {
    // 1. Check if we already have users to avoid duplicates
    const count = await prisma.user.count();
    if (count > 2) {
      return NextResponse.json({ message: "Database already has data! Seeding skipped." });
    }

    const password = await hash("password123", 12); // Default password for all

    // 2. Realistic Dummy Data
    const dummyUsers = [
      { name: "Ali Khan", email: "ali.khan@gmail.com", role: "user", phone: "+92 300 1234567" },
      { name: "Sara Ahmed", email: "sara.art@outlook.com", role: "user", phone: "+92 321 9876543" },
      { name: "John Smith", email: "john.smith@tech.co", role: "user", phone: "+1 555 0192" },
      { name: "Ayesha Malik", email: "ayesha.m@gmail.com", role: "admin", phone: "+92 333 5556667" }, // Another Admin
      { name: "Bilal Hameed", email: "bilal.h@yahoo.com", role: "user", phone: "+92 345 1122334" },
      { name: "Zara Sheikh", email: "zara.fashion@gmail.com", role: "user", phone: "+92 301 7788990" },
      { name: "David Miller", email: "d.miller@gmail.com", role: "user", phone: "+44 7700 900077" },
      { name: "Fatima Noor", email: "noor.fatima@hotmail.com", role: "user", phone: "+92 312 4455667" },
      { name: "Usman Ghani", email: "usman.dev@gmail.com", role: "user", phone: "+92 300 9988776" },
      { name: "Hina Rabbani", email: "hina.r@gmail.com", role: "user", phone: "+92 321 2233445" },
    ];

    // 3. Insert into Database
    for (const user of dummyUsers) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          name: user.name,
          email: user.email,
          password: password,
          role: user.role,
          // If your schema has a phone field, uncomment below:
          // phone: user.phone, 
          image: `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=random`,
        },
      });
    }

    return NextResponse.json({ success: true, message: "✅ Database Seeded with 10 Users!" });

  } catch (error) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}