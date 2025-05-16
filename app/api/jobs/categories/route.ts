import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const counts = await prisma.job.groupBy({
      by: ["category"],
      _count: {
        _all: true,
      },
    });

    // Convert to object with category names as keys
    const result = counts.reduce((acc, { category, _count }) => {
      acc[category] = _count._all;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching category counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch category counts" },
      { status: 500 }
    );
  }
}
