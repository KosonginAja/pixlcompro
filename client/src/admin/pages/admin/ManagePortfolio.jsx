import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { Save, Trash2, Edit2, Image as ImageIcon, Settings2 } from 'lucide-react';
import Modal from '../../components/Modal';
import PageHeader from '../../components/PageHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUploader from '../../components/ImageUploader';
import CategoryModal from '../../components/CategoryModal';

const EMPTY_FORM = { title_en: '', title_id: '', description_en: '', description_id: '', tags: '', url: '', category_en: 'Web Design', category_id: 'Desain Web', image: null };

const ManagePortfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  useEffect(() => { 
    fetchPortfolio(); 
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name_en', { ascending: true });
      if (error) throw error;
      setCategories(data);
    } catch (err) { 
      console.error(err);
      toast.error('Failed to load categories'); 
    }
  };

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase.from('portfolio').select('*').order('order', { ascending: true });
      if (error) throw error;
      setPortfolio(data);
    } catch (err) { 
      console.error(err);
      toast.error('Failed to load portfolio'); 
    }
  };

  const openAdd = () => { setEditing(null); setPreview(null); setFormData(EMPTY_FORM); setModalOpen(true); };

  const openEdit = (p) => {
    setEditing(p.id);
    setFormData({ 
      title_en: p.title_en, 
      title_id: p.title_id, 
      description_en: p.description_en, 
      description_id: p.description_id, 
      tags: p.tags?.join(', ') || '', 
      url: p.url || '', 
      category_en: p.category_en, 
      category_id: p.category_id, 
      image: null 
    });
    setPreview(p.image);
    setModalOpen(true);
  };

  const handleClose = () => { setModalOpen(false); setEditing(null); setPreview(null); setFormData(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imageUrl = preview;

      if (formData.image instanceof File) {
        const file = formData.image;
        const fileExt = file.name.split('.').pop();
        const fileName = `port_${Date.now()}.${fileExt}`;
        const filePath = `portfolio/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

      const dataToSave = {
        title_en: formData.title_en,
        title_id: formData.title_id,
        description_en: formData.description_en,
        description_id: formData.description_id,
        tags: tagsArray,
        url: formData.url,
        category_en: formData.category_en,
        category_id: formData.category_id,
        image: imageUrl,
        updated_at: new Date()
      };

      if (editing) {
        const { error } = await supabase.from('portfolio').update(dataToSave).eq('id', editing);
        if (error) throw error;
        toast.success('Project updated!');
      } else {
        const { error } = await supabase.from('portfolio').insert([dataToSave]);
        if (error) throw error;
        toast.success('Project added!');
      }
      handleClose();
      fetchPortfolio();
    } catch (err) { 
      console.error(err);
      toast.error('Operation failed'); 
    }
    finally { setLoading(false); }
  };

  const confirmDelete = async () => {
    if(!deleteId) return;
    try { 
      const { error } = await supabase.from('portfolio').delete().eq('id', deleteId);
      if (error) throw error;
      toast.success('Deleted'); 
      fetchPortfolio(); 
    }
    catch (err) { 
      console.error(err);
      toast.error('Delete failed'); 
    }
    finally { setDeleteId(null); }
  };

  const inp = (key, label, type = 'text', extra = {}) => (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">{label}</label>
      {type === 'textarea'
        ? <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none resize-none bg-white font-medium" value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} {...extra} />
        : <input type={type} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none bg-white font-medium" value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} {...extra} />}
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Portfolio"
        subtitle={`${portfolio.length} project${portfolio.length !== 1 ? 's' : ''} showcased`}
        onAdd={openAdd}
        addLabel="Add Project"
      />

      <div className="flex justify-end mb-6">
        <button 
          onClick={() => setIsCatModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
        >
          <Settings2 size={16} /> Manage Categories
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {portfolio.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
            <div className="h-44 bg-gray-100 relative">
              {p.image ? <img src={p.image} className="w-full h-full object-cover" alt={p.title_en} /> : <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon size={40} /></div>}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(p)} className="p-1.5 bg-white/90 text-gray-600 hover:text-primary-500 rounded-lg shadow-sm border border-gray-100"><Edit2 size={14} /></button>
                <button onClick={() => setDeleteId(p.id)} className="p-1.5 bg-white/90 text-gray-600 hover:text-red-500 rounded-lg shadow-sm border border-gray-100"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="p-4">
              <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1">{p.category_en}</div>
              <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{p.title_en}</h4>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2 font-medium">{p.description_en}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={handleClose} title={editing ? 'Edit Project' : 'Add New Project'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {inp('title_en', 'Title (EN)', 'text', { required: true })}
            {inp('title_id', 'Title (ID)', 'text', { required: true })}
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Project Category</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none bg-white font-medium"
                value={formData.category_en}
                onChange={e => {
                  const cat = categories.find(c => c.name_en === e.target.value);
                  if (cat) {
                    setFormData({ ...formData, category_en: cat.name_en, category_id: cat.name_id });
                  } else {
                    setFormData({ ...formData, category_en: e.target.value, category_id: e.target.value });
                  }
                }}
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name_en}>{c.name_en} ({c.name_id})</option>
                ))}
                {!categories.some(c => c.name_en === formData.category_en) && formData.category_en && (
                  <option value={formData.category_en}>{formData.category_en}</option>
                )}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {inp('description_en', 'Description (EN)', 'textarea', { required: true })}
            {inp('description_id', 'Description (ID)', 'textarea', { required: true })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {inp('tags', 'Tags (comma separated)', 'text', { placeholder: 'React, Tailwind, Node' })}
            {inp('url', 'Live URL', 'text', { placeholder: 'https://' })}
          </div>

          <ImageUploader 
            label="Project Thumbnail"
            hint="Ideal: 800×600px, max 10MB"
            preview={preview}
            onChange={(file, url) => {
              setFormData({...formData, image: file});
              setPreview(url);
            }}
            heightClass="h-48 w-full"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={handleClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors disabled:opacity-60">
              <Save size={15} /> {loading ? 'Saving...' : editing ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this portfolio project?"
      />

      <CategoryModal 
        isOpen={isCatModalOpen} 
        onClose={() => setIsCatModalOpen(false)}
        onUpdate={fetchCategories}
      />
    </div>
  );
};

export default ManagePortfolio;
