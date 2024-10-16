"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";

type AttendanceRecord = {
  _id: string;
  name: string;
  department: string;
  status: string;
  week: string;
};

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [newMember, setNewMember] = useState({
    name: "",
    department: "",
    status: "Present",
  });

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch("/api/attendance");
      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast.error("Failed to load attendance data");
    }
  };

  const handleAddMember = async () => {
    if (newMember.name && newMember.department && selectedWeek) {
      try {
        const response = await fetch("/api/attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...newMember, week: selectedWeek }),
        });

        if (!response.ok) {
          throw new Error("Failed to add attendance record");
        }

        const result = await response.json();
        setAttendanceData([
          ...attendanceData,
          { ...newMember, week: selectedWeek, _id: result.insertedId },
        ]);
        setNewMember({ name: "", department: "", status: "Present" });
        toast.success("Attendance record added successfully");
      } catch (error) {
        console.error("Error adding attendance record:", error);
        toast.error("Failed to add attendance record");
      }
    }
  };

  // const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6" "week 7"];
  const weeks = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);
  const departments = ["B2B", "B2C"];

  const filteredAttendance = selectedWeek
    ? attendanceData.filter((member) => member.week === selectedWeek)
    : attendanceData;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Attendance Tracker</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Member's Full Name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                className="flex-grow"
              />
              <Select
                value={newMember.department}
                onValueChange={(value) =>
                  setNewMember({ ...newMember, department: value })
                }
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={newMember.status}
                onValueChange={(value) =>
                  setNewMember({ ...newMember, status: value })
                }
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select Week" />
                </SelectTrigger>
                <SelectContent>
                  {weeks.map((week) => (
                    <SelectItem key={week} value={week}>
                      {week}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddMember}>Add Member</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Week</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((member, index) => (
                  <motion.tr
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.status === "Present"
                            ? "success"
                            : "destructive"
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.week}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
