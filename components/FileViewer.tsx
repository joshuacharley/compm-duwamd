"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  Trash2,
  File as FileIcon,
  MoreVertical,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileViewerProps {
  files: Array<{
    _id: string;
    filename: string;
    originalName: string;
    contentType: string;
    size: number;
    uploadDate: string;
    description?: string;
    uploadedBy: {
      id: string;
      name: string;
    };
    tags?: string[];
  }>;
  onDelete: (fileId: string) => Promise<void>;
  onRefresh: () => void;
}

export default function FileViewer({
  files,
  onDelete,
  onRefresh,
}: FileViewerProps) {
  const [selectedFile, setSelectedFile] = useState<
    FileViewerProps["files"][0] | null
  >(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = files.filter((file) =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePreview = async (file: FileViewerProps["files"][0]) => {
    try {
      const response = await fetch(`/api/files/${file._id}`);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setSelectedFile(file);
    } catch (error) {
      console.error("Error previewing file:", error);
      toast.error("Failed to preview file");
    }
  };

  const handleDownload = async (file: FileViewerProps["files"][0]) => {
    try {
      const response = await fetch(`/api/files/${file._id}`);
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const handleDelete = async (file: FileViewerProps["files"][0]) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await onDelete(file._id);
      toast.success("File deleted successfully");
      onRefresh();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (contentType: string): React.ElementType => {
    if (contentType.startsWith("image/")) return ImageIcon;
    if (contentType.includes("pdf")) return FileText;
    return FileIcon;
  };

  const getFileType = (contentType: string): string => {
    const types: { [key: string]: string } = {
      "application/pdf": "PDF",
      "image/jpeg": "JPEG Image",
      "image/png": "PNG Image",
      "image/gif": "GIF Image",
      "application/msword": "Word Document",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "Word Document",
      "application/vnd.ms-excel": "Excel Spreadsheet",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "Excel Spreadsheet",
      "text/plain": "Text File",
    };
    return types[contentType] || "Unknown Type";
  };

  const renderPreviewContent = () => {
    if (!selectedFile) return null;

    if (selectedFile.contentType.startsWith("image/")) {
      return (
        <img
          src={previewUrl || ""}
          alt={selectedFile.originalName}
          className="max-w-full h-auto"
        />
      );
    }

    if (selectedFile.contentType === "application/pdf") {
      return (
        <iframe
          src={previewUrl || ""}
          className="w-full h-[60vh]"
          title={selectedFile.originalName}
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <FileIcon className="w-16 h-16 text-gray-400" />
        <p className="text-center">
          Preview not available for {getFileType(selectedFile.contentType)}
        </p>
        <Button onClick={() => handleDownload(selectedFile)}>
          <Download className="mr-2 h-4 w-4" />
          Download to View
        </Button>
      </div>
    );
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <FileIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by uploading a file
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="h-[500px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 bg-background z-10">
                Name
              </TableHead>
              <TableHead className="sticky top-0 bg-background z-10">
                Type
              </TableHead>
              <TableHead className="sticky top-0 bg-background z-10">
                Size
              </TableHead>
              <TableHead className="sticky top-0 bg-background z-10">
                Uploaded By
              </TableHead>
              <TableHead className="sticky top-0 bg-background z-10">
                Upload Date
              </TableHead>
              <TableHead className="sticky top-0 bg-background z-10 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No files found matching your search
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {filteredFiles.map((file) => (
                  <motion.tr
                    key={file._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TableCell className="flex items-center space-x-2">
                      {React.createElement(getFileIcon(file.contentType), {
                        className: "h-5 w-5 text-gray-400",
                      })}
                      <span
                        className="truncate max-w-[200px]"
                        title={file.originalName}
                      >
                        {file.originalName}
                      </span>
                    </TableCell>
                    <TableCell>{getFileType(file.contentType)}</TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>{file.uploadedBy.name}</TableCell>
                    <TableCell>
                      {format(new Date(file.uploadDate), "PPp")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePreview(file)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload(file)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(file)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog open={!!selectedFile} onOpenChange={closePreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedFile?.originalName}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <div className="p-4">{renderPreviewContent()}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
