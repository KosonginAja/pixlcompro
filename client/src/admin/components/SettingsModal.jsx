import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Save, User, Mail, Lock, ShieldCheck, KeyRound } from 'lucide-react';
import Modal from './Modal';

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [step, setStep] = useState('verify'); // 'verify' | 'edit'
  const [verifyPassword, setVerifyPassword] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);

  // Reset state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setStep('verify');
      setVerifyPassword('');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [isOpen, user]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verifyPassword) return toast.error('Please enter your password');
    setLoading(true);
    try {
      await api.post('/auth/verify', { password: verifyPassword });
      setStep('edit');
      setFormData(prev => ({ ...prev, currentPassword: verifyPassword }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Incorrect password');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    setLoading(true);
    try {
      const res = await api.put('/auth/profile', {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success('Profile updated successfully! Please log in again.');
      
      onClose(); // Close modal
      logout(); // Force logout to trigger redirect to login page
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Settings" size={step === 'verify' ? 'sm' : 'lg'}>
      {step === 'verify' ? (
        <form onSubmit={handleVerify} className="space-y-5 flex flex-col items-center pt-2 pb-4">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-500 mb-2">
            <KeyRound size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">Verify Identity</h3>
          <p className="text-sm text-gray-500 text-center mb-2 px-4">
            For security reasons, please enter your current password to continue mapping your account.
          </p>
          <div className="w-full relative">
            <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input 
              type="password" 
              autoFocus
              required 
              value={verifyPassword} 
              onChange={e => setVerifyPassword(e.target.value)} 
              className={inputClass} 
              placeholder="Enter current password..." 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all shadow-md mt-2 disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Continue'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 pt-2">
          <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold border border-emerald-100">
            <ShieldCheck size={18} /> Verified identity
          </div>

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

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Change Password</h3>
            <p className="text-xs text-gray-400 mb-4">Leave empty if you only want to update your name or email.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input type="password" placeholder="Min 6 characters" value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 mt-6 border-t border-gray-100 gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 text-sm font-bold rounded-xl transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-sky-200 disabled:opacity-60">
              <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default SettingsModal;
