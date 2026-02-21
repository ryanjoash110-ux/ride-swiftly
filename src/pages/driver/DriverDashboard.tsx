import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, Star, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";

const mockRides = [
  { id: 1, from: "MG Road", to: "Whitefield", fare: "₹189", time: "12:30 PM", status: "completed" },
  { id: 2, from: "Koramangala", to: "Electronic City", fare: "₹249", time: "10:15 AM", status: "completed" },
  { id: 3, from: "Indiranagar", to: "Airport", fare: "₹599", time: "6:00 AM", status: "completed" },
];

const DriverDashboard = () => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(false);

  return (
    <AppLayout role="driver">
      <div className="p-4 md:p-6 space-y-6">
        {/* Status toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("dashboard")}</h1>
            <p className="text-muted-foreground text-sm">
              {isOnline ? "You're accepting rides" : "You're offline"}
            </p>
          </div>
          <motion.button
            onClick={() => setIsOnline(!isOnline)}
            className={`relative w-20 h-10 rounded-full transition-colors ${
              isOnline ? "bg-primary" : "bg-muted"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute top-1 w-8 h-8 rounded-full bg-card shadow-card"
              animate={{ left: isOnline ? "2.5rem" : "0.25rem" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Today's Earnings", value: "₹1,240", icon: DollarSign, color: "text-primary" },
            { label: "Rides Completed", value: "8", icon: Navigation, color: "text-accent" },
            { label: "Online Hours", value: "5.2h", icon: Clock, color: "text-primary" },
            { label: "Rating", value: "4.8", icon: Star, color: "text-accent" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-4 border border-border shadow-card"
            >
              <stat.icon size={20} className={`${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Map area */}
        <div className="bg-muted rounded-xl h-64 flex items-center justify-center border border-border">
          <div className="text-center text-muted-foreground">
            <MapPin size={36} className={`mx-auto mb-2 ${isOnline ? "text-primary animate-pulse-dot" : ""}`} />
            <p className="text-sm font-medium">{isOnline ? "Sharing your location" : "Go online to share location"}</p>
          </div>
        </div>

        {/* Recent rides */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Recent Rides</h2>
          <div className="space-y-2">
            {mockRides.map((ride, i) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-4 border border-border flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Navigation size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{ride.from} → {ride.to}</p>
                  <p className="text-xs text-muted-foreground">{ride.time}</p>
                </div>
                <p className="text-sm font-bold text-foreground">{ride.fare}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DriverDashboard;
