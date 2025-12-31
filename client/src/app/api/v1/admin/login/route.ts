// import { NextResponse } from "next/server";
// import prisma from "@/src/lib/prisma";
// import { compare } from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, password } = body;

//     // 1. Validate Input
//     if (!email || !password) {
//       return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
//     }

//     // 2. Find User in MongoDB
//     const user = await prisma.user.findUnique({
//       where: { email: email },
//     });

//     // 3. Check if User Exists
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 401 });
//     }

//     // But for production, always use compare()
//     const isPasswordValid = await compare(password, user.password);

//     if (!isPasswordValid) {
//       return NextResponse.json({ error: "Invalid password" }, { status: 401 });
//     }

//     // 6. Return User Info (Exclude password)
//     const { password: _, ...userWithoutPassword } = user;
    
//     return NextResponse.json(userWithoutPassword);

//   } catch (error) {
//     console.error("Login API Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }















import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { compare } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Validate Input
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    // 2. Find User in MongoDB
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // 3. Check if User Exists AND has a password
    // 👇 FIX: We check (!user.password) to ensure it's not null before comparing
    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found or password not set" }, { status: 401 });
    }

    // 4. Compare Password
    // TypeScript now knows user.password is definitely a string here
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // 5. Return User Info (Exclude password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}