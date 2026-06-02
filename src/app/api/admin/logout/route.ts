import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    // Delete session cookie
    cookieStore.set("admin_session", "", {
      path: "/",
      maxAge: 0,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal error" });
  }
}
