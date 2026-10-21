import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  hasSale?: boolean;
  savings?: string | null;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  hasSale,
  savings,
}) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Image Frame */}
      <div
        className="relative bg-brand-surface rounded-brand-xl p-8 border border-brand-border aspect-square flex items-center justify-center overflow-hidden cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        {hasSale && savings && (
          <span className="absolute top-4 left-4 z-10 bg-brand-sale text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Save £{savings}
          </span>
        )}

        <img
          src={selectedImage}
          alt={productName}
          className={`max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 ${
            isZoomed ? 'scale-125' : 'scale-100 hover:scale-105'
          }`}
        />

        <div className="absolute bottom-3 right-3 text-[10px] text-brand-subtle bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
          {isZoomed ? 'Click to minimize' : 'Click to zoom'}
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedImage(img);
                setIsZoomed(false);
              }}
              className={`w-20 h-20 rounded-brand p-2 bg-brand-surface border transition-all shrink-0 flex items-center justify-center ${
                selectedImage === img
                  ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-white'
                  : 'border-brand-border hover:border-brand-muted opacity-70 hover:opacity-100'
              }`}
              aria-label={`View image thumbnail ${idx + 1}`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
