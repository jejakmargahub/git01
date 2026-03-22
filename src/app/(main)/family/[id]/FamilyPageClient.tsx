"use client";

import { useState, useCallback, useEffect } from "react";
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [quickAddContext, setQuickAddContext] = useState<{
    sourceMemberId: string;
    relationType: "child" | "spouse" | "sibling" | "parent";
    sourceGender?: string;
  } | null>(null);
  const [highlightNodeId, setHighlightNodeId] = useState<string | null>(null);

  const canEdit = userRole === "admin" || userRole === "editor";
  const isAdmin = userRole === "admin";

  const handleNodeClick = useCallback(
    async (memberId: string) => {
      const member = members.find((m) => m.id === memberId);
      if (!member) return;

      try {
        const rels = await getMemberRelationships(family.id, memberId);
        setMemberRelationships(
          rels.map((r: any) => ({
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
    const newMember = await createMember(familyId, formData);
    
    if (quickAddContext && newMember) {
      const { sourceMemberId, relationType } = quickAddContext;
      
      try {
        if (relationType === "child") {
          // Add relationship from source (parent) to new (child)
          await addRelationship(familyId, sourceMemberId, newMember.id, "parent");
        } else if (relationType === "spouse") {
          await addRelationship(familyId, sourceMemberId, newMember.id, "spouse");
        } else if (relationType === "parent") {
          // Add relationship from new (parent) to source (child)
          await addRelationship(familyId, newMember.id, sourceMemberId, "parent");
        } else if (relationType === "sibling") {
          // Find parents of source member
          const sourceRels = await getMemberRelationships(familyId, sourceMemberId);
          const parents = sourceRels.filter((r: any) => r.relationType === "parent" && r.relatedMember.id !== sourceMemberId);
          // Note: andRelationship is bidirectional for spouse/child but we need to be careful with the "from" member.
          // Actually relationships are stored as (from, to, type).
          // If R is parent-child, then from is parent, to is child.
          
          // Let's re-fetch relationships to be sure about parents
          const allRels = await getMemberRelationships(familyId, sourceMemberId);
          // Parents of sourceMember are those where sourceMember is the child.
          // In our DB schema, if r.relationType === 'parent', from is parent, to is child.
          // Wait, getMemberRelationships returns relatedMember.
          
          // Simpler: Just look for relationships in the 'relationships' prop we already have
          const parentsOfSource = relationships
            .filter((r: any) => r.toMemberId === sourceMemberId && r.relationType === "parent")
            .map(r => r.fromMemberId);
          
          for (const parentId of parentsOfSource) {
            await addRelationship(familyId, parentId, newMember.id, "parent");
          }
        }
      } catch (err) {
        console.error("Gagal membuat relasi otomatis:", err);
      }
      setQuickAddContext(null);
    }
    
    router.refresh();
    
    if (newMember) {
      setHighlightNodeId(newMember.id);
      // Reset highlight after 5 seconds
      setTimeout(() => setHighlightNodeId(null), 5000);
    }
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

  // Auto-scroll to new member in list view
  useEffect(() => {
    if (viewMode === "list" && highlightNodeId) {
      setTimeout(() => {
        const element = document.getElementById(`member-${highlightNodeId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500); // Wait for refresh/render
    }
  }, [viewMode, highlightNodeId]);

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    if (!confirm(`Yakin ingin menghapus ${selectedMember.fullName}?`)) return;

    try {
      setIsDeleting(true);
      await deleteMember(family.id, selectedMember.id);
      setSelectedMember(null);
      router.refresh();
      alert("Anggota berhasil dihapus");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Gagal menghapus anggota: " + (error instanceof Error ? error.message : "Kesalahan tidak diketahui"));
    } finally {
      setIsDeleting(false);
    }
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

            {/* Edit Mode Toggle */}
            {canEdit && viewMode === "tree" && (
              <button
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  setSelectedMember(null);
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: isEditMode ? "1px solid var(--primary)" : "1px solid var(--card-border)",
                  background: isEditMode ? "rgba(var(--primary-rgb), 0.1)" : "var(--card)",
                  color: isEditMode ? "var(--primary)" : "var(--muted)",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{isEditMode ? "✏️ Mode Edit (Aktif)" : "✏️ Mode Edit"}</span>
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
              👨‍👩‍👧‍👦 Pohon
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
          onNodeClick={isEditMode ? undefined : handleNodeClick}
          isEditMode={isEditMode}
          onQuickAdd={(sourceId, type) => {
            const source = members.find(m => m.id === sourceId);
            setQuickAddContext({ 
              sourceMemberId: sourceId, 
              relationType: type,
              sourceGender: source?.gender
            });
            setEditingMember(null);
            setShowMemberForm(true);
          }}
          highlightNodeId={highlightNodeId}
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
                    id={`member-${member.id}`}
                    className="card ripple"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 16px",
                      cursor: "pointer",
                      marginBottom: "8px",
                      border: highlightNodeId === member.id ? "2px solid var(--primary)" : "1px solid var(--card-border)",
                      background: highlightNodeId === member.id ? "rgba(var(--primary-rgb), 0.05)" : "var(--card)",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handleNodeClick(member.id)}
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
          quickAddContext={quickAddContext}
          onSubmit={editingMember ? handleUpdateMember : handleCreateMember}
          onClose={() => {
            setShowMemberForm(false);
            setEditingMember(null);
            setQuickAddContext(null);
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
          isDeleting={isDeleting}
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
        isPublicViewEnabled={family.isPublicViewEnabled}
        publicViewSlug={family.publicViewSlug}
        open={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
      />
    </>
  );
}
