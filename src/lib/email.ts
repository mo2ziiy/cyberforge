import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const emailTemplate = (title: string, bodyHtml: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;padding:0 16px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:36px;height:36px;background:linear-gradient(135deg,#22d3ee,#a78bfa);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-weight:800;color:#000;font-size:14px;">CF</div>
        <span style="font-size:20px;font-weight:700;color:#e4e4e7;"><span style="color:#22d3ee;">Cyber</span>Forge</span>
      </div>
    </div>
    <!-- Card -->
    <div style="background:#111118;border:1px solid #27272a;border-radius:16px;padding:32px;">
      ${bodyHtml}
    </div>
    <!-- Footer -->
    <p style="text-align:center;color:#71717a;font-size:12px;margin-top:24px;">
      &copy; ${new Date().getFullYear()} CyberForge. Built for the security community.
    </p>
  </div>
</body>
</html>
`;

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${APP_URL}/auth/verify-email?token=${token}`;
  const html = emailTemplate(
    "Verify Your Email — CyberForge",
    `
    <h2 style="color:#e4e4e7;font-size:22px;margin:0 0 8px;">Verify your email address</h2>
    <p style="color:#71717a;margin:0 0 24px;font-size:15px;line-height:1.6;">
      Welcome to CyberForge! Click the button below to verify your email and start your cybersecurity journey.
    </p>
    <a href="${verifyUrl}" style="display:inline-block;background:#22d3ee;color:#000;padding:12px 28px;border-radius:10px;font-weight:700;text-decoration:none;font-size:15px;margin-bottom:24px;">
      Verify Email Address
    </a>
    <p style="color:#71717a;font-size:13px;margin:0;">
      Or copy this link: <span style="color:#22d3ee;word-break:break-all;">${verifyUrl}</span>
    </p>
    <p style="color:#52525b;font-size:12px;margin-top:16px;">This link expires in 24 hours. If you didn't register, you can ignore this email.</p>
    `
  );
  await transporter.sendMail({
    from: `"CyberForge" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email — CyberForge",
    html,
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const html = emailTemplate(
    `New Contact Message — CyberForge`,
    `
    <h2 style="color:#e4e4e7;font-size:22px;margin:0 0 8px;">New Contact Message</h2>
    <p style="color:#71717a;margin:0 0 24px;font-size:15px;line-height:1.6;">
      Someone submitted the contact form on CyberForge.
    </p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #27272a;color:#71717a;font-size:13px;width:90px;">Name</td>
        <td style="padding:10px 0;border-bottom:1px solid #27272a;color:#e4e4e7;font-size:14px;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #27272a;color:#71717a;font-size:13px;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #27272a;color:#22d3ee;font-size:14px;">${data.email}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #27272a;color:#71717a;font-size:13px;">Subject</td>
        <td style="padding:10px 0;border-bottom:1px solid #27272a;color:#e4e4e7;font-size:14px;">${data.subject}</td>
      </tr>
    </table>
    <p style="color:#71717a;font-size:13px;margin:0 0 8px;">Message:</p>
    <div style="background:#0a0a0f;border:1px solid #27272a;border-radius:10px;padding:16px;color:#e4e4e7;font-size:14px;line-height:1.7;white-space:pre-wrap;">${data.message}</div>
    <p style="color:#52525b;font-size:12px;margin-top:16px;">Reply directly to this email to respond to ${data.name}.</p>
    `
  );
  await transporter.sendMail({
    from: `"CyberForge Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: data.email,
    subject: `[Contact] ${data.subject}`,
    html,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;
  const html = emailTemplate(
    "Reset Your Password — CyberForge",
    `
    <h2 style="color:#e4e4e7;font-size:22px;margin:0 0 8px;">Reset your password</h2>
    <p style="color:#71717a;margin:0 0 24px;font-size:15px;line-height:1.6;">
      We received a request to reset your CyberForge password. Click the button below to choose a new password.
    </p>
    <a href="${resetUrl}" style="display:inline-block;background:#22d3ee;color:#000;padding:12px 28px;border-radius:10px;font-weight:700;text-decoration:none;font-size:15px;margin-bottom:24px;">
      Reset Password
    </a>
    <p style="color:#71717a;font-size:13px;margin:0;">
      Or copy this link: <span style="color:#22d3ee;word-break:break-all;">${resetUrl}</span>
    </p>
    <p style="color:#52525b;font-size:12px;margin-top:16px;">This link expires in 1 hour. If you didn't request a reset, you can ignore this email.</p>
    `
  );
  await transporter.sendMail({
    from: `"CyberForge" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password — CyberForge",
    html,
  });
}
