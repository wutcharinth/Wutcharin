import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import GeminiOCRPage from './pages/GeminiOCRPage';
import ThaiElectionPage from './pages/ThaiElectionPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import SlipVerifyPage from './pages/SlipVerifyPage';
import CollectionsPage from './pages/CollectionsPage';

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
      </Routes>
    </Router>
  );
}

export default App;
