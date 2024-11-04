import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const bids = await db
      .collection("bids")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
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
    const result = await db.collection("bids").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ ...body, _id: result.insertedId });
  } catch (error) {
    console.error("Error adding bid:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
