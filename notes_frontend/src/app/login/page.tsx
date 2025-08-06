"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    router.replace("/notes");
    return <></>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);
    const ok = await login(email.trim(), password);
    if (!ok) {
      setAuthError("Invalid email or password");
      setLoading(false);
    } else {
      router.replace("/notes");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">Sign in</div>
        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          <input
            required
            type="email"
            placeholder="Email address"
            value={email}
            disabled={loading}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            disabled={loading}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="btn btn-accent" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {authError && (
          <div style={{ color: "#ef4444", marginTop: "1.2rem", fontSize: "1.1rem" }}>
            {authError}
          </div>
        )}
        <div style={{ marginTop: "1.7rem", color: "#64748b", textAlign: "center" }}>
          No account?{" "}
          <Link href="/register" style={{ color: "var(--color-primary)", fontWeight: "500" }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
