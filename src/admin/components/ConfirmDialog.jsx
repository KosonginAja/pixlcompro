import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

/**
 * Reusable Confirmation Dialog
 * @param {boolean} isOpen - Whether dialog is visible
 * @param {function} onClose - Called to cancel
 * @param {function} onConfirm - Called exactly once when user clicks Confirm
 * @param {string} title - Title of dialog (default: 'Confirm Delete')
 * @param {string} message - Warning message (default: 'Are you sure you want to delete this item? This action cannot be undone.')
 * @param {string} confirmText - Text on confirm button (default: 'Delete')
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Delete'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmation" size="sm">
      <div className="flex flex-col items-center text-center pb-2">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <AlertTriangle size={28} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        
        <div className="flex w-full gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
