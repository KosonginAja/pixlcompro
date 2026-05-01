import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './admin/context/AuthContext';
import { supabase } from './lib/supabase';

// Animation
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Public Pages
import Home from './pages/public/Home';

// Admin Pages
import Login from './admin/pages/admin/Login';
import Dashboard from './admin/pages/admin/Dashboard';
import ManageHero from './admin/pages/admin/ManageHero';
import ManageAbout from './admin/pages/admin/ManageAbout';
import ManageServices from './admin/pages/admin/ManageServices';
import ManagePortfolio from './admin/pages/admin/ManagePortfolio';
import ManageTestimonials from './admin/pages/admin/ManageTestimonials';
import Inbox from './admin/pages/admin/Inbox';
import Settings from './admin/pages/admin/Settings';
import AdminLayout from './admin/components/AdminLayout';

gsap.registerPlugin(ScrollTrigger);

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || 'pixl-vault';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!user) return <Navigate to={`/${ADMIN_PATH}/login`} replace />;
  return children;
};

function App() {
  useEffect(() => {
    // 1. Initialize Lenis (Smooth Scroll) - Only for public pages
    const isAdmin = window.location.pathname.startsWith(`/${ADMIN_PATH}`);
    let lenis = null;

    if (!isAdmin) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      // 2. Synchronize Lenis with ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      gsap.ticker.lagSmoothing(0);
    }

    // 3. Record visitor hit
    const recordHit = async () => {
      try {
        const date = new Date().toISOString().split('T')[0];
        const { error } = await supabase.rpc('increment_visits', { target_date: date });
        if (error) throw error;
      } catch (err) {
        console.warn('Analytics hit failed', err);
      }
    };
    recordHit();

    return () => {
      if (lenis) {
        lenis.destroy();
      }
    };
  }, [ADMIN_PATH]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <HelmetProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home lang="en" />} />
              <Route path="/id" element={<Home lang="id" />} />

              {/* Admin Routes (Secret Path) */}
              <Route path={`/${ADMIN_PATH}/login`} element={<Login />} />
              
              <Route 
                path={`/${ADMIN_PATH}`} 
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="hero" element={<ManageHero />} />
                <Route path="about" element={<ManageAbout />} />
                <Route path="services" element={<ManageServices />} />
                <Route path="portfolio" element={<ManagePortfolio />} />
                <Route path="testimonials" element={<ManageTestimonials />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </HelmetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
