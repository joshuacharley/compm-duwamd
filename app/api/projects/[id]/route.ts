import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const project = await db.collection("projects").findOne({
      _id: new ObjectId(params.id),
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Transform ObjectId to string
    return NextResponse.json({
      ...project,
      _id: project._id.toString(),
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const body = await request.json();
    const { _id, ...updateData } = body;

    // Convert date strings to Date objects
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    updateData.updatedAt = new Date();

    const result = await db
      .collection("projects")
      .findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    // Handle null result case
    if (!result || !result.value) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Transform ObjectId to string
    return NextResponse.json({
      ...result.value,
      _id: result.value._id.toString(),
    });
  } catch (error) {
    console.error("Error updating project:", error);
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
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const result = await db.collection("projects").deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
