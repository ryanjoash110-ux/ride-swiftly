import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "@/i18n";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RiderDashboard from "./pages/rider/RiderDashboard";
import RideHistory from "./pages/rider/RideHistory";
import DriverDashboard from "./pages/driver/DriverDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/rider" element={<RiderDashboard />} />
            <Route path="/rider/history" element={<RideHistory />} />
            <Route path="/rider/payments" element={<RideHistory />} />
            <Route path="/rider/profile" element={<RideHistory />} />
            <Route path="/rider/settings" element={<RideHistory />} />
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/driver/history" element={<RideHistory />} />
            <Route path="/driver/profile" element={<RideHistory />} />
            <Route path="/driver/settings" element={<RideHistory />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/drivers" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
