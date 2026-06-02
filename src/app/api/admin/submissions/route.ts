import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";

const getFilePath = () => path.join(process.cwd(), "src/data/contact_messages.json");

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "session_active_12345";
}

export async function GET() {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filePath = getFilePath();
    let data = "[]";
    try {
      data = await fs.readFile(filePath, "utf8");
    } catch (e) {
      // If file doesn't exist yet, return empty list
      data = "[]";
    }

    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading submissions:", error);
    return NextResponse.json({ error: "Failed to read database" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
    }

    const filePath = getFilePath();
    let submissions = [];

    try {
      const fileData = await fs.readFile(filePath, "utf8");
      submissions = JSON.parse(fileData);
    } catch (e) {
      return NextResponse.json({ error: "No database file found" }, { status: 404 });
    }

    const filtered = submissions.filter((sub: any) => sub.id !== id);
    await fs.writeFile(filePath, JSON.stringify(filtered, null, 2), "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
