/**
 * Serviço centralizado de Storage do Supabase
 * Upload, download e gerenciamento de arquivos
 */

import { supabase } from '@/integrations/supabase/client';

export type BucketName = 'logos' | 'portfolio' | 'servicos';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export interface UploadResult {
  url: string;
  path: string;
}

export const storageService = {
  /**
   * Valida arquivo antes do upload
   */
  validateFile(file: File, bucket: BucketName): string | null {
    if (file.size > MAX_FILE_SIZE) {
      return `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }

    const allowedTypes = bucket === 'logos' 
      ? ALLOWED_IMAGE_TYPES 
      : [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

    if (!allowedTypes.includes(file.type)) {
      return `Tipo de arquivo não permitido: ${file.type}`;
    }

    return null;
  },

  /**
   * Faz upload de arquivo para o bucket especificado
   */
  async upload(file: File, bucket: BucketName): Promise<UploadResult | null> {
    const validationError = this.validateFile(file, bucket);
    if (validationError) {
      console.error('Erro de validação:', validationError);
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Erro no upload:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  },

  /**
   * Remove arquivo do bucket
   */
  async delete(path: string, bucket: BucketName): Promise<boolean> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Erro ao deletar arquivo:', error);
      return false;
    }

    return true;
  },

  /**
   * Obtém URL pública de um arquivo
   */
  getPublicUrl(path: string, bucket: BucketName): string {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl;
  },

  /**
   * Determina se arquivo é imagem ou vídeo
   */
  getFileType(file: File): 'imagem' | 'video' {
    return file.type.startsWith('video/') ? 'video' : 'imagem';
  }
};
