"use client";

import { useState, useEffect } from "react";

interface InviteDialogProps {
  familyId: string;
  isPublicViewEnabled: boolean;
  publicViewSlug: string | null;
  open: boolean;
  onClose: () => void;
}

export default function InviteDialog({
  familyId,
  isPublicViewEnabled,
  publicViewSlug,
  open,
  onClose,
}: InviteDialogProps) {
  const [copiedPublic, setCopiedPublic] = useState(false);

  const getPublicLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://jejakmarga.my.id";
    return `${origin}/public/${publicViewSlug}`;
  };

  useEffect(() => {
    if (open) {
      setCopiedPublic(false);
    }
  }, [open]);

  const handleCopyPublic = () => {
    if (!publicViewSlug) return;
    const fullLink = getPublicLink();
    navigator.clipboard.writeText(fullLink);
    setCopiedPublic(true);
    setTimeout(() => setCopiedPublic(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!publicViewSlug) return;
    const link = getPublicLink();
    const text = `Halo! Lihat pohon keluarga kami di Jejak Marga: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <>
      <div className={`modal-overlay ${open ? "active" : ""}`} onClick={onClose}>
        <div 
          className="modal" 
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: "500px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", borderBottom: "1px solid var(--card-border)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Bagikan Pohon Keluarga</h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "var(--muted)",
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>

          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Option: Public View */}
            <div style={{ 
              padding: "20px", 
              borderRadius: "16px", 
              border: `2px solid ${isPublicViewEnabled ? "var(--primary)" : "var(--card-border)"}`,
              background: isPublicViewEnabled ? "transparent" : "rgba(0,0,0,0.02)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700" }}>🎯 Bagikan Tampilan Publik</h3>
                {!isPublicViewEnabled && (
                  <span style={{ fontSize: "10px", background: "var(--muted)", color: "white", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>NONAKTIF</span>
                )}
              </div>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>
                Gunakan link ini untuk membagikan silsilah kepada keluarga besar dalam mode **Hanya Baca** (Tanpa perlu login). Nomor HP & Bio otomatis disembunyikan.
              </p>
              
              {isPublicViewEnabled ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    onClick={handleCopyPublic}
                    className="btn btn-primary" 
                    style={{ flex: 1, fontSize: "14px", height: "42px" }}
                  >
                    {copiedPublic ? "✅ Link Tersalin" : "Salin Link Publik"}
                  </button>
                  <button 
                    onClick={handleWhatsApp}
                    className="btn btn-secondary" 
                    style={{ width: "48px", height: "42px", padding: 0 }}
                    title="Bagikan ke WhatsApp"
                  >
                    <span style={{ fontSize: "20px" }}>💬</span>
                  </button>
                </div>
              ) : (
                <div style={{ padding: "16px", background: "var(--input-bg)", borderRadius: "10px", textAlign: "center", border: "1px dashed var(--card-border)" }}>
                  <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "8px" }}>
                    Tampilan publik saat ini sedang **Dimatikan**.
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--muted)" }}>
                    Silakan aktifkan terlebih dahulu melalui <br/> <strong>Ikon Gerigi (⚙️) Pengaturan</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: "20px", borderTop: "1px solid var(--card-border)", textAlign: "center" }}>
            <p style={{ fontSize: "11px", color: "var(--muted)" }}>
              Hanya Admin yang dapat mengelola link publik di menu Pengaturan.
            </p>
            <button className="btn btn-ghost" style={{ marginTop: "16px", width: "100%" }} onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
