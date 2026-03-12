export default function SkeletonCard() {
  return (
    <div className="skeleton-card animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div className="skeleton skeleton-circle" style={{ width: "48px", height: "48px", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-text" style={{ width: "70%" }} />
          <div className="skeleton skeleton-text-sm" />
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "12px", display: "flex", justifyContent: "space-between" }}>
        <div className="skeleton" style={{ width: "80px", height: "16px" }} />
        <div className="skeleton" style={{ width: "60px", height: "24px", borderRadius: "20px" }} />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonMemberRow() {
  return (
    <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "var(--card)", border: "1px solid var(--card-border)", borderRadius: "var(--radius)" }}>
      <div className="skeleton skeleton-circle" style={{ width: "32px", height: "32px", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton skeleton-text" style={{ width: "55%" }} />
        <div className="skeleton skeleton-text-sm" style={{ width: "35%" }} />
      </div>
    </div>
  );
}
