"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Demo mode fallback
  const userName = session?.user?.name || "Chris Siauw (Demo)";
  const userEmail = session?.user?.email || "demo@silsilah.app";
  const userInitial = userName[0]?.toUpperCase() || "?";

  const handleLogout = async () => {
    if (session) {
      await signOut({ redirect: false });
    }
    router.push("/login");
  };

  return (
    <>
      <div className="page-header">
        <h1 style={{ fontSize: "22px", fontWeight: "700" }}>Profil</h1>
      </div>

      <div className="page-content">
        {/* User Info Card */}
        <div className="card" style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                color: "white",
                fontWeight: "700",
                flexShrink: 0,
              }}
            >
              {userInitial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userName.replace(/\(Admin\)/g, "").trim()} {(session?.user as any)?.role === 'superadmin' ? '(Admin)' : ''}
              </h2>
              <p
                className="text-muted"
                style={{
                  fontSize: "14px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userEmail}
              </p>
              {(session?.user as any)?.phoneNumber && (
                <p
                  className="text-muted"
                  style={{
                    fontSize: "14px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {(session?.user as any)?.phoneNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Member Capacity Info Card */}
        <div 
          className="card" 
          style={{ 
            marginBottom: "16px", 
            background: "linear-gradient(to right, #ecfdf5, #ffffff)",
            border: "1px solid #10b981",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px"
          }}
        >
          <div style={{ fontSize: "24px" }}>🌳</div>
          <div>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#065f46" }}>
              Kapasitas Anggota
            </p>
            <p style={{ margin: 0, fontSize: "13px", color: "#059669" }}>
              Tanpa Batas (Unlimited)
            </p>
          </div>
        </div>

        {/* Settings */}
        <div className="card" style={{ marginBottom: "16px" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "12px",
            }}
          >
            Pengaturan
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid var(--card-border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "20px" }}>🌙</span>
                <span style={{ fontSize: "15px" }}>Mode Gelap</span>
              </div>
              <span className="text-muted" style={{ fontSize: "13px" }}>
                Ikuti Sistem
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid var(--card-border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "20px" }}>🔤</span>
                <span style={{ fontSize: "15px" }}>Mode Mudah (Senior)</span>
              </div>
              <span className="text-muted" style={{ fontSize: "13px" }}>
                Segera hadir
              </span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card" style={{ marginBottom: "24px" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "12px",
            }}
          >
            Tentang
          </h3>
          <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>
            Silsilah Keluarga v1.0
            <br />
            Aplikasi untuk melacak dan mengelola pohon keluarga dengan mudah.
          </p>
        </div>

        {/* Logout */}
        <button
          className="btn btn-danger btn-full"
          onClick={handleLogout}
        >
          Keluar
        </button>
      </div>
    </>
  );
}
