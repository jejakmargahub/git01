import Link from "next/link";
import { useState } from "react";

interface FamilyCardProps {
  family: {
    id: string;
    name: string;
    description: string | null;
    inviteCode: string | null;
  };
  role: string;
  memberCount: number;
}

const roleLabels: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export default function FamilyCard({
  family,
  role,
  memberCount,
}: FamilyCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (copied) return;

    navigator.clipboard.writeText(family.inviteCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link
      href={`/family/${family.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="card card-interactive animate-slide-up">
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                flexShrink: 0,
              }}
            >
              🌳
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  lineHeight: "1.3",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {family.name}
              </h3>
              {family.description && (
                <p
                  className="text-muted"
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.4",
                    marginTop: "2px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {family.description}
                </p>
              )}
            </div>
          </div>
          {/* Private lock icon */}
          <span style={{ fontSize: "16px", opacity: 0.5, flexShrink: 0, marginLeft: "8px" }}>🔒</span>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid var(--card-border)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              color: "var(--muted)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {memberCount} anggota
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              href={`/family/${family.id}/chat`}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--card-border)",
                fontSize: "16px",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              className="hover-scale"
              title="Chat Keluarga"
            >
              💬
            </Link>
            <span className={`badge badge-${role}`}>{roleLabels[role]}</span>
            {role === "admin" && (
              <span style={{ fontSize: "16px", opacity: 0.6 }} title="Pengaturan">⚙️</span>
            )}
          </div>
        </div>

        {/* Invite Code row (Visible to all for collaboration) */}
        {family.inviteCode && (
          <div
            onClick={handleCopy}
            style={{
              marginTop: "12px",
              padding: "8px 12px",
              background: copied ? "rgba(var(--success-rgb, 22, 163, 74), 0.1)" : "rgba(var(--primary-rgb), 0.05)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: copied ? "default" : "pointer",
              transition: "all 0.2s",
              border: copied ? "1px solid var(--success)" : "1px dashed rgba(var(--primary-rgb), 0.2)",
            }}
            className="invite-code-copy"
            title={copied ? "Kode tersalin" : "Klik untuk salin kode undangan"}
          >
            {copied ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", justifyContent: "center" }}>
                <span style={{ color: "var(--success)", fontWeight: "600", fontSize: "14px" }}>✅ Kode Undangan Tersalin!</span>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: "600", textTransform: "uppercase" }}>Kode Undangan:</span>
                  <code style={{ fontSize: "14px", fontWeight: "700", color: "var(--primary)", letterSpacing: "1px" }}>
                    {family.inviteCode}
                  </code>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "10px", color: "var(--muted)" }}>Salin & Bagikan</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "var(--primary)", opacity: 0.7 }}
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
