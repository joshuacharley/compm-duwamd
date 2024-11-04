import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignedTo: z.string().min(1, "Assignee is required"),
  dueDate: z.string().transform((str) => new Date(str)),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Not Started", "In Progress", "Completed"]),
});

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

    const tasks = await db
      .collection("tasks")
      .find({ projectId: new ObjectId(params.id) })
      .toArray();

    return NextResponse.json(
      tasks.map((task) => ({
        ...task,
        _id: task._id.toString(),
        projectId: task.projectId.toString(),
      }))
    );
  } catch (error) {
    console.error("Error fetching project tasks:", error);
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
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = taskSchema.parse(body);

    const client = await clientPromise;
    const db = client.db("commercial_pm");

    // Verify project exists
    const project = await db.collection("projects").findOne({
      _id: new ObjectId(params.id),
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const taskData = {
      ...validatedData,
      projectId: new ObjectId(params.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("tasks").insertOne(taskData);

    if (!result.insertedId) {
      return NextResponse.json(
        { error: "Failed to create task" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...taskData,
      _id: result.insertedId.toString(),
      projectId: params.id,
    });
  } catch (error) {
    console.error("Error creating project task:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
