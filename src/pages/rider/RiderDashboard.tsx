import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Clock, ChevronRight, Phone, MessageSquare, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import LeafletMap from "@/components/map/LeafletMap";
import AddressAutocomplete from "@/components/map/AddressAutocomplete";

interface LatLng {
  lat: number;
  lng: number;
}

const vehicleTypes = [
  { id: "auto", name: "Auto", price: 59, eta: "2 min", icon: "🛺", perKm: 9 },
  { id: "mini", name: "Mini", price: 89, eta: "3 min", icon: "🚗", perKm: 12 },
  { id: "sedan", name: "Sedan", price: 149, eta: "5 min", icon: "🚙", perKm: 16 },
  { id: "suv", name: "SUV", price: 249, eta: "7 min", icon: "🚐", perKm: 22 },
];

const calculateDistance = (a: LatLng, b: LatLng): number => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

const RiderDashboard = () => {
  const { t } = useTranslation();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<LatLng | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState("mini");
  const [step, setStep] = useState<"search" | "select" | "confirmed">("search");

  // Mock nearby drivers
  const mockDrivers = useMemo(() => {
    const base = pickupCoords || { lat: 12.9716, lng: 77.5946 };
    return Array.from({ length: 5 }, (_, i) => ({
      lat: base.lat + (Math.random() - 0.5) * 0.02,
      lng: base.lng + (Math.random() - 0.5) * 0.02,
    }));
  }, [pickupCoords]);

  const distance = pickupCoords && dropoffCoords ? calculateDistance(pickupCoords, dropoffCoords) : 0;

  const getFare = (v: (typeof vehicleTypes)[0]) => {
    if (!distance) return v.price;
    return Math.round(v.price + v.perKm * distance);
  };

  const handleEstimate = () => {
    if (pickup && dropoff && pickupCoords && dropoffCoords) setStep("select");
  };

  const handleConfirm = () => setStep("confirmed");

  const quickPlaces = [
    { name: "MG Road, Bangalore", coords: { lat: 12.9758, lng: 77.6045 } },
    { name: "Whitefield, Bangalore", coords: { lat: 12.9698, lng: 77.7500 } },
    { name: "Kempegowda International Airport", coords: { lat: 13.1989, lng: 77.7068 } },
  ];

  return (
    <AppLayout role="rider">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Map area */}
        <div className="flex-1 relative min-h-[300px]">
          <LeafletMap
            pickup={pickupCoords}
            dropoff={dropoffCoords}
            driverLocations={step !== "search" ? mockDrivers : []}
            showUserLocation
          />

          {/* Floating driver card on confirmed */}
          {step === "confirmed" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 right-4 bg-card rounded-xl p-4 shadow-elevated border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl">
                  🚗
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{t("arriving")}</p>
                  <p className="text-xs text-muted-foreground">Raj Kumar • ★ 4.8 • KA 01 AB 1234</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">3 min</p>
                  <p className="text-xs text-muted-foreground">{t("eta")}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1 gap-1.5">
                  <Phone size={14} /> Call
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1.5">
                  <MessageSquare size={14} /> Chat
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Shield size={14} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Distance badge */}
          {distance > 0 && step === "select" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-4 left-4 bg-card rounded-lg px-3 py-2 shadow-elevated border border-border"
            >
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="text-sm font-bold text-foreground">{distance.toFixed(1)} km</p>
            </motion.div>
          )}
        </div>

        {/* Booking panel */}
        <div className="lg:w-96 border-l border-border bg-card overflow-y-auto">
          <div className="p-5">
            {step === "search" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">{t("book_ride")}</h2>
                <div className="space-y-3">
                  <AddressAutocomplete
                    placeholder={t("pickup")}
                    value={pickup}
                    onChange={(val, coords) => {
                      setPickup(val);
                      if (coords) setPickupCoords(coords);
                    }}
                    icon="pickup"
                  />
                  <AddressAutocomplete
                    placeholder={t("dropoff")}
                    value={dropoff}
                    onChange={(val, coords) => {
                      setDropoff(val);
                      if (coords) setDropoffCoords(coords);
                    }}
                    icon="dropoff"
                  />

                  {/* Quick suggestions */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium px-1">Popular places</p>
                    {quickPlaces.map((place) => (
                      <button
                        key={place.name}
                        onClick={() => {
                          if (!pickup) {
                            setPickup(place.name);
                            setPickupCoords(place.coords);
                          } else {
                            setDropoff(place.name);
                            setDropoffCoords(place.coords);
                          }
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <Clock size={16} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{place.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleEstimate}
                  disabled={!pickup || !dropoff || !pickupCoords || !dropoffCoords}
                  className="w-full gradient-primary text-primary-foreground h-12 font-semibold"
                >
                  {t("estimate_fare")}
                  <ChevronRight size={18} className="ml-2" />
                </Button>
              </motion.div>
            )}

            {step === "select" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <button onClick={() => setStep("search")} className="text-sm text-primary font-medium hover:underline">
                  ← Back
                </button>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="text-foreground truncate">{pickup}</span>
                  </div>
                  <div className="ml-1 my-1 border-l-2 border-dashed border-border h-4" />
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                    <span className="text-foreground truncate">{dropoff}</span>
                  </div>
                  {distance > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Estimated distance: {distance.toFixed(1)} km
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  {vehicleTypes.map((v) => {
                    const fare = getFare(v);
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVehicle(v.id)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                          selectedVehicle === v.id
                            ? "border-primary bg-primary/5 shadow-card"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <span className="text-2xl">{v.icon}</span>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold text-foreground">{v.name}</p>
                          <p className="text-xs text-muted-foreground">{v.eta} away</p>
                        </div>
                        <p className="text-sm font-bold text-foreground">₹{fare}</p>
                      </button>
                    );
                  })}
                </div>

                <Button onClick={handleConfirm} className="w-full gradient-primary text-primary-foreground h-12 font-semibold">
                  {t("confirm_ride")} • ₹{getFare(vehicleTypes.find((v) => v.id === selectedVehicle)!)}
                </Button>
              </motion.div>
            )}

            {step === "confirmed" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                <div className="text-center py-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-3xl"
                  >
                    🚗
                  </motion.div>
                  <h3 className="text-lg font-bold text-foreground">{t("arriving")}</h3>
                  <p className="text-muted-foreground text-sm">Raj Kumar is on the way</p>
                </div>

                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("fare")}</span>
                    <span className="font-semibold text-foreground">
                      ₹{getFare(vehicleTypes.find((v) => v.id === selectedVehicle)!)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Distance</span>
                    <span className="font-semibold text-foreground">{distance.toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("eta")}</span>
                    <span className="font-semibold text-foreground">3 min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vehicle</span>
                    <span className="font-semibold text-foreground">KA 01 AB 1234</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">OTP</span>
                    <span className="font-bold text-primary text-lg">4829</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">{t("share_location")}</Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/5"
                  >
                    {t("cancel_ride")}
                  </Button>
                </div>

                <Button onClick={() => setStep("search")} variant="ghost" className="w-full text-muted-foreground">
                  Back to booking
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default RiderDashboard;
