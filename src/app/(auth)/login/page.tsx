"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="card" style={{ padding: "32px 24px" }}>
      {/* Logo / Brand */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div
          style={{
            fontSize: "40px",
            marginBottom: "8px",
          }}
        >
          🌳
        </div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "4px",
          }}
        >
          Silsilah Keluarga
        </h1>
        <p className="text-muted" style={{ fontSize: "14px" }}>
          Masuk untuk mengelola pohon keluarga Anda
        </p>
      </div>

      {/* Success Message */}
      {registered && (
        <div
          className="animate-slide-up"
          style={{
            background: "rgba(34, 197, 94, 0.1)",
            color: "var(--success, #22c55e)",
            padding: "12px 16px",
            borderRadius: "var(--radius-sm)",
            fontSize: "14px",
            marginBottom: "20px",
            textAlign: "center",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}
        >
          ✨ Registrasi berhasil! Silakan masuk dengan akun baru Anda.
        </div>
      )}

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

      {/* Login Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="input-group">
          <label className="input-label" htmlFor="identifier">
            Email atau Nomor HP
          </label>
          <input
            id="identifier"
            type="text"
            className="input-field"
            placeholder="Email Anda / No. Handphone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="password">
            Password / PIN
          </label>
          <input
            id="password"
            type="password"
            className="input-field"
            placeholder="Masukkan password atau PIN"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            minLength={4}
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
              Masuk...
            </>
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          margin: "24px 0",
        }}
      >
        <div
          style={{ flex: 1, height: "1px", background: "var(--card-border)" }}
        />
        <span className="text-muted" style={{ fontSize: "13px" }}>
          atau
        </span>
        <div
          style={{ flex: 1, height: "1px", background: "var(--card-border)" }}
        />
      </div>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        className="btn btn-secondary btn-full"
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Masuk dengan Google
      </button>

      {/* REGISTER BUTTON */}
      <div style={{ marginTop: "16px", marginBottom: "8px" }}>
        <Link 
          href="/register" 
          className="btn btn-full"
          style={{ 
            background: "transparent",
            border: "2px solid var(--primary)",
            color: "var(--primary)",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none"
          }}
        >
          ✨ Daftar Akun Baru (Email / No. HP)
        </Link>
      </div>
    </div>
  );
}
