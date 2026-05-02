import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Image as ImageIcon, Info, Briefcase,
  Settings, Users, MessageSquare, LogOut, Star, ChevronRight
} from 'lucide-react';

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || 'pixl-vault';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data, error } = await supabase.from('about').select('logo').single();
        if (data && data.logo) setLogo(data.logo);
        if (error) console.error(error);
      } catch (err) { console.error('Logo fetch failed', err); }
    };
    fetchLogo();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(`/${ADMIN_PATH}/login`);
  };

  const navItems = [
    { name: 'Dashboard', path: `/${ADMIN_PATH}`, icon: LayoutDashboard },
    { name: 'Hero Area', path: `/${ADMIN_PATH}/hero`, icon: ImageIcon },
    { name: 'About Us', path: `/${ADMIN_PATH}/about`, icon: Info },
    { name: 'Services', path: `/${ADMIN_PATH}/services`, icon: Settings },
    { name: 'Portfolio', path: `/${ADMIN_PATH}/portfolio`, icon: Briefcase },
    { name: 'Clients', path: `/${ADMIN_PATH}/testimonials`, icon: Star },
    { name: 'Inbox', path: `/${ADMIN_PATH}/inbox`, icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex w-64 shrink-0 bg-gray-950 flex-col h-full overflow-hidden border-r border-gray-800">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            {logo ? (
              <img src={logo} alt="Logo" className="w-9 h-9 rounded-lg object-cover shadow-lg border border-gray-800" />
            ) : (
              <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg" style={{ boxShadow: '0 3px 0 #004B74' }}>
                P
              </div>
            )}
            <div>
              <div className="text-white font-bold text-sm leading-tight">PixlCraft</div>
              <div className="text-gray-400 text-xs font-medium">Admin Panel</div>
            </div>
          </div>
          <Link 
            to={`/${ADMIN_PATH}/settings`}
            className="group flex items-center gap-2.5 bg-gray-900 rounded-xl px-3 py-2.5 border border-gray-800 relative cursor-pointer overflow-hidden transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold shrink-0 transition-transform group-hover:scale-110">
              {user?.email?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 transition-opacity group-hover:opacity-0">
              <p className="text-white text-xs font-semibold truncate">{user?.user_metadata?.first_name || 'Admin'}</p>
              <p className="text-gray-400 text-[10px] truncate">{user?.email || 'admin@pixlcraft.studio'}</p>
            </div>
            <div className="absolute inset-0 bg-primary-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold flex items-center gap-2">
                <Settings size={14} /> Manage Account
              </span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-2">Menu</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-primary-400' : 'text-gray-500'} />
                {item.name}
                {isActive && <ChevronRight size={12} className="ml-auto text-primary-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt="L" className="w-7 h-7 rounded-md object-cover" />
            ) : (
              <div className="w-7 h-7 bg-primary-500 rounded-md flex items-center justify-center text-white text-xs font-bold">P</div>
            )}
            <span className="font-bold text-gray-800 text-sm">PixlCraft Admin</span>
          </div>
          <button onClick={handleLogout} className="text-red-500 p-1"><LogOut size={18} /></button>
        </header>

        {/* content area */}
        <div 
          className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8 scroll-smooth custom-scrollbar" 
          id="admin-content-area"
          data-lenis-prevent
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
