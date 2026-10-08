import nodemailer from "nodemailer";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, token) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD not set in environment");
  }

  const verifyUrl = `${CLIENT_URL}/verify?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: `"MindSpace" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Verify your email for MindSpace",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #4f46e5; margin-top: 0;">MindSpace</h2>
        <h3 style="color: #1e293b;">Verify your email address</h3>
        <p style="color: #475569; line-height: 1.6;">
          Thanks for signing up! Please confirm that <strong>${email}</strong> is your
          email address by clicking the button below.
        </p>
        <a href="${verifyUrl}"
           style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #94a3b8; font-size: 13px;">
          This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};
