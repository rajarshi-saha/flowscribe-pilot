import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EditorAssignment from "./pages/EditorAssignment";
import EEWorkspace from "./pages/EEWorkspace";
import ManuscriptReview from "./pages/ManuscriptReview";
import PostEEWorklist from "./pages/PostEEWorklist";
import PeerReviewerAssignment from "./pages/PeerReviewerAssignment";
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
          <Route path="/editor-assignment" element={<EditorAssignment />} />
          <Route path="/ee-workspace" element={<EEWorkspace />} />
          <Route path="/manuscript-review" element={<ManuscriptReview />} />
          <Route path="/post-ee-worklist" element={<PostEEWorklist />} />
          <Route path="/peer-reviewer-assignment" element={<PeerReviewerAssignment />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
