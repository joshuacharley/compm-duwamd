import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const body = await request.json();
    const { _id, ...updateData } = body;

    const result = await db.collection("installations").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...updateData,
          startDate: new Date(updateData.startDate),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Installation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Installation updated successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const result = await db
      .collection("installations")
      .deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Installation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Installation deleted successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
