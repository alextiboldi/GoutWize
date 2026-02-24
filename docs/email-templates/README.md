# Email Templates

Branded email templates for Supabase Auth. Apply via **Supabase Dashboard > Authentication > Email Templates**.

## Templates

| Template | File | Subject Line |
|----------|------|-------------|
| Magic Link | `magic-link.html` | `Sign in to GoutWize` |
| Confirm Signup | `confirmation.html` | `Welcome to GoutWize — confirm your email` |
| Invite User | `invite.html` | `You've been invited to GoutWize` |

## How to Apply

1. Go to **Supabase Dashboard** > **Authentication** > **Email Templates**
2. Select the template type (e.g. "Magic Link")
3. Set the **Subject** from the table above
4. Paste the HTML from the corresponding file into the **Body** field
5. Click **Save**

## Plain Text Fallback

Supabase sends HTML emails only — there's no separate plain-text field. However, the templates are designed to degrade well:

- All links include a raw URL fallback below the button
- No images are used (pure text + colors)
- Content reads logically even without styling

If you need true multipart `text/plain` emails, you'd need a custom SMTP provider (e.g. Resend, Postmark) configured in Supabase under **Settings > Auth > SMTP Settings**. Those providers let you send both HTML and plain text parts.

## Template Variables

These are provided by Supabase and must not be renamed:

| Variable | Available In | Purpose |
|----------|-------------|---------|
| `{{ .ConfirmationURL }}` | All | Full auth link with token |
| `{{ .Token }}` | All | 6-digit OTP code |
| `{{ .Email }}` | All | User's email address |
| `{{ .SiteURL }}` | All | Your app's base URL |

## Design Tokens

Templates use GoutWize brand colors (inline CSS, no external sheets):

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#2C3E50` | Header background, headings |
| Blue | `#4A7C9E` | Magic link button, links |
| Green | `#7FB069` | Confirmation button |
| Light BG | `#EFF6FA` | Email body background |
| Border | `#D6E4ED` | Dividers |
| Text Gray | `#6C757D` | Secondary text |
