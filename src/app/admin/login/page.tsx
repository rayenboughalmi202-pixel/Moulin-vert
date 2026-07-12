"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Déjà connecté (retour arrière, onglet resté ouvert...) : direction le
  // dashboard plutôt que de réafficher le formulaire de connexion.
  useEffect(() => {
    if (!loading && user) {
      router.replace("/admin");
    }
  }, [loading, user, router]);

  return <LoginForm />;
}
