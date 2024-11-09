import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendBidAlert } from "@/lib/emailService";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const body = await request.json();

    // Add [TEST] prefix if not already present
    if (!body.title.startsWith("[TEST]")) {
      body.title = `[TEST] ${body.title}`;
    }

    // Insert test bid alert
    const result = await db.collection("bidalerts").insertOne({
      ...body,
      createdAt: new Date(),
    });

    // Send test email alert
    await sendBidAlert([{ ...body, _id: result.insertedId }]);

    return NextResponse.json({
      message: "Test bid alert created and email sent successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating test bid alert:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
