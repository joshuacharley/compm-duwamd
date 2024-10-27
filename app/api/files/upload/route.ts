import { NextResponse } from "next/server";
import { uploadFileToGridFS } from "@/lib/gridfs";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to GridFS
    const fileId = await uploadFileToGridFS(buffer, file.name, {
      projectId,
      contentType: file.type,
    });

    // Get MongoDB client and create file record
    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const projectFile = await db.collection("projectfiles").insertOne({
      filename: fileId.toString(),
      originalName: file.name,
      contentType: file.type,
      size: file.size,
      projectId,
      fileId: new ObjectId(fileId),
      uploadedBy: {
        id: "system",
        name: "System Upload",
      },
      uploadDate: new Date(),
      status: "active",
      version: 1,
      lastModified: new Date(),
    });

    const insertedFile = await db.collection("projectfiles").findOne({
      _id: projectFile.insertedId,
    });

    return NextResponse.json({
      message: "File uploaded successfully",
      file: insertedFile,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
