import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirecionar para a página de login
  redirect("/admin/login");
}
