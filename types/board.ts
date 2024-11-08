import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ObjectId } from "mongodb";

export interface Board {
  _id: ObjectId;
  name: string;
  elements: ExcalidrawElement[];
  thumbnail?: string;
  collaborators: Collaborator[];
  workspaceId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  role: "owner" | "editor" | "viewer";
}
