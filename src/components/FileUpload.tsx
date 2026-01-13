import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, Video, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  currentUrl?: string | null;
  accept?: 'image' | 'video' | 'both';
  className?: string;
  disabled?: boolean;
  uploading?: boolean;
  progress?: number;
}

const ACCEPT_MAP = {
  image: 'image/jpeg,image/png,image/webp',
  video: 'video/mp4,video/webm',
  both: 'image/jpeg,image/png,image/webp,video/mp4,video/webm',
};

export const FileUpload = ({
  onFileSelect,
  onRemove,
  currentUrl,
  accept = 'image',
  className,
  disabled = false,
  uploading = false,
  progress = 0,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'video'>('image');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const isVideo = file.type.startsWith('video/');
    setPreviewType(isVideo ? 'video' : 'image');
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled || uploading) return;
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [disabled, uploading, handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setIsDragging(true);
    }
  }, [disabled, uploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onRemove?.();
  }, [previewUrl, onRemove]);

  const displayUrl = previewUrl || currentUrl;
  const isVideo = previewType === 'video' || currentUrl?.match(/\.(mp4|webm)$/i);

  const formatLabels = {
    image: 'JPEG, PNG, WebP',
    video: 'MP4, WebM',
    both: 'JPEG, PNG, WebP, MP4, WebM',
  };

  if (displayUrl) {
    return (
      <div className={cn("relative rounded-xl border-2 border-primary/30 bg-secondary overflow-hidden", className)}>
        {uploading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-gold transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
        ) : (
          <>
            {isVideo ? (
              <video 
                src={displayUrl} 
                className="w-full h-40 object-cover"
                controls={false}
              />
            ) : (
              <img 
                src={displayUrl} 
                alt="Preview" 
                className="w-full h-40 object-cover"
              />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full h-8 w-8"
              disabled={disabled}
            >
              <X size={16} />
            </Button>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
              {isVideo ? <Video size={14} className="text-primary" /> : <Image size={14} className="text-primary" />}
              <span className="text-xs text-foreground">
                {isVideo ? 'Vídeo' : 'Imagem'}
              </span>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && !uploading && inputRef.current?.click()}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer min-h-[160px]",
        isDragging 
          ? "border-primary bg-primary/10" 
          : "border-primary/30 hover:border-primary/60 bg-secondary/50",
        (disabled || uploading) && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MAP[accept]}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || uploading}
      />
      
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
        <Upload className="h-6 w-6 text-primary" />
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          Arraste ou clique para selecionar
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatLabels[accept]} • Máx. 20MB
        </p>
      </div>
    </div>
  );
};
