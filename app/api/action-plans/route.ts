import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const actionPlans = await db
      .collection("actionplans")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(actionPlans);
  } catch (error) {
    console.error("Error fetching action plans:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const body = await request.json();
    const result = await db.collection("actionplans").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ ...body, _id: result.insertedId });
  } catch (error) {
    console.error("Error adding action plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
