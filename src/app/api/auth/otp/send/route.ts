import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verificationTokens, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Alamat email wajib diisi" },
        { status: 400 }
      );
    }

    const lowercasedEmail = email.toLowerCase();

    // Check if user exists (Optional: if we want to allow login only for registered users)
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, lowercasedEmail))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json(
        { error: "Email belum terdaftar. Silakan daftar akun baru." },
        { status: 404 }
      );
    }

    if (existingUser.status === "disabled") {
      return NextResponse.json(
        { error: "Akun Anda telah dinonaktifkan. Silakan hubungi dukungan." },
        { status: 403 }
      );
    }

    // Generate 4-digit code
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Delete existing tokens for this email to avoid clutter
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, lowercasedEmail));

    // Store token in DB
    await db.insert(verificationTokens).values({
      identifier: lowercasedEmail,
      token,
      expires,
    });

    // Send email
    const { error: mailError } = await sendVerificationEmail(lowercasedEmail, token);

    if (mailError) {
      return NextResponse.json(
        { error: "Gagal mengirim email verifikasi. Coba lagi nanti." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Kode verifikasi telah dikirim ke email Anda" },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}
