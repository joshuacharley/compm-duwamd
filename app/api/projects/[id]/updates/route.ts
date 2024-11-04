import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const project = await db
      .collection("projects")
      .findOne(
        { _id: new ObjectId(params.id) },
        { projection: { updates: 1 } }
      );
    return NextResponse.json(project?.updates || []);
  } catch (error) {
    console.error("Error fetching updates:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const body = await request.json();

    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $push: {
          updates: {
            _id: new ObjectId(),
            ...body,
            date: new Date(),
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Update added successfully" });
  } catch (error) {
    console.error("Error adding update:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
