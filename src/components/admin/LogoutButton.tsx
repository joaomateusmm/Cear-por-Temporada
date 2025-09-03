"use client";

import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/lib/admin-session";

export default function LogoutButton() {
  const handleLogout = () => {
    logoutAdmin();
  };

  return (
    <Button
      onClick={handleLogout}
      className="rounded-3xl bg-red-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
    >
      Sair
    </Button>
  );
}
