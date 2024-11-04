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
        { projection: { meetings: 1 } }
      );
    return NextResponse.json(project?.meetings || []);
  } catch (error) {
    console.error("Error fetching meetings:", error);
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
          meetings: {
            _id: new ObjectId(),
            ...body,
            date: new Date(body.date),
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Meeting added successfully" });
  } catch (error) {
    console.error("Error adding meeting:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
