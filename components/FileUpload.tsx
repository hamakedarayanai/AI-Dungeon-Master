
import React, { useRef } from 'react';
import { UploadedImage } from '../types';

interface FileUploadProps {
  onImageUpload: (image: UploadedImage | null) => void;
  uploadedImage: UploadedImage | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onImageUpload, uploadedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onImageUpload({ base64: base64String, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    onImageUpload(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Optional: Upload an image for inspiration
      </label>
      <div className="mt-2 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
        {!uploadedImage ? (
            <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-slate-500">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-cyan-400 hover:text-cyan-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 focus-within:ring-cyan-500 px-1">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                </label>
                <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-slate-600">PNG, JPG, GIF up to 10MB</p>
            </div>
        ) : (
            <div className="relative group">
                <img src={`data:${uploadedImage.mimeType};base64,${uploadedImage.base64}`} alt="Preview" className="h-32 w-auto rounded-md shadow-lg" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleRemoveImage} className="bg-rose-600 text-white rounded-full p-2 hover:bg-rose-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
