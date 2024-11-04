import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const tasks = await db.collection("tasks").find({}).toArray();
    return NextResponse.json(tasks);
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

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Task name is required" },
        { status: 400 }
      );
    }

    const newTask = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("tasks").insertOne(newTask);
    const insertedTask = await db
      .collection("tasks")
      .findOne({ _id: result.insertedId });

    return NextResponse.json(insertedTask);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id || !ObjectId.isValid(_id)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    if (!updateData.name?.trim()) {
      return NextResponse.json(
        { error: "Task name is required" },
        { status: 400 }
      );
    }

    const result = await db.collection("tasks").findOneAndUpdate(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result || !result.value) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(result.value);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");
    const { id } = await request.json();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const result = await db
      .collection("tasks")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
