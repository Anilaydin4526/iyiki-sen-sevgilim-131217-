import React from 'react';
import { useContent } from './utils/ContentContext';

function ClosingCard() {
  const { content } = useContent();
  const message = content?.closingMessage || '';

  if (!message) return null;

  return (
    <div className="welcome-message">
      <center>
        <p className="main-title">
          {message.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </p>
      </center>
    </div>
  );
}

export default ClosingCard;


