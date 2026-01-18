import { useState } from 'react';
import './Gallery.css';

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
      alt: 'Delicious BBQ ribs',
      category: 'food'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop',
      alt: 'Smoked chicken',
      category: 'food'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      alt: 'Soul food spread',
      category: 'food'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&h=600&fit=crop',
      alt: 'BBQ combo plate',
      category: 'food'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop',
      alt: 'Pulled pork sandwich',
      category: 'food'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
      alt: 'Family feast',
      category: 'food'
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&h=600&fit=crop',
      alt: 'Smoked sausage',
      category: 'food'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop',
      alt: 'Banana pudding',
      category: 'dessert'
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&h=600&fit=crop',
      alt: 'Peach cobbler',
      category: 'dessert'
    },
    {
      id: 10,
      src: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop',
      alt: 'Golden fries',
      category: 'sides'
    },
    {
      id: 11,
      src: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=600&fit=crop',
      alt: 'Yo-Jo Beans',
      category: 'sides'
    },
    {
      id: 12,
      src: 'https://images.unsplash.com/photo-1625938145312-bc024a2ce06c?w=800&h=600&fit=crop',
      alt: 'Cole slaw',
      category: 'sides'
    }
  ];

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    }

    setSelectedImage(galleryImages[newIndex]);
  };

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
