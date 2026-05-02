import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Briefcase,
  MessageSquare,
  Users,
  ArrowUpRight,
  Image as ImageIcon,
  Info,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Eye,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || 'pixl-vault';

const StatCard = ({ title, count, icon: Icon, accent, link, desc }) => (
  <Link to={`/${ADMIN_PATH}${link}` || "#"} className="group block">
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${accent.bg}`}>
          <Icon size={22} className={accent.text} />
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center -mr-1 -mt-1 opacity-0 group-hover:opacity-100 transition-all">
          <ArrowUpRight size={14} className="text-primary-500" />
        </div>
      </div>
      <div className="mt-auto">
        <div className="text-3xl font-black text-gray-950 mb-1">{count}</div>
        <div className="text-sm font-bold text-gray-900 mb-1">{title}</div>
        <div className="text-[11px] text-gray-500 font-medium leading-relaxed uppercase tracking-wider">{desc}</div>
      </div>
    </div>
  </Link>
);

const QuickLink = ({ icon: Icon, label, path, desc }) => (
  <Link
    to={`/${ADMIN_PATH}${path}`}
    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
  >
    <div className="w-11 h-11 bg-gray-50 group-hover:bg-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm group-hover:shadow-primary-500/20">
      <Icon
        size={20}
        className="text-gray-400 group-hover:text-white transition-colors"
      />
    </div>
    <div className="min-w-0">
      <div className="text-sm font-black text-gray-900 group-hover:text-primary-600 transition-colors">
        {label}
      </div>
      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 truncate">{desc}</div>
    </div>
    <div className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-gray-300 group-hover:text-primary-500 group-hover:bg-primary-50 transition-all">
      <ArrowUpRight size={14} />
    </div>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    services: 0,
    portfolio: 0,
    messages: 0,
  });
  const [analytics, setAnalytics] = useState({
    daily: 0,
    monthly: 0,
    total: 0,
    chart: []
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [srvRes, portRes, msgRes, visitRes] = await Promise.all([
          supabase.from('services').select('id', { count: 'exact' }),
          supabase.from('portfolio').select('id', { count: 'exact' }),
          supabase.from('contacts').select('*'),
          supabase.from('visits').select('*').order('date', { ascending: true })
        ]);

        setStats({
          services: srvRes.count || 0,
          portfolio: portRes.count || 0,
          messages: msgRes.data?.length || 0,
        });

        // Calculate Analytics
        const todayStr = new Date().toISOString().split('T')[0];
        const monthStartStr = todayStr.substring(0, 7) + '-01';
        
        const visits = visitRes.data || [];
        const daily = visits.find(v => v.date === todayStr)?.visits || 0;
        const monthly = visits
          .filter(v => v.date >= monthStartStr)
          .reduce((sum, v) => sum + v.visits, 0);
        const total = visits.reduce((sum, v) => sum + v.visits, 0);
        
        // Last 7 days chart
        const last7Days = visits.slice(-7).map(v => ({
          date: new Date(v.date).toLocaleDateString('en-US', { weekday: 'short' }),
          visits: v.visits
        }));

        setAnalytics({
          daily,
          monthly,
          total,
          chart: last7Days
        });

        setUnreadCount(msgRes.data?.filter((m) => !m.is_read).length || 0);
      } catch (err) {
        console.error("Failed to load initial stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-sky-500" />
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
              PixlCraft Studio
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {greeting()}, {user?.user_metadata?.first_name || "Admin"} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">
            Here's what's happening with your website today.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500">
          <Clock size={14} />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-5 hover:border-primary-100 transition-colors group">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center transition-all group-hover:bg-primary-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-500/20">
            <Eye size={28} />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-950 leading-none mb-1">{analytics.daily}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Visitors</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-5 hover:border-primary-100 transition-colors group">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center transition-all group-hover:bg-primary-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-500/20">
            <Calendar size={28} />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-950 leading-none mb-1">{analytics.monthly}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Visitors</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-5 hover:border-primary-100 transition-colors group">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center transition-all group-hover:bg-primary-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-500/20">
            <BarChart3 size={28} />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-950 leading-none mb-1">{analytics.total}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Overall</div>
          </div>
        </div>
      </div>

      {/* Visitor Graph */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={16} className="text-sky-500" />
              Visitor Trend
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">Traffic monitoring for the last 7 days</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-500 border border-gray-100">
              Last 7 Days
            </div>
            <button
              onClick={() => setShowChart(!showChart)}
              className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-lg text-xs font-bold transition-all border border-sky-100"
            >
              {showChart ? (
                <>
                  Hide Graph <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Show Graph <ChevronDown size={14} />
                </>
              )}
            </button>
          </div>
        </div>
        
        {showChart && (
          <div className="h-[300px] w-full animate-in fade-in slide-in-from-top-4 duration-500">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.chart}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#0ea5e9', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVisits)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Services"
          count={stats.services}
          icon={Zap}
          accent={{ bg: "bg-sky-100", text: "text-sky-600" }}
          link="/services"
          desc="Active offerings"
        />
        <StatCard
          title="Portfolio"
          count={stats.portfolio}
          icon={Briefcase}
          accent={{ bg: "bg-violet-100", text: "text-violet-600" }}
          link="/portfolio"
          desc="Projects showcased"
        />

        <StatCard
          title="New Messages"
          count={unreadCount}
          icon={MessageSquare}
          accent={{
            bg: unreadCount > 0 ? "bg-amber-100" : "bg-gray-100",
            text: unreadCount > 0 ? "text-amber-600" : "text-gray-400",
          }}
          link="/inbox"
          desc={unreadCount > 0 ? "Needs your attention" : "All caught up!"}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Quick Actions</h2>
            <span className="text-xs text-gray-400">Manage your content</span>
          </div>
          <div className="p-3 divide-y divide-gray-50">
            <QuickLink
              icon={ImageIcon}
              label="Hero Area"
              path="/hero"
              desc="Update headline, badge, and background"
            />
            <QuickLink
              icon={Info}
              label="About Us"
              path="/about"
              desc="Edit company story, vision & mission"
            />
            <QuickLink
              icon={Zap}
              label="Services"
              path="/services"
              desc="Add or edit service offerings"
            />
            <QuickLink
              icon={Briefcase}
              label="Portfolio"
              path="/portfolio"
              desc="Showcase your latest projects"
            />
            <QuickLink
              icon={Star}
              label="Clients"
              path="/testimonials"
              desc="Add client logos and testimonials"
            />

            <QuickLink
              icon={MessageSquare}
              label="Inbox"
              path="/inbox"
              desc={`${unreadCount} unread message`}
            />
          </div>
        </div>

        {/* Tips & Info */}
        <div className="space-y-4">
          {/* Status Card */}
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span className="text-sm font-semibold">Supabase System</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/20 rounded-md text-[10px] uppercase font-bold tracking-wider">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>{" "}
                Connected
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between text-xs bg-white/10 p-2.5 rounded-lg border border-white/10">
                <span className="text-sky-100 font-medium">Database (PostgreSQL)</span>
                <span className="font-bold text-green-300">Online</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white/10 p-2.5 rounded-lg border border-white/10">
                <span className="text-sky-100 font-medium">Auth Service</span>
                <span className="font-bold text-green-300">Online</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white/10 p-2.5 rounded-lg border border-white/10">
                <span className="text-sky-100 font-medium">Storage Bucket</span>
                <span className="font-bold text-green-300">Online</span>
              </div>
               <div className="p-3 bg-white/10 rounded-lg mt-2">
                  <p className="text-[10px] text-sky-100 leading-relaxed uppercase tracking-widest font-bold mb-1">Architecture</p>
                  <p className="text-[11px] font-medium">Serverless Unified Application</p>
               </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={14} className="text-amber-500" />
              <span className="text-sm font-bold text-gray-800">
                Maintenance Tip
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
               Your application is now serverless. All data is securely stored in Supabase.
            </p>
            <ul className="space-y-3">
              {[
                { icon: TrendingUp, text: "Monitor visitor trends weekly." },
                { icon: Star, text: "Update portfolio with your latest work." },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-gray-500 leading-relaxed">
                  <Icon size={13} className="text-sky-400 mt-0.5 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
