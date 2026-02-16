import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { usePromptStore } from '../hooks/usePromptStore';
import { ImageAttachment } from '../types/index';

interface ImageUploaderProps {
  maxSize?: number; // in bytes, default 5MB
  onImageAdded?: (image: ImageAttachment) => void;
}

export function ImageUploader({ maxSize = 5 * 1024 * 1024, onImageAdded }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageAttachment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addContext } = usePromptStore();

  const processImage = useCallback(
    (file: File): Promise<ImageAttachment | null> => {
      return new Promise((resolve) => {
        if (!file.type.startsWith('image/')) {
          setError('Only image files are supported');
          resolve(null);
          return;
        }

        if (file.size > maxSize) {
          setError(`Image size exceeds ${maxSize / 1024 / 1024}MB limit`);
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          const image: ImageAttachment = {
            id: `img-${Date.now()}-${Math.random()}`,
            url: base64,
            name: file.name,
            size: file.size,
            mimeType: file.type,
            uploadedAt: new Date(),
          };

          // Get image dimensions
          const img = new Image();
          img.onload = () => {
            image.width = img.width;
            image.height = img.height;
            resolve(image);
          };
          img.src = base64;
        };
        reader.readAsDataURL(file);
      });
    },
    [maxSize]
  );

  const handleFiles = useCallback(
    async (files: FileList) => {
      setError(null);
      const imageFiles = Array.from(files);

      for (const file of imageFiles) {
        const image = await processImage(file);
        if (image) {
          setSelectedImages((prev) => [...prev, image]);

          // Add to context
          addContext({
            id: image.id,
            type: 'image',
            label: image.name,
            content: image.url,
            tokens: 750, // Approximate tokens for image
            metadata: {
              dimensions: `${image.width}x${image.height}`,
              size: image.size,
              mimeType: image.mimeType,
            },
          });

          onImageAdded?.(image);
        }
      }
    },
    [processImage, addContext, onImageAdded]
  );

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const removeImage = useCallback((id: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
            <Upload className="w-6 h-6 text-purple-600" />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Drag and drop images here or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-purple-600 hover:text-purple-700 underline"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              PNG, JPG, GIF up to {maxSize / 1024 / 1024}MB each
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {selectedImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">
            {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} added
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedImages.map((image) => (
              <div
                key={image.id}
                className="relative rounded-lg border border-gray-200 overflow-hidden group"
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-24 object-cover"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
