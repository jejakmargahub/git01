import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, phoneNumber, password, fullName } = await request.json();

    if ((!email && !phoneNumber) || !password || !fullName) {
      return NextResponse.json(
        { error: "Identitas (Email/HP), password, dan nama lengkap wajib diisi" },
        { status: 400 }
      );
    }

    if (!phoneNumber && password.length < 6) {
      return NextResponse.json(
        { error: "Password email minimal 6 karakter" },
        { status: 400 }
      );
    }

    if (phoneNumber && (password.length !== 4 || !/^\d+$/.test(password))) {
      return NextResponse.json(
        { error: "Sandi PIN Nomor HP harus persis 4 angka" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const condition = phoneNumber
      ? eq(users.phoneNumber, phoneNumber)
      : eq(users.email, email);

    const [existingUser] = await db
      .select()
      .from(users)
      .where(condition)
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: phoneNumber ? "Nomor HP sudah terdaftar" : "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const [newUser] = await db
      .insert(users)
      .values({
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
        password: hashedPassword,
        fullName,
      })
      .returning({ id: users.id, email: users.email, phoneNumber: users.phoneNumber, fullName: users.fullName });

    return NextResponse.json(
      { message: "Registrasi berhasil", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
}
