import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

export async function GET(req: NextRequest) {
  try {
    // Extract Access Token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify token using Supabase
    const { data: user, error: userError } =
      await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        user: user.user,
        message: "User verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("USER_API_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Missing authorization" }, { status: 401 });
  }

  const accessToken = authHeader.replace("Bearer ", "");
  const { role } = await req.json();

  if (!["vendor", "customer"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const { data: userData, error: userErr } = await supabase.auth.getUser(accessToken);
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "Invalid user" }, { status: 401 });
  }

  const { error: updateErr } = await supabase.auth.admin.updateUserById(
    userData.user.id,
    { user_metadata: { role } }
  );

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}