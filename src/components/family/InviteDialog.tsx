"use client";

import { useState, useEffect } from "react";
import { generateInviteCode } from "@/lib/actions/family";

interface InviteDialogProps {
  familyId: string;
  initialCode?: string | null;
  open: boolean;
  onClose: () => void;
}

export default function InviteDialog({
  familyId,
  initialCode,
  open,
  onClose,
}: InviteDialogProps) {
  const [code, setCode] = useState(initialCode || "");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const domain = "https://jejakmarga.my.id/invite/";

  useEffect(() => {
    if (open) {
      setCopied(false);
      setError("");
      setCode(initialCode || "");
    }
  }, [open, initialCode]);

  const handleGenerateCode = async () => {
    setLoading(true);
    setError("");
    try {
      const newCode = await generateInviteCode(familyId);
      setCode(newCode);
    } catch (err: any) {
      setError(err.message || "Gagal membuat kode undangan");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!code) return;
    const fullLink = `${domain}${code}`;
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <>
      <div className="modal-overlay active" onClick={onClose} />
      <div className="modal active">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Bagikan Akses Keluarga</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "var(--muted)",
            }}
          >
            ×
          </button>
        </div>

        <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "20px" }}>
          Siapapun yang memiliki tautan atau kode unik ini bisa bergabung sebagai editor ke dalam silsilah keluarga ini.
        </p>

        {error && (
          <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <div style={{ background: "var(--input-bg)", padding: "16px", borderRadius: "12px", marginBottom: "20px" }}>
          <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>
            Tautan Undangan
          </p>
          
          {code ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div 
                style={{ 
                  background: "var(--card)", 
                  padding: "12px", 
                  borderRadius: "8px", 
                  border: "1px solid var(--card-border)",
                  wordBreak: "break-all",
                  fontSize: "14px",
                  fontWeight: "500",
                  fontFamily: "monospace",
                  color: "var(--primary)"
                }}
              >
                {domain}{code}
              </div>
              
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleCopyLink}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {copied ? "✓ Tersalin!" : "Salin Tautan"}
                </button>
                <button
                  onClick={handleGenerateCode}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  {loading ? "..." : "Reset Kode"}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <button
                onClick={handleGenerateCode}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Buat Tautan Undangan"}
              </button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </>
  );
}
