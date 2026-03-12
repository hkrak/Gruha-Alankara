import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import AnalyzePage from "./pages/AnalyzePage";
import DesignStudioPage from "./pages/DesignStudioPage";
import CatalogPage from "./pages/CatalogPage";
import ARCameraPage from "./pages/ARCameraPage";
import BudgetPlannerPage from "./pages/BudgetPlannerPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/design" element={<DesignStudioPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/ar-camera" element={<ARCameraPage />} />
            <Route path="/budget" element={<BudgetPlannerPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
