"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FamilyCard from "@/components/family/FamilyCard";
import CreateFamilyDialog from "@/components/family/CreateFamilyDialog";
import { joinFamily } from "@/lib/actions/family";

interface Family {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  isPublic: boolean;
  inviteCode: string | null;
  createdAt: Date;
}

interface DashboardClientProps {
  userName: string;
  families: {
    family: Family;
    role: string;
    memberCount: number;
  }[];
}

export default function DashboardClient({
  userName,
  families,
}: DashboardClientProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setJoining(true);
    setJoinError("");
    try {
      const familyId = await joinFamily(inviteCode.trim());
      setInviteCode("");
      router.push(`/family/${familyId}`);
    } catch (err: any) {
      setJoinError(err.message || "Gagal bergabung ke bagan");
    } finally {
      setJoining(false);
    }
  };

  const firstName = userName.split(" ")[0];

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p className="text-muted" style={{ fontSize: "13px" }}>
              Selamat datang,
            </p>
            <h1 style={{ fontSize: "22px", fontWeight: "700" }}>{firstName}</h1>
          </div>
          <div
            style={{
              fontSize: "32px",
            }}
          >
            🌳
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
            Bagan Keluarga
          </h2>
          <span className="text-muted" style={{ fontSize: "13px" }}>
            {families.length} bagan
          </span>
        </div>

        {families.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text" style={{ fontSize: "16px", fontWeight: "500" }}>
              Belum ada bagan keluarga
            </p>
            <p className="empty-state-text" style={{ fontSize: "14px" }}>
              Buat bagan pertama Anda untuk mulai mencatat silsilah keluarga
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateDialog(true)}
              style={{ marginTop: "16px" }}
            >
              ✨ Buat Bagan Pertama
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {families.map((item, index) => (
              <div
                key={item.family.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FamilyCard
                  family={item.family}
                  role={item.role}
                  memberCount={item.memberCount}
                />
              </div>
            ))}
          </div>
        )}

        {/* Join Family section */}
        <div style={{ marginTop: "24px", padding: "16px", background: "var(--card)", borderRadius: "var(--radius)", border: "1px dashed var(--card-border)" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "8px" }}>Gabung Bagan via Kode</h3>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "12px" }}>Punya kode undangan? Masukkan di sini untuk langsung bergabung ke silsilah.</p>
          
          <form onSubmit={handleJoin} style={{ display: "flex", gap: "8px" }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Contoh: JM-A1B2C3D4" 
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              style={{ flex: 1, padding: "10px 12px", margin: 0 }}
              required
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={joining || !inviteCode.trim()}
              style={{ padding: "0 16px" }}
            >
              {joining ? "Loading..." : "Gabung"}
            </button>
          </form>
          {joinError && <p style={{ color: "var(--danger)", fontSize: "12px", marginTop: "8px", fontWeight: "500" }}>{joinError}</p>}
        </div>
      </div>

      {/* FAB */}
      <button
        className="fab"
        onClick={() => setShowCreateDialog(true)}
        aria-label="Buat bagan baru"
      >
        +
      </button>

      {/* Create Dialog */}
      <CreateFamilyDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </>
  );
}
