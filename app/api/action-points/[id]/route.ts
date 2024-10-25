import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface ActionPoint {
  _id?: ObjectId;
  topic: string;
  description: string;
  processingDate: Date;
  responsibility: string;
  expectedClosingDate: Date;
  status: "Pending" | "In Progress" | "Completed";
  updatedAt: Date;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const body = (await request.json()) as Partial<ActionPoint>;

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid action point ID" },
        { status: 400 }
      );
    }

    const { _id, ...updateData } = body;

    const result = await db
      .collection<ActionPoint>("actionpoints")
      .findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: { ...updateData, updatedAt: new Date() } },
        { returnDocument: "after" }
      );

    if (!result) {
      return NextResponse.json(
        { error: "Action point not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid action point ID" },
        { status: 400 }
      );
    }

    const result = await db
      .collection<ActionPoint>("actionpoints")
      .deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Action point not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Action point deleted successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
