import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import BusinessesPage from "./pages/BusinessesPage";
import EventsPage from "./pages/EventsPage";
import DetailsPage from "./pages/DetailsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminServices from "./pages/AdminServices";
import AdminBusinesses from "./pages/AdminBusinesses";
import AdminEvents from "./pages/AdminEvents";
import AdminFilters from "./pages/AdminFilters";
import RegisterBusiness from "./pages/RegisterBusiness";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/businesses" element={<BusinessesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/register-business" element={<RegisterBusiness />} />
          <Route path="/:type/:id" element={<DetailsPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="businesses" element={<AdminBusinesses />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="filters" element={<AdminFilters />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
