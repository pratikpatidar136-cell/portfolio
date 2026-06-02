import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readContactSubmissions, writeContactSubmissions } from "@/lib/blob-db";

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

    const data = await readContactSubmissions();
    return NextResponse.json(data);
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

    const submissions = await readContactSubmissions();
    const filtered = submissions.filter((sub: any) => sub.id !== id);
    
    await writeContactSubmissions(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
