import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, DollarSign, Car, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppLayout from "@/components/layout/AppLayout";

const vehicleTypes = [
  { id: "mini", name: "Mini", price: "₹89", eta: "3 min", icon: "🚗" },
  { id: "sedan", name: "Sedan", price: "₹149", eta: "5 min", icon: "🚙" },
  { id: "suv", name: "SUV", price: "₹249", eta: "7 min", icon: "🚐" },
  { id: "auto", name: "Auto", price: "₹59", eta: "2 min", icon: "🛺" },
];

const RiderDashboard = () => {
  const { t } = useTranslation();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("mini");
  const [step, setStep] = useState<"search" | "select" | "confirmed">("search");

  const handleEstimate = () => {
    if (pickup && dropoff) setStep("select");
  };

  const handleConfirm = () => setStep("confirmed");

  return (
    <AppLayout role="rider">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Map area */}
        <div className="flex-1 relative bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin size={48} className="mx-auto mb-3 text-primary animate-pulse-dot" />
              <p className="text-sm font-medium">Map View</p>
              <p className="text-xs">Connect Mapbox to enable live map</p>
            </div>
          </div>

          {/* Floating indicators */}
          {step === "confirmed" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 right-4 bg-card rounded-xl p-4 shadow-elevated border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-lg">
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
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary" />
                    <Input
                      placeholder={t("pickup")}
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="h-12 pl-9"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent" />
                    <Input
                      placeholder={t("dropoff")}
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                      className="h-12 pl-9"
                    />
                  </div>
                  {/* Quick suggestions */}
                  <div className="space-y-1">
                    {["Home - MG Road", "Office - Whitefield", "Airport - KIA"].map((place) => (
                      <button
                        key={place}
                        onClick={() => { if (!pickup) setPickup(place); else setDropoff(place); }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <Clock size={16} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{place}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleEstimate} disabled={!pickup || !dropoff} className="w-full gradient-primary text-primary-foreground h-12 font-semibold">
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
                    <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    <span className="text-foreground truncate">{dropoff}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {vehicleTypes.map((v) => (
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
                      <p className="text-sm font-bold text-foreground">{v.price}</p>
                    </button>
                  ))}
                </div>

                <Button onClick={handleConfirm} className="w-full gradient-primary text-primary-foreground h-12 font-semibold">
                  {t("confirm_ride")} • {vehicleTypes.find((v) => v.id === selectedVehicle)?.price}
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
                    <span className="font-semibold text-foreground">₹89</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("eta")}</span>
                    <span className="font-semibold text-foreground">3 min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vehicle</span>
                    <span className="font-semibold text-foreground">KA 01 AB 1234</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">{t("share_location")}</Button>
                  <Button variant="outline" className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/5">
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
