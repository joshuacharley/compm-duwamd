// components/DocumentPreview.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";

interface DocumentPreviewProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
}

export default function DocumentPreview({
  fileUrl,
  fileName,
  fileType,
}: DocumentPreviewProps) {
  const [loading, setLoading] = useState(false);

  // Google Docs Viewer URL
  const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
    fileUrl
  )}&embedded=true`;

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-white rounded-lg overflow-hidden">
        <iframe
          src={googleDocsViewerUrl}
          className="w-full h-full border-0"
          title={fileName}
        />
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <Button
          variant="outline"
          onClick={handleDownload}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </Button>
      </div>
    </div>
  );
}
