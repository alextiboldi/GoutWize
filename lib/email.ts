import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "GoutWize <notifications@yourdomain.com>";

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
