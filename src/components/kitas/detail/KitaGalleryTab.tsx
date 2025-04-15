
import React from 'react';
import { motion } from 'framer-motion';

interface KitaGalleryTabProps {
  galleryImages: string[];
  kitaName: string;
}

const KitaGalleryTab: React.FC<KitaGalleryTabProps> = ({ galleryImages, kitaName }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Einblicke in unsere Kita</h2>
      {galleryImages && galleryImages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div 
              key={index} 
              className="aspect-square rounded-lg overflow-hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={image} 
                alt={`${kitaName} Einblick ${index + 1}`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Keine Galeriebilder vorhanden.</p>
        </div>
      )}
    </>
  );
};

export default KitaGalleryTab;
