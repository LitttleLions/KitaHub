import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud, XCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast'; // Assuming use-toast is still used, if not remove this line
// import { toast } from "sonner"; // Or use sonner if preferred
import { cn } from '@/lib/utils';

interface ImageUploadInputProps {
  bucketName: string;
  pathPrefix?: string;
  currentImageUrl?: string | null; // Use prop for current value
  onUploadSuccess: (url: string) => void; // Callback on success
  label?: string;
  className?: string;
}

const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  bucketName,
  pathPrefix = '',
  currentImageUrl, // Receive current URL via prop
  onUploadSuccess, // Receive callback via prop
  label = 'Bild hochladen',
  className,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Initialize internalPreview directly from currentImageUrl. No need for useEffect sync after upload.
  const [internalPreview, setInternalPreview] = useState<string | null>(currentImageUrl || null);
  const [fileKey, setFileKey] = useState(Date.now()); // Used to reset the file input

  // Update internal preview if the prop changes externally (e.g., form reset)
  // Only update if not currently uploading to avoid overriding temporary preview
  useEffect(() => {
    if (!uploading) {
      setInternalPreview(currentImageUrl || null);
    }
  }, [currentImageUrl]); // Depend only on currentImageUrl

  // Determine the key for the image element to force re-render on change if needed
  const imageKey = internalPreview || 'no-image-placeholder';

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const tempUrl = URL.createObjectURL(file);
    setInternalPreview(tempUrl); // Show temporary preview

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = pathPrefix ? `${pathPrefix.replace(/\/$/, '')}/${fileName}` : fileName;

    try {
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
           cacheControl: '3600',
           upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Konnte öffentliche URL nicht abrufen.');
      }

      console.log('Upload successful, public URL:', urlData.publicUrl);
      onUploadSuccess(urlData.publicUrl); // Call the callback with the new URL
      setInternalPreview(urlData.publicUrl); // Directly set internal preview to the final URL
      toast({
        title: "Upload erfolgreich",
        description: "Bild wurde hochgeladen.",
         action: <CheckCircle className="text-green-500" />,
       });

    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(`Upload fehlgeschlagen: ${err.message || 'Unbekannter Fehler'}`);
      // Revert internal preview to the state before this upload attempt on error
      setInternalPreview(currentImageUrl || null);
      toast({
        title: "Upload fehlgeschlagen",
        description: err.message || 'Bitte versuchen Sie es erneut.',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input so the same file can be selected again if needed
      setFileKey(Date.now());
    }
  // Remove currentImageUrl from dependency array as useEffect handles external changes
  }, [bucketName, pathPrefix, onUploadSuccess]);

  const handleRemoveImage = () => {
     onUploadSuccess(''); // Clear the URL in the parent form
     setError(null);
     setInternalPreview(null); // Clear internal preview immediately
     setFileKey(Date.now());
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
      <div className="flex items-center gap-4">
         {/* Use internalPreview for display */}
         {internalPreview ? (
           <div className="relative group">
             <img
               src={internalPreview}
               alt="Vorschau"
               className="h-20 w-20 rounded object-cover border"
               key={imageKey}
             />
             <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemoveImage}
                disabled={uploading}
                type="button"
              >
                <XCircle className="h-4 w-4" />
              </Button>
          </div>
        ) : (
           <div className="h-20 w-20 rounded border border-dashed flex items-center justify-center bg-muted">
             {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
             ) : (
                <UploadCloud className="h-6 w-6 text-muted-foreground" />
             )}
           </div>
        )}
        <div className="flex-1">
          <Input
            key={fileKey}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
};

export default ImageUploadInput;
