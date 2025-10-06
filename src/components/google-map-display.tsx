"use client";

import { MapPin } from "lucide-react";
import { useEffect, useRef } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GoogleMapDisplayProps {
  latitude?: number;
  longitude?: number;
  googleMapsEmbedUrl?: string;
  address?: string;
  className?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initDisplayMap: () => void;
  }
}

export function GoogleMapDisplay({
  latitude,
  longitude,
  googleMapsEmbedUrl,
  address,
  className = "",
}: GoogleMapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    // Função para inicializar o mapa
    const initializeMap = () => {
      if (!mapRef.current || !window.google || !window.google.maps) return;

      const position = { lat: latitude, lng: longitude };

      // Criar o mapa
      const map = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: true,
        streetViewControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_TOP,
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
        },
      });

      mapInstanceRef.current = map;

      // Criar o marker
      new window.google.maps.Marker({
        position: position,
        map: map,
        title: address || "Localização do imóvel",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#ef4444"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });
    };

    // Função para carregar a API do Google Maps
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        // Script já existe, aguarda carregar
        const checkGoogleLoaded = () => {
          if (window.google && window.google.maps) {
            initializeMap();
          } else {
            setTimeout(checkGoogleLoaded, 100);
          }
        };
        checkGoogleLoaded();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initDisplayMap`;
      script.async = true;
      script.defer = true;

      window.initDisplayMap = () => {
        initializeMap();
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, [latitude, longitude, address]);

  // Se não tiver coordenadas, tenta usar embed URL
  if ((!latitude || !longitude) && googleMapsEmbedUrl) {
    return (
      <Card className={`border-slate-700/50 bg-slate-800/80 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <MapPin className="h-5 w-5 text-red-400" />
            Localização
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <iframe
            src={googleMapsEmbedUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-b-lg"
          />
        </CardContent>
      </Card>
    );
  }

  // Se não tiver nem coordenadas nem embed URL
  if (!latitude || !longitude) {
    return (
      <Card className={`border-slate-700/50 bg-slate-800/80 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <MapPin className="h-5 w-5 text-red-400" />
            Localização
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex h-64 items-center justify-center text-slate-400">
            <div className="text-center">
              <MapPin className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p className="text-sm">
                {address || "Localização não disponível"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Renderizar mapa interativo
  return (
    <div
      ref={mapRef}
      className={`h-full w-full ${className}`}
      style={{ minHeight: "300px", height: "100%" }}
    />
  );
}
