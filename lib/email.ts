import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "GoutWize <notifications@goutwize.com>";

// ---------------------------------------------------------------------------
// Auth email templates (sent via Supabase Auth Hook → Resend)
// ---------------------------------------------------------------------------

const MAGIC_LINK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Sign in to GoutWize</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#EFF6FA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;font-size:1px;color:#EFF6FA;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Your magic link to sign in to GoutWize is ready. Click the button below to continue.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EFF6FA;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#2C3E50;padding:28px 32px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td style="font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                    Gout<span style="color:#4A7C9E;">Wize</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 16px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#2C3E50;line-height:1.3;">
                Sign in to your account
              </h1>
              <p style="margin:0 0 28px;font-size:15px;color:#6C757D;line-height:1.6;">
                Click the button below to securely sign in. This link expires in 10 minutes.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="{{CONFIRMATION_URL}}"
                       target="_blank"
                       style="display:inline-block;background-color:#4A7C9E;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:10px;letter-spacing:0.2px;">
                      Sign In
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0;">
              <div style="border-top:1px solid #D6E4ED;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 8px;">
              <p style="margin:0;font-size:13px;color:#6C757D;line-height:1.5;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <p style="margin:0;font-size:12px;color:#4A7C9E;line-height:1.5;word-break:break-all;">
                {{CONFIRMATION_URL}}
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#F8FAFB;padding:20px 32px;border-top:1px solid #D6E4ED;">
              <p style="margin:0;font-size:12px;color:#6C757D;line-height:1.5;text-align:center;">
                You received this email because someone requested a sign-in link for <strong>{{EMAIL}}</strong> on GoutWize. If this wasn't you, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;">
          <tr>
            <td style="padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#6C757D;line-height:1.5;">
                GoutWize &mdash; You're not alone with gout.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const CONFIRMATION_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Confirm your GoutWize account</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#EFF6FA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;font-size:1px;color:#EFF6FA;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Welcome to GoutWize! Confirm your email to join the community.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EFF6FA;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#2C3E50;padding:28px 32px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td style="font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                    Gout<span style="color:#4A7C9E;">Wize</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 16px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#2C3E50;line-height:1.3;">
                Welcome to GoutWize!
              </h1>
              <p style="margin:0 0 28px;font-size:15px;color:#6C757D;line-height:1.6;">
                Confirm your email to join a community that understands what you're going through. Real experiences, real patterns, real support.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="{{CONFIRMATION_URL}}"
                       target="_blank"
                       style="display:inline-block;background-color:#7FB069;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:10px;letter-spacing:0.2px;">
                      Confirm Email
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0;">
              <div style="border-top:1px solid #D6E4ED;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 8px;">
              <p style="margin:0;font-size:13px;color:#6C757D;line-height:1.5;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <p style="margin:0;font-size:12px;color:#4A7C9E;line-height:1.5;word-break:break-all;">
                {{CONFIRMATION_URL}}
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#F8FAFB;padding:20px 32px;border-top:1px solid #D6E4ED;">
              <p style="margin:0;font-size:12px;color:#6C757D;line-height:1.5;text-align:center;">
                You received this email because someone signed up with <strong>{{EMAIL}}</strong> on GoutWize. If this wasn't you, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;">
          <tr>
            <td style="padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#6C757D;line-height:1.5;">
                GoutWize &mdash; You're not alone with gout.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const INVITE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>You're invited to GoutWize</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#EFF6FA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;font-size:1px;color:#EFF6FA;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    You've been invited to join GoutWize — a community that gets what you're going through.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EFF6FA;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#2C3E50;padding:28px 32px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td style="font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                    Gout<span style="color:#4A7C9E;">Wize</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 16px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#2C3E50;line-height:1.3;">
                You've been invited!
              </h1>
              <p style="margin:0 0 12px;font-size:15px;color:#6C757D;line-height:1.6;">
                Someone thinks you'd benefit from GoutWize — a community of people who actually understand what living with gout is like.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#6C757D;line-height:1.6;">
                Join to track flares, share what works, and connect with others who get it.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="{{CONFIRMATION_URL}}"
                       target="_blank"
                       style="display:inline-block;background-color:#E8956F;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:10px;letter-spacing:0.2px;">
                      Accept Invite
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0;">
              <div style="border-top:1px solid #D6E4ED;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 8px;">
              <p style="margin:0;font-size:13px;color:#6C757D;line-height:1.5;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <p style="margin:0;font-size:12px;color:#4A7C9E;line-height:1.5;word-break:break-all;">
                {{CONFIRMATION_URL}}
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#F8FAFB;padding:20px 32px;border-top:1px solid #D6E4ED;">
              <p style="margin:0;font-size:12px;color:#6C757D;line-height:1.5;text-align:center;">
                This invitation was sent to <strong>{{EMAIL}}</strong>. If you weren't expecting this, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;">
          <tr>
            <td style="padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#6C757D;line-height:1.5;">
                GoutWize &mdash; You're not alone with gout.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

function renderTemplate(
  html: string,
  confirmationUrl: string,
  email: string,
): string {
  return html
    .replaceAll("{{CONFIRMATION_URL}}", confirmationUrl)
    .replaceAll("{{EMAIL}}", email);
}

export async function sendMagicLinkEmail(
  to: string,
  confirmationUrl: string,
  email: string,
) {
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Sign in to GoutWize",
    html: renderTemplate(MAGIC_LINK_HTML, confirmationUrl, email),
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

export async function sendConfirmationEmail(
  to: string,
  confirmationUrl: string,
  email: string,
) {
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Confirm your GoutWize account",
    html: renderTemplate(CONFIRMATION_HTML, confirmationUrl, email),
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

export async function sendInviteEmail(
  to: string,
  confirmationUrl: string,
  email: string,
) {
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "You're invited to GoutWize",
    html: renderTemplate(INVITE_HTML, confirmationUrl, email),
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

export async function sendCommentNotificationEmail(
  to: string,
  postTitle: string,
  commenterName: string,
  commentPreview: string,
  postUrl: string,
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "New reply on your GoutWize discussion",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#F0F4F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:32px 16px;">
    <div style="background:#1B2A4A;padding:20px 24px;border-radius:16px 16px 0 0;">
      <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">GoutWize</h1>
    </div>
    <div style="background:#ffffff;padding:24px;border-radius:0 0 16px 16px;">
      <p style="margin:0 0 8px;color:#1B2A4A;font-size:15px;font-weight:600;">
        ${commenterName} replied to your discussion
      </p>
      <p style="margin:0 0 16px;color:#6B7280;font-size:13px;">
        &ldquo;${postTitle}&rdquo;
      </p>
      <div style="background:#F0F4F8;padding:12px 16px;border-radius:8px;margin-bottom:20px;">
        <p style="margin:0;color:#1B2A4A;font-size:14px;line-height:1.5;">
          ${commentPreview}
        </p>
      </div>
      <a href="${postUrl}" style="display:inline-block;background:#4A7C9E;color:#ffffff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
        View discussion
      </a>
    </div>
    <p style="margin:16px 0 0;text-align:center;color:#9CA3AF;font-size:11px;">
      You can turn off email notifications in your profile settings.
    </p>
  </div>
</body>
</html>`,
  });
}

export async function sendReengagementEmail(
  to: string,
  streakDays: number,
  checkinUrl: string,
) {
  const streakText =
    streakDays > 0
      ? `Your ${streakDays}-day streak is at risk!`
      : "We miss you! Time for a check-in?";

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your check-in streak is at risk",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#F0F4F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:32px 16px;">
    <div style="background:#1B2A4A;padding:20px 24px;border-radius:16px 16px 0 0;">
      <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">GoutWize</h1>
    </div>
    <div style="background:#ffffff;padding:24px;border-radius:0 0 16px 16px;">
      <p style="margin:0 0 8px;color:#1B2A4A;font-size:20px;font-weight:700;text-align:center;">
        ${streakText}
      </p>
      <p style="margin:12px 0 20px;color:#6B7280;font-size:14px;text-align:center;line-height:1.5;">
        A quick daily check-in helps you spot gout patterns early. Don&rsquo;t break the habit!
      </p>
      <div style="text-align:center;">
        <a href="${checkinUrl}" style="display:inline-block;background:#4A7C9E;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
          Check in now
        </a>
      </div>
    </div>
    <p style="margin:16px 0 0;text-align:center;color:#9CA3AF;font-size:11px;">
      You can turn off email notifications in your profile settings.
    </p>
  </div>
</body>
</html>`,
  });
}
