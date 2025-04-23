
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import JobBoard from "./pages/JobBoard";
// Removed CompanyProfile import
import CandidateProfile from "./pages/CandidateProfile";
import About from "./pages/About";
import Employers from "./pages/Employers";
import NotFound from "./pages/NotFound";
import Kitas from "./pages/Kitas";
import KitaDetail from "./pages/KitaDetail";
import KitaMapSearch from "./pages/KitaMapSearch";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import GuideBewerbung from "./pages/guides/GuideBewerbung";
import GuideGehalt from "./pages/guides/GuideGehalt";
import GuideAusbildung from "./pages/guides/GuideAusbildung";
import GuideEltern from "./pages/guides/GuideEltern";
import GuideErzieher from "./pages/guides/GuideErzieher";
import GuideGesundheit from "./pages/guides/GuideGesundheit";
import GuideRechtliches from "./pages/guides/GuideRechtliches";
import ELearning from "./pages/elearning/ELearning";
import ELearningCourseDetail from "./pages/elearning/ELearningCourseDetail";
import ELearningCategories from "./pages/elearning/ELearningCategories";
import ELearningMyCourses from "./pages/elearning/ELearningMyCourses";
import Matching from "./pages/matching/Matching";
import MatchingResults from "./pages/matching/MatchingResults";

// Layout Imports
import MainLayout from "./components/layout/MainLayout"; // Import MainLayout
import AdminLayout from "./components/layout/AdminLayout";

// Admin Imports
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminKitas from "./pages/admin/AdminKitas";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminKitaForm from "./pages/admin/AdminKitaForm";
import AdminJobForm from "./pages/admin/AdminJobForm"; // Import the new job form component
import AdminImport from "./pages/admin/AdminImport"; // Import the new import component
import KnowledgeAdminPage from "./pages/admin/KnowledgeAdminPage"; // Wissen-Admin-Seite
import KnowledgeListAdminPage from "./pages/admin/KnowledgeListAdminPage"; // Wissen-Liste
import KnowledgePostPage from "./pages/KnowledgePostPage"; // Öffentliche Wissens-Seite
import KnowledgeCategoryPage from "./pages/KnowledgeCategoryPage"; // Kategorie-Seite
import KnowledgeOverviewPage from "./pages/KnowledgeOverviewPage"; // NEU: Übersichtsseite

// Kinderwelt Imports
import KinderweltKatalogPage from "./pages/KinderweltKatalogPage";
import KinderweltStoryPage from "./pages/KinderweltStoryPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes (Layout wird in jeder Seite selbst gehandhabt) */}
          {/* <Route element={<MainLayout />}> */} 
            <Route path="/" element={<Index />} />
            <Route path="/kitas" element={<Kitas />} />
            <Route path="/kitas/map-search" element={<KitaMapSearch />} />
            <Route path="/kita/:id" element={<KitaDetail />} />
            <Route path="/company/:id" element={<KitaDetail />} /> {/* Alias für Kita */}
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobboard" element={<JobBoard />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/profile" element={<CandidateProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/employers" element={<Employers />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            
            {/* Guide Pages */}
            <Route path="/guides/bewerbung" element={<GuideBewerbung />} />
            <Route path="/guides/gehalt" element={<GuideGehalt />} />
            <Route path="/guides/ausbildung" element={<GuideAusbildung />} />
            <Route path="/guides/eltern" element={<GuideEltern />} />
            <Route path="/guides/erzieher" element={<GuideErzieher />} />
            <Route path="/guides/gesundheit" element={<GuideGesundheit />} />
            <Route path="/guides/rechtliches" element={<GuideRechtliches />} />
            
            {/* E-Learning Routes */}
            <Route path="/elearning" element={<ELearning />} />
            <Route path="/elearning/course/:id" element={<ELearningCourseDetail />} />
            <Route path="/elearning/categories" element={<ELearningCategories />} />
            <Route path="/elearning/meine-kurse" element={<ELearningMyCourses />} />
            
            {/* Matching Routes */}
            <Route path="/matching" element={<Matching />} />
            <Route path="/matching/results" element={<MatchingResults />} />

            {/* Öffentliche Wissens-Seiten */}
            <Route path="/wissen" element={<KnowledgeOverviewPage />} />
            <Route path="/wissen/kategorie/:categorySlug" element={<KnowledgeCategoryPage />} /> 
            <Route path="/wissen/*" element={<KnowledgePostPage />} /> 

            {/* Kinderwelt Routes */}
            <Route path="/kinderwelt" element={<KinderweltKatalogPage />} />
            <Route path="/kinderwelt/:slug" element={<KinderweltStoryPage />} />

            {/* Redirects (innerhalb des MainLayouts, falls gewünscht) */}
            <Route path="/employers/pricing" element={<Employers />} />
            <Route path="/employers/register" element={<Employers />} />
            <Route path="/employers/faq" element={<Employers />} />
            <Route path="/guides/*" element={<Index />} />
            <Route path="/login" element={<Index />} />
            <Route path="/register" element={<Index />} />
            <Route path="/contact" element={<Index />} />

            {/* Catch-all für öffentliche Seiten (innerhalb MainLayout) */}
            {/* <Route path="*" element={<NotFound />} /> */} 
          {/* </Route> */} {/* Ende der MainLayout-Gruppe */}

          {/* Admin Routes using AdminLayout (separat vom MainLayout) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="kitas" element={<AdminKitas />} />
            <Route path="kitas/new" element={<AdminKitaForm />} />
            <Route path="kitas/edit/:id" element={<AdminKitaForm />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="jobs/new" element={<AdminJobForm />} />
            <Route path="jobs/edit/:id" element={<AdminJobForm />} />
            <Route path="import" element={<AdminImport />} />
            <Route path="knowledge" element={<KnowledgeAdminPage />} />
            <Route path="knowledge-list" element={<KnowledgeListAdminPage />} />
            {/* Optional: Admin-Route für Kinderwelt hinzufügen */}
            {/* <Route path="kinderwelt" element={<AdminKinderweltPage />} /> */}
          </Route>

          {/* Fallback, falls eine Route weder öffentlich noch admin ist (sollte nicht passieren) */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
