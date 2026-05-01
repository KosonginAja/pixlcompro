import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const CategoryModal = ({ isOpen, onClose, onUpdate }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCat, setNewCat] = useState({ name_en: '', name_id: '' });

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

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

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCat.name_en || !newCat.name_id) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('categories').insert([newCat]);
      if (error) throw error;
      toast.success('Category added');
      setNewCat({ name_en: '', name_id: '' });
      fetchCategories();
      onUpdate();
    } catch (err) { 
        console.error(err);
        toast.error('Add failed'); 
    }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure? Projects with this category will keep the name but won\'t be in the dynamic list anymore.')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      toast.success('Deleted');
      fetchCategories();
      onUpdate();
    } catch (err) { 
        console.error(err);
        toast.error('Delete failed'); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800">Portfolio Categories</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add Form */}
          <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input 
                placeholder="Name (EN)" 
                className="px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary-500"
                value={newCat.name_en}
                onChange={e => setNewCat({...newCat, name_en: e.target.value})}
              />
              <input 
                placeholder="Nama (ID)" 
                className="px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary-500"
                value={newCat.name_id}
                onChange={e => setNewCat({...newCat, name_id: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Plus size={14} /> Add Category
            </button>
          </form>

          {/* List */}
          <div className="max-h-64 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
            {categories.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-xs italic">No categories yet.</p>
            ) : (
              categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-primary-100 transition-all group">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{cat.name_en}</p>
                    <p className="text-[10px] text-gray-400">{cat.name_id}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
