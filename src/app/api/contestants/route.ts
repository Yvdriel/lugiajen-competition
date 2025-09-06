import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      karateSchool,
      beltColor,
      age,
      email,
      kata,
      kumite,
    } = body;

    // Get the active competition
    const activeCompetition = await prisma.competition.findFirst({
      where: { isActive: true },
    });

    if (!activeCompetition) {
      return NextResponse.json(
        { error: "No active competition found" },
        { status: 400 }
      );
    }

    // Create the contestant
    const contestant = await prisma.contestant.create({
      data: {
        firstName,
        lastName,
        karateSchool,
        beltColor,
        age: parseInt(age),
        email,
        kata,
        kumite,
        competitionId: activeCompetition.id,
      },
    });

    // Create Stripe payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Tournament Registration - ${firstName} ${lastName}`,
              description: `Registration for ${activeCompetition.name}`,
            },
            unit_amount: 2500, // €25.00
          },
          quantity: 1,
        },
      ],
      metadata: {
        contestantId: contestant.id,
      },
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?contestant=${contestant.id}`,
        },
      },
    });

    return NextResponse.json({
      contestant,
      paymentUrl: paymentLink.url,
    });
  } catch (error) {
    console.error("Error creating contestant:", error);
    return NextResponse.json(
      { error: "Failed to create contestant" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contestants = await prisma.contestant.findMany({
      include: {
        competition: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(contestants);
  } catch (error) {
    console.error("Error fetching contestants:", error);
    return NextResponse.json(
      { error: "Failed to fetch contestants" },
      { status: 500 }
    );
  }
}
