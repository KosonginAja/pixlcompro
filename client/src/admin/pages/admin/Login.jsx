import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || 'pixl-vault';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Access Granted');
      // Redirect to the dashboard in the secret path
      navigate(`/${ADMIN_PATH}/`);
    } catch (err) {
      toast.error('Invalid credentials or unauthorized');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 relative overflow-hidden transition-colors duration-500">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-200 dark:bg-sky-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[120px] opacity-60 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[120px] opacity-60 animate-pulse delay-1000"></div>

      <div className="max-w-md w-full z-10 p-8 m-4 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 transition-all">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-sky-50 dark:bg-sky-900/30 text-sky-500 dark:text-sky-400 mb-6 shadow-inner rotate-3">
            <Lock size={36} />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck size={14} className="text-sky-500" />
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">Secure Entry</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Admin Vault</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm font-medium">Please identify yourself to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-sky-500">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                autoFocus
                className="pl-12 w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all shadow-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-sky-500">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                className="pl-12 w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-4 text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-2xl shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 group"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Authenticating...
              </div>
            ) : (
              <span className="flex items-center gap-2">
                Sign Into Dashboard <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <Link to="/" className="text-xs font-bold text-gray-400 hover:text-sky-500 transition-colors">
                ← Return to Public Website
            </Link>
        </div>
      </div>
    </div>
  );
};

// Simple link helper to avoid re-importing Link from a different package if not needed,
// but better to import it properly.
const Link = ({ to, children, className }) => (
    <a href={to} className={className}>{children}</a>
);

export default Login;
