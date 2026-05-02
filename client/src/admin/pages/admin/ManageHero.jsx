import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import ImageUploader from '../../components/ImageUploader';

const ManageHero = () => {
  const [data, setData] = useState({
    headline_en: '', headline_id: '', subheadline_en: '', subheadline_id: '',
    cta_text_en: '', cta_text_id: '', cta_link: '', badge_text_en: '', badge_text_id: '', bg_image: null
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [recordId, setRecordId] = useState(null);

  useEffect(() => { fetchHero(); }, []);

  const fetchHero = async () => {
    try {
      const { data: heroData, error } = await supabase.from('hero').select('*').single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      
      if (heroData) {
        setRecordId(heroData.id);
        setData({
          headline_en: heroData.headline_en || '',
          headline_id: heroData.headline_id || '',
          subheadline_en: heroData.subheadline_en || '',
          subheadline_id: heroData.subheadline_id || '',
          cta_text_en: heroData.cta_text_en || '',
          cta_text_id: heroData.cta_text_id || '',
          cta_link: heroData.cta_link || '',
          badge_text_en: heroData.badge_text_en || '',
          badge_text_id: heroData.badge_text_id || '',
          bg_image: null
        });
        if (heroData.bg_image) setPreview(heroData.bg_image);
      }
    } catch (err) { 
      console.error(err);
      toast.error('Failed to load hero data'); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = preview;

      // Handle Image Upload if new image selected
      if (data.bg_image instanceof File) {
        const file = data.bg_image;
        const fileExt = file.name.split('.').pop();
        const fileName = `hero_${Date.now()}.${fileExt}`;
        const filePath = `hero/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      const updateData = {
        headline_en: data.headline_en,
        headline_id: data.headline_id,
        subheadline_en: data.subheadline_en,
        subheadline_id: data.subheadline_id,
        cta_text_en: data.cta_text_en,
        cta_text_id: data.cta_text_id,
        cta_link: data.cta_link,
        badge_text_en: data.badge_text_en,
        badge_text_id: data.badge_text_id,
        bg_image: imageUrl,
        updated_at: new Date()
      };

      if (recordId) {
        const { error } = await supabase.from('hero').update(updateData).eq('id', recordId);
        if (error) throw error;
      } else {
        const { data: inserted, error } = await supabase.from('hero').insert([updateData]).select();
        if (error) throw error;
        setRecordId(inserted[0].id);
      }

      toast.success('Hero updated successfully!');
      setPreview(imageUrl);
    } catch (err) { 
      console.error(err);
      toast.error('Failed to update hero section'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div>
      <PageHeader title="Manage Hero Area" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-w-4xl space-y-6">
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4 shadow-sm">
                <h3 className="font-semibold text-gray-700 border-b pb-2 mb-2 border-gray-200">Badge Text</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">English</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm" value={data.badge_text_en} onChange={e => setData({...data, badge_text_en: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Indonesian</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm" value={data.badge_text_id} onChange={e => setData({...data, badge_text_id: e.target.value})} />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4 shadow-sm">
                <h3 className="font-semibold text-gray-700 border-b pb-2 mb-2 border-gray-200">Headline</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">English</label>
                        <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-semibold" value={data.headline_en} onChange={e => setData({...data, headline_en: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Indonesian</label>
                        <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-semibold" value={data.headline_id} onChange={e => setData({...data, headline_id: e.target.value})} />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4 shadow-sm">
                <h3 className="font-semibold text-gray-700 border-b pb-2 mb-2 border-gray-200">Subheadline</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">English</label>
                        <textarea rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm" value={data.subheadline_en} onChange={e => setData({...data, subheadline_en: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Indonesian</label>
                        <textarea rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm" value={data.subheadline_id} onChange={e => setData({...data, subheadline_id: e.target.value})} />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4 shadow-sm">
                <h3 className="font-semibold text-gray-700 border-b pb-2 mb-2 border-gray-200">Call to Action (CTA)</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Button (EN)</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 text-sm" value={data.cta_text_en} onChange={e => setData({...data, cta_text_en: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Button (ID)</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 text-sm" value={data.cta_text_id} onChange={e => setData({...data, cta_text_id: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Link</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 text-sm font-mono" value={data.cta_link} onChange={e => setData({...data, cta_link: e.target.value})} />
                    </div>
                </div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-gray-200 flex justify-end">
          <button type="submit" disabled={loading} className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70">
            <Save size={18} /> {loading ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageHero;
