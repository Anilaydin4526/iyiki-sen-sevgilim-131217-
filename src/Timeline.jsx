import React from "react";
import { useContent } from './utils/ContentContext';
import './Timeline.css';

function Timeline() {
  const { content } = useContent();
  const timeline = Array.isArray(content?.timeline) ? content.timeline : [];

  return (
    <div className="timeline-container">
      <h2 className="timeline-title">Zaman Tünelimiz</h2>
      <div className="timeline-list">
        {timeline.map((item, idx) => (
          <div className="timeline-item" key={idx}>
            <div className="timeline-date">{item.date}</div>
            {item.media && item.media.src ? (
              item.media.type === 'video' ? (
                <video className="timeline-img" controls>
                  <source src={item.media.src} type="video/mp4" />
                  Tarayıcınız video etiketini desteklemiyor.
                </video>
              ) : (
                <img className="timeline-img" src={item.media.src} alt={item.title} />
              )
            ) : (
              <img className="timeline-img" src={item.image} alt={item.title} />
            )}
            <div className="timeline-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline; 
