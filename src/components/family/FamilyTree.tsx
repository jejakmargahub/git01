"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import type { FamilyMember, Relationship } from "@/lib/db/schema";

interface TreeNode {
  member: FamilyMember;
  children: TreeNode[];
  spouses: FamilyMember[];
}

interface FamilyTreeProps {
  members: FamilyMember[];
  relationships: Relationship[];
  onNodeClick: (memberId: string) => void;
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

// Node dimensions – designed for 48dp+ touch targets
const NODE_WIDTH = 180;
const NODE_HEIGHT = 100;
const NODE_MARGIN_X = 28;
const NODE_MARGIN_Y = 64;
const SPOUSE_GAP = 14;

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
  // Calculate total width needed for the node + ALL its spouses
  const nodeWidth = hasSpouse
    ? NODE_WIDTH + (tree.spouses.length * (NODE_WIDTH + SPOUSE_GAP))
    : NODE_WIDTH;

  if (tree.children.length === 0) {
    return {
      node: tree,
      x: startX,
      y: startY,
      width: nodeWidth,
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

  // Calculate total children width
  const totalChildrenWidth =
    laidOutChildren.reduce((sum, c) => sum + c.width, 0) +
    (laidOutChildren.length - 1) * NODE_MARGIN_X;

  // Center parent over children
  const firstChild = laidOutChildren[0];
  const lastChild = laidOutChildren[laidOutChildren.length - 1];
  
  // Center point of the children
  const childrenCenter = (firstChild.x + lastChild.x + lastChild.width) / 2;
  let parentX = childrenCenter - nodeWidth / 2;

  // Ensure parent + spouses don't hang off the right side uncomfortably
  // If the parent structure is wider than the children's span, the right edge 
  // might get clipped in some scenarios depending on sibling positioning.
  const childrenRight = lastChild.x + lastChild.width;
  if (parentX + nodeWidth > Math.max(childrenRight, startX + totalChildrenWidth)) {
    // If the spouse block ends further right than the rightmost child + padding,
    // we shift the parent slightly to the left to keep it compact visually, or
    // handle it so it doesn't break out of the calculated SVGBounds cleanly.
    parentX = startX;
  }
  
  // Ensure we don't go left of startX
  parentX = Math.max(startX, parentX);

  const totalWidth = Math.max(totalChildrenWidth, nodeWidth);

  // Shift children if parent is forced further right due to Math.max(startX, ...)
  if (parentX > startX) {
     const shift = parentX - (childrenCenter - nodeWidth / 2);
     if (shift > 0) {
        laidOutChildren.forEach(c => updateXPositions(c, shift));
     }
  }

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
  const displayName = member.nickname || member.fullName;
  
  let maxNameLength = 14;
  if (member.photoUrl) maxNameLength -= 3;
  if (member.mandarinName) maxNameLength -= member.mandarinName.length + 1;
  if (isDeceased) maxNameLength -= 3;
  if (maxNameLength < 5) maxNameLength = 5;

  const truncatedName =
    displayName.length > maxNameLength ? displayName.substring(0, maxNameLength) + "…" : displayName;
  const showFullName = member.nickname && member.nickname !== member.fullName;
  const truncatedFullName = member.fullName.length > 20
    ? member.fullName.substring(0, 20) + "…"
    : member.fullName;

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
      {/* Gender icon */}
      <text
        x={x + 14}
        y={y + 22}
        fontSize={18}
        fill={genderColor}
        fontWeight="bold"
      >
        {genderIcon}
      </text>
      {/* Age badge (right side) */}
      {ageText && (
        <text
          x={x + NODE_WIDTH - 12}
          y={y + 18}
          fontSize={10}
          fill={isDeceased ? "#9ca3af" : "#059669"}
          fontWeight="600"
          textAnchor="end"
        >
          {ageText}
        </text>
      )}
      {/* Name (nickname or fullName) */}
      <text
        x={member.photoUrl ? x + 44 : x + 36}
        y={y + 22}
        fontSize={15}
        fontWeight="600"
        fill="#111827"
      >
        {isDeceased ? `${deceasedPrefix} ` : ""}
        {truncatedName}
        {member.mandarinName ? ` ${member.mandarinName}` : ""}
        {isDeceased ? " 🌼" : ""}
      </text>
      {/* Full name (if nickname exists) */}
      {showFullName && (
        <text x={x + 14} y={y + 38} fontSize={11} fill="#9ca3af">
          {truncatedFullName}
        </text>
      )}
      {/* Title */}
      {member.title && (
        <text x={x + 14} y={y + (showFullName ? 54 : 48)} fontSize={12} fill="#6b7280">
          {member.title}
        </text>
      )}
      {/* Phone */}
      {member.phone && (
        <text x={x + 14} y={y + (showFullName ? 72 : 68)} fontSize={11} fill="#6b7280">
          📱 {member.phone}
        </text>
      )}
    </g>
  );
}

export default function FamilyTree({
  members,
  relationships,
  onNodeClick,
}: FamilyTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const trees = buildTree(members, relationships);

  // Layout all trees side by side
  let currentX = 40;
  const layouts: LayoutNode[] = [];
  trees.forEach((tree) => {
    const layout = layoutTree(tree, currentX, 40);
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
  const PADDING = 60;
  const RIGHT_PADDING = 100;
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
        // Center horizontally
        x: (containerWidth - contentWidth * scale) / 2 - (minX - PADDING) * scale,
        // Align top (with 40px margin) so the root is always visible
        y: 40 - (minY - PADDING) * scale,
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
      const parentCenterX =
        layout.spouseX !== undefined
          ? (layout.x + NODE_WIDTH + layout.spouseX) / 2
          : layout.x + NODE_WIDTH / 2;
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
        const leftX = layout.children[0].x + NODE_WIDTH / 2;
        const rightX =
          layout.children[layout.children.length - 1].x + NODE_WIDTH / 2;
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
        const childCenterX = child.x + NODE_WIDTH / 2;
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
        width={Math.max(contentWidth, 1200)}
        height={Math.max(contentHeight, 800)}
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
              onClick={() => onNodeClick(layoutNode.node.member.id)}
            />
            {/* Spouse nodes */}
            {layoutNode.spouseX !== undefined &&
              layoutNode.node.spouses.map((spouse, i) => (
                <RenderNode
                  key={spouse.id}
                  member={spouse}
                  x={layoutNode.spouseX! + i * (NODE_WIDTH + SPOUSE_GAP)}
                  y={layoutNode.y}
                  onClick={() => onNodeClick(spouse.id)}
                />
              ))}
          </g>
        ))}
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
