'use client';

import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin, X, Loader2, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const DEFAULT_CENTER = {
  lat: -11.9300, // Comas, Lima
  lng: -77.0450
};

interface AddressMapPickerProps {
  onAddressSelect: (address: string) => void;
}

export function AddressMapPicker({ onAddressSelect }: AddressMapPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(DEFAULT_CENTER);
  const [addressLoading, setAddressLoading] = useState(false);
  const [geocodeError, setGeoCodeError] = useState<string | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      setGeoCodeError(null);
    }
  }, []);

  const handleConfirm = async () => {
    setAddressLoading(true);
    setGeoCodeError(null);
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: markerPosition });
      if (response.results[0]) {
        onAddressSelect(response.results[0].formatted_address);
        setIsOpen(false);
      } else {
        // Geocoder returned no results — use coordinates as fallback
        const fallback = `Ubicación: ${markerPosition.lat.toFixed(6)}, ${markerPosition.lng.toFixed(6)}`;
        onAddressSelect(fallback);
        setIsOpen(false);
      }
    } catch {
      // Geocoding failed (likely billing not enabled) — use coordinates as fallback
      const fallback = `Comas, Lima (${markerPosition.lat.toFixed(5)}, ${markerPosition.lng.toFixed(5)})`;
      setGeoCodeError(
        'No se pudo obtener la dirección exacta (API de Geocoding no disponible). ' +
        'Se usarán las coordenadas del pin.'
      );
      onAddressSelect(fallback);
      setTimeout(() => setIsOpen(false), 1500);
    } finally {
      setAddressLoading(false);
    }
  };

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="shrink-0 flex items-center justify-center gap-2 bg-[#e53e3e]/10 hover:bg-[#e53e3e]/20 text-[#e53e3e] border border-[#e53e3e]/30 px-3 py-3 rounded-xl transition-colors btn-press text-xs font-bold"
      >
        <MapPin className="w-4 h-4" />
        <span className="hidden sm:inline">Mapa</span>
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121217] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#e53e3e]" />
                Selecciona tu ubicación
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Map Area */}
            <div className="relative bg-[#09090c]">
              {!isLoaded ? (
                <div className="h-[400px] flex items-center justify-center flex-col gap-3 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin text-[#e53e3e]" />
                  <p className="text-sm">Cargando mapa...</p>
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={markerPosition}
                  zoom={15}
                  onClick={onMapClick}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: [
                      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                      { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
                      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
                      { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
                    ]
                  }}
                >
                  <Marker position={markerPosition} />
                </GoogleMap>
              )}
            </div>

            {/* Geocode Error Banner */}
            {geocodeError && (
              <div className="px-4 py-3 bg-amber-500/10 border-t border-amber-500/20 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300 leading-relaxed">{geocodeError}</p>
              </div>
            )}

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-[#09090c]/50">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={addressLoading || !isLoaded}
                className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-bold bg-[#e53e3e] hover:bg-[#dc2626] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addressLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirmar Ubicación
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
