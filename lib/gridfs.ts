import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "stream";
import { promises as fs } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";

let bucket: GridFSBucket;

export async function getGridFSBucket() {
  if (!bucket) {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db();
      bucket = new GridFSBucket(db, {
        bucketName: "projectFiles",
      });
    } catch (error) {
      console.error("Failed to initialize GridFS bucket:", error);
      throw new Error("Failed to initialize file storage");
    }
  }
  return bucket;
}

export async function uploadFileToGridFS(
  buffer: Buffer,
  filename: string,
  metadata: Record<string, any>
): Promise<ObjectId> {
  try {
    const bucket = await getGridFSBucket();

    return new Promise((resolve, reject) => {
      // Create a readable stream from the buffer
      const readStream = Readable.from(buffer);

      // Open upload stream with metadata
      const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          ...metadata,
          uploadDate: new Date(),
          originalName: filename,
        },
      });

      // Handle upload events
      uploadStream.on("error", (error) => {
        console.error("Error uploading to GridFS:", error);
        reject(new Error("Failed to upload file"));
      });

      uploadStream.on("finish", () => {
        resolve(uploadStream.id);
      });

      // Pipe the read stream to the upload stream
      readStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error("Error in uploadFileToGridFS:", error);
    throw new Error("Failed to upload file to storage");
  }
}

export async function getFileFromGridFS(fileId: ObjectId): Promise<Buffer> {
  try {
    const bucket = await getGridFSBucket();

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      const downloadStream = bucket.openDownloadStream(fileId);

      downloadStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      downloadStream.on("error", (error) => {
        console.error("Error downloading from GridFS:", error);
        reject(new Error("Failed to download file"));
      });

      downloadStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
    });
  } catch (error) {
    console.error("Error in getFileFromGridFS:", error);
    throw new Error("Failed to retrieve file from storage");
  }
}

export async function deleteFileFromGridFS(fileId: ObjectId): Promise<void> {
  try {
    const bucket = await getGridFSBucket();
    await bucket.delete(fileId);
  } catch (error) {
    console.error("Error in deleteFileFromGridFS:", error);
    throw new Error("Failed to delete file from storage");
  }
}

export async function getFileMetadata(fileId: ObjectId) {
  try {
    const bucket = await getGridFSBucket();
    const [metadata] = await bucket.find({ _id: fileId }).toArray();
    return metadata;
  } catch (error) {
    console.error("Error in getFileMetadata:", error);
    throw new Error("Failed to retrieve file metadata");
  }
}

export async function saveFileLocally(
  buffer: Buffer,
  filename: string
): Promise<string> {
  try {
    // Create a unique filename to avoid collisions
    const uniqueFilename = `${uuidv4()}-${filename}`;
    const tempPath = join(tmpdir(), uniqueFilename);

    // Write the buffer to a temporary file
    await fs.writeFile(tempPath, buffer);

    return tempPath;
  } catch (error) {
    console.error("Error saving file locally:", error);
    throw new Error("Failed to save file temporarily");
  }
}

export async function cleanupTempFile(filepath: string) {
  try {
    await fs.unlink(filepath);
  } catch (error) {
    console.error("Error cleaning up temporary file:", error);
  }
}

export async function streamToBuffer(
  stream: NodeJS.ReadableStream
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
