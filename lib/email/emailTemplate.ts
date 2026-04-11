type EmailTemplateInput = {
  title: string;
  greeting?: string;
  intro?: string;
  contentHtml: string;
  outro?: string;
};

const appName = process.env.APP_NAME || "TrackMyCash";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const supportEmail = process.env.EMAIL_REPLY_TO || "support@trackmycash.com";
const logoUrl = `${appUrl.replace(/\/$/, "")}/logos/email_logo.png`;

export const buildCommonEmailTemplate = ({
  title,
  greeting,
  intro,
  contentHtml,
  outro,
}: EmailTemplateInput): string => {
  const year = new Date().getFullYear();

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;color:#1f2a44;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6fb;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e5eaf3;border-radius:14px;overflow:hidden;">
              <tr>
                <td>
                  <img src="${logoUrl}" alt="${appName} logo" width="280" style="display:block;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;" />
                </td>
              </tr>
              <tr>
                <td style="padding:26px 24px;">
                  <h2 style="margin:0 0 14px;font-size:20px;color:#0f2f57;">${title}</h2>
                  ${greeting ? `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;">${greeting}</p>` : ""}
                  ${intro ? `<p style="margin:0 0 18px;font-size:15px;line-height:1.6;">${intro}</p>` : ""}
                  ${contentHtml}
                  ${outro ? `<p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#4a5a78;">${outro}</p>` : ""}
                </td>
              </tr>
              <tr>
                <td style="padding:18px 24px;background:#f8faff;border-top:1px solid #e5eaf3;">
                  <p style="margin:0 0 8px;font-size:12px;color:#5f6f8d;">
                    Need help? Contact us at <a href="mailto:${supportEmail}" style="color:#165aa7;text-decoration:none;">${supportEmail}</a>
                  </p>
                  <p style="margin:0 0 8px;font-size:12px;color:#5f6f8d;">
                    <a href="${appUrl}" style="color:#165aa7;text-decoration:none;">${appName}</a>
                  </p>
                  <p style="margin:0;font-size:12px;color:#8a96ad;">© ${year} ${appName}. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
