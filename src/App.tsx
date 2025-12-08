import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import GeminiOCRPage from './pages/GeminiOCRPage';
import ThaiElectionPage from './pages/ThaiElectionPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import SlipVerifyPage from './pages/SlipVerifyPage';
import CollectionsPage from './pages/CollectionsPage';
import RiskGuardPage from './pages/RiskGuardPage';
import ProjectFlowPage from './pages/ProjectFlowPage';
import ReviewFlowPage from './pages/ReviewFlowPage';
import QueryFlowPage from './pages/QueryFlowPage';
import FutureOfWorkPage from './pages/FutureOfWorkPage';
import AIEvolutionPage from './pages/AIEvolutionPage';
import AgenticAIPage from './pages/AgenticAIPage';

// Component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
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
      </Routes>
    </Router>
  );
}

export default App;
