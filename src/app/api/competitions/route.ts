import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    const competition = await prisma.competition.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(competition);
  } catch (error) {
    console.error("Error creating competition:", error);
    return NextResponse.json(
      { error: "Failed to create competition" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const competitions = await prisma.competition.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(competitions);
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return NextResponse.json(
      { error: "Failed to fetch competitions" },
      { status: 500 }
    );
  }
}
