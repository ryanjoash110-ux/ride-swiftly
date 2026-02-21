import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Mail, Phone, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"rider" | "driver">("rider");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(role === "driver" ? "/driver" : "/rider");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-6">
            <Car size={40} className="text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-extrabold text-primary-foreground mb-3">{t("app_name")}</h1>
          <p className="text-primary-foreground/80 text-lg">{t("welcome_sub")}</p>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Car size={22} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">{t("app_name")}</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">{t("signup")}</h2>
          <p className="text-muted-foreground mb-6">Create your account to get started.</p>

          <div className="flex gap-2 mb-6">
            {(["rider", "driver"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  role === r ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(r)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("name")}</label>
              <Input placeholder="John Doe" className="h-11" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("phone")}</label>
              <Input type="tel" placeholder="+91 98765 43210" className="h-11" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("email")}</label>
              <Input type="email" placeholder="you@example.com" className="h-11" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("password")}</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="h-11 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground h-11 font-semibold">
              {t("signup")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">{t("login")}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
