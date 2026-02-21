import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Users, Car, TrendingUp, DollarSign, MapPin, Activity } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const mockDrivers = [
  { id: 1, name: "Raj Kumar", status: "online", rating: 4.8, rides: 1240 },
  { id: 2, name: "Priya Sharma", status: "on_trip", rating: 4.9, rides: 890 },
  { id: 3, name: "Amit Patel", status: "offline", rating: 4.6, rides: 2100 },
  { id: 4, name: "Sneha Gupta", status: "online", rating: 4.7, rides: 560 },
];

const AdminDashboard = () => {
  const { t } = useTranslation();

  const stats = [
    { label: t("total_rides"), value: "12,845", icon: Car, change: "+12%" },
    { label: t("active_drivers"), value: "342", icon: Users, change: "+5%" },
    { label: t("revenue"), value: "₹8.2L", icon: DollarSign, change: "+18%" },
    { label: "Live Rides", value: "89", icon: Activity, change: "" },
  ];

  return (
    <AppLayout role="admin">
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin")} {t("dashboard")}</h1>
          <p className="text-muted-foreground text-sm">Overview of platform activity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-4 border border-border shadow-card"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={20} className="text-primary" />
                {stat.change && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Map */}
        <div className="bg-muted rounded-xl h-64 flex items-center justify-center border border-border">
          <div className="text-center text-muted-foreground">
            <MapPin size={36} className="mx-auto mb-2 text-primary animate-pulse-dot" />
            <p className="text-sm font-medium">Live Driver Map</p>
            <p className="text-xs">89 active rides across the city</p>
          </div>
        </div>

        {/* Drivers table */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">{t("drivers")}</h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Driver</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Rating</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Rides</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDrivers.map((driver) => (
                    <tr key={driver.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                            {driver.name[0]}
                          </div>
                          <span className="text-sm font-medium text-foreground">{driver.name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
                          driver.status === "online"
                            ? "bg-primary/10 text-primary"
                            : driver.status === "on_trip"
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            driver.status === "online" ? "bg-primary" : driver.status === "on_trip" ? "bg-accent" : "bg-muted-foreground"
                          }`} />
                          {driver.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-foreground">⭐ {driver.rating}</td>
                      <td className="p-3 text-sm text-muted-foreground">{driver.rides.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
