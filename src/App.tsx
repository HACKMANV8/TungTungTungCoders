import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import LawyerDashboard from "./pages/lawyer/LawyerDashboard";
import LawyerCases from "./pages/lawyer/LawyerCases";
import LawyerClients from "./pages/lawyer/LawyerClients";
import LawyerDocuments from "./pages/lawyer/LawyerDocuments";
import LawyerSettings from "./pages/lawyer/LawyerSettings";
import LawyerCaseDetailPage from "./pages/lawyer/LawyerCaseDetailPage";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientCases from "./pages/client/ClientCases";
import ClientDocuments from "./pages/client/ClientDocuments";
import ClientSettings from "./pages/client/ClientSettings";
import CreateCase from "./pages/client/CreateCase";
import ClientCaseDetailPage from "./pages/client/ClientCaseDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Lawyer Routes */}
          <Route path="/lawyer/dashboard" element={<LawyerDashboard />} />
          <Route path="/lawyer/cases" element={<LawyerCases />} />
          <Route path="/lawyer/cases/:id" element={<LawyerCaseDetailPage />} />
          <Route path="/lawyer/clients" element={<LawyerClients />} />
          <Route path="/lawyer/documents" element={<LawyerDocuments />} />
          <Route path="/lawyer/settings" element={<LawyerSettings />} />

          {/* Client Routes */}
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/cases" element={<ClientCases />} />
          <Route path="/client/cases/:id" element={<ClientCaseDetailPage />} />
          <Route path="/client/documents" element={<ClientDocuments />} />
          <Route path="/client/settings" element={<ClientSettings />} />
          <Route path="/client/create-case" element={<CreateCase />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
