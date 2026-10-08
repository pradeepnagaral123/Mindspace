const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendVerificationEmail = async (email, token) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "MindSpace";

  if (!apiKey || !senderEmail) {
    throw new Error("BREVO_API_KEY / BREVO_SENDER_EMAIL not set in environment");
  }

  const verifyUrl = `${CLIENT_URL}/verify?token=${encodeURIComponent(token)}`;

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email }],
      subject: "Verify your email for MindSpace",
      htmlContent: `
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
    }),
  });

  if (!response.ok) {
    const info = await response.json().catch(() => ({}));
    throw new Error(
      info.message || `Brevo send failed with status ${response.status}`
    );
  }
};