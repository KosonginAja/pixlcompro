import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Save, User, Mail, Lock, ShieldAlert } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const Settings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.first_name || '',
    email: user?.email || '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    setLoading(true);
    try {
      const updates = {
        email: formData.email,
        data: { first_name: formData.name }
      };

      if (formData.newPassword) {
        updates.password = formData.newPassword;
      }

      const { error } = await supabase.auth.updateUser(updates);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all";

  return (
    <div className="max-w-3xl">
      <PageHeader title="Account Settings" subtitle="Manage your admin profile and security credentials" />
      
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-sky-500" /> General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock size={18} className="text-amber-500" /> Change Password
            </h3>
            <p className="text-xs text-gray-400 mb-5">Leave new password fields empty if you only want to update your name or email.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input type="password" placeholder="Min 6 characters" value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className={inputClass} />
                </div>
              </div>
            </div>
          </section>

          <div className="p-5 bg-sky-50 border border-sky-100 rounded-2xl">
            <h3 className="text-sm font-bold text-sky-900 mb-2 flex items-center gap-2">
              <ShieldAlert size={16} className="text-sky-600" /> Data Protection
            </h3>
            <p className="text-xs text-sky-700/80">Updating your email or password will require a new session login for security.</p>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-sky-200 disabled:opacity-60">
              <Save size={16} /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
