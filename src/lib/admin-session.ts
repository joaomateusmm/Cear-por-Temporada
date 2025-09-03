// Utilitários para gerenciamento de sessão administrativa

export interface AdminSession {
  userId: number;
  timestamp: number;
  userEmail: string;
  userName: string;
}

/**
 * Verifica se existe uma sessão administrativa válida
 */
export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;

  try {
    const savedSession = localStorage.getItem("adminSession");
    if (!savedSession) return null;

    const sessionData: AdminSession = JSON.parse(savedSession);
    const now = Date.now();
    const sessionAge = now - sessionData.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas

    if (sessionAge < maxAge) {
      return sessionData;
    } else {
      // Sessão expirou
      clearAdminSession();
      return null;
    }
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    clearAdminSession();
    return null;
  }
}

/**
 * Salva uma nova sessão administrativa
 */
export function saveAdminSession(user: {
  id: number;
  email: string;
  name: string;
}): void {
  if (typeof window === "undefined") return;

  const sessionData: AdminSession = {
    userId: user.id,
    timestamp: Date.now(),
    userEmail: user.email,
    userName: user.name,
  };

  localStorage.setItem("adminSession", JSON.stringify(sessionData));
}

/**
 * Remove a sessão administrativa
 */
export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("adminSession");
}

/**
 * Faz logout do usuário administrativo
 */
export function logoutAdmin(): void {
  clearAdminSession();
  window.location.href = "/admin/login";
}
