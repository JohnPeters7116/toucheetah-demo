import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { findStopById } from '../data/audioStops';
import { useAppState } from '../state/AppState';
import { assetUrl } from '../lib/assets';

const SPEEDS: Array<{ rate: number; src: string; label: string }> = [
  { rate: 1.0, src: assetUrl('images/ui/speed-1x.png'), label: '1x speed' },
  { rate: 1.5, src: assetUrl('images/ui/speed-15x.png'), label: '1.5x speed' },
  { rate: 2.0, src: assetUrl('images/ui/speed-2x.png'), label: '2x speed' },
];

function fmt(t: number) {
  if (!Number.isFinite(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function AudioPlayer() {
  const { stopId } = useParams<{ stopId: string }>();
  const navigate = useNavigate();
  const stop = stopId ? findStopById(stopId) : undefined;
  const { markCompleted, setNowPlayingId } = useAppState();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(0);

  // Wire Media Session API for lock-screen / notification controls
  useEffect(() => {
    if (!stop) return;
    setNowPlayingId(stop.id);
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: stop.displayTitle,
        artist: 'Tour Cheetah London',
        album: 'Santander Cycles Tour',
        artwork: [
          { src: stop.photoSrc, sizes: '512x512', type: 'image/jpeg' },
        ],
      });

      const ms = navigator.mediaSession;
      ms.setActionHandler('play', () => audioRef.current?.play());
      ms.setActionHandler('pause', () => audioRef.current?.pause());
      ms.setActionHandler('seekbackward', (d) => {
        if (audioRef.current) audioRef.current.currentTime -= d.seekOffset ?? 30;
      });
      ms.setActionHandler('seekforward', (d) => {
        if (audioRef.current) audioRef.current.currentTime += d.seekOffset ?? 30;
      });
      ms.setActionHandler('seekto', (d) => {
        if (audioRef.current && d.seekTime !== undefined) {
          audioRef.current.currentTime = d.seekTime;
        }
      });
    }
    return () => {
      if ('mediaSession' in navigator) {
        const ms = navigator.mediaSession;
        ms.setActionHandler('play', null);
        ms.setActionHandler('pause', null);
        ms.setActionHandler('seekbackward', null);
        ms.setActionHandler('seekforward', null);
        ms.setActionHandler('seekto', null);
      }
    };
  }, [stop, setNowPlayingId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = SPEEDS[speedIdx].rate;
  }, [speedIdx]);

  if (!stop) {
    return (
      <div className="player-screen">
        <p style={{ padding: 24 }}>Stop not found.</p>
        <button onClick={() => navigate('/map')} type="button">Back to map</button>
      </div>
    );
  }

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const rewind30 = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 30);
  };

  const cycleSpeed = () => {
    setSpeedIdx((i) => (i + 1) % SPEEDS.length);
  };

  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setTime(audio.currentTime);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Number(e.target.value);
      setTime(audio.currentTime);
    }
  };

  const onEnded = () => {
    setPlaying(false);
    markCompleted(stop.id);
  };

  const speed = SPEEDS[speedIdx];

  return (
    <div className="player-screen">
      <button
        type="button"
        className="player-back"
        onClick={() => navigate(-1)}
        aria-label="Back to map"
      >
        ‹
      </button>

      <img src={stop.photoSrc} alt={stop.displayTitle} className="player-photo" />

      <h1 className="player-title">{stop.displayTitle}</h1>

      <audio
        ref={audioRef}
        src={stop.audioSrc}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration((e.target as HTMLAudioElement).duration)}
        onTimeUpdate={onTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={onEnded}
      />

      <div className="player-scrub">
        <span className="player-time">{fmt(time)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          onChange={onSeek}
          className="player-slider"
          aria-label="Seek"
        />
        <span className="player-time">{fmt(duration)}</span>
      </div>

      <div className="player-controls">
        <button type="button" className="player-btn-secondary" onClick={rewind30} aria-label="Rewind 30 seconds">
          <img src={assetUrl('images/ui/rewind.png')} alt="" />
        </button>
        <button
          type="button"
          className="player-btn-primary"
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          <img src={playing ? assetUrl('images/ui/pause.png') : assetUrl('images/ui/play.png')} alt="" />
        </button>
        <button
          type="button"
          className="player-btn-secondary"
          onClick={cycleSpeed}
          aria-label={`Change speed (currently ${speed.label})`}
        >
          <img src={speed.src} alt="" />
        </button>
      </div>

      {stop.stopInfo && (
        <div className="player-info">
          {stop.stopInfo.split('\n').map((line, i) =>
            line.endsWith(':') ? (
              <h3 key={i}>{line}</h3>
            ) : line === '' ? (
              <div key={i} className="player-info-spacer" />
            ) : (
              <p key={i}>{line}</p>
            )
          )}
        </div>
      )}
    </div>
  );
}
