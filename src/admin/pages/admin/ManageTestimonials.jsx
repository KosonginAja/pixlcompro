import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { Save, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';
import Modal from '../../components/Modal';
import PageHeader from '../../components/PageHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUploader from '../../components/ImageUploader';

const EMPTY_FORM = { name: '', image: null };

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try { 
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setTestimonials(data); 
    }
    catch (err) { 
      console.error(err);
      toast.error('Failed to load partners'); 
    }
  };

  const openAdd = () => { setEditing(null); setPreview(null); setFormData(EMPTY_FORM); setModalOpen(true); };

  const openEdit = (t) => {
    setEditing(t.id);
    setFormData({ name: t.name, image: null });
    setPreview(t.image);
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
        const fileName = `partner_${Date.now()}.${fileExt}`;
        const filePath = `testimonials/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      const dataToSave = {
        name: formData.name,
        image: imageUrl,
        updated_at: new Date()
      };

      if (editing) {
        const { error } = await supabase.from('testimonials').update(dataToSave).eq('id', editing);
        if (error) throw error;
        toast.success('Partner updated!');
      } else {
        const { error } = await supabase.from('testimonials').insert([dataToSave]);
        if (error) throw error;
        toast.success('Partner added!');
      }
      handleClose();
      fetchTestimonials();
    } catch (err) { 
      console.error(err);
      toast.error('Operation failed'); 
    }
    finally { setLoading(false); }
  };

  const confirmDelete = async () => {
    if(!deleteId) return;
    try { 
      const { error } = await supabase.from('testimonials').delete().eq('id', deleteId);
      if (error) throw error;
      toast.success('Deleted'); 
      fetchTestimonials(); 
    }
    catch (err) { 
      console.error(err);
      toast.error('Delete failed'); 
    }
    finally { setDeleteId(null); }
  };

  return (
    <div>
      <PageHeader
        title="Clients &amp; Partners"
        subtitle={`${testimonials.length} logo${testimonials.length !== 1 ? 's' : ''} listed`}
        onAdd={openAdd}
        addLabel="Add Partner"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {testimonials.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-4 group relative flex flex-col items-center justify-center min-h-[130px] hover:shadow-md transition-all">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(t)} className="p-1.5 bg-gray-50 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-lg border border-gray-100"><Edit2 size={13} /></button>
              <button onClick={() => setDeleteId(t.id)} className="p-1.5 bg-gray-50 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg border border-gray-100"><Trash2 size={13} /></button>
            </div>
            {t.image
              ? (
                <div className="w-full h-16 flex items-center justify-center bg-gray-50 rounded-xl p-2 mb-2">
                   <img src={t.image} className="max-w-full max-h-full object-contain" alt={t.name} />
                </div>
              )
              : <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center font-bold text-lg mb-2">{t.name.charAt(0)}</div>
            }
            <div className="text-xs font-semibold text-gray-600 text-center truncate w-full">{t.name}</div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={handleClose} title={editing ? 'Edit Partner Logo' : 'Add New Partner'} size="md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Partner / Client Name</label>
            <input type="text" required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none" placeholder="e.g. Google, Microsoft..." value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <p className="text-xs text-gray-400 mt-1">Used for alt text and tooltip on hover.</p>
          </div>

          <ImageUploader 
            label="Client Logo"
            hint="PNG transparent, ~200×100px"
            preview={preview}
            onChange={(file, url) => {
              setFormData({...formData, image: file});
              setPreview(url);
            }}
            heightClass="h-40 w-full"
            required={!editing}
            contain={true}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={handleClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors disabled:opacity-60">
              <Save size={15} /> {loading ? 'Saving...' : editing ? 'Update Logo' : 'Add Partner'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Partner"
        message="Are you sure you want to remove this client/partner logo?"
      />
    </div>
  );
};

export default ManageTestimonials;
