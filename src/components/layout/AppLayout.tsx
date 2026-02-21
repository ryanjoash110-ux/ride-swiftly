import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, Menu, X, Bell, User, Car, MapPin, History,
  CreditCard, Settings, LayoutDashboard, Users, BarChart3, LogOut, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
  role?: "rider" | "driver" | "admin" | null;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, role }) => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleLang = () => {
    const next = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
  };

  const riderLinks = [
    { to: "/rider", icon: Car, label: t("book_ride") },
    { to: "/rider/history", icon: History, label: t("ride_history") },
    { to: "/rider/payments", icon: CreditCard, label: t("payments") },
    { to: "/rider/profile", icon: User, label: t("profile") },
    { to: "/rider/settings", icon: Settings, label: t("settings") },
  ];

  const driverLinks = [
    { to: "/driver", icon: LayoutDashboard, label: t("dashboard") },
    { to: "/driver/history", icon: History, label: t("ride_history") },
    { to: "/driver/profile", icon: User, label: t("profile") },
    { to: "/driver/settings", icon: Settings, label: t("settings") },
  ];

  const adminLinks = [
    { to: "/admin", icon: LayoutDashboard, label: t("dashboard") },
    { to: "/admin/drivers", icon: Users, label: t("drivers") },
    { to: "/admin/analytics", icon: BarChart3, label: t("analytics") },
    { to: "/admin/settings", icon: Settings, label: t("settings") },
  ];

  const links = role === "admin" ? adminLinks : role === "driver" ? driverLinks : riderLinks;
  const showSidebar = role !== null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {showSidebar && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Car size={18} className="text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">{t("app_name")}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Switch language"
            >
              <Globe size={20} />
            </button>
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              whileTap={{ scale: 0.9, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </button>
            {role && (
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                {role[0].toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Mobile overlay */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
              )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
              className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card transition-transform duration-300 lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <nav className="flex flex-col gap-1 p-4">
                {links.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <link.icon size={18} />
                      {link.label}
                    </Link>
                  );
                })}
                <div className="mt-4 pt-4 border-t border-border">
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <LogOut size={18} />
                    {t("logout")}
                  </Link>
                </div>
              </nav>
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
