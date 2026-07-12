import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import type { AdminUser } from "@/types";

/**
 * Erreur levée par les fonctions d'authentification admin. Le message est
 * déjà en français et prêt à être affiché tel quel dans le formulaire de
 * connexion — pas besoin de traduire les codes d'erreur Firebase plus haut
 * dans la pile.
 */
export class AuthServiceError extends Error {}

/** Traduit les codes d'erreur Firebase Auth les plus courants en français. */
function translateAuthError(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Adresse e-mail invalide.";
    case "auth/user-disabled":
      return "Ce compte administrateur a été désactivé.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "E-mail ou mot de passe incorrect.";
    case "auth/too-many-requests":
      return "Trop de tentatives. Merci de réessayer dans quelques minutes.";
    case "auth/network-request-failed":
      return "Connexion impossible. Vérifiez votre connexion internet.";
    default:
      return "La connexion a échoué. Merci de réessayer.";
  }
}

function toAdminUser(user: User): AdminUser {
  return { uid: user.uid, email: user.email };
}

/**
 * Connecte un administrateur par e-mail/mot de passe. Les comptes sont créés
 * manuellement dans la console Firebase (Authentication → Users) : il n'y a
 * volontairement aucune page d'inscription publique.
 */
export async function adminSignIn(email: string, password: string): Promise<AdminUser> {
  if (!isFirebaseConfigured) {
    throw new AuthServiceError(
      "L'authentification n'est pas encore configurée (voir .env.local.example)."
    );
  }

  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return toAdminUser(credential.user);
  } catch (error) {
    const code = error instanceof Error && "code" in error ? String((error as { code: unknown }).code) : "";
    throw new AuthServiceError(translateAuthError(code));
  }
}

/** Déconnecte l'administrateur actuellement connecté. */
export async function adminSignOut(): Promise<void> {
  if (!isFirebaseConfigured) return;
  await signOut(auth);
}

/**
 * S'abonne aux changements d'état de connexion. Retourne la fonction de
 * désinscription à appeler dans le `cleanup` de `useEffect`.
 */
export function subscribeToAuthState(callback: (user: AdminUser | null) => void): () => void {
  if (!isFirebaseConfigured) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    callback(user ? toAdminUser(user) : null);
  });
}
