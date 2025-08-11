import React, { useEffect, useRef, useState } from "react";
import { useContent } from './utils/ContentContext';
import './MusicPlayer.css';

function MusicPlayer() {
  const { content } = useContent();
  const playlist = Array.isArray(content?.music) ? content.music : [];
  const [current, setCurrent] = useState(0);
  const audioRef = useRef(null);
  const youtubeRef = useRef(null);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // İlk yüklemede sessiz başlat

  const playNext = () => setCurrent((prev) => (prev + 1) % playlist.length);
  const playPrev = () => setCurrent((prev) => (prev - 1 + playlist.length) % playlist.length);

  if (playlist.length === 0) return null;

  // Sayfa açıldığında veya şarkı değiştiğinde otomatik oynatmayı dene
  useEffect(() => {
    const isYouTube = Boolean(playlist[current].youtubeUrl);
    if (!isYouTube && audioRef.current) {
      const tryPlay = async () => {
        try {
          // Sessiz başlat, böylece hemen oyun başlar
          audioRef.current.muted = true;
          setIsMuted(true);
          await audioRef.current.play();
          setNeedsInteraction(false);
          // Bazı tarayıcılarda mümkünse kısa süre sonra sesi açmayı dene
          setTimeout(() => {
            try {
              audioRef.current.muted = false;
              setIsMuted(false);
            } catch (_) {}
          }, 300);
        } catch (_err) {
          // Hâlâ engelleniyorsa kullanıcıdan etkileşim iste
          setNeedsInteraction(true);
        }
      };
      tryPlay();
    }
  }, [current, playlist]);

  // İlk kullanıcı etkileşiminde çalmayı dene (tarayıcı engellerine karşı)
  useEffect(() => {
    const isYouTube = Boolean(playlist[current]?.youtubeUrl);
    let triggered = false;
    const handler = async () => {
      if (triggered) return;
      triggered = true;
      try {
        if (!isYouTube && audioRef.current) {
          audioRef.current.muted = false;
          setIsMuted(false);
          await audioRef.current.play();
          setNeedsInteraction(false);
        } else if (isYouTube && youtubeRef.current) {
          youtubeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
            '*'
          );
          youtubeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
            '*'
          );
          setNeedsInteraction(false);
          setIsMuted(false);
        }
      } catch (_) {}
      window.removeEventListener('pointerdown', handler);
      window.removeEventListener('click', handler);
      window.removeEventListener('touchstart', handler);
      window.removeEventListener('keydown', handler);
    };
    window.addEventListener('pointerdown', handler, { once: true });
    window.addEventListener('click', handler, { once: true });
    window.addEventListener('touchstart', handler, { once: true });
    window.addEventListener('mousemove', handler, { once: true });
    window.addEventListener('wheel', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handler);
      window.removeEventListener('click', handler);
      window.removeEventListener('touchstart', handler);
      window.removeEventListener('mousemove', handler);
      window.removeEventListener('wheel', handler);
      window.removeEventListener('keydown', handler);
    };
  }, [current, playlist]);

  // Sekme görünür olduğunda tekrar dene
  useEffect(() => {
    const onVis = async () => {
      if (document.visibilityState !== 'visible') return;
      const isYouTube = Boolean(playlist[current]?.youtubeUrl);
      try {
        if (!isYouTube && audioRef.current && audioRef.current.paused) {
          await audioRef.current.play();
          setNeedsInteraction(false);
        } else if (isYouTube && youtubeRef.current) {
          youtubeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
            '*'
          );
        }
      } catch (_) {}
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [current, playlist]);

  const handleUserStart = async () => {
    const isYouTube = Boolean(playlist[current].youtubeUrl);
    if (!isYouTube && audioRef.current) {
      try {
        audioRef.current.muted = false;
        await audioRef.current.play();
        setNeedsInteraction(false);
        setIsMuted(false);
      } catch (_err) {
        // noop
      }
    } else if (isYouTube && youtubeRef.current) {
      // YouTube iframe'i için play komutu gönder
      try {
        youtubeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
        setNeedsInteraction(false);
      } catch (_e) {}
    }
  };

  const handleUnmute = async () => {
    const isYouTube = Boolean(playlist[current].youtubeUrl);
    if (!isYouTube && audioRef.current) {
      try {
        audioRef.current.muted = false;
        await audioRef.current.play();
        setIsMuted(false);
      } catch (_err) {
        // noop
      }
    } else if (isYouTube && youtubeRef.current) {
      try {
        youtubeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
          '*'
        );
        youtubeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
        setIsMuted(false);
      } catch (_e) {}
    }
  };

  return (
    <div className="music-player-container">
      <h2 className="music-title">Müzik Çalar</h2>
      <div className="music-info">
        <span className="music-song">{playlist[current].title}</span>
        <span className="music-artist">{playlist[current].artist}</span>
      </div>
      {playlist[current].youtubeUrl ? (
        <div className="music-youtube-embed">
          <iframe
            ref={youtubeRef}
            width="320"
            height="180"
            src={`https://www.youtube.com/embed/${playlist[current].youtubeUrl.split('v=')[1]?.split('&')[0] || ''}?autoplay=1&rel=0&playsinline=1&mute=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <audio
          ref={audioRef}
          src={playlist[current].src}
          controls
          autoPlay
          preload="auto"
          muted={isMuted}
          defaultMuted
          playsInline
          onEnded={playNext}
          onCanPlay={async () => {
            try {
              if (audioRef.current?.paused) {
                await audioRef.current.play();
              }
            } catch (_) {}
          }}
          onLoadedMetadata={async () => {
            try {
              if (audioRef.current?.paused) {
                await audioRef.current.play();
              }
            } catch (_) {}
          }}
          onPlay={() => setNeedsInteraction(false)}
          className="music-audio"
        />
      )}
      <div className="music-controls">
        <button onClick={playPrev}>&lt;&lt; Önceki</button>
        <button onClick={playNext}>Sonraki &gt;&gt;</button>
      </div>
      {(needsInteraction || isMuted) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '20px 28px',
              borderRadius: 12,
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 12 }}>
              Müzik başlatılmaya hazır. Dokun veya tıkla; sesli olarak başlasın.
            </div>
            <button
              onClick={() => {
                handleUnmute();
                handleUserStart();
                setIsMuted(false);
                setNeedsInteraction(false);
              }}
              style={{
                fontSize: 16,
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#b31217',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Sesi Aç ve Başlat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer; 
