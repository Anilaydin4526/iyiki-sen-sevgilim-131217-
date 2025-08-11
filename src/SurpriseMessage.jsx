import React, { useState } from 'react';
import './SurpriseMessage.css';

function SurpriseMessage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="surprise-container">
      <button className="surprise-btn" onClick={() => setOpen((v) => !v)}>
        {open ? 'Kapat ✖️' : 'Bir Sürprizim Var! 🎁'}
      </button>
      <div className={`surprise-message${open ? ' open' : ''}`}>
        <h3>💌 Sürpriz Mesaj</h3>
        <p>Seninle her günüm bir mucize. İyi ki varsın, iyi ki sevgilimsin! 💖</p>
        <p>Bu siteyi senin için hazırladım, her köşesinde sana olan sevgim saklı...</p>
      </div>
    </div>
  );
}

export default SurpriseMessage; 