import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/Landing'
import ProfilePage from './pages/Profile'
import RolePage from './pages/Role'
import AnalysisPage from './pages/Analysis'
import RoadmapPage from './pages/Roadmap'
import Layout from './components/layout/Layout'

import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

export default function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/role" element={<RolePage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <Toaster position="bottom-right" />
    </>
  )
}
