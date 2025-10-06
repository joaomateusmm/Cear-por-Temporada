"use client";

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";

interface GoogleMapsInputProps {
  value?: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: {
    address: string;
    lat: number;
    lng: number;
    placeId: string;
    mapsUrl: string;
    embedUrl: string;
  }) => void;
  placeholder?: string;
  className?: string;
}

// Declare Web Components types - solução mais limpa
/* eslint-disable @typescript-eslint/no-namespace */
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "gmpx-api-loader": {
        key?: string;
        "solution-channel"?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
      };
      "gmp-map": {
        ref?: React.RefObject<HTMLElement | null>;
        center?: string;
        zoom?: string;
        "map-id"?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
      };
      "gmp-advanced-marker": {
        ref?: React.RefObject<HTMLElement | null>;
        children?: React.ReactNode;
      };
      "gmpx-place-picker": {
        ref?: React.RefObject<HTMLElement | null>;
        placeholder?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
      };
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

export function GoogleMapsInput({
  onChange,
  onLocationSelect,
  placeholder = "Digite o endereço ou nome do local...",
}: GoogleMapsInputProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
    placeId: string;
  } | null>(null);

  const mapRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLElement>(null);
  const placePickerRef = useRef<HTMLElement>(null);

  // Carregar a biblioteca de Web Components
  useEffect(() => {
    // Verificar se a chave API está configurada
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY não está configurada");
      toast.error(
        "Chave do Google Maps não configurada. Verifique o arquivo .env",
      );
      return;
    }

    console.log("Iniciando carregamento do Google Maps...");
    console.log(
      "API Key exists:",
      !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    );
    console.log(
      "API Key preview:",
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.substring(0, 10) + "...",
    );

    const loadGoogleMapsComponents = async () => {
      try {
        // Verificar se já foi carregado
        if (
          document.querySelector(
            'script[src*="@googlemaps/extended-component-library"]',
          )
        ) {
          await customElements.whenDefined("gmp-map");
          setIsLoaded(true);
          return;
        }

        // Carregar o script dos Web Components
        const script = document.createElement("script");
        script.type = "module";
        script.src =
          "https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js";

        script.onload = async () => {
          console.log("Google Maps Web Components carregados");
          try {
            await customElements.whenDefined("gmp-map");
            console.log("gmp-map definido com sucesso");
            setIsLoaded(true);
          } catch (error) {
            console.error("Erro ao definir gmp-map:", error);
            toast.error("Erro ao inicializar componentes do Google Maps");
          }
        };

        script.onerror = (error) => {
          console.error("Erro ao carregar script Google Maps:", error);
          toast.error(
            "Erro ao carregar Google Maps. Verifique sua conexão e chave API.",
          );
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error("Erro ao carregar Google Maps:", error);
        toast.error("Erro ao carregar Google Maps");
      }
    };

    loadGoogleMapsComponents();

    // Timeout de emergência - se não carregar em 10 segundos, tenta forçar
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        console.log("Tentando forçar carregamento após timeout");
        const checkElements = () => {
          if (window.customElements && window.customElements.get("gmp-map")) {
            console.log("Elementos encontrados após timeout");
            setIsLoaded(true);
          } else {
            console.log("Elementos ainda não disponíveis");
            setTimeout(checkElements, 1000);
          }
        };
        checkElements();
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isLoaded]);

  // Inicializar os event listeners após o carregamento
  useEffect(() => {
    if (
      !isLoaded ||
      !mapRef.current ||
      !markerRef.current ||
      !placePickerRef.current
    ) {
      return;
    }

    const initializeMapEvents = async () => {
      try {
        await customElements.whenDefined("gmp-map");
        await customElements.whenDefined("gmpx-place-picker");

        /* eslint-disable @typescript-eslint/no-explicit-any */
        const map = mapRef.current as any;
        const marker = markerRef.current as any;
        const placePicker = placePickerRef.current as any;
        /* eslint-enable @typescript-eslint/no-explicit-any */

        // Configurar o mapa
        if (map.innerMap) {
          map.innerMap.setOptions({
            mapTypeControl: false,
            streetViewControl: true,
            fullscreenControl: true,
          });
        }

        // Event listener para mudança de local
        placePicker.addEventListener("gmpx-placechange", () => {
          const place = placePicker.value;

          if (!place || !place.location) {
            toast.error("Local não encontrado ou sem coordenadas");
            marker.position = null;
            return;
          }

          // Atualizar o mapa
          if (place.viewport && map.innerMap) {
            map.innerMap.fitBounds(place.viewport);
          } else {
            map.center = place.location;
            map.zoom = 17;
          }

          // Atualizar o marcador
          marker.position = place.location;

          // Preparar os dados de localização
          const locationData = {
            address: place.formattedAddress || place.displayName || "",
            lat: place.location.lat,
            lng: place.location.lng,
            placeId: place.id || "",
          };

          // Atualizar estados
          setSelectedLocation(locationData);
          onChange(locationData.address);

          // Callback para o componente pai
          if (onLocationSelect) {
            onLocationSelect({
              ...locationData,
              mapsUrl: `https://www.google.com/maps/place/?q=place_id:${locationData.placeId}`,
              embedUrl: `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:${locationData.placeId}`,
            });
          }

          toast.success("Localização selecionada com sucesso!");
        });
      } catch (error) {
        console.error("Erro ao inicializar eventos do mapa:", error);
        toast.error("Erro ao configurar o mapa");
      }
    };

    initializeMapEvents();
  }, [isLoaded, onChange, onLocationSelect]);

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border-slate-600 bg-slate-700 p-3 text-slate-100 placeholder:text-slate-400">
          Carregando Google Maps...
        </div>
        <Card className="border-slate-700/50 bg-slate-800/80">
          <CardContent className="p-6">
            <div className="flex h-64 items-center justify-center text-slate-400">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 h-8 w-8" />
                <p>Carregando mapa...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* API Loader - necessário apenas uma vez */}
      {!document.querySelector("gmpx-api-loader") && (
        <gmpx-api-loader
          key={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          solution-channel="GMP_GE_mapsandplacesautocomplete_v2"
        />
      )}

      {/* Mapa com Place Picker integrado */}
      <Card className="border-slate-700/50 bg-slate-800/80">
        <CardContent className="p-0">
          <gmp-map
            ref={mapRef}
            center="-3.7319,-38.5267"
            zoom="13"
            map-id="DEMO_MAP_ID"
            style={{ height: "400px", width: "100%" }}
          >
            {/* Place Picker no canto superior esquerdo */}
            <div
              slot="control-block-start-inline-start"
              style={{
                padding: "20px",
                background: "rgba(15, 23, 42, 0.9)",
                borderRadius: "8px",
                margin: "10px",
              }}
            >
              <gmpx-place-picker
                ref={placePickerRef}
                placeholder={placeholder}
                style={{
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #475569",
                  backgroundColor: "#334155",
                  color: "#f1f5f9",
                  minWidth: "300px",
                }}
              />
            </div>

            {/* Marcador avançado */}
            <gmp-advanced-marker ref={markerRef} />
          </gmp-map>

          {/* Informações da localização selecionada */}
          {selectedLocation && (
            <div className="bg-slate-700/50 p-4">
              <div className="flex items-start space-x-2">
                <MapPin className="mt-1 h-4 w-4 text-green-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">
                    Localização selecionada:
                  </p>
                  <p className="text-xs text-slate-300">
                    {selectedLocation.address}
                  </p>
                  <p className="text-xs text-slate-400">
                    Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
                    {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-slate-400">
        💡 Dica: Use a barra de pesquisa no mapa para encontrar endereços ou
        estabelecimentos
      </p>
    </div>
  );
}
