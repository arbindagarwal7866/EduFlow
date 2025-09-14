import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "@/components/eduflow/Layout";
import Placeholder from "@/pages/Placeholder";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/home" element={<Index />} />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/explore"
              element={
                <Placeholder
                  title="Explore"
                  description="Discover subjects, playlists and creators. This section will include filters, trending topics, and subject-specific discovery."
                />
              }
            />
            <Route
              path="/upload"
              element={
                <Placeholder
                  title="Upload"
                  description="Record or upload vertical videos (15-60s), add title and subject, and let AI verify educational value and categorize automatically."
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Placeholder
                  title="Profile"
                  description="Your learning dashboard with streaks, XP, badges, saved playlists and progress tracking."
                />
              }
            />
            <Route
              path="/ar"
              element={
                <Placeholder
                  title="AR Learning"
                  description="Point your phone at real-world objects to discover related educational videos and overlays. (PWA + camera access to be enabled)"
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
