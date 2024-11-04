import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const pipelineProjects = await db
      .collection("pipelineprojects")
      .find({})
      .sort({ projectId: -1 })
      .toArray();
    return NextResponse.json(pipelineProjects);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const body = await request.json();

    // Generate a unique projectId
    const lastProject = await db
      .collection("pipelineprojects")
      .findOne({}, { sort: { projectId: -1 } });
    const newProjectId = lastProject ? lastProject.projectId + 1 : 1;

    const newProject = { ...body, projectId: newProjectId };
    const result = await db
      .collection("pipelineprojects")
      .insertOne(newProject);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
