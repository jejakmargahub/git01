import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Jejak Marga <onboarding@resend.dev>",
      to: email,
      subject: "Kode Verifikasi Silsilah Keluarga 👨👩👧👦",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="font-size: 40px; margin-bottom: 8px;">👨👩👧👦</div>
            <h1 style="font-size: 24px; color: #1e293b; margin: 0;">Silsilah Keluarga</h1>
          </div>
          
          <div style="padding: 24px; background-color: #f8fafc; border-radius: 8px; text-align: center;">
            <p style="font-size: 16px; color: #64748b; margin-top: 0; margin-bottom: 16px;">Gunakan kode verifikasi di bawah ini untuk masuk ke akun Anda:</p>
            <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #2563eb; margin: 24px 0;">${token}</div>
            <p style="font-size: 14px; color: #94a3b8; margin: 0;">Kode ini akan kedaluwarsa dalam 10 menit.</p>
          </div>
          
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 13px; color: #94a3b8;">
            <p style="margin: 0;">Jika Anda tidak meminta kode ini, silakan abaikan email ini.</p>
            <p style="margin: 8px 0 0;">&copy; ${new Date().getFullYear()} Jejak Marga. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { error };
    }

    return { data };
  } catch (error) {
    console.error("Email send error:", error);
    return { error };
  }
};
