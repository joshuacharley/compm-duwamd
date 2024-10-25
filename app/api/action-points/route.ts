import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const actionPoints = await db
      .collection("actionpoints")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(actionPoints);
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
    const result = await db.collection("actionpoints").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newActionPoint = await db
      .collection("actionpoints")
      .findOne({ _id: result.insertedId });

    return NextResponse.json(newActionPoint, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
