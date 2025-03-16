
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AIDialognosticsPage from "./pages/AIDialognosticsPage";
import ReportsPage from "./pages/ReportsPage";
import HealthAssistantPage from "./pages/HealthAssistantPage";
import FitbitIntegrationPage from "./pages/FitbitIntegrationPage";
import ManualDataEntryPage from "./pages/ManualDataEntryPage";
import DoctorSearchPage from "./pages/DoctorSearchPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="health-synergy-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Index />} />
                <Route path="ai-diagnostics" element={<AIDialognosticsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="health-assistant" element={<HealthAssistantPage />} />
                <Route path="fitbit-integration" element={<FitbitIntegrationPage />} />
                <Route path="manual-data" element={<ManualDataEntryPage />} />
                <Route path="doctor-search" element={<DoctorSearchPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
