interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    adminId: string;
  }>;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Conteúdo principal */}
      <main className="mx-auto max-w-7xl">{children}</main>
    </div>
  );
}
