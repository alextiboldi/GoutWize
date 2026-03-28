import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import {
  sendMagicLinkEmail,
  sendConfirmationEmail,
  sendInviteEmail,
} from "@/lib/email";

interface AuthHookPayload {
  user: {
    id: string;
    email: string;
  };
  email_data: {
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
    token: string;
    hashed_token: string;
  };
}

export async function POST(req: NextRequest) {
  console.log("[auth-hook] POST /api/auth/send-email called");
  try {
    const secret = process.env.SUPABASE_AUTH_HOOK_SECRET;
    if (!secret) {
      console.error("[auth-hook] Missing SUPABASE_AUTH_HOOK_SECRET env var");
      return NextResponse.json(
        { error: "Missing SUPABASE_AUTH_HOOK_SECRET" },
        { status: 500 },
      );
    }
    console.log("[auth-hook] Secret present, length:", secret.length, "starts with:", secret.substring(0, 5));

    // --- Verify webhook signature (Standard Webhooks spec) ---
    const rawBody = await req.text();
    console.log("[auth-hook] Raw body length:", rawBody.length);
    const headers = {
      "webhook-id": req.headers.get("webhook-id") ?? "",
      "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
      "webhook-signature": req.headers.get("webhook-signature") ?? "",
    };
    console.log("[auth-hook] Webhook headers:", JSON.stringify(headers));

    // standardwebhooks expects "whsec_<base64>" format.
    // Supabase may store it as "v1,whsec_..." — strip the "v1," prefix if present.
    const normalizedSecret = secret.startsWith("v1,") ? secret.slice(3) : secret;
    const whSecret = normalizedSecret.startsWith("whsec_")
      ? normalizedSecret
      : `whsec_${normalizedSecret}`;
    console.log("[auth-hook] Normalized secret starts with:", whSecret.substring(0, 10));
    const wh = new Webhook(whSecret);
    let payload: AuthHookPayload;
    try {
      payload = wh.verify(rawBody, headers) as AuthHookPayload;
      console.log("[auth-hook] Signature verified successfully");
    } catch (err) {
      console.error("[auth-hook] Signature verification FAILED:", String(err));
      return NextResponse.json(
        { error: "Invalid signature", detail: String(err) },
        { status: 401 },
      );
    }

    // --- Build confirmation URL ---
    const { user, email_data } = payload;
    console.log("[auth-hook] User email:", user.email, "Action:", email_data.email_action_type);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const tokenHash = email_data.token_hash;
    const type = email_data.email_action_type;
    const redirectTo = email_data.redirect_to || email_data.site_url;

    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token=${tokenHash}&type=${type}&redirect_to=${encodeURIComponent(redirectTo)}`;
    console.log("[auth-hook] Confirmation URL built, type:", type);

    // --- Route by action type and send email ---
    console.log("[auth-hook] Sending email for action type:", type);
    switch (type) {
      case "magic_link":
      case "login":
        await sendMagicLinkEmail(user.email, confirmationUrl, user.email);
        break;
      case "signup":
        await sendConfirmationEmail(user.email, confirmationUrl, user.email);
        break;
      case "invite":
        await sendInviteEmail(user.email, confirmationUrl, user.email);
        break;
      case "recovery":
      case "email_change":
        await sendMagicLinkEmail(user.email, confirmationUrl, user.email);
        break;
      default:
        await sendMagicLinkEmail(user.email, confirmationUrl, user.email);
    }

    console.log("[auth-hook] Email sent successfully");
    return NextResponse.json({});
  } catch (err) {
    console.error("[auth-hook] UNHANDLED ERROR:", err instanceof Error ? err.message : String(err));
    console.error("[auth-hook] Stack:", err instanceof Error ? err.stack : "N/A");
    // Top-level catch — return full error details for debugging
    return NextResponse.json(
      {
        error: "Unhandled error in auth hook",
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      },
      { status: 500 },
    );
  }
}
