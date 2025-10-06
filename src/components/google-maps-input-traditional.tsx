"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface GoogleMapsInputProps {
  onChange?: (value: string) => void;
  onLocationSelect?: (location: {
    address: string;
    lat: number;
    lng: number;
    placeId: string;
    mapsUrl: string;
    embedUrl: string;
  }) => void;
  placeholder?: string;
}

// Declarar tipos para o Google Maps tradicional
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google: any;
    initAutocomplete?: () => void;
  }
}

export function GoogleMapsInputTraditional({
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

  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Carregar Google Maps JavaScript API
  useEffect(() => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("GOOGLE_MAPS_API_KEY não está configurada");
      toast.error("Chave do Google Maps não configurada");
      return;
    }

    console.log("Carregando Google Maps JavaScript API...");

    const loadGoogleMaps = () => {
      return new Promise<void>((resolve, reject) => {
        // Verificar se já foi carregado
        if (window.google && window.google.maps) {
          console.log("Google Maps já carregado");
          resolve();
          return;
        }

        // Usar o novo carregador bootstrap da Google (seguindo a documentação oficial)
        const script = document.createElement("script");
        script.innerHTML = `
          (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=\`https://maps.\${c}apis.com/maps/api/js?\`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
            key: "${apiKey}",
            v: "weekly"
          });
        `;

        script.onerror = () => {
          console.error("Erro ao carregar Google Maps API");
          reject(new Error("Falha ao carregar Google Maps API"));
        };

        document.head.appendChild(script);

        // Aguardar um momento para o script carregar
        setTimeout(() => {
          console.log("Google Maps carregado com sucesso");
          resolve();
        }, 1000);
      });
    };

    const initializeComponents = async () => {
      if (!mapRef.current || !inputRef.current) {
        console.error("Elementos DOM não disponíveis");
        return;
      }

      try {
        console.log(
          "Inicializando componentes seguindo documentação oficial...",
        );

        // Posição inicial (Fortaleza, CE)
        const position = { lat: -3.7319, lng: -38.5267 };

        // Importar bibliotecas necessárias (seguindo documentação oficial)
        const { Map } = await window.google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } =
          await window.google.maps.importLibrary("marker");
        const { Autocomplete } =
          await window.google.maps.importLibrary("places");

        console.log("Bibliotecas importadas com sucesso");

        // Criar o mapa seguindo a documentação oficial
        mapInstanceRef.current = new Map(mapRef.current as HTMLElement, {
          zoom: 10,
          center: position,
          mapId: "DEMO_MAP_ID", // Necessário para AdvancedMarkerElement

          // APENAS 2 controles: Street View (topo direito) e Fullscreen (inferior direito)
          disableDefaultUI: true, // Desabilita TODOS os controles padrão

          streetViewControl: true,
          streetViewControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_TOP,
          },

          fullscreenControl: true,
          fullscreenControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
          },
        });

        console.log("Mapa inicializado:", mapInstanceRef.current);

        // Aguardar o mapa estar totalmente carregado
        await new Promise<void>((resolve) => {
          const listener = mapInstanceRef.current.addListener("idle", () => {
            console.log("Mapa totalmente carregado (idle event)");
            window.google.maps.event.removeListener(listener);
            resolve();
          });
        });

        console.log("Mapa pronto para uso!");

        // Inicializar autocomplete
        autocompleteRef.current = new Autocomplete(inputRef.current, {
          componentRestrictions: { country: "br" },
          fields: ["place_id", "geometry", "name", "formatted_address"],
        });

        console.log("Autocomplete inicializado:", autocompleteRef.current);

        // Função para criar marcador usando AdvancedMarkerElement
        const createAdvancedMarker = async (
          lat: number,
          lng: number,
          title = "",
        ) => {
          try {
            console.log("=== INÍCIO CRIAÇÃO MARCADOR ===");
            console.log("Tentando criar AdvancedMarkerElement em:", {
              lat,
              lng,
              title,
            });
            console.log("Map instance exists:", !!mapInstanceRef.current);
            console.log("AdvancedMarkerElement class:", AdvancedMarkerElement);

            const position = { lat, lng };

            // Remover marcador anterior se existir
            if (markerRef.current) {
              console.log("Removendo marcador anterior...");
              try {
                markerRef.current.map = null;
              } catch (e) {
                console.warn("Erro ao remover marcador anterior:", e);
              }
            }

            // Verificar se o mapa está pronto
            if (!mapInstanceRef.current) {
              throw new Error("Mapa não está inicializado");
            }

            console.log("Criando novo AdvancedMarkerElement...");

            // Criar novo marcador avançado
            markerRef.current = new AdvancedMarkerElement({
              map: mapInstanceRef.current,
              position: position,
              title: title || "Localização selecionada",
            });

            console.log(
              "AdvancedMarkerElement criado com sucesso:",
              markerRef.current,
            );

            // Centralizar mapa na posição com delay para garantir que está pronto
            setTimeout(() => {
              try {
                console.log("Centralizando mapa na posição:", position);
                mapInstanceRef.current.setCenter(position);

                const currentZoom = mapInstanceRef.current.getZoom();
                console.log("Zoom atual:", currentZoom);

                if (currentZoom < 15) {
                  console.log("Aumentando zoom para 15");
                  mapInstanceRef.current.setZoom(15);
                }

                console.log("Mapa centralizado com sucesso");
              } catch (mapError) {
                console.error("Erro ao centralizar mapa:", mapError);
              }
            }, 100);

            console.log("=== MARCADOR CRIADO COM SUCESSO ===");
            return markerRef.current;
          } catch (error) {
            console.error("=== ERRO AO CRIAR MARCADOR ===");
            console.error("Erro detalhado:", error);
            throw error; // Re-throw para o fallback funcionar
          }
        };

        // Event listener para autocomplete
        autocompleteRef.current.addListener("place_changed", async () => {
          const place = autocompleteRef.current.getPlace();

          console.log("Place changed event triggered:", place);

          if (!place.geometry || !place.geometry.location) {
            console.error("Local sem coordenadas:", place);
            toast.error("Local selecionado não possui coordenadas");
            return;
          }

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || place.name || "";
          const placeId = place.place_id || "";

          console.log("Dados extraídos do place:", {
            lat,
            lng,
            address,
            placeId,
          });

          try {
            // Atualizar estado primeiro
            const locationData = { address, lat, lng, placeId };
            setSelectedLocation(locationData);

            console.log("Estado atualizado, criando marcador...");

            // Criar marcador com fallback para Marker tradicional
            try {
              await createAdvancedMarker(lat, lng, address);
              console.log("AdvancedMarkerElement criado com sucesso");
            } catch (error) {
              console.warn(
                "AdvancedMarkerElement falhou, usando Marker tradicional:",
                error,
              );

              try {
                // Fallback para Marker tradicional
                console.log("=== INICIANDO FALLBACK TRADICIONAL ===");

                const { Marker } =
                  await window.google.maps.importLibrary("maps");
                console.log("Biblioteca maps importada para fallback:", Marker);

                // Remover marcador anterior
                if (markerRef.current) {
                  console.log("Removendo marcador anterior no fallback...");
                  try {
                    if (typeof markerRef.current.setMap === "function") {
                      markerRef.current.setMap(null);
                    } else {
                      markerRef.current.map = null;
                    }
                  } catch (removeError) {
                    console.warn("Erro ao remover marcador:", removeError);
                  }
                }

                console.log("Criando Marker tradicional com posição:", {
                  lat,
                  lng,
                });
                console.log("Mapa disponível:", !!mapInstanceRef.current);

                markerRef.current = new Marker({
                  position: { lat, lng },
                  map: mapInstanceRef.current,
                  title: address,
                  animation: window.google.maps.Animation.DROP,
                });

                console.log(
                  "Marker tradicional criado com sucesso:",
                  markerRef.current,
                );
                console.log("=== FALLBACK COMPLETADO COM SUCESSO ===");
              } catch (fallbackError) {
                console.error("=== FALHA NO FALLBACK ===");
                console.error(
                  "Erro no fallback do Marker tradicional:",
                  fallbackError,
                );
                toast.error("Erro ao criar marcador no mapa");
              }
            }

            // Chamar callbacks
            if (onChange) {
              onChange(address);
            }

            if (onLocationSelect) {
              onLocationSelect({
                address,
                lat,
                lng,
                placeId,
                mapsUrl: `https://maps.google.com/?q=${lat},${lng}`,
                embedUrl: `https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=place_id:${placeId}`,
              });
            }

            toast.success("📍 Localização selecionada com sucesso!");
          } catch (error) {
            console.error("Erro ao processar seleção de local:", error);
            toast.error("Erro ao processar localização selecionada");
          }
        });

        console.log(
          "Componentes inicializados com sucesso seguindo documentação oficial",
        );
      } catch (error) {
        console.error("Erro ao inicializar componentes:", error);
        toast.error("Erro ao inicializar Google Maps");
      }
    };

    loadGoogleMaps()
      .then(() => {
        setIsLoaded(true);
        initializeComponents();
      })
      .catch((error) => {
        console.error("Erro ao carregar Google Maps:", error);
        toast.error("Erro ao carregar Google Maps. Verifique sua conexão.");
      });

    return () => {
      // Cleanup se necessário
      if (window.initAutocomplete) {
        window.initAutocomplete = undefined;
      }
    };
  }, [onChange, onLocationSelect]);

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="mb-4 h-10 rounded-md bg-slate-600"></div>
          <div className="h-64 rounded-md bg-slate-600"></div>
        </div>
        <p className="text-sm text-slate-400">Carregando Google Maps...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
        />
      </div>

      <div
        ref={mapRef}
        className="relative h-64 w-full overflow-hidden rounded-md border border-slate-600 bg-slate-700"
        style={{ minHeight: "300px" }}
      ></div>

      {selectedLocation && (
        <div className="rounded-md border border-slate-600/60 bg-slate-700/60 p-3">
          <p className="text-sm font-medium text-gray-200">
            Local selecionado:
          </p>
          <p className="text-sm text-gray-300">{selectedLocation.address}</p>
          <p className="text-xs text-gray-400/80">
            Coordenadas: {selectedLocation.lat.toFixed(6)},{" "}
            {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}
