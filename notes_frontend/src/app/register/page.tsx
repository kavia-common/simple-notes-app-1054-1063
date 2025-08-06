"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const { user, register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
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
    const ok = await register(name, email.trim(), password);
    if (!ok) {
      setAuthError("Registration failed. Try a different email.");
      setLoading(false);
    } else {
      router.replace("/notes");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">Register</div>
        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          <input
            required
            minLength={3}
            placeholder="Full Name"
            value={name}
            disabled={loading}
            onChange={e => setName(e.target.value)}
          />
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {authError && (
          <div style={{ color: "#ef4444", marginTop: "1.2rem", fontSize: "1.1rem" }}>
            {authError}
          </div>
        )}
        <div style={{ marginTop: "1.7rem", color: "#64748b", textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--color-primary)", fontWeight: "500" }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
