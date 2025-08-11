import React from "react";
import { useContent } from './utils/ContentContext';
import './Gallery.css';

function Gallery() {
  const { content } = useContent();
  const gallery = Array.isArray(content?.gallery) ? content.gallery : [];

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">Fotoğraf & Video Galerisi</h2>
      <div className="gallery-grid">
        {gallery.map((item, idx) => (
          <div className="gallery-item" key={idx}>
            {item.type === 'image' ? (
              <img src={item.src} alt={item.alt} className="gallery-img" />
            ) : (
              <video controls className="gallery-video">
                <source src={item.src} type="video/mp4" />
                Tarayıcınız video etiketini desteklemiyor.
              </video>
            )}
            {item.alt && <div className="gallery-alt">{item.alt}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery; 
