import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// POST: Save a new message (Public)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ⚠️ FIX: Use (prisma as any) here
    const newMessage = await (prisma as any).contactMessage.create({
      data: { name, email, subject, message },
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Contact Error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// GET: Fetch all messages (Admin Only)
export async function GET() {
  try {
    // ⚠️ FIX: Use (prisma as any) here
    const messages = await (prisma as any).contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}