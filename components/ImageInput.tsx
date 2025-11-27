import React, { useState, useRef } from 'react';
import { urlToBase64, fileToBase64 } from '../services/gemini';
import { ImageData } from '../types';

interface ImageInputProps {
  onImageReady: (data: ImageData) => void;
  isLoading: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageReady, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        const previewUrl = URL.createObjectURL(file);
        onImageReady({ base64, mimeType: file.type, previewUrl });
      } catch (err) {
        console.error("Error reading file", err);
      }
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    
    setUrlError('');
    try {
      const { base64, mimeType } = await urlToBase64(urlInput);
      onImageReady({ base64, mimeType, previewUrl: urlInput });
    } catch (err: any) {
      setUrlError(err.message || "Invalid URL or CORS error");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
       if (!file.type.startsWith('image/')) {
        alert("Please drop an image file.");
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        const previewUrl = URL.createObjectURL(file);
        onImageReady({ base64, mimeType: file.type, previewUrl });
      } catch (err) {
        console.error("Error reading dropped file", err);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Tabs */}
      <div className="flex p-1 bg-zinc-900 rounded-xl mb-6 w-fit mx-auto border border-zinc-800">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'upload' 
              ? 'bg-zinc-800 text-white shadow-sm' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span className="font-arabic">رفع من الجهاز</span> (Upload)
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'url' 
              ? 'bg-zinc-800 text-white shadow-sm' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span className="font-arabic">رابط صورة</span> (URL)
        </button>
      </div>

      <div className="relative group">
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur ${isLoading ? 'animate-pulse' : ''}`}></div>
        
        <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {activeTab === 'upload' ? (
            <div 
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
                ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900'}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="w-16 h-16 mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-lg font-medium text-zinc-200 mb-1 font-arabic">اضغط للرفع أو اسحب الصورة هنا</p>
              <p className="text-sm text-zinc-500">Click to upload or drag and drop</p>
              <p className="text-xs text-zinc-600 mt-4">SVG, PNG, JPG or GIF</p>
            </div>
          ) : (
            <form onSubmit={handleUrlSubmit} className="flex flex-col gap-4">
               <label className="text-sm font-medium text-zinc-400 font-arabic">أدخل رابط الصورة المباشر</label>
               <div className="flex gap-2">
                 <input 
                    type="url" 
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                 />
                 <button 
                    type="submit"
                    disabled={isLoading || !urlInput}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors font-arabic"
                 >
                   تحليل
                 </button>
               </div>
               {urlError && (
                 <p className="text-red-400 text-sm mt-2 bg-red-400/10 p-2 rounded border border-red-400/20">{urlError}</p>
               )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageInput;