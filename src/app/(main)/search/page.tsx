"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    {
      id: string;
      fullName: string;
      nickname: string | null;
      gender: string;
      title: string | null;
      deathDate: string | null;
      familyId: string;
      familyName: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query.trim())}`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>
          Cari Anggota
        </h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            className="input-field"
            placeholder="Cari nama atau panggilan..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary"
            onClick={handleSearch}
            disabled={loading}
            style={{ minWidth: "48px", padding: "0 16px" }}
          >
            {loading ? "⏳" : "🔍"}
          </button>
        </div>
      </div>

      <div className="page-content">
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <div className="spinner" />
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-text">
              Tidak ditemukan anggota dengan kata kunci &quot;{query}&quot;
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p className="text-muted" style={{ fontSize: "13px", marginBottom: "8px" }}>
              {results.length} hasil ditemukan
            </p>
            {results.map((member) => {
              const genderIcon = member.gender === "M" ? "♂" : "♀";
              const genderColor =
                member.gender === "M" ? "var(--male)" : "var(--female)";
              const displayName = member.nickname || member.fullName;
              const deceased = !!member.deathDate;
              const deceasedPrefix =
                member.gender === "M" ? "Alm." : "Almh.";

              return (
                <div
                  key={member.id}
                  className="card card-interactive"
                  onClick={() => router.push(`/family/${member.familyId}`)}
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "2px",
                      }}
                    >
                      {member.title && (
                        <span
                          className="text-muted"
                          style={{ fontSize: "12px" }}
                        >
                          {member.title}
                        </span>
                      )}
                      <span
                        className="badge badge-viewer"
                        style={{ fontSize: "11px" }}
                      >
                        {member.familyName}
                      </span>
                    </div>
                  </div>
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

        {!searched && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-text" style={{ fontSize: "16px" }}>
              Cari anggota keluarga
            </p>
            <p className="empty-state-text" style={{ fontSize: "14px" }}>
              Pencarian mencakup semua bagan yang dapat Anda akses
            </p>
          </div>
        )}
      </div>
    </>
  );
}
