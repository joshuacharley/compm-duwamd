import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const activityReports = await db
      .collection("activityreports")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(activityReports);
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
    const result = await db.collection("activityreports").insertOne({
      ...body,
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

export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const body = await request.json();
    const { _id, ...updateData } = body;
    const result = await db
      .collection("activityreports")
      .updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Activity report not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Activity report updated successfully",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
