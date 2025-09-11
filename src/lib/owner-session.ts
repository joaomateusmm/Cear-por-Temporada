"use client";

interface OwnerSession {
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
}

const OWNER_SESSION_KEY = "owner_session";

export function saveOwnerSession(ownerData: OwnerSession): void {
  try {
    localStorage.setItem(OWNER_SESSION_KEY, JSON.stringify(ownerData));
  } catch (error) {
    console.error("Erro ao salvar sessão do proprietário:", error);
  }
}

export function getOwnerSession(): OwnerSession | null {
  try {
    const sessionData = localStorage.getItem(OWNER_SESSION_KEY);
    if (!sessionData) return null;

    return JSON.parse(sessionData) as OwnerSession;
  } catch (error) {
    console.error("Erro ao recuperar sessão do proprietário:", error);
    return null;
  }
}

export function clearOwnerSession(): void {
  try {
    localStorage.removeItem(OWNER_SESSION_KEY);
  } catch (error) {
    console.error("Erro ao limpar sessão do proprietário:", error);
  }
}

export function isOwnerLoggedIn(): boolean {
  return getOwnerSession() !== null;
}
