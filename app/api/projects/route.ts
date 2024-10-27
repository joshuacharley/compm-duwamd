import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const projects = await db.collection("projects").find({}).toArray();

    // Transform ObjectId to string for each project
    const transformedProjects = projects.map((project) => ({
      ...project,
      _id: project._id.toString(),
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
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

    // Validate request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "objective",
      "scope",
      "status",
      "priority",
      "startDate",
      "endDate",
      "manager",
      "department",
      "stakeholders",
    ];

    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Add timestamps and initial progress
    const projectData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    };

    const result = await db.collection("projects").insertOne(projectData);

    if (!result.insertedId) {
      return NextResponse.json(
        { error: "Failed to create project" },
        { status: 500 }
      );
    }

    // Return the created project with string _id
    const createdProject = {
      ...projectData,
      _id: result.insertedId.toString(),
    };

    return NextResponse.json(createdProject);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
