export interface ProjectFile {
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
  projectId: string;
  fileId: string;
  status: "active" | "archived" | "deleted";
  version: number;
  lastModified: Date;
}
