import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const files = await db
      .collection("projectfiles")
      .find({ projectId: params.projectId })
      .sort({ uploadDate: -1 })
      .toArray();

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching project files:", error);
    return NextResponse.json(
      { error: "Failed to fetch project files" },
      { status: 500 }
    );
  }
}
