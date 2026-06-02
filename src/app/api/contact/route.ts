import { NextResponse } from "next/server";
import { readContactSubmissions, writeContactSubmissions } from "@/lib/blob-db";

export async function POST(request: Request) {
  try {
    const { name, email, project } = await request.json();

    if (!name || !email || !project) {
      return NextResponse.json({ error: "Name, email, and project are required fields" }, { status: 400 });
    }

    const submissions = await readContactSubmissions();

    const newSubmission = {
      id: `msg-${Date.now()}`,
      name,
      email,
      project,
      timestamp: new Date().toISOString(),
    };

    submissions.push(newSubmission);
    await writeContactSubmissions(submissions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json({ error: "Failed to submit project scope" }, { status: 500 });
  }
}
