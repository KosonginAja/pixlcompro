import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageHero from './pages/admin/ManageHero';
import ManageAbout from './pages/admin/ManageAbout';
import ManageServices from './pages/admin/ManageServices';
import ManagePortfolio from './pages/admin/ManagePortfolio';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageTeam from './pages/admin/ManageTeam';
import Inbox from './pages/admin/Inbox';
import AdminLayout from './components/AdminLayout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/" 
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
          <Route path="team" element={<ManageTeam />} />
          <Route path="inbox" element={<Inbox />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
