import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // 1. Find User First
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // 2. SECURITY: Prevent Deleting Admins
    if (user.role === 'admin') {
      return NextResponse.json({ success: false, message: "Cannot delete Administrator accounts." }, { status: 403 });
    }

    // 3. Delete the User
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true, message: "User deleted successfully" });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
  }
}