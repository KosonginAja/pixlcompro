import { Image as ImageIcon } from 'lucide-react';

/**
 * Reusable Image Uploader component
 * @param {string} label - The label for the image input
 * @param {string} hint - Helper text explaining resolution/format rules
 * @param {string} preview - Object URL of the current image preview
 * @param {function} onChange - function(file, objectUrl) called when a file is selected
 * @param {string} heightClass - Tailwind class for the dropzone height (default: h-44 w-full)
 * @param {boolean} required - Is the underlying file input required?
 * @param {boolean} contain - Use object-contain instead of object-cover (useful for logos)
 */
const ImageUploader = ({
  label,
  hint,
  preview,
  onChange,
  heightClass = 'h-44 w-full',
  required = false,
  contain = false,
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file, URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
        {label} <span className="text-gray-400 font-normal normal-case">{hint ? `(${hint})` : ''}</span>
      </label>
      
      <div className={`${heightClass} bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl relative flex items-center justify-center overflow-hidden`}>
        {preview ? (
          <>
            <img 
              src={preview} 
              alt="preview" 
              className={`w-full h-full ${contain ? 'object-contain p-4' : 'object-cover object-center'}`} 
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <label className="cursor-pointer bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-800 shadow-sm">
                Change Image 
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </>
        ) : (
          <label className="cursor-pointer text-center flex flex-col items-center w-full h-full justify-center hover:bg-gray-100 transition-colors">
            <ImageIcon className="text-primary-300 mb-2" size={32} />
            <span className="text-sm font-medium text-gray-500">Click to upload image</span>
            <input type="file" className="hidden" accept="image/*" required={required} onChange={handleFileChange} />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
