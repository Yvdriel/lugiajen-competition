import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isActive, isOpen } = body;

    // If setting a competition as active, deactivate all others
    if (isActive) {
      await prisma.competition.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const competition = await prisma.competition.update({
      where: { id },
      data: { isActive, isOpen },
    });

    return NextResponse.json(competition);
  } catch (error) {
    console.error("Error updating competition:", error);
    return NextResponse.json(
      { error: "Failed to update competition" },
      { status: 500 }
    );
  }
}
