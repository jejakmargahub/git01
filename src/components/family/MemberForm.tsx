"use client";

import { useState, useRef } from "react";

interface MemberFormProps {
  familyId: string;
  initialData?: {
    id: string;
    fullName: string;
    nickname: string | null;
    mandarinName: string | null;
    photoUrl: string | null;
    gender: string;
    birthDate: string | null;
    deathDate: string | null;
    title: string | null;
    phone: string | null;
    bio: string | null;
  };
  quickAddContext?: {
    sourceMemberId: string;
    relationType: "child" | "spouse" | "sibling" | "parent";
    sourceGender?: string;
  } | null;
  onSubmit: (familyId: string, formData: FormData, memberId?: string) => Promise<void>;
  onClose: () => void;
}

const TITLE_SUGGESTIONS = [
  "Buyut",
  "Kakek",
  "Nenek",
  "Ayah",
  "Ibu",
  "Paman",
  "Bibi",
  "Kepala Keluarga",
  "Anak",
  "Cucu",
  "Cicit",
];

export default function MemberForm({
  familyId,
  initialData,
  quickAddContext,
  onSubmit,
  onClose,
}: MemberFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [titleValue, setTitleValue] = useState(initialData?.title || "");

  // Photo states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.photoUrl || "");

  const isEditing = !!initialData;

  // Helper: Client-side image compression
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          0.8 // 80% quality
        );
      };
      img.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      let finalPhotoUrl = initialData?.photoUrl || "";

      // Handle photo upload first
      if (photoFile) {
        // Compress if larger than 1MB
        const finalFile = photoFile.size > 1024 * 1024 ? await compressImage(photoFile) : photoFile;
        
        const uploadData = new FormData();
        uploadData.append("file", finalFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!uploadRes.ok) {
          const body = await uploadRes.json();
          throw new Error(body.error || "Gagal mengunggah foto");
        }

        const data = await uploadRes.json();
        finalPhotoUrl = data.url;
      }

      if (finalPhotoUrl) {
        formData.append("photoUrl", finalPhotoUrl);
      }

      await onSubmit(familyId, formData, initialData?.id);
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
      <div className="bottom-sheet active" style={{ maxHeight: "90vh" }}>
        <div className="bottom-sheet-handle" />
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "20px",
          }}
        >
          {isEditing ? "Edit Anggota" : "Tambah Anggota Baru"}
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
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Photo Picker */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div 
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "var(--card-border)",
                backgroundImage: previewUrl ? `url(${previewUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                color: "var(--muted)",
                cursor: "pointer",
                border: "2px solid var(--primary)",
                flexShrink: 0,
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {!previewUrl && "📷"}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: "500", fontSize: "14px", color: "var(--foreground)" }}>Foto Profil</p>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)" }}>Opsional. Ketuk ikon untuk mengganti foto.</p>
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoFile(null);
                    setPreviewUrl("");
                  }}
                  style={{
                    background: "none", border: "none", color: "var(--danger)", fontSize: "12px", padding: 0, marginTop: "4px", cursor: "pointer", fontWeight: "600"
                  }}
                >
                  Hapus Foto
                </button>
              )}
            </div>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Nama Lengkap */}
          <div className="input-group">
            <label className="input-label" htmlFor="fullName">
              Nama Lengkap *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="input-field"
              placeholder="Nama lengkap anggota"
              defaultValue={initialData?.fullName || ""}
              required
            />
          </div>

          {/* Nama Panggilan */}
          <div className="input-group">
            <label className="input-label" htmlFor="nickname">
              Nama Panggilan
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              className="input-field"
              placeholder="Nama panggilan (ditampilkan di pohon)"
              defaultValue={initialData?.nickname || ""}
            />
          </div>

          {/* Nama Mandarin */}
          <div className="input-group">
            <label className="input-label" htmlFor="mandarinName">
              Nama Mandarin
            </label>
            <input
              id="mandarinName"
              name="mandarinName"
              type="text"
              className="input-field"
              placeholder="Contoh: 萧德兴 (opsional)"
              defaultValue={initialData?.mandarinName || ""}
            />
          </div>

          {/* Jenis Kelamin */}
          <div className="input-group">
            <label className="input-label" htmlFor="gender">
              Jenis Kelamin *
            </label>
            <select
              id="gender"
              name="gender"
              className="input-field"
              defaultValue={
                initialData?.gender || 
                (quickAddContext?.relationType === "spouse" 
                  ? (quickAddContext.sourceGender === "M" ? "F" : "M") 
                  : "")
              }
              required
            >
              <option value="" disabled>
                Pilih jenis kelamin
              </option>
              <option value="M">♂ Laki-laki</option>
              <option value="F">♀ Perempuan</option>
            </select>
          </div>

          {/* Context Info */}
          {quickAddContext && (
             <div style={{
               background: "var(--input-bg)",
               padding: "10px 12px",
               borderRadius: "var(--radius-sm)",
               fontSize: "13px",
               borderLeft: "4px solid var(--primary)",
               color: "var(--muted)"
             }}>
               Menambah <strong>{
                 quickAddContext.relationType === "child" ? "Anak" :
                 quickAddContext.relationType === "spouse" ? "Pasangan (Suami/Istri)" :
                 quickAddContext.relationType === "sibling" ? "Saudara Kandung" :
                 "Orang Tua (Ayah/Ibu)"
               }</strong>
             </div>
          )}

          {/* Istilah/Jabatan */}
          <div className="input-group" style={{ position: "relative" }}>
            <label className="input-label" htmlFor="title">
              Istilah / Jabatan
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="input-field"
              placeholder="Contoh: Buyut, Kakek, Kepala Keluarga"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onFocus={() => setShowTitleSuggestions(true)}
              onBlur={() =>
                setTimeout(() => setShowTitleSuggestions(false), 200)
              }
            />
            {showTitleSuggestions && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "var(--card)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "var(--shadow-md)",
                  zIndex: 10,
                  maxHeight: "150px",
                  overflowY: "auto",
                }}
              >
                {TITLE_SUGGESTIONS.filter((s) =>
                  s.toLowerCase().includes(titleValue.toLowerCase())
                ).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setTitleValue(suggestion);
                      setShowTitleSuggestions(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px 16px",
                      textAlign: "left",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "var(--foreground)",
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tanggal Lahir */}
          <div className="input-group">
            <label className="input-label" htmlFor="birthDate">
              Bulan & Tahun Lahir
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="month"
              className="input-field"
              defaultValue={initialData?.birthDate?.substring(0, 7) || ""}
            />
          </div>

          {/* Tanggal Meninggal */}
          <div className="input-group">
            <label className="input-label" htmlFor="deathDate">
              Tanggal Meninggal (opsional)
            </label>
            <input
              id="deathDate"
              name="deathDate"
              type="date"
              className="input-field"
              defaultValue={
                initialData?.deathDate
                  ? new Date(initialData.deathDate).toISOString().substring(0, 10)
                  : ""
              }
            />
          </div>

          {/* Nomor HP */}
          <div className="input-group">
            <label className="input-label" htmlFor="phone">
              Nomor HP
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="input-field"
              placeholder="08xxxxxxxxxx"
              defaultValue={initialData?.phone || ""}
            />
          </div>

          {/* Bio */}
          <div className="input-group">
            <label className="input-label" htmlFor="bio">
              Bio Singkat
            </label>
            <textarea
              id="bio"
              name="bio"
              className="input-field"
              placeholder="Catatan singkat tentang anggota ini"
              rows={3}
              defaultValue={initialData?.bio || ""}
            />
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "8px",
              paddingBottom: "16px",
            }}
          >
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
                  Menyimpan...
                </>
              ) : isEditing ? (
                "Simpan"
              ) : (
                "Tambah"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
