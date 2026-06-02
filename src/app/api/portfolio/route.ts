import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";

const getFilePath = () => path.join(process.cwd(), "src/data/portfolio.json");

export async function GET() {
  try {
    const filePath = getFilePath();
    const data = await fs.readFile(filePath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return NextResponse.json({ error: "Failed to read database data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Verify session authorization
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session || session.value !== "session_active_12345") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Read and write payload data
    const payload = await request.json();
    
    // Simple schema check
    if (!payload.hero || !payload.services || !payload.categories || !payload.showcase || !payload.journey) {
      return NextResponse.json({ error: "Invalid data schema structure" }, { status: 400 });
    }

    const filePath = getFilePath();
    await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    return NextResponse.json({ error: "Failed to write database data" }, { status: 500 });
  }
}
