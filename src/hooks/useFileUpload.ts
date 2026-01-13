import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type BucketName = 'logos' | 'servicos' | 'portfolio';

interface UploadResult {
  url: string;
  path: string;
}

interface UseFileUploadReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadFile: (file: File, bucket: BucketName) => Promise<UploadResult | null>;
  deleteFile: (path: string, bucket: BucketName) => Promise<boolean>;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const useFileUpload = (): UseFileUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File, bucket: BucketName): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'Arquivo muito grande. Máximo: 20MB';
    }

    const allowedTypes = bucket === 'portfolio' 
      ? [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
      : ALLOWED_IMAGE_TYPES;

    if (!allowedTypes.includes(file.type)) {
      const formats = bucket === 'portfolio' 
        ? 'JPEG, PNG, WebP, MP4, WebM'
        : 'JPEG, PNG, WebP';
      return `Formato inválido. Use: ${formats}`;
    }

    return null;
  };

  const uploadFile = async (file: File, bucket: BucketName): Promise<UploadResult | null> => {
    setError(null);
    setProgress(0);

    const validationError = validateFile(file, bucket);
    if (validationError) {
      setError(validationError);
      return null;
    }

    setUploading(true);

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Simular progresso (Supabase não fornece progresso real)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      clearInterval(progressInterval);

      if (uploadError) {
        throw uploadError;
      }

      setProgress(100);

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        url: publicUrl,
        path: data.path,
      };
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (path: string, bucket: BucketName): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (deleteError) {
        throw deleteError;
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar arquivo');
      return false;
    }
  };

  return {
    uploading,
    progress,
    error,
    uploadFile,
    deleteFile,
  };
};

export const getFileType = (file: File): 'imagem' | 'video' => {
  return ALLOWED_VIDEO_TYPES.includes(file.type) ? 'video' : 'imagem';
};
