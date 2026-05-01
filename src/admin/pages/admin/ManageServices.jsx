import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { Save, Trash2, Edit2, Settings2, Zap, GripVertical } from 'lucide-react';
import CategoryModal from '../../components/CategoryModal';

import Modal from '../../components/Modal';
import PageHeader from '../../components/PageHeader';
import ConfirmDialog from '../../components/ConfirmDialog';

const LEGACY_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];
const EMPTY_FORM = { 
  title_en: '', title_id: '', 
  description_en: '', description_id: '', 
  category_en: 'General', category_id: 'Umum',
  spotlight_items: []
};

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  useEffect(() => { 
    fetchServices(); 
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

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').order('order', { ascending: true });
      if (error) throw error;
      setServices(data);
    } catch (err) { 
      console.error(err);
      toast.error('Failed to load services'); 
    }
  };

  const openAdd = () => { setEditing(null); setFormData(EMPTY_FORM); setModalOpen(true); };

  const openEdit = (s) => {
    setEditing(s.id);
    setFormData({
      title_en: s.title_en || '', title_id: s.title_id || '',
      description_en: s.description_en || '', description_id: s.description_id || '',
      category_en: s.category_en || 'General',
      category_id: s.category_id || 'Umum',
      spotlight_items: s.spotlight_items || []
    });
    setModalOpen(true);
  };

  const handleClose = () => { setModalOpen(false); setEditing(null); setFormData(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        updated_at: new Date()
      };

      if (editing) {
        const { error } = await supabase.from('services').update(dataToSave).eq('id', editing);
        if (error) throw error;
        toast.success('Service updated!');
      } else {
        const { error } = await supabase.from('services').insert([dataToSave]);
        if (error) throw error;
        toast.success('Service added!');
      }
      handleClose();
      fetchServices();
    } catch (err) { 
      console.error(err);
      toast.error('Operation failed'); 
    }
    finally { setLoading(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', deleteId);
      if (error) throw error;
      toast.success('Deleted');
      fetchServices();
    } catch (err) { 
      console.error(err);
      toast.error('Delete failed'); 
    }
    finally { setDeleteId(null); }
  };

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleSort = async () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) return;
    
    const _services = [...services];
    const draggedItemContent = _services.splice(dragItem.current, 1)[0];
    _services.splice(dragOverItem.current, 0, draggedItemContent);
    
    // Optimistic UI update
    setServices(_services);
    dragItem.current = null;
    dragOverItem.current = null;

    // Save to DB
    const promise = Promise.all(
      _services.map((s, idx) => 
        supabase.from('services').update({ order: idx + 1 }).eq('id', s.id)
      )
    );
    
    toast.promise(promise, {
      loading: 'Saving new order...',
      success: 'Order saved successfully!',
      error: 'Failed to save order.'
    });
  };

  const field = (key, label, type = 'text', extra = {}) => (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
      {type === 'textarea'
        ? <textarea rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none resize-none" value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} {...extra} />
        : <input type={type} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none" value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} {...extra} />}
    </div>
  );

  return (
    <div>
      <PageHeader 
        title="Services" 
        subtitle={`${services.length} service${services.length !== 1 ? 's' : ''} listed`}
        onAdd={openAdd}
        addLabel="Add Service"
      />

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500 italic flex items-center gap-2">
          <GripVertical size={16} className="text-gray-400" /> Drag and drop cards below to change rotation order
        </p>
        <button 
          onClick={() => setIsCatModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
        >
          <Settings2 size={16} /> Manage Categories
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, index) => (
          <div 
            key={s.id} 
            draggable
            onDragStart={() => (dragItem.current = index)}
            onDragEnter={() => (dragOverItem.current = index)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
            className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-all group relative cursor-move"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-50 text-primary-500 shadow-sm relative">
                <GripVertical size={14} className="absolute -left-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Zap size={20} />
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => openEdit(s)} className="p-1.5 bg-gray-50 text-gray-500 hover:bg-primary-50 hover:text-primary-500 rounded-lg border border-gray-100 transition-colors"><Edit2 size={14} /></button>
                <button type="button" onClick={() => setDeleteId(s.id)} className="p-1.5 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-lg border border-gray-100 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="text-[10px] font-bold text-primary-500 uppercase tracking-wider mb-1">{s.category_en}</div>
            <h4 className="font-bold text-gray-800 mb-0.5">{s.title_en || <span className="text-gray-400 italic">No EN title</span>}</h4>
            <p className="text-xs text-gray-400 italic mb-3">{s.title_id}</p>
            <p className="text-gray-500 text-xs line-clamp-2">{s.description_en}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={handleClose} title={editing ? 'Edit Service' : 'Add New Service'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {field('title_en', 'Title (EN)', 'text', { required: true, placeholder: 'e.g. Web Development' })}
            {field('title_id', 'Title (ID)', 'text', { required: true, placeholder: 'e.g. Pengembangan Web' })}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Service Category</label>
            <select 
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none bg-white font-medium"
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
          <div className="grid grid-cols-2 gap-4">
            {field('description_en', 'Short Description (EN)', 'textarea', { required: true })}
            {field('description_id', 'Short Description (ID)', 'textarea', { required: true })}
          </div>


          <div className="pt-4 border-t border-gray-100">
             <div className="flex items-center justify-between mb-4">
                <label className="block text-xs font-black text-gray-800 uppercase tracking-widest">Spotlight Items (Right side list)</label>
                <button 
                  type="button" 
                  onClick={() => setFormData({ ...formData, spotlight_items: [...formData.spotlight_items, { label: '', title_en: '', title_id: '', desc_en: '', desc_id: '' }] })}
                  className="text-[10px] font-bold px-3 py-1 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg border border-primary-100 transition-all"
                >
                  + Add Item
                </button>
             </div>
             
             <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.spotlight_items.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                     <button 
                       type="button"
                       onClick={() => {
                          const newItems = [...formData.spotlight_items];
                          newItems.splice(index, 1);
                          setFormData({ ...formData, spotlight_items: newItems });
                       }}
                       className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <Trash2 size={14} />
                     </button>
                     
                     <div className="grid grid-cols-1 gap-3">
                        <div>
                           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Label (e.g. CORE_FEATURE)</label>
                           <input 
                             type="text" 
                             className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs" 
                             value={item.label} 
                             onChange={e => {
                               const newItems = [...formData.spotlight_items];
                               newItems[index].label = e.target.value;
                               setFormData({ ...formData, spotlight_items: newItems });
                             }}
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Title (EN)</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs" 
                                value={item.title_en} 
                                onChange={e => {
                                  const newItems = [...formData.spotlight_items];
                                  newItems[index].title_en = e.target.value;
                                  setFormData({ ...formData, spotlight_items: newItems });
                                }}
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Title (ID)</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs" 
                                value={item.title_id} 
                                onChange={e => {
                                  const newItems = [...formData.spotlight_items];
                                  newItems[index].title_id = e.target.value;
                                  setFormData({ ...formData, spotlight_items: newItems });
                                }}
                              />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Hover Desc (EN)</label>
                              <textarea 
                                rows={2}
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs resize-none" 
                                value={item.desc_en} 
                                onChange={e => {
                                  const newItems = [...formData.spotlight_items];
                                  newItems[index].desc_en = e.target.value;
                                  setFormData({ ...formData, spotlight_items: newItems });
                                }}
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Hover Desc (ID)</label>
                              <textarea 
                                rows={2}
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs resize-none" 
                                value={item.desc_id} 
                                onChange={e => {
                                  const newItems = [...formData.spotlight_items];
                                  newItems[index].desc_id = e.target.value;
                                  setFormData({ ...formData, spotlight_items: newItems });
                                }}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
                {formData.spotlight_items.length === 0 && (
                   <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-xs italic">
                      No spotlight items added. Will show placeholder or "Coming Soon".
                   </div>
                )}
             </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={handleClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors disabled:opacity-60">
              <Save size={15} /> {loading ? 'Saving...' : editing ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service?"
      />

      <CategoryModal 
        isOpen={isCatModalOpen} 
        onClose={() => setIsCatModalOpen(false)}
        onUpdate={fetchCategories}
      />
    </div>
  );
};

export default ManageServices;
