import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const projectCount = await db.collection("projects").countDocuments();
    const taskCount = await db.collection("tasks").countDocuments();
    const completedTaskCount = await db.collection("tasks").countDocuments({ status: "Completed" });
    const trackerCount = await db.collection("trackers").countDocuments();

    const report = {
      projectCount,
      taskCount,
      completedTaskCount,
      trackerCount,
      taskCompletionRate: (completedTaskCount / taskCount * 100).toFixed(2)
    };

    return NextResponse.json(report);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}