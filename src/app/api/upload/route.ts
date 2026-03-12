import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB allowed on server

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Foto tidak ditemukan" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file foto melebihi batas maksimal 2MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const fileName = `${uuidv4()}-${Date.now()}${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "members");

    // Ensure directory exists
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/members/${fileName}`;

    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengunggah foto" },
      { status: 500 }
    );
  }
}
