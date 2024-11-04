import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

const taskUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  assignedTo: z.string().min(1, "Assignee is required").optional(),
  dueDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  status: z.enum(["Not Started", "In Progress", "Completed"]).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    if (
      !params.id ||
      !ObjectId.isValid(params.id) ||
      !params.taskId ||
      !ObjectId.isValid(params.taskId)
    ) {
      return NextResponse.json(
        { error: "Invalid ID provided" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const task = await db.collection("tasks").findOne({
      _id: new ObjectId(params.taskId),
      projectId: new ObjectId(params.id),
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...task,
      _id: task._id.toString(),
      projectId: task.projectId.toString(),
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PUT(
  request: Request,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    if (
      !params.id ||
      !ObjectId.isValid(params.id) ||
      !params.taskId ||
      !ObjectId.isValid(params.taskId)
    ) {
      return NextResponse.json(
        { error: "Invalid ID provided" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = taskUpdateSchema.parse(body);

    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    const result = await db.collection("tasks").findOneAndUpdate(
      {
        _id: new ObjectId(params.taskId),
        projectId: new ObjectId(params.id),
      },
      { $set: updateData },
      { returnDocument: "after" }
    );

    // Handle null result case
    if (!result || !result.value) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updatedTask = {
      ...result.value,
      _id: result.value._id.toString(),
      projectId: result.value.projectId.toString(),
    };

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    if (
      !params.id ||
      !ObjectId.isValid(params.id) ||
      !params.taskId ||
      !ObjectId.isValid(params.taskId)
    ) {
      return NextResponse.json(
        { error: "Invalid ID provided" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(params.taskId),
      projectId: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
