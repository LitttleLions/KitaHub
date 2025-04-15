import React from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import ImageUploadInput from '@/components/ui/image-upload-input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageListInputProps {
  field: ControllerRenderProps<FieldValues, string>; // Expects field for string[] (URLs)
  bucketName: string;
  pathPrefix: string; // Required prefix (e.g., 'kitas/{id}/gallery')
  label: string;
  className?: string;
}

const ImageListInput: React.FC<ImageListInputProps> = ({
  field,
  bucketName,
  pathPrefix,
  label,
  className,
}) => {
  const currentImageList: string[] = Array.isArray(field.value) ? field.value : [];

  const handleUploadSuccess = (newUrl: string) => {
    if (newUrl && !currentImageList.includes(newUrl)) {
      field.onChange([...currentImageList, newUrl]);
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    // Note: This only removes the URL from the form state.
    // It does NOT delete the file from Supabase Storage.
    field.onChange(currentImageList.filter(url => url !== urlToRemove));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>

      {/* Display existing images */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {currentImageList.map((url, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={url}
              alt={`Galeriebild ${index + 1}`}
              className="h-full w-full rounded object-cover border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(url)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
         {/* Placeholder for adding new image */}
         <div className="aspect-square">
            {/* We use a separate ImageUploadInput just for adding new images */}
            <ImageUploadInput
                 // Pass dummy/empty values for props not needed for the adder
                 currentImageUrl={null}
                 onUploadSuccess={handleUploadSuccess} // Call our handler on success
                 bucketName={bucketName}
                 pathPrefix={pathPrefix}
                 // onUploadSuccess is removed from ImageUploadInput props, logic is handled here
                 label=""
                 className="h-full w-full"
            />
         </div>
      </div>
       {currentImageList.length === 0 && <p className="text-sm text-muted-foreground">Keine Bilder in der Galerie vorhanden.</p>}
       <p className="text-sm text-muted-foreground">Klicken Sie auf das Upload-Symbol, um ein neues Bild hinzuzufügen.</p>
    </div>
  );
};

export default ImageListInput;
