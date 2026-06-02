import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const getFilePath = () => path.join(process.cwd(), "src/data/contact_messages.json");

export async function POST(request: Request) {
  try {
    const { name, email, project } = await request.json();

    if (!name || !email || !project) {
      return NextResponse.json({ error: "Name, email, and project are required fields" }, { status: 400 });
    }

    const filePath = getFilePath();
    let submissions = [];

    try {
      const fileData = await fs.readFile(filePath, "utf8");
      submissions = JSON.parse(fileData);
    } catch (e) {
      // If file doesn't exist or is invalid, start with empty array
      submissions = [];
    }

    const newSubmission = {
      id: `msg-${Date.now()}`,
      name,
      email,
      project,
      timestamp: new Date().toISOString(),
    };

    submissions.push(newSubmission);
    await fs.writeFile(filePath, JSON.stringify(submissions, null, 2), "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json({ error: "Failed to submit project scope" }, { status: 500 });
  }
}
