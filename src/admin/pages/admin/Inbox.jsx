import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { Mail, CheckCircle, Trash2, Calendar, User, Phone } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import ConfirmDialog from '../../components/ConfirmDialog';

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => { fetchMessages(); }, []);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setMessages(data);
        } catch (err) { 
            console.error(err);
            toast.error('Failed to load messages'); 
        }
    };

    const markRead = async (id) => {
        try {
            const { error } = await supabase.from('contacts').update({ is_read: true }).eq('id', id);
            if (error) throw error;
            fetchMessages();
        } catch (err) { 
            console.error(err);
            toast.error('Marking read failed'); 
        }
    }

    const confirmDelete = async () => {
        if(!deleteId) return;
        try {
            const { error } = await supabase.from('contacts').delete().eq('id', deleteId);
            if (error) throw error;
            fetchMessages();
            toast.success('Message deleted');
        } catch (err) { 
            console.error(err);
            toast.error('Delete failed'); 
        }
        finally { setDeleteId(null); }
    }

    return (
        <div>
            <PageHeader title="Inbox" subtitle={`${messages.filter(m => !m.is_read).length} unread messages`} />
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {messages.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No messages in inbox.</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {messages.map(msg => (
                            <li key={msg.id} className={`p-6 transition-colors ${msg.is_read ? 'bg-white' : 'bg-primary-50/50'}`}>
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex gap-4">
                                        <div className={`mt-1 p-2 rounded-full ${msg.is_read ? 'bg-gray-100 text-gray-400' : 'bg-primary-100 text-primary-500'}`}>
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className={`font-semibold ${msg.is_read ? 'text-gray-700' : 'text-gray-900'}`}>{msg.name}</h4>
                                                {!msg.is_read && <span className="bg-primary-100 text-primary-500 text-xs px-2 py-0.5 rounded-full font-medium">New</span>}
                                            </div>
                                            <div className="flex gap-4 text-xs text-gray-500 mb-3 font-medium">
                                                <span className="flex items-center gap-1"><User size={12}/> {msg.email}</span>
                                                {msg.phone && <span className="flex items-center gap-1"><Phone size={12} className="text-green-600"/> {msg.phone}</span>}
                                                <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(msg.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{msg.message}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 shrink-0">
                                        {!msg.is_read && (
                                            <button onClick={() => markRead(msg.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg tooltip" title="Mark as read">
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        <button onClick={() => setDeleteId(msg.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg tooltip" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ConfirmDialog 
               isOpen={!!deleteId}
               onClose={() => setDeleteId(null)}
               onConfirm={confirmDelete}
               title="Delete Message"
               message="Are you sure you want to delete this message?"
            />
        </div>
    )
}
export default Inbox;
