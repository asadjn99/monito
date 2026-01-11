import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. 🧹 CLEAN THE EMAIL
    const cleanEmail = email.trim().toLowerCase();

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 3. Hash the password
    const hashedPassword = await hash(password, 12);

    // 4. Save to Database
    const user = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        password: hashedPassword,
        // ⚠️ I changed this to "user" for safety. 
        // If you need an admin, change it manually in MongoDB Atlas.
        role: "user", 
        image: `https://res.cloudinary.com/dvwqnzsgx/image/upload/v1767095412/asadjn99_16kb_jjstuw.jpg`,
      },
    });

    return NextResponse.json({ success: true, user });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}