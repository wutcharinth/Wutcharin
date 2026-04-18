import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Home from './pages/Home';
import { CustomCursor, PageTransition } from './lib/motion';

// Project sub-pages are code-split — each becomes its own chunk loaded on
// navigation. This keeps the initial bundle lean since most visitors only
// hit a handful of routes.
const GeminiOCRPage = lazy(() => import('./pages/GeminiOCRPage'));
const ThaiElectionPage = lazy(() => import('./pages/ThaiElectionPage'));
const ResumeBuilderPage = lazy(() => import('./pages/ResumeBuilderPage'));
const SlipVerifyPage = lazy(() => import('./pages/SlipVerifyPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const RiskGuardPage = lazy(() => import('./pages/RiskGuardPage'));
const ProjectFlowPage = lazy(() => import('./pages/ProjectFlowPage'));
const ReviewFlowPage = lazy(() => import('./pages/ReviewFlowPage'));
const QueryFlowPage = lazy(() => import('./pages/QueryFlowPage'));
const FutureOfWorkPage = lazy(() => import('./pages/FutureOfWorkPage'));
const AIEvolutionPage = lazy(() => import('./pages/AIEvolutionPage'));
const AgenticAIPage = lazy(() => import('./pages/AgenticAIPage'));
const HumanEdgePage = lazy(() => import('./pages/HumanEdgePage'));
const KarpathyDeepDivePage = lazy(() => import('./pages/KarpathyDeepDivePage'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Minimal branded loader shown during a chunk fetch — matches the page
// transition's dark backdrop so users don't see a jarring white flash.
const RouteLoader = () => (
  <div className="fixed inset-0 z-[8000] flex items-center justify-center bg-slate-950">
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-0 rounded-full border-t border-violet-400 animate-spin [animation-duration:0.9s]" />
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <PageTransition>
      <Suspense fallback={<RouteLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/gemini-ocr" element={<GeminiOCRPage />} />
          <Route path="/thai-election" element={<ThaiElectionPage />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
          <Route path="/slip-verify" element={<SlipVerifyPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/risk-guard" element={<RiskGuardPage />} />
          <Route path="/project-flow" element={<ProjectFlowPage />} />
          <Route path="/review-flow" element={<ReviewFlowPage />} />
          <Route path="/query-flow" element={<QueryFlowPage />} />
          <Route path="/ai-evolution" element={<AIEvolutionPage />} />
          <Route path="/future-of-work" element={<FutureOfWorkPage />} />
          <Route path="/agentic-ai" element={<AgenticAIPage />} />
          <Route path="/human-edge" element={<HumanEdgePage />} />
          <Route path="/karpathy-deep-dive" element={<KarpathyDeepDivePage />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
};

function App() {
  return (
    <Router>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ScrollToTop />
      <CustomCursor />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
