import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Navigation, Clock, Star, MapPin } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const rides = [
  { id: 1, from: "MG Road", to: "Whitefield", fare: "₹189", date: "Feb 20, 2026", time: "12:30 PM", rating: 5, driver: "Raj Kumar", status: "completed" },
  { id: 2, from: "Koramangala", to: "Electronic City", fare: "₹249", date: "Feb 19, 2026", time: "10:15 AM", rating: 4, driver: "Priya S.", status: "completed" },
  { id: 3, from: "Indiranagar", to: "Airport", fare: "₹599", date: "Feb 18, 2026", time: "6:00 AM", rating: 5, driver: "Amit P.", status: "completed" },
  { id: 4, from: "HSR Layout", to: "Marathahalli", fare: "₹129", date: "Feb 17, 2026", time: "3:45 PM", rating: 4, driver: "Sneha G.", status: "cancelled" },
];

const RideHistory = () => {
  const { t } = useTranslation();

  return (
    <AppLayout role="rider">
      <div className="p-4 md:p-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t("ride_history")}</h1>

        <div className="space-y-3">
          {rides.map((ride, i) => (
            <motion.div
              key={ride.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-4 border border-border shadow-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">{ride.date} • {ride.time}</p>
                  <p className="text-xs text-muted-foreground">Driver: {ride.driver}</p>
                </div>
                <div className="flex items-center gap-1">
                  {ride.status === "completed" ? (
                    <>
                      {Array.from({ length: ride.rating }).map((_, i) => (
                        <Star key={i} size={12} className="text-accent fill-accent" />
                      ))}
                    </>
                  ) : (
                    <span className="text-xs text-destructive font-medium">Cancelled</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <div className="w-px h-6 bg-border" />
                  <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{ride.from}</p>
                  <div className="h-4" />
                  <p className="text-sm font-medium text-foreground truncate">{ride.to}</p>
                </div>
                <p className="text-lg font-bold text-foreground">{ride.fare}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default RideHistory;
