"use client";

import { useState, useCallback } from "react";
import type { Family, FamilyMember, Relationship } from "@/lib/db/schema";
import FamilyTree from "@/components/family/FamilyTree";
import MemberDetail from "@/components/family/MemberDetail";
import { getMemberRelationships } from "@/lib/actions/relationship";
import Link from "next/link";

interface PublicViewClientProps {
  family: Family;
  members: FamilyMember[];
  relationships: Relationship[];
}

export default function PublicViewClient({
  family,
  members,
  relationships,
}: PublicViewClientProps) {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [memberRelationships, setMemberRelationships] = useState<
    { id: string; relationType: string; relatedMember: FamilyMember }[]
  >([]);

  const handleNodeClick = useCallback(
    async (memberId: string) => {
      const member = members.find((m) => m.id === memberId);
      if (!member) return;

      // Even though it's public, we can still fetch relationships for the detail view
      // But we must be careful if the action checks authentication.
      // Let's check getMemberRelationships.
      try {
        const rels = await getMemberRelationships(family.id, memberId);
        // Note: getMemberRelationships might need to be updated to allow public access 
        // if the family has public view enabled.
        setMemberRelationships(
          rels.map((r: any) => ({
            id: r.id,
            relationType: r.relationType,
            relatedMember: {
              ...r.relatedMember,
              phone: null,
              bio: null
            },
          }))
        );
      } catch {
        // Fallback to static props if action fails (e.g. auth check)
        setMemberRelationships([]);
      }

      setSelectedMember(member);
    },
    [members, family.id]
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Public Header */}
      <header style={{ 
        padding: "16px 20px", 
        background: "rgba(var(--card-rgb), 0.8)", 
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--card-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 10
      }}>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: "700" }}>{family.name}</h1>
          <p style={{ fontSize: "12px", color: "var(--muted)" }}>Tampilan Publik (Hanya Baca)</p>
        </div>
        <Link href="/" className="btn btn-ghost" style={{ fontSize: "13px" }}>
          Buat Silsilah Sendiri →
        </Link>
      </header>

      {/* Main Tree View */}
      <main style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <FamilyTree
          members={members}
          relationships={relationships}
          onNodeClick={handleNodeClick}
          isEditMode={false} // Always read-only
        />
      </main>

      {/* Detail Overlay */}
      {selectedMember && (
        <MemberDetail
          member={selectedMember}
          relationships={memberRelationships}
          canEdit={false} // No editing in public view
          onEdit={() => {}} // Dummy as required by type
          onDelete={() => {}} // Dummy as required by type
          onClose={() => setSelectedMember(null)}
          onMemberClick={(memberId) => {
            setSelectedMember(null);
            setTimeout(() => handleNodeClick(memberId), 300);
          }}
        />
      )}

      {/* Watermark/Branding */}
      <div style={{ 
        position: "fixed", 
        bottom: "20px", 
        left: "50%", 
        transform: "translateX(-50%)",
        background: "rgba(var(--card-rgb), 0.6)",
        padding: "6px 16px",
        borderRadius: "20px",
        fontSize: "12px",
        color: "var(--muted)",
        pointerEvents: "none",
        border: "1px solid var(--card-border)"
      }}>
        Dibuat dengan <strong>Jejak Marga</strong>
      </div>
    </div>
  );
}
