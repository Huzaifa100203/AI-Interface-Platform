import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_COUNT = 5;
const ALLOWED_TYPES = [
  'text/plain',
  'application/json',
  'text/markdown',
  'application/pdf',
  'image/png',
  'image/jpeg',
];

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authError = await requireAuth(req);
    if (authError) return authError;

    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (files.length > MAX_FILE_COUNT) {
      return NextResponse.json(
        { error: `You can upload up to ${MAX_FILE_COUNT} files at once.` },
        { status: 400 }
      );
    }

    // Validate and save files
    const savedFiles = await Promise.all(
      files.map(async (file, index) => {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File "${file.name}" is larger than 5MB.`);
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error(`File type not allowed: ${file.type || 'unknown'}.`);
        }

        // Generate unique filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const storedName = `${timestamp}-${index}-${safeName}`;
        const filePath = path.join(uploadDir, storedName);

        // Save file to disk
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        return {
          id: `file-${timestamp}-${index}`,
          name: file.name,
          storedName,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          url: `/uploads/${storedName}`, // Public URL to access the file
        };
      })
    );

    return NextResponse.json({ 
      success: true,
      files: savedFiles 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    );
  }
}
