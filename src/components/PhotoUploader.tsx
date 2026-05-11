import { useState, useRef } from 'react';
import { Camera, Upload, Check, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, handleFirestoreError, OperationType } from '../firebase';
import { cn } from '../lib/utils';

interface PhotoUploaderProps {
  onUploadSuccess: (url: string) => void;
  folder: string;
}

export default function PhotoUploader({ onUploadSuccess, folder }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    if (!storage) {
        console.warn("Storage not initialized, using local preview only.");
        onUploadSuccess("mock-url-" + Date.now());
        return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      onUploadSuccess(url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Error al subir la foto. Inténtalo de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="neo-border bg-white aspect-square relative flex items-center justify-center overflow-hidden">
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            {uploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <Loader2 className="text-white animate-spin" size={48} />
                </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center text-black/20">
            <Camera size={64} strokeWidth={1} />
            <p className="font-bold uppercase text-[10px] mt-2 italic">Sin Captura</p>
          </div>
        )}
      </div>
      
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFile}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full neo-border bg-red-600 text-white py-4 font-black uppercase text-sm flex items-center justify-center space-x-2 active:scale-95 transition-all"
      >
        {uploading ? <Loader2 className="animate-spin" /> : <Camera />}
        <span>{preview ? "Cambiar Evidencia" : "Capturar Prueba"}</span>
      </button>
    </div>
  );
}
