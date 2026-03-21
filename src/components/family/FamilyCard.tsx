import Link from "next/link";
import { useState } from "react";
import FamilySettingsDialog from "./FamilySettingsDialog";
import InviteDialog from "./InviteDialog";
import { useRouter } from "next/navigation";

interface FamilyCardProps {
  family: {
    id: string;
    name: string;
    description: string | null;
    inviteCode: string | null;
    isPublicViewEnabled: boolean;
    publicViewSlug: string | null;
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
  const [showSettings, setShowSettings] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const router = useRouter();

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (copied) return;

    navigator.clipboard.writeText(family.inviteCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSettings(true);
  };

  return (
    <>
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
              {/* Invite Code Badge - Restored for Admin quick access */}
              {family.inviteCode && (
                <div
                  onClick={handleCopy}
                  className="hover-scale"
                  style={{
                    padding: "4px 10px",
                    background: "rgba(59, 130, 246, 0.12)",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#3b82f6",
                    cursor: "pointer",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    fontFamily: "monospace",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    height: "32px",
                    position: "relative"
                  }}
                  title="Klik untuk salin kode undangan (Editor)"
                >
                  {family.inviteCode}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                  {copied && (
                    <span style={{ 
                      position: "absolute", 
                      bottom: "100%", 
                      left: "50%", 
                      transform: "translateX(-50%)", 
                      background: "#3b82f6", 
                      color: "white", 
                      padding: "2px 8px", 
                      borderRadius: "10px", 
                      fontSize: "10px", 
                      marginBottom: "6px",
                      whiteSpace: "nowrap",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                    }}>
                      Tersalin!
                    </span>
                  )}
                </div>
              )}

              {/* Public Sharing Button */}
              {family.isPublicViewEnabled ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowInviteDialog(true);
                  }}
                  style={{
                    padding: "4px 12px",
                    background: "rgba(var(--primary-rgb), 0.1)",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: "1px solid var(--primary)",
                    height: "32px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--primary)"
                  }}
                  title="Bagikan Link Publik"
                >
                  🌐 Bagikan
                </button>
              ) : (
                <div style={{ fontSize: "11px", color: "var(--muted)", fontStyle: "italic" }}>
                  Privat 🔒
                </div>
              )}

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
                  flexShrink: 0,
                }}
                className="hover-scale"
                title="Chat Keluarga"
              >
                💬
              </Link>
              <span className={`badge badge-${role}`} style={{ flexShrink: 0 }}>{roleLabels[role]}</span>
              {role === "admin" && (
                <button 
                  onClick={openSettings}
                  style={{ 
                    fontSize: "16px", 
                    opacity: 0.6, 
                    flexShrink: 0, 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center"
                  }} 
                  title="Pengaturan"
                >
                  ⚙️
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>

      {showSettings && (
        <FamilySettingsDialog
          familyId={family.id}
          familyName={family.name}
          currentInviteCode={family.inviteCode || ""}
          isPublicViewEnabled={family.isPublicViewEnabled}
          publicViewSlug={family.publicViewSlug}
          onClose={() => setShowSettings(false)}
          onUpdate={() => {
            router.refresh();
          }}
        />
      )}

      {showInviteDialog && (
        <InviteDialog
          familyId={family.id}
          isPublicViewEnabled={family.isPublicViewEnabled}
          publicViewSlug={family.publicViewSlug}
          open={showInviteDialog}
          onClose={() => setShowInviteDialog(false)}
        />
      )}
    </>
  );
}
