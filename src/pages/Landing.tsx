import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Shield, Zap, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import heroBg from "@/assets/hero-bg.jpg";

const Landing = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Shield, title: t("safety"), desc: t("safety_desc"), color: "text-primary" },
    { icon: DollarSign, title: t("affordable"), desc: t("affordable_desc"), color: "text-accent" },
    { icon: Zap, title: t("fast"), desc: t("fast_desc"), color: "text-primary" },
  ];

  return (
    <AppLayout role={null}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>

        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Car size={16} />
              {t("app_name")}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4 leading-tight">
              {t("welcome")}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              {t("welcome_sub")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/login">
                <Button size="lg" className="gradient-primary text-primary-foreground px-8 font-semibold shadow-elevated hover:opacity-90 transition-opacity">
                  {t("book_ride")}
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="font-semibold">
                  {t("signup")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12 text-foreground"
        >
          {t("features")}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-elevated transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10 ${f.color}`}>
                <f.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            {t("book_ride")}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            {t("welcome_sub")}
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-card text-foreground font-semibold hover:bg-card/90 shadow-elevated">
              {t("signup")}
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © 2026 {t("app_name")}. All rights reserved.
        </div>
      </footer>
    </AppLayout>
  );
};

export default Landing;
