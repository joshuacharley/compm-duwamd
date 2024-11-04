import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const installations = await db
      .collection("installations")
      .find({})
      .toArray();
    return NextResponse.json(installations);
  } catch (e) {
    console.error(e);
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
    const result = await db.collection("installations").insertOne({
      ...body,
      startDate: new Date(body.startDate),
      aging: parseInt(body.aging, 10), // Ensure aging is stored as a number
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
