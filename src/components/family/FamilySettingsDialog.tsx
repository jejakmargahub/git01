"use client";

import { useState } from "react";
import { generateInviteCode, exportFamilyData } from "@/lib/actions/family";

interface FamilySettingsDialogProps {
  familyId: string;
  familyName: string;
  currentInviteCode: string;
  onClose: () => void;
  onUpdate: () => void;
}

export default function FamilySettingsDialog({
  familyId,
  familyName,
  currentInviteCode,
  onClose,
  onUpdate,
}: FamilySettingsDialogProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "pdf">("json");
  const [includePhotos, setIncludePhotos] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleResetCode = async () => {
    if (!confirm("Apakah Anda yakin ingin mengganti kode undangan? Kode lama tidak akan bisa digunakan lagi.")) return;
    
    setIsResetting(true);
    setMessage(null);
    try {
      await generateInviteCode(familyId);
      setMessage({ type: "success", text: "Kode undangan berhasil diperbarui!" });
      onUpdate();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Gagal memperbarui kode" });
    } finally {
      setIsResetting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setMessage(null);
    try {
      const data = await exportFamilyData(familyId);
      
      if (exportFormat === "json") {
        downloadJSON(data);
      } else if (exportFormat === "csv") {
        downloadCSV(data);
      } else if (exportFormat === "pdf") {
        // Simple PDF representation or structured text as fallback for now
        downloadPDF(data);
      }
      
      setMessage({ type: "success", text: `Data berhasil diekspor dalam format ${exportFormat.toUpperCase()}!` });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Gagal mengekspor data" });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadJSON = (data: any) => {
    const cleanData = includePhotos ? data : { ...data, members: data.members.map((m: any) => ({ ...m, photoUrl: null })) };
    const blob = new Blob([JSON.stringify(cleanData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `silsilah-${familyName.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (data: any) => {
    // Generate Members CSV
    let csv = "ID,Nama Lengkap,Panggilan,Nama Mandarin,Gender,Gelar,Bio,Foto URL\n";
    data.members.forEach((m: any) => {
      csv += `"${m.id}","${m.fullName}","${m.nickname || ""}","${m.mandarinName || ""}","${m.gender}","${m.title || ""}","${m.bio || ""}","${includePhotos ? m.photoUrl || "" : ""}"\n`;
    });
    
    csv += "\nRelasi\nFrom ID,To ID,Tipe Relasi\n";
    data.relationships.forEach((r: any) => {
      csv += `"${r.fromMemberId}","${r.toMemberId}","${r.relationType}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `silsilah-${familyName.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async (data: any) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text(`Laporan silsilah: ${familyName}`, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Diekspor pada: ${new Date().toLocaleString()}`, 20, 30);
    doc.line(20, 35, 190, 35);
    
    let y = 45;
    
    // Members
    doc.setFontSize(16);
    doc.text("Daftar Anggota:", 20, y);
    y += 10;
    
    doc.setFontSize(10);
    data.members.forEach((m: any, i: number) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}. ${m.fullName}`, 20, y);
      doc.setFont("helvetica", "normal");
      
      let info = `Gender: ${m.gender === "M" ? "L" : "P"}`;
      if (m.nickname) info += ` | Panggilan: ${m.nickname}`;
      if (m.title) info += ` | Gelar: ${m.title}`;
      
      doc.text(info, 25, y + 5);
      y += 12;
    });

    doc.save(`silsilah-${familyName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  return (
    <div className="bottom-sheet-overlay active" onClick={onClose}>
      <div 
        className="bottom-sheet active" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "500px", margin: "0 auto", borderRadius: "24px 24px 0 0" }}
      >
        <div className="bottom-sheet-handle" onClick={onClose} />
        
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px" }}>Pengaturan Bagan</h3>
          <p style={{ fontSize: "14px", color: "var(--muted)" }}>{familyName}</p>
        </div>

        {message && (
          <div className={`toast toast-${message.type}`} style={{ position: "static", transform: "none", marginBottom: "16px", width: "100%" }}>
            {message.text}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Section: Invite Code */}
          <section>
            <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              🎟️ Kode Undangan
            </h4>
            <div style={{ 
              padding: "16px", 
              background: "var(--input-bg)", 
              borderRadius: "16px", 
              border: "1px solid var(--card-border)",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <code style={{ fontSize: "18px", fontWeight: "800", color: "var(--primary)", letterSpacing: "1px" }}>
                  {currentInviteCode}
                </code>
                <button 
                  onClick={handleResetCode}
                  disabled={isResetting}
                  className="btn btn-secondary"
                  style={{ minHeight: "36px", padding: "0 16px", fontSize: "13px" }}
                >
                  {isResetting ? "Memproses..." : "Reset Kode"}
                </button>
              </div>
              <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>
                Gunakan reset jika kode saat ini tersebar ke orang yang tidak diinginkan. Link lama akan otomatis tidak berlaku.
              </p>
            </div>
          </section>

          {/* Section: Export Data */}
          <section>
            <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              📂 Ekspor Data Silsilah
            </h4>
            <div style={{ 
              padding: "16px", 
              background: "var(--input-bg)", 
              borderRadius: "16px", 
              border: "1px solid var(--card-border)",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <div className="input-group">
                <label className="input-label" style={{ fontSize: "14px" }}>Pilih Format</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {(["json", "csv", "pdf"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setExportFormat(fmt)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "10px",
                        border: "1px solid",
                        borderColor: exportFormat === fmt ? "var(--primary)" : "var(--card-border)",
                        background: exportFormat === fmt ? "rgba(var(--primary-rgb), 0.1)" : "var(--card)",
                        color: exportFormat === fmt ? "var(--primary)" : "var(--foreground)",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => setIncludePhotos(!includePhotos)}>
                <div style={{ 
                  width: "20px", 
                  height: "20px", 
                  borderRadius: "4px", 
                  border: "2px solid var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: includePhotos ? "var(--primary)" : "transparent"
                }}>
                  {includePhotos && <span style={{ color: "white", fontSize: "14px" }}>✓</span>}
                </div>
                <span style={{ fontSize: "14px" }}>Sertakan referensi foto (photoUrl)</span>
              </div>

              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                {isExporting ? "Menyiapkan File..." : `Unduh ${exportFormat.toUpperCase()}`}
              </button>
            </div>
          </section>
        </div>

        <button 
          onClick={onClose}
          className="btn btn-ghost" 
          style={{ width: "100%", marginTop: "16px" }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
