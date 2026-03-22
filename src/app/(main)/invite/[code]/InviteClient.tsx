"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinFamily } from "@/lib/actions/family";

interface InviteClientProps {
  family: {
    id: string;
    name: string;
    description: string | null;
  };
  inviteCode: string;
  isLoggedIn: boolean;
}

export default function InviteClient({
  family,
  inviteCode,
  isLoggedIn,
}: InviteClientProps) {
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleJoin = async () => {
    setJoining(true);
    setError("");
    try {
      const familyId = await joinFamily(inviteCode);
      // Sukses gabung, lompat ke bagan
      router.push(`/family/${familyId}`);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat bergabung");
      setJoining(false); // Reset so user can try again if wanted
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "0 20px" }}>
      <div className="card" style={{ padding: "32px", textAlign: "center" }}>
        <div 
          style={{ 
            width: "64px", 
            height: "64px", 
            background: "linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)", 
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            margin: "0 auto 20px",
            boxShadow: "var(--shadow-md)"
          }}
        >
          👨‍👩‍👧‍👦
        </div>
        
        <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>Undangan Keluarga</h1>
        <p className="text-muted" style={{ fontSize: "15px", marginBottom: "24px" }}>
          Anda diundang untuk bergabung mengelola silsilah keluarga:
        </p>

        <div style={{ background: "var(--input-bg)", padding: "20px", borderRadius: "12px", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--primary)", marginBottom: "8px" }}>{family.name}</h2>
          {family.description && (
            <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
              {family.description}
            </p>
          )}
        </div>

        {error && (
          <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", borderRadius: "6px", fontSize: "14px", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        {isLoggedIn ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button 
              className="btn btn-primary" 
              style={{ width: "100%", padding: "14px" }}
              onClick={handleJoin}
              disabled={joining}
            >
              {joining ? "Memproses..." : "Gabung Sekarang"}
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ width: "100%", padding: "14px" }}
              onClick={() => router.push("/dashboard")}
              disabled={joining}
            >
              Batal
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button 
              className="btn btn-primary" 
              style={{ width: "100%", padding: "14px" }}
              onClick={() => router.push(`/login?callbackUrl=/invite/${inviteCode}`)}
            >
              Masuk untuk Bergabung
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ width: "100%", padding: "14px" }}
              onClick={() => router.push(`/register?callbackUrl=/invite/${inviteCode}`)}
            >
              Buat Akun Baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
