"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Family, FamilyMember, Relationship } from "@/lib/db/schema";
import FamilyTree from "@/components/family/FamilyTree";
import MemberForm from "@/components/family/MemberForm";
import MemberDetail from "@/components/family/MemberDetail";
import AddRelationshipDialog from "@/components/family/AddRelationshipDialog";
import InviteDialog from "@/components/family/InviteDialog";
import { createMember, updateMember, deleteMember } from "@/lib/actions/member";
import {
  addRelationship,
  getMemberRelationships,
} from "@/lib/actions/relationship";

interface FamilyPageClientProps {
  family: Family;
  members: FamilyMember[];
  relationships: Relationship[];
  userRole: string;
}

type ViewMode = "tree" | "list";

export default function FamilyPageClient({
  family,
  members,
  relationships,
  userRole,
}: FamilyPageClientProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [memberRelationships, setMemberRelationships] = useState<
    { id: string; relationType: string; relatedMember: FamilyMember }[]
  >([]);
  const [showRelationshipDialog, setShowRelationshipDialog] = useState(false);
  const [relationshipMember, setRelationshipMember] = useState<FamilyMember | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const canEdit = userRole === "admin" || userRole === "editor";
  const isAdmin = userRole === "admin";

  const handleNodeClick = useCallback(
    async (memberId: string) => {
      const member = members.find((m) => m.id === memberId);
      if (!member) return;

      try {
        const rels = await getMemberRelationships(family.id, memberId);
        setMemberRelationships(
          rels.map((r) => ({
            id: r.id,
            relationType: r.relationType,
            relatedMember: r.relatedMember,
          }))
        );
      } catch {
        setMemberRelationships([]);
      }

      setSelectedMember(member);
    },
    [members, family.id]
  );

  const handleCreateMember = async (
    familyId: string,
    formData: FormData
  ) => {
    await createMember(familyId, formData);
    router.refresh();
  };

  const handleUpdateMember = async (
    familyId: string,
    formData: FormData,
    memberId?: string
  ) => {
    if (!memberId) return;
    await updateMember(familyId, memberId, formData);
    router.refresh();
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    if (!confirm("Yakin ingin menghapus anggota ini?")) return;

    await deleteMember(family.id, selectedMember.id);
    setSelectedMember(null);
    router.refresh();
  };

  const handleAddRelationship = async (
    familyId: string,
    fromMemberId: string,
    toMemberId: string,
    relationType: string
  ) => {
    await addRelationship(familyId, fromMemberId, toMemberId, relationType);
    router.refresh();
  };

  const handleEditMember = () => {
    if (!selectedMember) return;
    setEditingMember(selectedMember);
    setSelectedMember(null);
    setShowMemberForm(true);
  };

  const handleOpenAddRelationship = (member: FamilyMember) => {
    setRelationshipMember(member);
    setSelectedMember(null);
    setShowRelationshipDialog(true);
  };

  const isDeceased = (m: FamilyMember) => !!m.deathDate;

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              textDecoration: "none",
              color: "var(--foreground)",
              background: "var(--input-bg)",
            }}
          >
            ←
          </Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: "700",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {family.name}
            </h1>
            <p className="text-muted" style={{ fontSize: "12px" }}>
              {members.length} anggota
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Share / Invite Button */}
            {isAdmin && (
              <button
                onClick={() => setShowInviteDialog(true)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--primary)",
                  background: "var(--card)",
                  color: "var(--primary)",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>🔗</span> Bagikan
              </button>
            )}

            {/* View toggle */}
            <div
            style={{
              display: "flex",
              background: "var(--input-bg)",
              borderRadius: "var(--radius-sm)",
              padding: "2px",
            }}
          >
            <button
              onClick={() => setViewMode("tree")}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background:
                  viewMode === "tree" ? "var(--card)" : "transparent",
                color:
                  viewMode === "tree"
                    ? "var(--foreground)"
                    : "var(--muted)",
                fontWeight: viewMode === "tree" ? "600" : "400",
                fontSize: "13px",
                cursor: "pointer",
                boxShadow:
                  viewMode === "tree" ? "var(--shadow-sm)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              🌳 Pohon
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background:
                  viewMode === "list" ? "var(--card)" : "transparent",
                color:
                  viewMode === "list"
                    ? "var(--foreground)"
                    : "var(--muted)",
                fontWeight: viewMode === "list" ? "600" : "400",
                fontSize: "13px",
                cursor: "pointer",
                boxShadow:
                  viewMode === "list" ? "var(--shadow-sm)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              📋 Daftar
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Content */}
      {viewMode === "tree" ? (
        <FamilyTree
          members={members}
          relationships={relationships}
          onNodeClick={handleNodeClick}
        />
      ) : (
        <div className="page-content">
          {members.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <p className="empty-state-text">Belum ada anggota</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {members.map((member) => {
                const genderIcon = member.gender === "M" ? "♂" : "♀";
                const genderColor =
                  member.gender === "M" ? "var(--male)" : "var(--female)";
                const displayName = member.nickname || member.fullName;
                const deceased = isDeceased(member);
                const deceasedPrefix =
                  member.gender === "M" ? "Alm." : "Almh.";

                return (
                  <div
                    key={member.id}
                    className="card card-interactive"
                    onClick={() => handleNodeClick(member.id)}
                    style={{
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: deceased
                        ? "var(--deceased-bg)"
                        : "var(--card)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "20px",
                        color: genderColor,
                        flexShrink: 0,
                      }}
                    >
                      {genderIcon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "15px",
                          fontWeight: "600",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {deceased ? `${deceasedPrefix} ` : ""}
                        {displayName}
                        {deceased ? " 🌼" : ""}
                      </p>
                      {member.title && (
                        <p
                          className="text-muted"
                          style={{ fontSize: "12px" }}
                        >
                          {member.title}
                        </p>
                      )}
                    </div>
                    {member.phone && (
                      <span
                        className="text-muted"
                        style={{ fontSize: "12px", flexShrink: 0 }}
                      >
                        📱
                      </span>
                    )}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--muted)"
                      strokeWidth="2"
                      style={{ flexShrink: 0 }}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      {canEdit && (
        <button
          className="fab"
          onClick={() => {
            setEditingMember(null);
            setShowMemberForm(true);
          }}
          aria-label="Tambah anggota"
        >
          +
        </button>
      )}

      {/* Member Form */}
      {showMemberForm && (
        <MemberForm
          familyId={family.id}
          initialData={
            editingMember
              ? {
                  id: editingMember.id,
                  fullName: editingMember.fullName,
                  nickname: editingMember.nickname,
                  mandarinName: editingMember.mandarinName,
                  photoUrl: editingMember.photoUrl,
                  gender: editingMember.gender,
                  birthDate: editingMember.birthDate,
                  deathDate: editingMember.deathDate,
                  title: editingMember.title,
                  phone: editingMember.phone,
                  bio: editingMember.bio,
                }
              : undefined
          }
          onSubmit={editingMember ? handleUpdateMember : handleCreateMember}
          onClose={() => {
            setShowMemberForm(false);
            setEditingMember(null);
          }}
        />
      )}

      {/* Member Detail */}
      {selectedMember && (
        <MemberDetail
          member={selectedMember}
          relationships={memberRelationships}
          canEdit={canEdit}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
          onClose={() => setSelectedMember(null)}
          onMemberClick={(memberId) => {
            setSelectedMember(null);
            setTimeout(() => handleNodeClick(memberId), 300);
          }}
        />
      )}

      {/* Relationship Dialog */}
      {showRelationshipDialog && relationshipMember && (
        <AddRelationshipDialog
          familyId={family.id}
          currentMember={relationshipMember}
          allMembers={members}
          onSubmit={handleAddRelationship}
          onClose={() => {
            setShowRelationshipDialog(false);
            setRelationshipMember(null);
          }}
        />
      )}

      {/* Invite Dialog */}
      <InviteDialog
        familyId={family.id}
        initialCode={(family as any).inviteCode || null}
        open={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
      />
    </>
  );
}
