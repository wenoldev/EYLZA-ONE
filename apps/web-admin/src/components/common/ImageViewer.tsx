import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import clsx from 'clsx';

interface ImageViewerProps {
    src: string;
    alt: string;
    className?: string;
  }
  
const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt,className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={clsx("cursor-pointer hover:opacity-80 transition-opacity", className)}
        onClick={handleImageClick}
        width={100}
        height={100}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/noimage.png';
        }}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>

        <DialogContent className="max-h-[90vh] w-full h-full p-0">
        <DialogTitle>
          <div className='sr-only'>Image preview</div>
        </DialogTitle>
            <div className="relative w-full h-full">
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-contain"
                width={100}
                height={100}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/noimage.png';
                }}
              />
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageViewer;

