import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { families } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import InviteClient from "./InviteClient";

export default async function InvitePage({
  params,
}: {
  params: { code: string };
}) {
  const code = params.code;

  const [family] = await db
    .select()
    .from(families)
    .where(eq(families.inviteCode, code))
    .limit(1);

  if (!family) {
    return (
      <div className="container" style={{ padding: "40px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px" }}>Tautan Tidak Valid</h1>
        <p className="text-muted" style={{ marginBottom: "24px" }}>
          Kode undangan yang Anda gunakan sudah tidak valid atau telah kedaluwarsa.
        </p>
        <a href="/" className="btn btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
          Kembali ke Beranda
        </a>
      </div>
    );
  }

  const session = await auth();

  return (
    <InviteClient
      family={family}
      inviteCode={code}
      isLoggedIn={!!session?.user?.id}
    />
  );
}
