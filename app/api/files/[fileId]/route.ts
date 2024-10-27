import { NextResponse } from "next/server";
import { getFileFromGridFS, deleteFileFromGridFS } from "@/lib/gridfs";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const projectFile = await db.collection("projectfiles").findOne({
      _id: new ObjectId(params.fileId),
    });

    if (!projectFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = await getFileFromGridFS(projectFile.fileId);

    // Create response with appropriate headers
    const response = new NextResponse(fileBuffer);
    response.headers.set("Content-Type", projectFile.contentType);
    response.headers.set(
      "Content-Disposition",
      `inline; filename="${projectFile.originalName}"`
    );

    // Add CORS headers for document preview
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("Error retrieving file:", error);
    return NextResponse.json(
      { error: "Failed to retrieve file" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function DELETE(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const projectFile = await db.collection("projectfiles").findOne({
      _id: new ObjectId(params.fileId),
    });

    if (!projectFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete from GridFS
    await deleteFileFromGridFS(projectFile.fileId);

    // Delete record from MongoDB
    await db.collection("projectfiles").deleteOne({
      _id: new ObjectId(params.fileId),
    });

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
