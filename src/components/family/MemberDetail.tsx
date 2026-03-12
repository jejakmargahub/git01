"use client";

import type { FamilyMember } from "@/lib/db/schema";

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
}

export default function MemberDetail({
  member,
  relationships,
  canEdit,
  onEdit,
  onDelete,
  onClose,
  onMemberClick,
}: MemberDetailProps) {
  const isDeceased = !!member.deathDate;
  const deceasedPrefix = member.gender === "M" ? "Alm." : "Almh.";
  const genderIcon = member.gender === "M" ? "♂" : "♀";
  const genderColor = member.gender === "M" ? "var(--male)" : "var(--female)";

  const displayName = member.nickname || member.fullName;

  const parents = relationships.filter((r) => r.relationType === "parent");
  const children = relationships.filter((r) => r.relationType === "child");
  const spouses = relationships.filter((r) => r.relationType === "spouse");

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
      <div className="bottom-sheet active">
        <div className="bottom-sheet-handle" />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          {/* Avatar / Photo */}
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
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
          {member.mandarinName && <InfoRow label="Nama Mandarin" value={member.mandarinName} />}
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
        </div>

        {/* Relationships */}
        {(parents.length > 0 || spouses.length > 0 || children.length > 0) && (
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
          </div>
        )}

        {/* Action Buttons */}
        {canEdit && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              paddingTop: "16px",
              borderTop: "1px solid var(--card-border)",
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={onEdit}
              style={{ flex: 1 }}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={onDelete}
              style={{ flex: 1 }}
            >
              🗑️ Hapus
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
