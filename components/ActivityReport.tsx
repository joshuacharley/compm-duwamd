"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Info, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";

interface ActivityReportProps {
  activityReport: {
    informationSharing: string[];
    workedWell: string[];
    difficulties: string[];
    alignmentRequest: string[];
  };
  updateActivityReport: (updatedReport: any) => void;
}

const ActivityReport: React.FC<ActivityReportProps> = ({
  activityReport,
  updateActivityReport,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedReport, setEditedReport] = useState(activityReport);

  const handleInputChange = (section: string, value: string) => {
    setEditedReport((prev) => ({
      ...prev,
      [section]: value.split("\n").filter((item) => item.trim() !== ""),
    }));
  };

  const handleSave = () => {
    updateActivityReport(editedReport);
    setEditMode(false);
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    items: string[],
    section: string
  ) => (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 flex items-center text-lg">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      {editMode ? (
        <Textarea
          value={items.join("\n")}
          onChange={(e) => handleInputChange(section, e.target.value)}
          rows={5}
          className="w-full p-2 border rounded"
        />
      ) : (
        <ul className="list-disc pl-5 space-y-1">
          {items.map((item, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <Card className="mt-8 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl text-indigo-700 dark:text-indigo-300">
          <span>Activity Report</span>
          <Button
            onClick={() => (editMode ? handleSave() : setEditMode(true))}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {editMode ? "Save Changes" : "Edit Report"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderSection(
          "Information Sharing",
          <Info className="w-5 h-5 text-blue-500" />,
          editedReport.informationSharing,
          "informationSharing"
        )}
        {renderSection(
          "What Worked Well",
          <CheckCircle className="w-5 h-5 text-green-500" />,
          editedReport.workedWell,
          "workedWell"
        )}
        {renderSection(
          "Difficulties / Challenges",
          <AlertTriangle className="w-5 h-5 text-yellow-500" />,
          editedReport.difficulties,
          "difficulties"
        )}
        {renderSection(
          "Alignment / Coordination / Support Request",
          <HelpCircle className="w-5 h-5 text-purple-500" />,
          editedReport.alignmentRequest,
          "alignmentRequest"
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityReport;
