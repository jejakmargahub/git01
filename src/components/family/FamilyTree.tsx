"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import type { FamilyMember, Relationship } from "@/lib/db/schema";
import { getOptimizedPhotoUrl } from "@/lib/imagekit";

interface TreeNode {
  member: FamilyMember;
  children: TreeNode[];
  spouses: FamilyMember[];
}

interface FamilyTreeProps {
  members: FamilyMember[];
  relationships: Relationship[];
  onNodeClick?: (memberId: string) => void;
  isEditMode?: boolean;
  onQuickAdd?: (sourceId: string, type: "child" | "spouse" | "sibling" | "parent") => void;
}

function buildTree(
  members: FamilyMember[],
  relationships: Relationship[]
): TreeNode[] {
  const memberMap = new Map<string, FamilyMember>();
  members.forEach((m) => memberMap.set(m.id, m));

  // Find parent-child relationships
  const childToParents = new Map<string, string[]>();
  const parentToChildren = new Map<string, string[]>();
  const spouseMap = new Map<string, string[]>();

  relationships.forEach((r) => {
    if (r.relationType === "parent") {
      // fromMember is parent of toMember
      const children = parentToChildren.get(r.fromMemberId) || [];
      children.push(r.toMemberId);
      parentToChildren.set(r.fromMemberId, children);

      const parents = childToParents.get(r.toMemberId) || [];
      parents.push(r.fromMemberId);
      childToParents.set(r.toMemberId, parents);
    } else if (r.relationType === "spouse") {
      const existing = spouseMap.get(r.fromMemberId) || [];
      if (!existing.includes(r.toMemberId)) {
        existing.push(r.toMemberId);
        spouseMap.set(r.fromMemberId, existing);
      }
    }
  });

  // Find root nodes (members without parents)
  const rootMembers = members.filter((m) => {
    const parents = childToParents.get(m.id);
    return !parents || parents.length === 0;
  });

  // Filter roots: if a root is a spouse of another root, only keep one
  const spouseRootsRemoved = new Set<string>();
  rootMembers.forEach((m) => {
    const spouses = spouseMap.get(m.id) || [];
    spouses.forEach((sid) => {
      if (
        rootMembers.some((rm) => rm.id === sid) &&
        !spouseRootsRemoved.has(m.id)
      ) {
        spouseRootsRemoved.add(sid);
      }
    });
  });

  const filteredRoots = rootMembers.filter(
    (m) => !spouseRootsRemoved.has(m.id)
  );

  function buildNode(memberId: string, visited: Set<string>): TreeNode | null {
    if (visited.has(memberId)) return null;
    visited.add(memberId);

    const member = memberMap.get(memberId);
    if (!member) return null;

    const childIds = parentToChildren.get(memberId) || [];
    const spouseIds = spouseMap.get(memberId) || [];
    const spouses = spouseIds
      .map((id) => memberMap.get(id))
      .filter((m): m is FamilyMember => !!m);

    // Also find children from spouse
    const allChildIds = new Set(childIds);
    spouseIds.forEach((sid) => {
      const spouseChildren = parentToChildren.get(sid) || [];
      spouseChildren.forEach((cid) => allChildIds.add(cid));
    });

    const children: TreeNode[] = [];
    allChildIds.forEach((cid) => {
      const childNode = buildNode(cid, visited);
      if (childNode) children.push(childNode);
    });

    return { member, children, spouses };
  }

  const visited = new Set<string>();
  const trees = filteredRoots
    .map((m) => buildNode(m.id, visited))
    .filter((n): n is TreeNode => !!n);

  // Add any unvisited members as standalone roots
  members.forEach((m) => {
    if (!visited.has(m.id)) {
      trees.push({
        member: m,
        children: [],
        spouses: (spouseMap.get(m.id) || [])
          .map((id) => memberMap.get(id))
          .filter((mm): mm is FamilyMember => !!mm),
      });
    }
  });

  return trees;
}

// Node dimensions – extreme sizing to guarantee long names fit and spouses are separated
const NODE_WIDTH = 280;
const NODE_HEIGHT = 150;
const NODE_MARGIN_X = 220; 
const NODE_MARGIN_Y = 160;
const SPOUSE_GAP = 60; 

interface LayoutNode {
  node: TreeNode;
  x: number;
  y: number;
  width: number;
  children: LayoutNode[];
  spouseX?: number;
}

function layoutTree(
  tree: TreeNode,
  startX: number,
  startY: number
): LayoutNode {
  const hasSpouse = tree.spouses.length > 0;
  // Total width of the parent block (parent + all spouses)
  const spouseBlockWidth = hasSpouse
    ? NODE_WIDTH + (tree.spouses.length * (NODE_WIDTH + SPOUSE_GAP))
    : NODE_WIDTH;

  if (tree.children.length === 0) {
    return {
      node: tree,
      x: startX,
      y: startY,
      width: spouseBlockWidth,
      children: [],
      spouseX: hasSpouse ? startX + NODE_WIDTH + SPOUSE_GAP : undefined,
    };
  }

  // Layout children first
  let childX = startX;
  const laidOutChildren: LayoutNode[] = [];
  tree.children.forEach((child) => {
    const layoutChild = layoutTree(
      child,
      childX,
      startY + NODE_HEIGHT + NODE_MARGIN_Y
    );
    laidOutChildren.push(layoutChild);
    childX += layoutChild.width + NODE_MARGIN_X;
  });

  // Calculate total children width span (for layout purposes)
  const totalChildrenWidth =
    laidOutChildren.reduce((sum, c) => sum + c.width, 0) +
    (laidOutChildren.length - 1) * NODE_MARGIN_X;

  // Center the parent block over the children's own card midpoints (NOT their branch widths)
  const firstChild = laidOutChildren[0];
  const lastChild = laidOutChildren[laidOutChildren.length - 1];
  
  const getMid = (l: LayoutNode) => 
    l.spouseX !== undefined ? (l.x + NODE_WIDTH + l.spouseX) / 2 : l.x + NODE_WIDTH / 2;
  
  const childrenSpanCenter = (getMid(firstChild) + getMid(lastChild)) / 2;
  let parentX = childrenSpanCenter - spouseBlockWidth / 2;

  // Ensure parentX doesn't shift tree to the left of startX
  if (parentX < startX) {
    const shift = startX - parentX;
    parentX = startX;
    // Shift all children to maintain centering relative to parent
    laidOutChildren.forEach(c => updateXPositions(c, shift));
  }

  // Calculate the actual total width covered by this family branch
  const childrenRight = laidOutChildren[laidOutChildren.length - 1].x + 
    laidOutChildren[laidOutChildren.length - 1].width;
  const parentRight = parentX + spouseBlockWidth;
  const totalWidth = Math.max(childrenRight, parentRight) - startX;

  return {
    node: tree,
    x: parentX,
    y: startY,
    width: totalWidth,
    children: laidOutChildren,
    spouseX: hasSpouse ? parentX + NODE_WIDTH + SPOUSE_GAP : undefined,
  };
}

function updateXPositions(node: LayoutNode, shift: number) {
  node.x += shift;
  if (node.spouseX !== undefined) node.spouseX += shift;
  node.children.forEach(c => updateXPositions(c, shift));
}

function getAllNodes(layout: LayoutNode): LayoutNode[] {
  const result: LayoutNode[] = [layout];
  
  // Also collect spouses as ghost nodes for layout calculations if needed
  // but for now RenderNode handles them separately in the map at the bottom.
  
  layout.children.forEach((child) => {
    result.push(...getAllNodes(child));
  });
  return result;
}

function RenderNode({
  member,
  x,
  y,
  onClick,
}: {
  member: FamilyMember;
  x: number;
  y: number;
  onClick: () => void;
}) {
  const isDeceased = !!member.deathDate;
  const genderIcon = member.gender === "M" ? "♂" : "♀";
  const genderColor = member.gender === "M" ? "#60a5fa" : "#f472b6";
  const deceasedPrefix = member.gender === "M" ? "Alm." : "Almh.";
  
  // Calculate age
  let ageText = "";
  if (member.birthDate) {
    const birth = new Date(member.birthDate);
    const endDate = isDeceased && member.deathDate ? new Date(member.deathDate) : new Date();
    let age = endDate.getFullYear() - birth.getFullYear();
    const monthDiff = endDate.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birth.getDate())) {
      age--;
    }
    if (age >= 0) {
      ageText = isDeceased ? `† ${age} thn` : `${age} thn`;
    }
  }

  return (
    <g
      onClick={onClick}
      style={{ cursor: "pointer" }}
      role="button"
      tabIndex={0}
    >
      {/* Shadow */}
      <rect
        x={x + 2}
        y={y + 2}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={14}
        ry={14}
        fill="rgba(0,0,0,0.06)"
      />
      {/* Card */}
      <rect
        x={x}
        y={y}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={14}
        ry={14}
        fill={isDeceased ? "#f3f4f6" : "white"}
        stroke={genderColor}
        strokeWidth={2.5}
      />
      {/* Avatar Image */}
      {member.photoUrl && (
        <clipPath id={`avatar-clip-${member.id}`}>
          <circle cx={x + 28} cy={y + 35} r={20} />
        </clipPath>
      )}
      {member.photoUrl ? (
        <image
          href={getOptimizedPhotoUrl(member.photoUrl, 40, 40) || ""}
          x={x + 8}
          y={y + 15}
          width={40}
          height={40}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#avatar-clip-${member.id})`}
        />
      ) : (
        <circle cx={x + 28} cy={y + 35} r={20} fill="#f1f5f9" />
      )}
      {/* Gender icon overlay on avatar or circle */}
      {!member.photoUrl && (
        <text
          x={x + 28}
          y={y + 42}
          fontSize={18}
          fill={genderColor}
          fontWeight="bold"
          textAnchor="middle"
        >
          {genderIcon}
        </text>
      )}
      {/* Age badge (top right corner) - moved further right and improved styling */}
      {ageText && (
        <g>
          <rect
            x={x + NODE_WIDTH - 60}
            y={y + 8}
            width={52}
            height={20}
            rx={10}
            fill={isDeceased ? "#e5e7eb" : "#ecfdf5"}
          />
          <text
            x={x + NODE_WIDTH - 34}
            y={y + 22}
            fontSize={10}
            fill={isDeceased ? "#6b7280" : "#059669"}
            fontWeight="700"
            textAnchor="middle"
          >
            {ageText}
          </text>
        </g>
      )}

      {/* NEW Consolidated UI: Using an explicit XHTML namespace and robust wrapping CSS */}
      <foreignObject
        x={x + 64}
        y={y + 12}
        width={NODE_WIDTH - 120}
        height={NODE_HEIGHT - 24}
      >
        <div 
          style={{
            fontSize: "15px", // Slightly larger for better readability
            color: "#111827",
            lineHeight: "1.3",
            wordWrap: "break-word",
            wordBreak: "break-word",
            whiteSpace: "normal !important",
            textAlign: "left",
            display: "block",
            fontFamily: "inherit",
            overflow: "visible",
            height: "auto"
          }}
        >
          {/* Main Name + Mandarin - Ensure it is the primary focus */}
          <div style={{ fontWeight: "700", marginBottom: "4px" }}>
            {isDeceased ? `${deceasedPrefix} ` : ""}
            {member.fullName}
            {member.mandarinName ? ` (${member.mandarinName})` : ""}
            {isDeceased ? " 🌼" : ""}
          </div>
          
          {/* Secondary Info: Nickname & Title */}
          <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "400", lineHeight: "1.2" }}>
            {member.nickname && member.nickname !== member.fullName && (
              <div style={{ opacity: 0.8 }}>Panggilan: {member.nickname}</div>
            )}
            {member.title && (
              <div style={{ fontStyle: "italic", marginTop: "2px" }}>{member.title}</div>
            )}
          </div>
        </div>
      </foreignObject>

      {/* Indicators at bottom */}
      {member.phone && (
        <g>
          <circle cx={x + 14} cy={y + NODE_HEIGHT - 14} r={3} fill="#059669" />
          <text x={x + 20} y={y + NODE_HEIGHT - 11} fontSize={9} fill="#6b7280">
            📱
          </text>
        </g>
      )}
    </g>
  );
}

function EditArrows({
  x,
  y,
  onAdd,
}: {
  x: number;
  y: number;
  onAdd: (type: "child" | "spouse" | "sibling" | "parent") => void;
}) {
  const DISTANCE = 55; // Slightly more distance for labels
  const ARROW_SIZE = 36;

  const arrows = [
    { 
      type: "parent" as const, 
      lx: x + NODE_WIDTH / 2, 
      ly: y - DISTANCE, 
      icon: "☝️", 
      label: "Orang Tua",
      labelPos: { x: 0, y: -25 }
    },
    { 
      type: "child" as const, 
      lx: x + NODE_WIDTH / 2, 
      ly: y + NODE_HEIGHT + DISTANCE, 
      icon: "👇", 
      label: "Anak",
      labelPos: { x: 0, y: 30 }
    },
    { 
      type: "sibling" as const, 
      lx: x - DISTANCE, 
      ly: y + NODE_HEIGHT / 2, 
      icon: "👈", 
      label: "Saudara",
      labelPos: { x: -45, y: 5 }
    },
    { 
      type: "spouse" as const, 
      lx: x + NODE_WIDTH + DISTANCE, 
      ly: y + NODE_HEIGHT / 2, 
      icon: "👉", 
      label: "Pasangan",
      labelPos: { x: 45, y: 5 }
    },
  ];

  return (
    <g className="animate-fade-in">
      {arrows.map((a) => (
        <g
          key={a.type}
          onClick={(e) => {
            e.stopPropagation();
            onAdd(a.type);
          }}
          style={{ cursor: "pointer" }}
        >
          {/* Label Background */}
          <rect
            x={a.lx + a.labelPos.x - 40}
            y={a.ly + a.labelPos.y - 10}
            width={80}
            height={20}
            rx={10}
            fill="rgba(0,0,0,0.6)"
          />
          {/* Label Text */}
          <text
            x={a.lx + a.labelPos.x}
            y={a.ly + a.labelPos.y + 4}
            fontSize={10}
            fill="white"
            fontWeight="600"
            textAnchor="middle"
            style={{ pointerEvents: "none" }}
          >
            {a.label}
          </text>
          
          <circle
            cx={a.lx}
            cy={a.ly}
            r={ARROW_SIZE / 2}
            fill="var(--card)"
            stroke="var(--primary)"
            strokeWidth={1.5}
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
          />
          <text
            x={a.lx}
            y={a.ly + 5}
            fontSize={16}
            textAnchor="middle"
            style={{ userSelect: "none" }}
          >
            {a.icon}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function FamilyTree({
  members,
  relationships,
  onNodeClick,
  isEditMode = false,
  onQuickAdd,
}: FamilyTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedEditNode, setSelectedEditNode] = useState<string | null>(null);

  // Clear selection if edit mode is turned off
  useEffect(() => {
    if (!isEditMode) setSelectedEditNode(null);
  }, [isEditMode]);

  const trees = buildTree(members, relationships);

  // Layout all trees side by side
  let currentX = 120; // Start with more space
  const layouts: LayoutNode[] = [];
  trees.forEach((tree) => {
    const layout = layoutTree(tree, currentX, 120);
    layouts.push(layout);
    currentX += layout.width + NODE_MARGIN_X * 2;
  });

  // Calculate SVG bounds precisely
  const allNodes = layouts.flatMap(getAllNodes);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  allNodes.forEach((n) => {
    // Left edge
    minX = Math.min(minX, n.x);
    
    // Right edge (include spouses)
    const nodeRight = n.x + NODE_WIDTH;
    const spouseRight = n.spouseX !== undefined 
      ? n.spouseX + (n.node.spouses.length * (NODE_WIDTH + SPOUSE_GAP)) - SPOUSE_GAP
      : nodeRight;
    
    maxX = Math.max(maxX, nodeRight, spouseRight);
    
    // Vertical
    minY = Math.min(minY, n.y);
    maxY = Math.max(maxY, n.y + NODE_HEIGHT);
  });

  // Default fallback
  if (minX === Infinity) { minX = 0; maxX = 400; minY = 0; maxY = 300; }

  // Add extra padding specifically for the right side to prevent cutoff bugs
  const PADDING = 120; // Increased to accommodate arrows (63px from edge)
  const RIGHT_PADDING = 150;
  const contentWidth = maxX - minX + PADDING + RIGHT_PADDING;
  const contentHeight = maxY - minY + PADDING * 2;

  // Auto-fit on first render or when data changes
  useEffect(() => {
    if (containerRef.current && contentWidth > 0) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      const scaleX = containerWidth / contentWidth;
      const scaleY = containerHeight / contentHeight;
      
      // Limit scaling so it's readable on mobile (min 0.4) and not huge on desktop (max 1.0)
      const idealScale = Math.min(scaleX, scaleY) * 0.95;
      const scale = Math.max(Math.min(idealScale, 1), 0.4);
      
      setTransform({
        // Calculate initial offset to center content
        x: (containerWidth / 2) - ( (minX + maxX + NODE_WIDTH) / 2 ) * scale,
        y: 60,
        scale,
      });
    }
  }, [contentWidth, contentHeight, members.length]);

  // Ref to track pinch state (avoid stale closure issues)
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);

  // Pan handlers (pointer events – works for mouse + single touch)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only start drag with single pointer (not during pinch)
      if (e.pointerType === "touch" && pinchRef.current) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    },
    [transform.x, transform.y]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      if (e.pointerType === "touch" && pinchRef.current) return;
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    },
    [isDragging, dragStart]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Pinch-to-zoom (touch events)
  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setIsDragging(false); // cancel any drag
      const dist = getTouchDistance(e.touches);
      pinchRef.current = { dist, scale: transform.scale };
    }
  }, [transform.scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const newDist = getTouchDistance(e.touches);
      const ratio = newDist / pinchRef.current.dist;
      const newScale = Math.min(Math.max(pinchRef.current.scale * ratio, 0.15), 3);
      
      // Pinch center
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      setTransform((prev) => {
        const scaleDiff = newScale / prev.scale;
        return {
          x: cx - (cx - prev.x) * scaleDiff,
          y: cy - (cy - prev.y) * scaleDiff,
          scale: newScale,
        };
      });
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      pinchRef.current = null;
    }
  }, []);

  // Scroll wheel zoom (desktop)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * delta, 0.15), 3),
    }));
  }, []);

  const zoomIn = () =>
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, 3),
    }));

  const zoomOut = () =>
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(prev.scale * 0.8, 0.2),
    }));

  function getNodeMidpoint(layout: LayoutNode): number {
    return layout.spouseX !== undefined
      ? (layout.x + NODE_WIDTH + layout.spouseX) / 2
      : layout.x + NODE_WIDTH / 2;
  }

  // Draw connection lines
  function drawLines(layout: LayoutNode): React.ReactNode[] {
    const lines: React.ReactNode[] = [];

    // Spouse connector
    if (
      layout.spouseX !== undefined &&
      layout.node.spouses.length > 0
    ) {
      const y = layout.y + NODE_HEIGHT / 2;
      lines.push(
        <line
          key={`spouse-${layout.node.member.id}`}
          x1={layout.x + NODE_WIDTH}
          y1={y}
          x2={layout.spouseX}
          y2={y}
          stroke="#ec4899"
          strokeWidth={2}
          strokeDasharray="6 3"
        />
      );
    }

    // Parent to children connectors
    if (layout.children.length > 0) {
      const parentCenterX = getNodeMidpoint(layout);
      const parentBottomY = layout.y + NODE_HEIGHT;
      const midY =
        (parentBottomY + layout.children[0].y) / 2;

      // Vertical line from parent center down
      lines.push(
        <line
          key={`parent-down-${layout.node.member.id}`}
          x1={parentCenterX}
          y1={parentBottomY}
          x2={parentCenterX}
          y2={midY}
          stroke="#94a3b8"
          strokeWidth={1.5}
        />
      );

      // Horizontal line connecting children
      if (layout.children.length > 1) {
        const leftX = getNodeMidpoint(layout.children[0]);
        const rightX = getNodeMidpoint(layout.children[layout.children.length - 1]);
        lines.push(
          <line
            key={`children-h-${layout.node.member.id}`}
            x1={leftX}
            y1={midY}
            x2={rightX}
            y2={midY}
            stroke="#94a3b8"
            strokeWidth={1.5}
          />
        );
      }

      // Vertical lines from horizontal bar to each child
      layout.children.forEach((child) => {
        const childCenterX = getNodeMidpoint(child);
        lines.push(
          <line
            key={`child-down-${child.node.member.id}`}
            x1={childCenterX}
            y1={midY}
            x2={childCenterX}
            y2={child.y}
            stroke="#94a3b8"
            strokeWidth={1.5}
          />
        );

        // Recurse
        lines.push(...drawLines(child));
      });
    }

    return lines;
  }

  if (members.length === 0) {
    return (
      <div className="empty-state" style={{ minHeight: "50vh" }}>
        <div className="empty-state-icon">🌳</div>
        <p className="empty-state-text" style={{ fontSize: "16px", fontWeight: "500" }}>
          Belum ada anggota keluarga
        </p>
        <p className="empty-state-text" style={{ fontSize: "14px" }}>
          Tekan tombol + untuk menambah anggota pertama
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "calc(100dvh - 180px)",
        overflow: "hidden",
        touchAction: "none",
        position: "relative",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
      >
        <g
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
            transition: isDragging ? "none" : "transform 0.1s ease",
          }}
        >
        {/* Connection lines */}
        {layouts.map((layout) => drawLines(layout))}

        {/* Nodes */}
        {allNodes.map((layoutNode) => (
          <g key={layoutNode.node.member.id}>
            <RenderNode
              member={layoutNode.node.member}
              x={layoutNode.x}
              y={layoutNode.y}
              onClick={() => {
                if (isEditMode) {
                  setSelectedEditNode(selectedEditNode === layoutNode.node.member.id ? null : layoutNode.node.member.id);
                } else if (onNodeClick) {
                  onNodeClick(layoutNode.node.member.id);
                }
              }}
            />
            {/* Edit Arrows for Main Node */}
            {isEditMode && selectedEditNode === layoutNode.node.member.id && (
              <EditArrows
                x={layoutNode.x}
                y={layoutNode.y}
                onAdd={(type) => onQuickAdd?.(layoutNode.node.member.id, type)}
              />
            )}

            {/* Spouse nodes */}
            {layoutNode.spouseX !== undefined &&
              layoutNode.node.spouses.map((spouse, i) => {
                const sx = layoutNode.spouseX! + i * (NODE_WIDTH + SPOUSE_GAP);
                const sy = layoutNode.y;
                return (
                  <g key={spouse.id}>
                    <RenderNode
                      member={spouse}
                      x={sx}
                      y={sy}
                      onClick={() => {
                        if (isEditMode) {
                          setSelectedEditNode(selectedEditNode === spouse.id ? null : spouse.id);
                        } else if (onNodeClick) {
                          onNodeClick(spouse.id);
                        }
                      }}
                    />
                    {/* Edit Arrows for Spouse */}
                    {isEditMode && selectedEditNode === spouse.id && (
                      <EditArrows
                        x={sx}
                        y={sy}
                        onAdd={(type) => onQuickAdd?.(spouse.id, type)}
                      />
                    )}
                  </g>
                );
              })}
          </g>
        ))}
        </g>
      </svg>

      {/* Zoom controls */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 10,
        }}
      >
        <button
          onClick={zoomIn}
          className="btn btn-secondary"
          style={{
            width: "40px",
            height: "40px",
            padding: 0,
            minHeight: "40px",
            fontSize: "20px",
            borderRadius: "50%",
          }}
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="btn btn-secondary"
          style={{
            width: "40px",
            height: "40px",
            padding: 0,
            minHeight: "40px",
            fontSize: "20px",
            borderRadius: "50%",
          }}
        >
          −
        </button>
      </div>
    </div>
  );
}
