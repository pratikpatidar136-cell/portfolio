import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readPortfolioData, writePortfolioData } from "@/lib/blob-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readPortfolioData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return NextResponse.json({ 
      error: "Failed to read database data",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
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

    await writePortfolioData(payload);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    return NextResponse.json({ 
      error: "Failed to write database data", 
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
