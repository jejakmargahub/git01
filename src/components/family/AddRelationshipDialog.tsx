"use client";

import { useState } from "react";
import type { FamilyMember } from "@/lib/db/schema";

interface AddRelationshipDialogProps {
  familyId: string;
  currentMember: FamilyMember;
  allMembers: FamilyMember[];
  onSubmit: (
    familyId: string,
    fromMemberId: string,
    toMemberId: string,
    relationType: string
  ) => Promise<void>;
  onClose: () => void;
}

export default function AddRelationshipDialog({
  familyId,
  currentMember,
  allMembers,
  onSubmit,
  onClose,
}: AddRelationshipDialogProps) {
  const [relationType, setRelationType] = useState("parent");
  const [targetMemberId, setTargetMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const otherMembers = allMembers.filter((m) => m.id !== currentMember.id);
  const displayName = currentMember.nickname || currentMember.fullName;

  const relationLabels: Record<string, string> = {
    parent: `adalah orang tua dari ${displayName}`,
    child: `adalah anak dari ${displayName}`,
    spouse: `adalah pasangan dari ${displayName}`,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMemberId) return;

    setError("");
    setLoading(true);

    try {
      if (relationType === "parent") {
        // targetMember is parent of currentMember
        await onSubmit(familyId, targetMemberId, currentMember.id, "parent");
      } else if (relationType === "child") {
        // currentMember is parent of targetMember
        await onSubmit(familyId, currentMember.id, targetMemberId, "parent");
      } else {
        // spouse
        await onSubmit(familyId, currentMember.id, targetMemberId, "spouse");
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bottom-sheet-overlay active" onClick={onClose} />
      <div className="bottom-sheet active">
        <div className="bottom-sheet-handle" />
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "4px",
          }}
        >
          Tambah Hubungan
        </h2>
        <p className="text-muted" style={{ fontSize: "14px", marginBottom: "20px" }}>
          Untuk: {displayName}
        </p>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "var(--danger)",
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div className="input-group">
            <label className="input-label">Pilih Anggota</label>
            <select
              className="input-field"
              value={targetMemberId}
              onChange={(e) => setTargetMemberId(e.target.value)}
              required
            >
              <option value="" disabled>
                Pilih anggota keluarga
              </option>
              {otherMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.gender === "M" ? "♂" : "♀"}{" "}
                  {m.nickname || m.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Jenis Hubungan</label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {(["parent", "child", "spouse"] as const).map((type) => (
                <label
                  key={type}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-sm)",
                    border: `1.5px solid ${relationType === type ? "var(--primary)" : "var(--card-border)"}`,
                    background:
                      relationType === type
                        ? "rgba(37, 99, 235, 0.05)"
                        : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input
                    type="radio"
                    name="relationType"
                    value={type}
                    checked={relationType === type}
                    onChange={() => setRelationType(type)}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <div>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                      {type === "parent" && "Orang Tua"}
                      {type === "child" && "Anak"}
                      {type === "spouse" && "Pasangan"}
                    </span>
                    {targetMemberId && (
                      <p className="text-muted" style={{ fontSize: "12px", marginTop: "2px" }}>
                        {
                          otherMembers.find((m) => m.id === targetMemberId)
                            ?.nickname ||
                          otherMembers.find((m) => m.id === targetMemberId)
                            ?.fullName ||
                          "?"
                        }{" "}
                        {relationLabels[type]}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !targetMemberId}
              style={{ flex: 1 }}
            >
              {loading ? (
                <>
                  <span className="spinner spinner-sm" style={{ borderTopColor: "white" }} />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
