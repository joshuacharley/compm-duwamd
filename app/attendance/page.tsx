"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [newMember, setNewMember] = useState({ name: '', department: '', status: 'Present' });

  useEffect(() => {
    // Fetch attendance data from API
    // For now, we'll use mock data
    setAttendanceData([
      { id: 1, name: 'Annie Wonnie- Katta', department: 'B2B', status: 'Present', week: 'Week 1' },
      { id: 2, name: 'Priscilla Okechuku', department: 'B2C', status: 'Absent', week: 'Week 1' },
      { id: 3, name: 'Nyake Vandi', department: 'B2B', status: 'Present', week: 'Week 2' },
    ]);
  }, []);

  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
  const departments = ['B2B', 'B2C'];

  const handleAddMember = () => {
    if (newMember.name && newMember.department && selectedWeek) {
      setAttendanceData([...attendanceData, { ...newMember, id: Date.now(), week: selectedWeek }]);
      setNewMember({ name: '', department: '', status: 'Present' });
    }
  };

  const filteredAttendance = selectedWeek
    ? attendanceData.filter(member => member.week === selectedWeek)
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
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className="flex-grow"
              />
              <Select
                value={newMember.department}
                onValueChange={(value) => setNewMember({...newMember, department: value})}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={newMember.status}
                onValueChange={(value) => setNewMember({...newMember, status: value})}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selectedWeek}
                onValueChange={setSelectedWeek}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select Week" />
                </SelectTrigger>
                <SelectContent>
                  {weeks.map((week) => (
                    <SelectItem key={week} value={week}>{week}</SelectItem>
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
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <Badge variant={member.status === 'Present' ? 'success' : 'destructive'}>
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