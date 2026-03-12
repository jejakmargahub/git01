"use client";

import { useState } from "react";
import { createFamily } from "@/lib/actions/family";

interface CreateFamilyDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateFamilyDialog({
  open,
  onClose,
}: CreateFamilyDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await createFamily(formData);
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
            marginBottom: "20px",
          }}
        >
          Buat Bagan Keluarga Baru
        </h2>

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
            <label className="input-label" htmlFor="familyName">
              Nama Bagan
            </label>
            <input
              id="familyName"
              name="name"
              type="text"
              className="input-field"
              placeholder="Contoh: Keluarga Siauw Sak Po"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="familyDesc">
              Deskripsi (opsional)
            </label>
            <textarea
              id="familyDesc"
              name="description"
              className="input-field"
              placeholder="Deskripsi singkat bagan keluarga"
              rows={3}
            />
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
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner spinner-sm"
                    style={{ borderTopColor: "white" }}
                  />
                  Membuat...
                </>
              ) : (
                "Buat Bagan"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
