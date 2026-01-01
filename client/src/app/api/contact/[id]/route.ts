import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// DELETE: Remove a specific message
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // ⚠️ Using (prisma as any) to avoid TS errors until regeneration
    await (prisma as any).contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}