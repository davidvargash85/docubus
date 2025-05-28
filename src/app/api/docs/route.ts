import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const filePath = path.join(process.cwd(), "content", "manual.md");

export async function GET() {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return NextResponse.json({ content });
  } catch (err) {
    return NextResponse.json({ error: "Manual not found" }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, "utf-8");

    return NextResponse.json({ message: "Manual saved successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save manual" }, { status: 500 });
  }
}
