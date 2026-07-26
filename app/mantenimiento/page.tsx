"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function MantenimientoPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const res = await fetch("/api/maintenance/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <main className="maintenance">
      <div className="maintenance-panel">
        <Logo href="/" className="logo--nav" priority />
        <div className="maintenance-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <h1 className="maintenance-title">Em breve</h1>
        <p className="maintenance-sub">
          O site está em manutenção. Introduz a palavra-passe para continuar.
        </p>

        <form className="maintenance-form" onSubmit={onSubmit}>
          <label className="maintenance-label" htmlFor="maintenance-password">
            Palavra-passe
          </label>
          <input
            id="maintenance-password"
            className="maintenance-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error ? (
            <p className="maintenance-error" role="alert">
              Palavra-passe incorrecta.
            </p>
          ) : null}
          <button
            type="submit"
            className="hero-pill hero-pill--solid maintenance-submit"
            disabled={loading || !password}
          >
            {loading ? "…" : "Entrar"}
            <span className="hero-dot" aria-hidden="true" />
          </button>
        </form>
      </div>
    </main>
  );
}
