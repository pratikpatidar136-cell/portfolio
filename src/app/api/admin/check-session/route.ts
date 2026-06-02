import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (session && session.value === "session_active_12345") {
      return NextResponse.json({ authorized: true });
    }

    return NextResponse.json({ authorized: false });
  } catch (error) {
    return NextResponse.json({ authorized: false, error: "Internal error" });
  }
}
