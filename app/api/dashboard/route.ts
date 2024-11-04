import { NextResponse } from "next/server";
import { Db } from "mongodb";
import clientPromise from "@/lib/mongodb";

interface ProjectHealth {
  healthy: number;
  atRisk: number;
  critical: number;
}

interface DashboardKPIs {
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  teamUtilization: number;
  upcomingDeadlines: number;
  projectHealth: ProjectHealth;
}

interface RevenueData {
  month: string;
  revenue: number;
  forecast: number;
}

interface TeamPerformance {
  _id: string;
  completed: number;
  inProgress: number;
  overdue: number;
}

interface ResourceUtilization {
  date: string;
  planned: number;
  actual: number;
}

interface DashboardData {
  kpis: DashboardKPIs;
  revenueData: RevenueData[];
  teamPerformance: TeamPerformance[];
  resourceUtilization: ResourceUtilization[];
}

export async function GET(): Promise<
  NextResponse<DashboardData | { error: string }>
> {
  try {
    const client = await clientPromise;
    const db = client.db("commercial_pm");

    const activeProjects = await db
      .collection("projects")
      .countDocuments({ status: "In Progress" });
    const completedProjects = await db
      .collection("projects")
      .countDocuments({ status: "Completed" });
    const totalRevenue = await calculateTotalRevenue(db);
    const teamUtilization = await calculateTeamUtilization(db);
    const upcomingDeadlines = await calculateUpcomingDeadlines(db);
    const projectHealth = await calculateProjectHealth(db);

    const revenueData = await getRevenueData(db);
    const teamPerformance = await getTeamPerformance(db);
    const resourceUtilization = await getResourceUtilization(db);

    const dashboardData: DashboardData = {
      kpis: {
        activeProjects,
        completedProjects,
        totalRevenue,
        teamUtilization,
        upcomingDeadlines,
        projectHealth,
      },
      revenueData,
      teamPerformance,
      resourceUtilization,
    };

    return NextResponse.json(dashboardData);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function calculateTotalRevenue(db: Db): Promise<number> {
  const pipeline = [
    {
      $group: {
        _id: null,
        total: { $sum: "$dealWorth" },
      },
    },
  ];
  const result = await db
    .collection("pipelineprojects")
    .aggregate(pipeline)
    .toArray();
  return result[0]?.total || 0;
}

async function calculateTeamUtilization(db: Db): Promise<number> {
  const pipeline = [
    {
      $group: {
        _id: "$assignedTo",
        taskCount: { $sum: 1 },
      },
    },
  ];
  const result = await db.collection("tasks").aggregate(pipeline).toArray();
  const totalCapacity = result.length * 40;
  const totalAssigned = result.reduce(
    (acc, curr) => acc + (curr.taskCount || 0),
    0
  );
  return Math.round((totalAssigned / totalCapacity) * 100);
}

async function calculateUpcomingDeadlines(db: Db): Promise<number> {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  return await db.collection("tasks").countDocuments({
    dueDate: {
      $gte: new Date(),
      $lte: nextWeek,
    },
  });
}

async function calculateProjectHealth(db: Db): Promise<ProjectHealth> {
  const healthy = await db
    .collection("projects")
    .countDocuments({ health: "Healthy" });
  const atRisk = await db
    .collection("projects")
    .countDocuments({ health: "At Risk" });
  const critical = await db
    .collection("projects")
    .countDocuments({ health: "Critical" });

  return { healthy, atRisk, critical };
}

async function getRevenueData(db: Db): Promise<RevenueData[]> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const pipeline = [
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$dealWorth" },
        forecast: { $sum: { $multiply: ["$dealWorth", 1.1] } },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ];

  const result = await db
    .collection("pipelineprojects")
    .aggregate(pipeline)
    .toArray();
  return result.map((item) => ({
    month: `${item._id.year}-${item._id.month}`,
    revenue: item.revenue || 0,
    forecast: item.forecast || 0,
  }));
}

async function getTeamPerformance(db: Db): Promise<TeamPerformance[]> {
  const pipeline = [
    {
      $group: {
        _id: "$assignedTo",
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
        },
        overdue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$status", "Completed"] },
                  { $lt: ["$dueDate", new Date()] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ];

  return await db
    .collection("tasks")
    .aggregate<TeamPerformance>(pipeline)
    .toArray();
}

async function getResourceUtilization(db: Db): Promise<ResourceUtilization[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const pipeline = [
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        planned: { $sum: "$estimatedHours" },
        actual: { $sum: "$actualHours" },
      },
    },
    {
      $sort: { "_id.date": 1 },
    },
  ];

  const result = await db.collection("tasks").aggregate(pipeline).toArray();
  return result.map((item) => ({
    date: item._id.date,
    planned: item.planned || 0,
    actual: item.actual || 0,
  }));
}
