import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Info,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Plus,
  Trash,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { IActivityReport } from "@/models/ActivityReport";
import { getWeekNumber } from "@/app/utils/dateUtils";

interface ActivityReportProps {
  fetchActivityReports: () => Promise<IActivityReport[]>;
}

const ActivityReport: React.FC<ActivityReportProps> = ({
  fetchActivityReports,
}) => {
  const [activityReports, setActivityReports] = useState<IActivityReport[]>([]);
  const [newReport, setNewReport] = useState<Partial<IActivityReport>>(
    getInitialReportState()
  );
  const [expandedReports, setExpandedReports] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);

  useEffect(() => {
    loadActivityReports();
  }, []);

  function getInitialReportState(): Partial<IActivityReport> {
    return {
      informationSharing: [""],
      workedWell: [""],
      difficulties: [""],
      alignmentRequest: [""],
      week: getWeekNumber(new Date()),
      year: new Date().getFullYear(),
    };
  }

  const loadActivityReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const reports = await fetchActivityReports();
      setActivityReports(reports);
    } catch (error) {
      console.error("Error loading activity reports:", error);
      setError("Failed to load activity reports. Please try again later.");
      toast.error("Failed to load activity reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    section: keyof IActivityReport,
    index: number,
    value: string
  ) => {
    setNewReport((prev) => ({
      ...prev,
      [section]:
        prev[section]?.map((item: string, i: number) =>
          i === index ? value : item
        ) || [],
    }));
  };

  const addInput = (section: keyof IActivityReport) => {
    setNewReport((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), ""],
    }));
  };

  const removeInput = (section: keyof IActivityReport, index: number) => {
    setNewReport((prev) => ({
      ...prev,
      [section]:
        prev[section]?.filter((_: string, i: number) => i !== index) || [],
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/activity-reports", {
        method: editingReportId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingReportId ? { ...newReport, _id: editingReportId } : newReport
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      toast.success(
        editingReportId
          ? "Report updated successfully"
          : "Report submitted successfully"
      );
      setNewReport(getInitialReportState());
      setEditingReportId(null);
      loadActivityReports();
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    }
  };

  const handleEdit = (report: IActivityReport) => {
    setNewReport(report);
    setEditingReportId(report._id as string);
  };

  const handleDelete = async (reportId: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        const response = await fetch(`/api/activity-reports/${reportId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete report");
        }

        toast.success("Report deleted successfully");
        loadActivityReports();
      } catch (error) {
        console.error("Error deleting report:", error);
        toast.error("Failed to delete report");
      }
    }
  };

  const toggleReportExpansion = (reportId: string) => {
    setExpandedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  const renderInputSection = (
    title: string,
    icon: React.ReactNode,
    section: keyof IActivityReport
  ) => (
    <div className="mb-4">
      <h4 className="flex items-center font-semibold mb-2">
        {icon}
        <span className="ml-2">{title}</span>
      </h4>
      {newReport[section]?.map((item: string, index: number) => (
        <div key={index} className="flex items-center mb-2">
          <Input
            value={item}
            onChange={(e) => handleInputChange(section, index, e.target.value)}
            className="flex-grow mr-2"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeInput(section, index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )) || null}
      <Button
        variant="outline"
        size="sm"
        onClick={() => addInput(section)}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" /> Add {title}
      </Button>
    </div>
  );

  const renderReportSection = (title: string, items: string[]) => (
    <div className="mb-4">
      <h4 className="font-semibold">{title}</h4>
      <ul className="list-disc pl-5">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-4">Loading activity reports...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>
          {editingReportId ? "Edit Activity Report" : "New Activity Report"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderInputSection(
          "Information Sharing",
          <Info className="h-5 w-5 text-blue-500" />,
          "informationSharing"
        )}
        {renderInputSection(
          "What Worked Well",
          <CheckCircle className="h-5 w-5 text-green-500" />,
          "workedWell"
        )}
        {renderInputSection(
          "Difficulties",
          <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          "difficulties"
        )}
        {renderInputSection(
          "Alignment Request",
          <HelpCircle className="h-5 w-5 text-purple-500" />,
          "alignmentRequest"
        )}

        <Button onClick={handleSubmit} className="mt-4">
          {editingReportId ? "Update Report" : "Submit Report"}
        </Button>
        {editingReportId && (
          <Button
            onClick={() => {
              setNewReport(getInitialReportState());
              setEditingReportId(null);
            }}
            variant="outline"
            className="mt-4 ml-2"
          >
            Cancel Edit
          </Button>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Previous Reports</h3>
          {activityReports.length > 0 ? (
            activityReports.map((report) => (
              <Card key={report._id as string} className="mb-4">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>
                      Week {report.week}, {report.year}
                    </span>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(report)}
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(report._id as string)}
                        className="mr-2"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleReportExpansion(report._id as string)
                        }
                      >
                        {expandedReports[report._id as string] ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                {expandedReports[report._id as string] && (
                  <CardContent>
                    {renderReportSection(
                      "Information Sharing",
                      report.informationSharing
                    )}
                    {renderReportSection("What Worked Well", report.workedWell)}
                    {renderReportSection("Difficulties", report.difficulties)}
                    {renderReportSection(
                      "Alignment Request",
                      report.alignmentRequest
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No activity reports found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityReport;
