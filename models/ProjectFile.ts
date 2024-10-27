import mongoose, { Document, Schema } from "mongoose";

export interface IProjectFile extends Document {
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  uploadDate: Date;
  projectId: string;
  fileId: mongoose.Types.ObjectId;
  description?: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  tags?: string[];
  status: "active" | "archived" | "deleted";
  version: number;
  lastModified: Date;
  metadata?: {
    dimensions?: {
      width: number;
      height: number;
    };
    duration?: number;
    pageCount?: number;
    [key: string]: any;
  };
  accessControl?: {
    visibility: "public" | "private" | "restricted";
    allowedUsers?: string[];
    allowedRoles?: string[];
  };
  thumbnailUrl?: string;
  category?: "document" | "image" | "spreadsheet" | "presentation" | "other";
}

const ProjectFileSchema = new Schema<IProjectFile>(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    fileId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    uploadedBy: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
      index: true,
    },
    version: {
      type: Number,
      default: 1,
      min: 1,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      dimensions: {
        width: Number,
        height: Number,
      },
      duration: Number,
      pageCount: Number,
    },
    accessControl: {
      visibility: {
        type: String,
        enum: ["public", "private", "restricted"],
        default: "private",
      },
      allowedUsers: [
        {
          type: String,
        },
      ],
      allowedRoles: [
        {
          type: String,
        },
      ],
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["document", "image", "spreadsheet", "presentation", "other"],
      default: "other",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
ProjectFileSchema.index({ uploadDate: -1 });
ProjectFileSchema.index({ "uploadedBy.id": 1 });
ProjectFileSchema.index({ tags: 1 });
ProjectFileSchema.index({ contentType: 1 });
ProjectFileSchema.index({ status: 1, projectId: 1 });

// Pre-save middleware to set category based on contentType
ProjectFileSchema.pre("save", function (next) {
  if (this.isModified("contentType")) {
    if (this.contentType.startsWith("image/")) {
      this.category = "image";
    } else if (
      this.contentType.includes("spreadsheet") ||
      this.contentType.includes("excel")
    ) {
      this.category = "spreadsheet";
    } else if (
      this.contentType.includes("presentation") ||
      this.contentType.includes("powerpoint")
    ) {
      this.category = "presentation";
    } else if (
      this.contentType.includes("document") ||
      this.contentType.includes("pdf")
    ) {
      this.category = "document";
    } else {
      this.category = "other";
    }
  }
  next();
});

// Ensure model isn't already defined before creating it
const ProjectFile =
  mongoose.models.ProjectFile ||
  mongoose.model<IProjectFile>("ProjectFile", ProjectFileSchema);

export default ProjectFile;
