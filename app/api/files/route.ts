import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const query = projectId ? { projectId } : {};
    const files = await db
      .collection("projectfiles")
      .find(query)
      .sort({ uploadDate: -1 })
      .toArray();

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
