import React, { useState, useRef } from 'react';
import { Upload, Link2, Image as ImageIcon, X, Check } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = "e.g. https://... or select a file",
  required = false
}: ImageUploadFieldProps) {
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>(
    value.startsWith('data:image/') ? 'upload' : 'url'
  );
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file! (অনুগ্রহ করে ছবি সিলেক্ট করুন)');
      return;
    }

    // Limit original to 10MB just as a safety boundary
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB! (ছবির সাইজ ১০ মেগাবাইটের কম হতে হবে)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        const img = new Image();
        img.onload = () => {
          // Max dimension 1000px for excellent sharpness and extremely light weight
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG with 0.75 quality which is perfectly sharp and less than ~120KB
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
            onChange(compressedDataUrl);
          } else {
            // Fallback if canvas context fails
            onChange(event.target.result as string);
          }
        };
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const isBase64 = value.startsWith('data:image/');

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-bold text-emerald-deep/80 uppercase tracking-widest block">{label}</label>
        <div className="flex bg-warm-beige/50 p-0.5 rounded-lg border border-emerald-deep/5">
          <button
            type="button"
            onClick={() => setUploadMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              uploadMode === 'upload'
                ? 'bg-emerald-deep text-white shadow-sm'
                : 'text-emerald-deep/60 hover:text-emerald-deep'
            }`}
          >
            <Upload size={12} /> Computer Upload
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              uploadMode === 'url'
                ? 'bg-emerald-deep text-white shadow-sm'
                : 'text-emerald-deep/60 hover:text-emerald-deep'
            }`}
          >
            <Link2 size={12} /> Paste URL
          </button>
        </div>
      </div>

      {uploadMode === 'upload' ? (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] bg-white ${
              dragging 
                ? 'border-rose-gold bg-rose-gold/5 scale-[1.01]' 
                : isBase64 
                  ? 'border-emerald-deep/20 bg-emerald-deep/[0.01]' 
                  : 'border-emerald-deep/10 hover:border-rose-gold/40'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            {isBase64 ? (
              <div className="space-y-3 w-full flex flex-col items-center">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-emerald-deep/10 shadow-sm bg-warm-beige group">
                  <img
                    src={value}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-emerald-deep/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <Check size={20} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-emerald-deep">Image Loaded Successfully! (ছবি লোড হয়েছে)</p>
                  <p className="text-[10px] text-emerald-deep/50 mt-1">Click or drag another image to replace</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-deep/[0.04] text-emerald-deep flex items-center justify-center group-hover:bg-emerald-deep/10 transition-colors">
                  <Upload size={22} className="text-emerald-deep/80" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-deep">
                    Drag & Drop your image here, or <span className="text-rose-gold hover:underline">browse</span>
                  </p>
                  <p className="text-[10px] text-emerald-deep/50 mt-1">Supports PNG, JPG, WEBP (Max 5MB)</p>
                </div>
              </div>
            )}
          </div>
          
          {isBase64 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 bg-rose-50 px-3.5 py-1.5 rounded-xl border border-rose-100 hover:bg-rose-100 transition-all"
              >
                <X size={12} /> Clear Selected Image (ছবি মুছুন)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex items-center">
          <input
            type="text"
            value={isBase64 ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white border-none rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-rose-gold transition-all"
            placeholder={placeholder}
            required={required}
          />
          <Link2 size={16} className="absolute left-4 text-emerald-deep/40" />
          
          {!isBase64 && value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-3 p-1 rounded-full bg-emerald-deep/5 text-emerald-deep/60 hover:bg-emerald-deep/10"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Render small URL image preview if url mode is selected and we have an external url */}
      {uploadMode === 'url' && value && !isBase64 && (
        <div className="pt-2 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-deep/10 shadow-sm bg-warm-beige shrink-0">
            <img
              src={value}
              alt="External URL preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Invalid+URL';
              }}
            />
          </div>
          <p className="text-[10px] text-emerald-deep/50 font-mono truncate max-w-xs">{value}</p>
        </div>
      )}
    </div>
  );
}
