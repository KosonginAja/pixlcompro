import { Plus } from 'lucide-react';

/**
 * Reusable Page Header for Admin forms/lists
 * @param {string} title - Page title (e.g. 'Manage Services')
 * @param {string|number} subtitle - Count or descriptive subtitle (e.g. '5 services listed')
 * @param {function} onAdd - Handler when 'Add New' button is clicked. If omitted, button is hidden.
 * @param {string} addLabel - Label for the add button (default: 'Add New')
 */
const PageHeader = ({ title, subtitle, onAdd, addLabel = 'Add New' }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-sm"
        >
          <Plus size={16} /> {addLabel}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
