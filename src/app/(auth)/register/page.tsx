"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthMode = "email" | "phone";

export default function RegisterPage() {
  const [mode, setMode] = useState<AuthMode>("email");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Sandi tidak cocok");
      return;
    }

    if (mode === "email" && password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (mode === "phone" && (password.length !== 4 || !/^\d+$/.test(password))) {
      setError("Sandi PIN harus tepat 4 angka");
      return;
    }

    setLoading(true);

    try {
      const payload = mode === "email"
        ? { email: email.toLowerCase(), password, fullName }
        : { phoneNumber, password, fullName };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan");
        return;
      }

      // Redirect to login after successful registration
      router.push("/login?registered=true");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ fontSize: "40px", marginBottom: "8px" }}>👨👩👧👦</div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "4px",
          }}
        >
          Daftar Akun
        </h1>
        <p className="text-muted" style={{ fontSize: "14px" }}>
          Buat akun untuk mulai mengelola silsilah keluarga
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="animate-slide-up"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            color: "var(--danger)",
            padding: "12px 16px",
            borderRadius: "var(--radius-sm)",
            fontSize: "14px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", background: "var(--background)", padding: "4px", borderRadius: "12px" }}>
        <button
          onClick={() => setMode("email")}
          style={{
            flex: 1,
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            background: mode === "email" ? "var(--card)" : "transparent",
            color: mode === "email" ? "var(--foreground)" : "var(--muted)",
            fontWeight: mode === "email" ? "600" : "400",
            boxShadow: mode === "email" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            cursor: "pointer",
            transition: "all 0.2s",
            fontSize: "14px",
          }}
        >
          Dengan Email
        </button>
        <button
          onClick={() => setMode("phone")}
          style={{
            flex: 1,
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            background: mode === "phone" ? "var(--card)" : "transparent",
            color: mode === "phone" ? "var(--foreground)" : "var(--muted)",
            fontWeight: mode === "phone" ? "600" : "400",
            boxShadow: mode === "phone" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            cursor: "pointer",
            transition: "all 0.2s",
            fontSize: "14px",
          }}
        >
          Nomor HP
        </button>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="input-group">
          <label className="input-label" htmlFor="fullName">
            Nama Lengkap
          </label>
          <input
            id="fullName"
            type="text"
            className="input-field"
            placeholder="Masukkan nama lengkap"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        {mode === "email" ? (
          <div className="input-group">
            <label className="input-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        ) : (
          <div className="input-group">
            <label className="input-label" htmlFor="phoneNumber">
              Nomor Handphone
            </label>
            <input
              id="phoneNumber"
              type="tel"
              className="input-field"
              placeholder="Contoh: 081234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              required
              autoComplete="tel"
            />
          </div>
        )}

        <div className="input-group">
          <label className="input-label" htmlFor="password">
            {mode === "email" ? "Password" : "PIN (4 Angka)"}
          </label>
          <input
            id="password"
            type={mode === "email" ? "password" : "password"}
            inputMode={mode === "email" ? "text" : "numeric"}
            className="input-field"
            placeholder={mode === "email" ? "Minimal 6 karakter" : "Masukkan 4 angka acak"}
            value={password}
            onChange={(e) => {
              if (mode === "phone") {
                setPassword(e.target.value.replace(/\D/g, '').slice(0, 4));
              } else {
                setPassword(e.target.value);
              }
            }}
            required
            autoComplete="new-password"
            minLength={mode === "email" ? 6 : 4}
            maxLength={mode === "phone" ? 4 : undefined}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="confirmPassword">
            {mode === "email" ? "Konfirmasi Password" : "Konfirmasi PIN"}
          </label>
          <input
            id="confirmPassword"
            type="password"
            inputMode={mode === "email" ? "text" : "numeric"}
            className="input-field"
            placeholder={mode === "email" ? "Ulangi password" : "Ulangi 4 angka"}
            value={confirmPassword}
            onChange={(e) => {
              if (mode === "phone") {
                setConfirmPassword(e.target.value.replace(/\D/g, '').slice(0, 4));
              } else {
                setConfirmPassword(e.target.value);
              }
            }}
            required
            autoComplete="new-password"
            minLength={mode === "email" ? 6 : 4}
            maxLength={mode === "phone" ? 4 : undefined}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading}
          style={{ marginTop: "8px" }}
        >
          {loading ? (
            <>
              <span className="spinner spinner-sm" style={{ borderTopColor: "white" }} />
              Mendaftar...
            </>
          ) : (
            "Daftar"
          )}
        </button>
      </form>

      {/* Login Link */}
      <p
        style={{
          textAlign: "center",
          marginTop: "24px",
          fontSize: "14px",
          color: "var(--muted)",
        }}
      >
        Sudah punya akun?{" "}
        <Link
          href="/login"
          style={{
            color: "var(--primary)",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
