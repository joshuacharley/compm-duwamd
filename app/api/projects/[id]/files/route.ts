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
      .findOne({ _id: new ObjectId(params.id) }, { projection: { files: 1 } });
    return NextResponse.json(project?.files || []);
  } catch (error) {
    console.error("Error fetching files:", error);
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
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // In a real application, you would upload the file to a storage service
    // and get back a URL. For this example, we'll create a mock URL.
    const mockUrl = `https://storage.example.com/${file.name}`;

    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const fileDoc = {
      _id: new ObjectId(),
      name: file.name,
      url: mockUrl,
      type: file.type,
      uploadedBy: "Current User", // Replace with actual user
      uploadedAt: new Date(),
    };

    const result = await db
      .collection("projects")
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $push: { files: fileDoc } }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(fileDoc);
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
