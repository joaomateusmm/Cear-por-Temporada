import {
  Activity,
  AirVent,
  Building,
  Car,
  ChefHat,
  Coffee,
  Dumbbell,
  type LucideIcon,
  Microwave,
  Phone,
  Shield,
  Tv,
  Users,
  Utensils,
  Waves,
  Wifi,
  Wind,
  Zap,
} from "lucide-react";

// Mapeamento dos ícones das comodidades para ícones do Lucide
export const amenityIcons: Record<string, LucideIcon> = {
  // Área comum
  gym: Dumbbell,
  pool: Waves,
  barbecue: ChefHat,
  "party-room": Users,
  playground: Activity,
  "sports-court": Activity,

  // Apartamento
  "air-conditioning": AirVent,
  "individual-ac": Wind,
  "smart-tv": Tv,
  wifi: Wifi,
  "washing-machine": Zap, // Lucide não tem washing machine, usando genérico
  "hair-dryer": Wind,
  iron: Zap, // Lucide não tem iron, usando genérico
  fridge: Zap, // Usando genérico para geladeira
  microwave: Microwave,
  cooktop: ChefHat,
  "coffee-maker": Coffee,
  "kitchen-utensils": Utensils,
  balcony: Building,
  bathtub: Waves, // Usando waves como alternativa
  "glass-shower": Waves,

  // Prédio/Segurança
  "24h-security": Shield,
  elevator: Building, // Usando Building como alternativa
  parking: Car,
  "covered-parking": Car,
  intercom: Phone,
  cctv: Shield,
};

// Função para obter o ícone de uma comodidade
export function getAmenityIcon(iconName: string): LucideIcon {
  return amenityIcons[iconName] || Activity; // Activity como fallback
}

// Função para renderizar o ícone de uma comodidade
export function AmenityIcon({
  iconName,
  size = 20,
  className = "",
}: {
  iconName: string;
  size?: number;
  className?: string;
}) {
  const IconComponent = getAmenityIcon(iconName);
  return <IconComponent size={size} className={className} />;
}
