import { Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { TikTokIcon, WhatsAppIcon } from "@/components/SocialIcons";

export default function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 py-16 text-white border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between lg:grid-cols-4">
          <div className="md:col-span-2 lg:col-span-1">
            <div className="-mt-8 mb-6 text-2xl font-bold">
              <Image
                src="/logo-alternativa.svg"
                alt="Ceará por Temporada"
                width={150}
                height={40}
                className="h-auto w-40 cursor-pointer"
              />
            </div>
            <p className="mb-4 max-w-md text-gray-300">
              A plataforma líder em aluguel de imóveis por temporada no Ceará.
              <br></br>
              Conectamos viajantes aos melhores destinos do estado.
            </p>
            <div className="flex flex-col gap-4">
              <p className="text-md text-gray-200">
                Nos siga nas redes sociais:
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.tiktok.com/@cearaportemporada?ug_source=op.auth&ug_term=Linktr.ee&utm_source=awyc6vc625ejxp86&utm_campaign=tt4d_profile_link&_r=1"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <TikTokIcon className="h-6 w-6" />
                </a>
                <a
                  href="https://www.instagram.com/cearaportemporada/"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=5585992718222&text&type=phone_number&app_absent=0"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <WhatsAppIcon className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Destinos</h4>
            <ul className="space-y-3 text-gray-300">
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
            <ul className="space-y-3 text-gray-300">
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
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Proprietário</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Adicione seu Imóvel
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Como funciona?
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Tira dúvidas
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
          <p>&copy; 2025 Ceará por Temporada. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
