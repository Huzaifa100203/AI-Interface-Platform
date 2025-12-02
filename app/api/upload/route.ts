import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_COUNT = 5;
const ALLOWED_TYPES = [
  "text/plain",
  "application/json",
  "text/markdown",
  "application/pdf",
  "image/png",
  "image/jpeg",
];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json(
      { error: "No files provided" },
      { status: 400 }
    );
  }

  if (files.length > MAX_FILE_COUNT) {
    return NextResponse.json(
      { error: `You can upload up to ${MAX_FILE_COUNT} files at once.` },
      { status: 400 }
    );
  }

  const fileMetas = files.map((file, index) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File "${file.name}" is larger than 5MB.`);
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`File type not allowed: ${file.type || "unknown"}.`);
    }

    return {
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    };
  });

  // In a real implementation, this is where you'd persist to blob storage (S3, R2, etc.)
  // For now we just return metadata so the frontend can associate files with messages.

  return NextResponse.json({ files: fileMetas });
}


