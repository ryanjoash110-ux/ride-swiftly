import React, { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Search, Loader2, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LatLng {
  lat: number;
  lng: number;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

interface AddressAutocompleteProps {
  placeholder?: string;
  value: string;
  onChange: (value: string, coords?: LatLng) => void;
  icon?: "pickup" | "dropoff";
  className?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  placeholder = "Search address or pincode...",
  value,
  onChange,
  icon = "pickup",
  className = "",
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5&addressdetails=1`
      );
      const data: Suggestion[] = await res.json();
      setSuggestions(data);
      setIsOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (val: string) => {
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 400);
  };

  const handleSelect = (s: Suggestion) => {
    const shortName = s.display_name.split(",").slice(0, 3).join(", ");
    onChange(shortName, { lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const name = data.display_name?.split(",").slice(0, 3).join(", ") || "Current Location";
          onChange(name, { lat: latitude, lng: longitude });
        } catch {
          onChange("Current Location", { lat: latitude, lng: longitude });
        } finally {
          setLoading(false);
          setIsOpen(false);
        }
      },
      () => setLoading(false),
      { enableHighAccuracy: true }
    );
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
          icon === "pickup" ? "bg-primary" : "bg-destructive"
        }`}
      />
      {loading && (
        <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        className="h-12 pl-9 pr-9"
      />

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-elevated overflow-hidden max-h-64 overflow-y-auto">
          <button
            onClick={handleUseMyLocation}
            className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left border-b border-border"
          >
            <Navigation size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Use my current location</span>
          </button>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSelect(s)}
              className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
            >
              <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground line-clamp-2">
                {s.display_name.split(",").slice(0, 4).join(", ")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
