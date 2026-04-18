"use client";

import type { FamilyMember } from "@/lib/db/schema";
import { getOptimizedPhotoUrl } from "@/lib/imagekit";
import { getEthnicityById, getEthnicityByName } from "@/lib/constants/ethnicities";

interface MemberDetailProps {
  member: FamilyMember;
  relationships: {
    id: string;
    relationType: string;
    relatedMember: FamilyMember;
  }[];
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  onMemberClick: (memberId: string) => void;
  isDeleting?: boolean;
}

export default function MemberDetail({
  member,
  relationships,
  canEdit,
  onEdit,
  onDelete,
  onClose,
  onMemberClick,
  isDeleting,
}: MemberDetailProps) {
  const isDeceased = !!member.deathDate;
  const deceasedPrefix = member.gender === "M" ? "Alm." : "Almh.";
  const genderIcon = member.gender === "M" ? "♂" : "♀";
  const genderColor = member.gender === "M" ? "var(--male)" : "var(--female)";

  const displayName = member.nickname || member.fullName;

  const parents = relationships.filter((r) => r.relationType === "child");
  const children = relationships.filter((r) => r.relationType === "parent");
  const spouses = relationships.filter((r) => r.relationType === "spouse");
  const inLaws = relationships.filter((r) => r.relationType === "menantu");

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  const formatFullDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="bottom-sheet-overlay active" onClick={onClose} />
      <div 
        className="bottom-sheet active" 
        style={{ display: "flex", flexDirection: "column", padding: 0 }}
        onClick={(e) => e.stopPropagation()} // Prevent clicking through to overlay
      >
        <div className="bottom-sheet-handle" style={{ marginTop: "16px" }} />

        <div className="bottom-sheet-content" style={{ padding: "0 20px 20px", overflowY: "auto", flex: 1 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              marginBottom: "20px",
              paddingTop: "20px"
            }}
          >
            {/* Avatar / Photo */}
            {member.photoUrl ? (
              <img
                src={getOptimizedPhotoUrl(member.photoUrl, 120, 120) || ""}
                alt={displayName}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `2px solid ${genderColor}`,
                  flexShrink: 0,
                }}
              />
            ) : (member as any).metadata?.lineage ? (
              <img
                src="/icons/spiritual-default.png"
                alt="Spiritual Icon"
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  border: `2px solid #d4af37`,
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: isDeceased
                    ? "var(--deceased-bg)"
                    : member.gender === "M"
                      ? "rgba(59, 130, 246, 0.1)"
                      : "rgba(236, 72, 153, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  flexShrink: 0,
                  border: `2px solid ${genderColor}`,
                }}
              >
                {genderIcon}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  lineHeight: "1.3",
                }}
              >
                {isDeceased ? `${deceasedPrefix} ` : ""}
                {displayName}
                {isDeceased ? " 🌼" : ""}
              </h2>
              {member.nickname && (
                <p className="text-muted" style={{ fontSize: "14px" }}>
                  {member.fullName}
                </p>
              )}
              {member.title && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--muted)",
                    marginTop: "2px",
                    fontStyle: "italic",
                  }}
                >
                  {member.title}
                </p>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <InfoRow label="Jenis Kelamin" value={member.gender === "M" ? "Laki-laki" : "Perempuan"} />
            
            {/* Tampilkan Etnis dari Database (Hasil JOIN) */}
            {(member as any).ethnicity?.name && (
              <InfoRow label="Etnis" value={(member as any).ethnicity.name} />
            )}

            {(member as any).regionalName && (() => {
              const eth = (member as any).ethnicity;
              const metadata = eth ? (getEthnicityByName(eth.name) || eth) : null;
              
              return (
                <InfoRow
                  label={metadata?.labelName || "Nama Regional"}
                  value={
                    <span
                      className={metadata?.fontClass || ""}
                      dir={metadata?.isRtl ? "rtl" : "ltr"}
                      style={{
                        fontFamily: metadata?.fontFamily || undefined,
                        fontSize: "16px",
                      }}
                    >
                      {(member as any).regionalName}
                    </span>
                  }
                />
              );
            })()}
            {member.mandarinName && !(member as any).regionalName && (
              <InfoRow
                label="Nama Mandarin"
                value={<span className="font-chinese">{member.mandarinName}</span>}
              />
            )}
            <InfoRow label="Bulan & Tahun Lahir" value={formatDate(member.birthDate)} />
            {isDeceased && (
              <InfoRow label="Tanggal Meninggal" value={formatFullDate(member.deathDate)} />
            )}
            {member.phone && (
              <InfoRow
                label="Nomor HP"
                value={
                  <a
                    href={`tel:${member.phone}`}
                    style={{ color: "var(--primary)", textDecoration: "none" }}
                  >
                    📱 {member.phone}
                  </a>
                }
              />
            )}
            {member.bio && <InfoRow label="Bio" value={member.bio} />}
            
            {/* Spiritual Metadata Sections */}
            {(member.metadata as any)?.title && (
              <InfoRow label="Gelar Spiritual" value={(member.metadata as any).title} />
            )}
            {(member.metadata as any)?.period && (
              <InfoRow label="Periode / Zaman" value={(member.metadata as any).period} />
            )}
            {(member.metadata as any)?.lineage && (
              <InfoRow label="Silsilah" value={(member.metadata as any).lineage} />
            )}
            {(member.metadata as any)?.mainTeachings && (
              <InfoRow label="Ajaran Utama" value={(member.metadata as any).mainTeachings} />
            )}
            {(member.metadata as any)?.location && (
              <InfoRow label="Lokasi / Vihara" value={(member.metadata as any).location} />
            )}
            {(member.metadata as any)?.notes && (
              <div style={{ marginTop: "4px", padding: "10px", backgroundColor: "#fffbeb", borderRadius: "8px", border: "1px solid #fde68a", fontSize: "12px", color: "#92400e" }}>
                <strong>Catatan:</strong> {(member.metadata as any).notes}
              </div>
            )}
          </div>

          {/* Relationships */}
          {(parents.length > 0 || spouses.length > 0 || children.length > 0 || inLaws.length > 0) && (
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: "var(--foreground)",
                }}
              >
                Hubungan Keluarga
              </h3>

              {parents.length > 0 && (
                <RelationGroup
                  label="Orang Tua"
                  items={parents}
                  onMemberClick={onMemberClick}
                />
              )}
              {spouses.length > 0 && (
                <RelationGroup
                  label="Pasangan"
                  items={spouses}
                  onMemberClick={onMemberClick}
                />
              )}
              {children.length > 0 && (
                <RelationGroup
                  label="Anak"
                  items={children}
                  onMemberClick={onMemberClick}
                />
              )}
              {inLaws.length > 0 && (
                <RelationGroup
                  label="Menantu"
                  items={inLaws}
                  onMemberClick={onMemberClick}
                />
              )}
            </div>
          )}
        </div>

        {/* Sticky Action Buttons */}
        {canEdit && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              padding: "16px 20px calc(16px + env(safe-area-inset-bottom, 0px))",
              background: "var(--card)",
              borderTop: "1px solid var(--card-border)",
              zIndex: 10
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={onEdit}
              disabled={isDeleting}
              style={{ flex: 1 }}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Hapus button clicked inside MemberDetail sticky footer");
                onDelete();
              }}
              disabled={isDeleting}
              style={{ 
                flex: 1,
                opacity: isDeleting ? 0.7 : 1,
                cursor: isDeleting ? "not-allowed" : "pointer"
              }}
            >
              {isDeleting ? "⏳ Menghapus..." : "🗑️ Hapus"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "8px 0",
        borderBottom: "1px solid var(--card-border)",
      }}
    >
      <span className="text-muted" style={{ fontSize: "14px", flexShrink: 0 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: "14px",
          fontWeight: "500",
          textAlign: "right",
          marginLeft: "16px",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function RelationGroup({
  label,
  items,
  onMemberClick,
}: {
  label: string;
  items: {
    id: string;
    relationType: string;
    relatedMember: FamilyMember;
  }[];
  onMemberClick: (memberId: string) => void;
}) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <p
        className="text-muted"
        style={{
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "6px",
          fontWeight: "600",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {items.map((item) => {
          const m = item.relatedMember;
          const icon = m.gender === "M" ? "♂" : "♀";
          const name = m.nickname || m.fullName;
          const isDeceased = !!m.deathDate;
          return (
            <button
              key={item.id}
              onClick={() => onMemberClick(m.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--card-border)",
                background: "var(--input-bg)",
                cursor: "pointer",
                fontSize: "14px",
                color: "var(--foreground)",
                textAlign: "left",
                width: "100%",
              }}
            >
              <span
                style={{
                  color: m.gender === "M" ? "var(--male)" : "var(--female)",
                }}
              >
                {icon}
              </span>
              <span>
                {isDeceased
                  ? `${m.gender === "M" ? "Alm." : "Almh."} `
                  : ""}
                {name}
                {isDeceased ? " 🌼" : ""}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
