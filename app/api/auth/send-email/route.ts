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
  try {
    const secret = process.env.SUPABASE_AUTH_HOOK_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Missing SUPABASE_AUTH_HOOK_SECRET" },
        { status: 500 },
      );
    }

    // --- Verify webhook signature (Standard Webhooks spec) ---
    const rawBody = await req.text();
    const headers = {
      "webhook-id": req.headers.get("webhook-id") ?? "",
      "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
      "webhook-signature": req.headers.get("webhook-signature") ?? "",
    };

    // standardwebhooks expects "whsec_<base64>" format.
    // Supabase may store it as "v1,whsec_..." — strip the "v1," prefix if present.
    const normalizedSecret = secret.startsWith("v1,") ? secret.slice(3) : secret;
    const whSecret = normalizedSecret.startsWith("whsec_")
      ? normalizedSecret
      : `whsec_${normalizedSecret}`;
    const wh = new Webhook(whSecret);
    let payload: AuthHookPayload;
    try {
      payload = wh.verify(rawBody, headers) as AuthHookPayload;
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid signature", detail: String(err) },
        { status: 401 },
      );
    }

    // --- Build confirmation URL ---
    const { user, email_data } = payload;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const tokenHash = email_data.token_hash;
    const type = email_data.email_action_type;
    const redirectTo = email_data.redirect_to || email_data.site_url;

    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token=${tokenHash}&type=${type}&redirect_to=${encodeURIComponent(redirectTo)}`;

    // --- Route by action type and send email ---
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

    return NextResponse.json({});
  } catch (err) {
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
