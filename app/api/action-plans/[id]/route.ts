import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const body = await request.json();

    // Remove _id from the body if it exists
    const { _id, ...updateData } = body;

    // Convert date strings to Date objects
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline);
    }
    if (updateData.actualCompletionDate) {
      updateData.actualCompletionDate = new Date(
        updateData.actualCompletionDate
      );
    }

    const result = await db
      .collection("actionplans")
      .findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: { ...updateData, updatedAt: new Date() } },
        { returnDocument: "after" }
      );

    if (!result) {
      return NextResponse.json(
        { error: "Action plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating action plan:", error);
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
      .collection("actionplans")
      .deleteOne({ _id: new ObjectId(params.id) });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Action plan not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Action plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting action plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
