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

  // Salva no localStorage para uso no cliente
  localStorage.setItem("adminSession", JSON.stringify(sessionData));

  // Salva também em cookie para uso no middleware
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000); // 24 horas

  document.cookie = `adminSession=${JSON.stringify(sessionData)}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Remove a sessão administrativa
 */
export function clearAdminSession(): void {
  if (typeof window === "undefined") return;

  // Remove do localStorage
  localStorage.removeItem("adminSession");

  // Remove o cookie
  document.cookie =
    "adminSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/**
 * Faz logout do usuário administrativo
 */
export function logoutAdmin(): void {
  clearAdminSession();
  window.location.href = "/admin/login";
}

/**
 * Verifica se existe uma sessão administrativa válida no servidor (usando cookies)
 */
export function getAdminSessionFromCookie(
  cookieString?: string,
): AdminSession | null {
  if (!cookieString) return null;

  try {
    // Extrai o cookie adminSession
    const cookies = cookieString.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    const adminSessionCookie = cookies["adminSession"];
    if (!adminSessionCookie) return null;

    const sessionData: AdminSession = JSON.parse(
      decodeURIComponent(adminSessionCookie),
    );
    const now = Date.now();
    const sessionAge = now - sessionData.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas

    if (sessionAge < maxAge) {
      return sessionData;
    } else {
      // Sessão expirou
      return null;
    }
  } catch (error) {
    console.error("Erro ao verificar sessão do cookie:", error);
    return null;
  }
}
