"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, TriangleAlert } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { fieldStyles } from "@/components/reservation/FormField";
import { Button } from "@/components/ui/Button";
import { AuthServiceError, adminSignIn } from "@/lib/auth";

/**
 * Formulaire de connexion, seule porte d'entrée du dashboard. Aucune
 * inscription publique : les comptes admin sont créés à la main dans la
 * console Firebase (Authentication → Users → Add user).
 */
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await adminSignIn(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof AuthServiceError ? err.message : "La connexion a échoué.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl bg-linen p-8 shadow-soft sm:p-10">
        <div className="flex flex-col items-center text-center">
          <LogoMark className="h-10 w-10 text-moss" />
          <h1 className="mt-4 font-display text-2xl italic text-ink">Espace administrateur</h1>
          <p className="mt-2 text-sm text-ink/60">Moulin Vert Béja — accès réservé à l&apos;équipe</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-ink">
              E-mail
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" aria-hidden="true" />
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`${fieldStyles(Boolean(error))} pl-11`}
                placeholder="admin@moulinvertbeja.tn"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-ink">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" aria-hidden="true" />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={`${fieldStyles(Boolean(error))} pl-11`}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="flex items-start gap-2 text-sm text-rust">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Connexion…
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
