import React, { useState } from "react";
import ParallaxBanner from "./ParallaxBanner";
import AdminPanel from "./AdminPanel";
import Timeline from "./Timeline";
import Gallery from "./Gallery";
import MusicPlayer from "./MusicPlayer";
import LoveQuiz from "./LoveQuiz";
import LoveChatbot from "./LoveChatbot";
import { useContent } from "./utils/ContentContext";
import "./App.css";
import ClosingCard from "./ClosingCard";

function App() {
  const [admin, setAdmin] = useState(false);
  const { content, loading } = useContent();

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="main-bg">
      <div className="header-center">
        <center><div className="heart-animation">❤️</div></center>
        <center><h1 className="main-title">{content?.title || "İyiki Sen Sevgilim"}</h1></center>
        <center>
          <p className="subtitle">
            {content?.description || "Birlikte geçirdiğimiz her an, bu sitede sonsuza dek yaşayacak..."}
          </p>
        </center>
      </div>
      <div className="welcome-message">
        <center>
          <p className="main-title">
            {(content?.welcomeMessage || "Hoş geldin Gülüm…").split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
        </center>
      </div>
      <ParallaxBanner />
      {admin ? (
        <AdminPanel />
      ) : (
        <>
          <Timeline />
          <Gallery />
          <MusicPlayer />
          <LoveQuiz />
          <LoveChatbot />
          <ClosingCard />
        </>
      )}
      <div style={{ textAlign: 'center', padding: '20px', marginTop: '50px' }}>
        <button
          className="header-admin-btn"
          onClick={() => setAdmin((a) => !a)}
        >
          {admin ? "Siteye Dön" : "Yönetici Girişi"}
        </button>
      </div>
    </div>
  );
}

export default App; 
