import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import Home from './pages/Home';
import { CustomCursor, PageTransition } from './lib/motion';
import ScrollProvider, { useLenis } from './lib/scroll/ScrollProvider';

// The persistent WebGL world ships in its own chunk and mounts after first
// paint — the DOM hero owns the LCP, the field fades in behind it.
const SceneRoot = lazy(() => import('./scene/SceneRoot'));

const DeferredScene = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // requestIdleCallback is missing on older Safari — fall back to a timer.
    const ric: typeof window.requestIdleCallback | undefined = window.requestIdleCallback;
    if (ric) {
      const id = ric(() => setReady(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(t);
  }, []);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <SceneRoot />
    </Suspense>
  );
};

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
  const lenis = useLenis();
  useEffect(() => {
    // Reset through Lenis when it owns the scroll, so its internal position
    // stays in sync; plain window scroll otherwise.
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);
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
      <ScrollProvider>
        <ScrollToTop />
        <DeferredScene />
        <CustomCursor />
        {/* DOM content layer — sits above the fixed z-0 scene canvas. */}
        <div className="relative z-10">
          <AnimatedRoutes />
        </div>
      </ScrollProvider>
    </Router>
  );
}

export default App;
