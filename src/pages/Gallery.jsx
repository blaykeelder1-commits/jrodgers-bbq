import { useState, useEffect, useCallback } from 'react';
import usePageTitle from '../hooks/usePageTitle';
import './Gallery.css';

const galleryImages = [
  { id: 1, src: '/images/menu/half-slab-ribs.jpg', alt: 'Our famous slow-smoked half slab ribs', category: 'bbq' },
  { id: 2, src: '/images/menu/combo-dinner.jpg', alt: 'BBQ combo dinner plate', category: 'bbq' },
  { id: 3, src: '/images/menu/fried-ribs.jpg', alt: 'Crispy fried ribs', category: 'bbq' },
  { id: 4, src: '/images/menu/pulled-pork.jpg', alt: 'Tender pulled pork', category: 'bbq' },
  { id: 5, src: '/images/menu/sausage-sandwich.jpg', alt: 'Smoked sausage sandwich', category: 'bbq' },
  { id: 6, src: '/images/menu/yo-jo-beans.jpg', alt: 'Our famous Yo-Jo Beans', category: 'sides' },
  { id: 7, src: '/images/menu/mac-and-cheese.jpg', alt: 'Creamy mac and cheese', category: 'sides' },
  { id: 8, src: '/images/menu/cole-slaw.jpg', alt: 'Fresh homemade cole slaw', category: 'sides' },
  { id: 9, src: '/images/menu/potato-salad.jpg', alt: 'Southern-style potato salad', category: 'sides' },
  { id: 10, src: '/images/menu/collard-greens.jpg', alt: 'Collard greens', category: 'sides' },
  { id: 11, src: '/images/menu/fries.jpg', alt: 'Golden crispy fries', category: 'sides' },
  { id: 12, src: '/images/menu/cornbread-dressing.jpg', alt: 'Cornbread dressing', category: 'sides' },
  { id: 13, src: '/images/menu/banana-pudding.jpg', alt: 'Homemade banana pudding', category: 'desserts' },
  { id: 14, src: '/images/menu/peach-cobbler.jpg', alt: 'Warm peach cobbler', category: 'desserts' },
  { id: 15, src: '/images/menu/pound-cake-slice.jpg', alt: 'Homemade pound cake slice', category: 'desserts' },
  { id: 16, src: '/images/menu/pound-cake-whole.jpg', alt: 'Whole pound cake', category: 'desserts' },
  { id: 17, src: '/images/menu/sweet-tea.jpg', alt: 'Southern sweet tea', category: 'drinks' },
  { id: 18, src: '/images/menu/header.jpg', alt: 'J Rodgers BBQ & Soul Food', category: 'restaurant' },
];

function Gallery() {
  usePageTitle('Gallery');
  const [selectedImage, setSelectedImage] = useState(null);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const navigateImage = useCallback((direction) => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    }

    setSelectedImage(galleryImages[newIndex]);
  }, [selectedImage]);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateImage('prev');
        if (e.key === 'ArrowRight') navigateImage('next');
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedImage, closeLightbox, navigateImage]);

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div className="container">
          <h1>Gallery</h1>
          <p>A taste of what awaits you at J Rodgers</p>
        </div>
      </div>

      <div className="gallery-content">
        <div className="container">
          <div className="gallery-grid">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="gallery-item"
                onClick={() => openLightbox(image)}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(image)}
                tabIndex={0}
                role="button"
                aria-label={`View ${image.alt}`}
              >
                <img src={image.src} alt={image.alt} loading="lazy" />
                <div className="gallery-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <button
            className="lightbox-nav prev"
            onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.alt} />
            <p className="lightbox-caption">{selectedImage.alt}</p>
          </div>

          <button
            className="lightbox-nav next"
            onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default Gallery;
