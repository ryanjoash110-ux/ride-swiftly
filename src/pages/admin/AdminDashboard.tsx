import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Users, Car, TrendingUp, DollarSign, Activity, Search,
  ChevronDown, MoreHorizontal, Filter, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppLayout from "@/components/layout/AppLayout";
import LeafletMap from "@/components/map/LeafletMap";

const mockDrivers = [
  { id: 1, name: "Raj Kumar", status: "online", rating: 4.8, rides: 1240, earnings: "₹45,200", vehicle: "Swift Dzire", phone: "+91 98765 43210" },
  { id: 2, name: "Priya Sharma", status: "on_trip", rating: 4.9, rides: 890, earnings: "₹38,100", vehicle: "Honda City", phone: "+91 98765 43211" },
  { id: 3, name: "Amit Patel", status: "offline", rating: 4.6, rides: 2100, earnings: "₹72,500", vehicle: "Maruti Ertiga", phone: "+91 98765 43212" },
  { id: 4, name: "Sneha Gupta", status: "online", rating: 4.7, rides: 560, earnings: "₹22,800", vehicle: "Hyundai i20", phone: "+91 98765 43213" },
  { id: 5, name: "Vikram Singh", status: "on_trip", rating: 4.5, rides: 1800, earnings: "₹61,000", vehicle: "Toyota Innova", phone: "+91 98765 43214" },
  { id: 6, name: "Meera Nair", status: "online", rating: 4.9, rides: 430, earnings: "₹18,500", vehicle: "Tata Nexon", phone: "+91 98765 43215" },
];

const revenueData = [
  { day: "Mon", revenue: 12400, rides: 145 },
  { day: "Tue", revenue: 15200, rides: 178 },
  { day: "Wed", revenue: 13800, rides: 162 },
  { day: "Thu", revenue: 18600, rides: 215 },
  { day: "Fri", revenue: 22100, rides: 258 },
  { day: "Sat", revenue: 25800, rides: 302 },
  { day: "Sun", revenue: 19400, rides: 228 },
];

const rideTypeData = [
  { name: "Mini", value: 35, color: "hsl(145, 63%, 42%)" },
  { name: "Sedan", value: 28, color: "hsl(38, 92%, 50%)" },
  { name: "SUV", value: 15, color: "hsl(220, 70%, 50%)" },
  { name: "Auto", value: 22, color: "hsl(0, 84%, 60%)" },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  rides: Math.floor(Math.random() * 50) + (i >= 7 && i <= 10 ? 40 : i >= 17 && i <= 21 ? 45 : 10),
}));

const liveDriverLocations = [
  { lat: 12.975, lng: 77.590 },
  { lat: 12.965, lng: 77.610 },
  { lat: 12.985, lng: 77.580 },
  { lat: 12.950, lng: 77.620 },
  { lat: 12.990, lng: 77.570 },
  { lat: 12.960, lng: 77.640 },
  { lat: 12.940, lng: 77.600 },
  { lat: 12.980, lng: 77.560 },
];

const recentRides = [
  { id: "R001", rider: "Ankit M.", from: "Koramangala", to: "Whitefield", fare: "₹289", status: "completed", time: "2 min ago" },
  { id: "R002", rider: "Sara K.", from: "Indiranagar", to: "MG Road", fare: "₹89", status: "in_progress", time: "5 min ago" },
  { id: "R003", rider: "Ravi P.", from: "HSR Layout", to: "Airport", fare: "₹549", status: "in_progress", time: "8 min ago" },
  { id: "R004", rider: "Neha S.", from: "JP Nagar", to: "Electronic City", fare: "₹199", status: "completed", time: "12 min ago" },
];

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const stats = [
    { label: t("total_rides"), value: "12,845", icon: Car, change: "+12%", up: true },
    { label: t("active_drivers"), value: "342", icon: Users, change: "+5%", up: true },
    { label: t("revenue"), value: "₹8.2L", icon: DollarSign, change: "+18%", up: true },
    { label: "Live Rides", value: "89", icon: Activity, change: "-3%", up: false },
  ];

  const filteredDrivers = useMemo(() => {
    return mockDrivers.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <AppLayout role="admin">
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("admin")} {t("dashboard")}</h1>
            <p className="text-muted-foreground text-sm">Real-time platform overview</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live
            </span>
          </div>
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
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon size={20} className="text-primary" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                  stat.up ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                }`}>
                  {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue chart */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-4 shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Revenue & Rides</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(145, 63%, 42%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(145, 63%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220, 18%, 11%)",
                    border: "1px solid hsl(220, 16%, 20%)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(145, 63%, 42%)" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Ride type pie */}
          <div className="bg-card rounded-xl border border-border p-4 shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Ride Types</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={rideTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                  {rideTypeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {rideTypeData.map((r) => (
                <div key={r.name} className="flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-muted-foreground">{r.name} ({r.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live map + hourly chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Live Driver Map</h3>
              <p className="text-xs text-muted-foreground">{liveDriverLocations.length} drivers on map</p>
            </div>
            <div className="h-64">
              <LeafletMap
                driverLocations={liveDriverLocations}
                showUserLocation={false}
                zoom={12}
              />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Hourly Ride Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={hourlyData}>
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220, 18%, 11%)",
                    border: "1px solid hsl(220, 16%, 20%)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Bar dataKey="rides" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent rides */}
        <div className="bg-card rounded-xl border border-border shadow-card">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Recent Rides</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Ride ID</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Rider</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3 hidden sm:table-cell">Route</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Fare</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3 hidden md:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentRides.map((ride) => (
                  <tr key={ride.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-3 text-sm font-mono text-foreground">{ride.id}</td>
                    <td className="p-3 text-sm text-foreground">{ride.rider}</td>
                    <td className="p-3 text-sm text-muted-foreground hidden sm:table-cell">
                      {ride.from} → {ride.to}
                    </td>
                    <td className="p-3 text-sm font-semibold text-foreground">{ride.fare}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
                        ride.status === "completed"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent-foreground"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ride.status === "completed" ? "bg-primary" : "bg-accent"
                        }`} />
                        {ride.status === "in_progress" ? "In Progress" : "Completed"}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">{ride.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Driver management */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-foreground">{t("drivers")} Management</h2>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-60">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search drivers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="on_trip">On Trip</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Driver</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Vehicle</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3 hidden sm:table-cell">Rating</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3 hidden md:table-cell">Rides</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3 hidden lg:table-cell">Earnings</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                            {driver.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{driver.name}</p>
                            <p className="text-xs text-muted-foreground hidden sm:block">{driver.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
                          driver.status === "online"
                            ? "bg-primary/10 text-primary"
                            : driver.status === "on_trip"
                            ? "bg-accent/10 text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            driver.status === "online" ? "bg-primary" : driver.status === "on_trip" ? "bg-accent" : "bg-muted-foreground"
                          }`} />
                          {driver.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-foreground">{driver.vehicle}</td>
                      <td className="p-3 text-sm text-foreground hidden sm:table-cell">⭐ {driver.rating}</td>
                      <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">{driver.rides.toLocaleString()}</td>
                      <td className="p-3 text-sm font-medium text-foreground hidden lg:table-cell">{driver.earnings}</td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal size={16} />
                        </Button>
                      </td>
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
