import { Metadata } from "next";
import Link from "next/link";

import AdminHeader from "@/components/admin/AdminHeader";

export const metadata: Metadata = {
  title: "Administração - Ceará por Temporada",
  description: "Área administrativa para gerenciamento de imóveis",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900">
      <AdminHeader />

      {/* Conteúdo principal */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer administrativo */}
      <footer className="bg-gray-900 py-16 text-white border-t border-gray-700">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                  <div className="md:col-span-2">
                    <div className="mb-4 text-2xl font-bold">
                      🏖️ Ceará por Temporada
                    </div>
                    <p className="mb-4 max-w-md text-gray-300">
                      A plataforma líder em aluguel de imóveis por temporada no Ceará.
                      Conectamos viajantes aos melhores destinos do estado.
                    </p>
                    <div className="flex gap-4">
                      <a
                        href="#"
                        className="text-gray-400 transition-colors hover:text-white"
                      >
                        Facebook
                      </a>
                      <a
                        href="#"
                        className="text-gray-400 transition-colors hover:text-white"
                      >
                        Instagram
                      </a>
                      <a
                        href="#"
                        className="text-gray-400 transition-colors hover:text-white"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
      
                  <div>
                    <h4 className="mb-4 font-semibold">Destinos</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>
                        <a href="#" className="transition-colors hover:text-white">
                          Fortaleza
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition-colors hover:text-white">
                          Jericoacoara
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition-colors hover:text-white">
                          Canoa Quebrada
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition-colors hover:text-white">
                          Cumbuco
                        </a>
                      </li>
                    </ul>
                  </div>
      
                  <div>
                    <h4 className="mb-4 font-semibold">Suporte</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>
                        <a href="#" className="transition-colors hover:text-white">
                          Central de Ajuda
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition-colors hover:text-white">
                          Privacidade
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition-colors hover:text-white">
                          Termos de Uso
                        </a>
                      </li>
                      <li>
                        <Link
                          href="/admin/login"
                          className="transition-colors hover:text-white"
                        >
                          Administrativo
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
      
                <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
                  <p>
                    &copy; 2025 Ceará por Temporada. Todos os direitos reservados.
                  </p>
                </div>
              </div>
            </footer>
    </div>
  );
}
