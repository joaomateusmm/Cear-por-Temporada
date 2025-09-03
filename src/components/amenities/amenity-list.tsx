import type { Amenity } from "../../types/database";
import { AmenityIcon } from "../icons/amenity-icons";

interface AmenityListProps {
  amenities: Amenity[];
  showCategory?: boolean;
  className?: string;
}

export function AmenityList({
  amenities,
  showCategory = false,
  className = "",
}: AmenityListProps) {
  // Agrupar por categoria se necessário
  const groupedAmenities = showCategory
    ? amenities.reduce(
        (acc, amenity) => {
          if (!acc[amenity.category]) {
            acc[amenity.category] = [];
          }
          acc[amenity.category].push(amenity);
          return acc;
        },
        {} as Record<string, Amenity[]>,
      )
    : { all: amenities };

  const categoryLabels = {
    common_area: "Área Comum",
    apartment: "Apartamento",
    building: "Prédio/Segurança",
  };

  return (
    <div className={className}>
      {Object.entries(groupedAmenities).map(([category, items]) => (
        <div key={category} className="mb-6">
          {showCategory && category !== "all" && (
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              {categoryLabels[category as keyof typeof categoryLabels] ||
                category}
            </h3>
          )}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {items.map((amenity) => (
              <div
                key={amenity.id}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2"
              >
                <AmenityIcon
                  iconName={amenity.icon || "activity"}
                  size={18}
                  className="flex-shrink-0 text-blue-600"
                />
                <span className="truncate text-sm text-gray-700">
                  {amenity.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente para uma única comodidade (útil para cards pequenos)
interface AmenityItemProps {
  amenity: Amenity;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function AmenityItem({
  amenity,
  size = "md",
  showIcon = true,
}: AmenityItemProps) {
  const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-2",
    lg: "text-base gap-3",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]}`}>
      {showIcon && (
        <AmenityIcon
          iconName={amenity.icon || "activity"}
          size={iconSizes[size]}
          className="flex-shrink-0 text-blue-600"
        />
      )}
      <span className="text-gray-700">{amenity.name}</span>
    </div>
  );
}
