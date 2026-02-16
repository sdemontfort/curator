import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // In production, connect to a database (Cloudflare D1 / KV) and Stripe.
    // For now, log the subscriber and return success.
    console.log(`New subscriber: ${email}`);

    return NextResponse.json({ success: true, email });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
