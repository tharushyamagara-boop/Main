'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, Maximize, Minimize } from 'lucide-react';

interface SlideVideoPlayerProps {
  src: string;
  isActive?: boolean;
  title?: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function SlideVideoPlayer({ src, isActive = true }: SlideVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.85);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Synchronize muted and volume with the HTML5 video element
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
    videoRef.current.volume = isMuted ? 0 : volume;
  }, [isMuted, volume]);

  // Auto-hide controls after 5 seconds of video playback without interaction
  const resetAutoHideTimer = useCallback(() => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }

    if (showControls && isPlaying) {
      autoHideTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
  }, [showControls, isPlaying]);

  useEffect(() => {
    resetAutoHideTimer();
    return () => {
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }
    };
  }, [resetAutoHideTimer]);

  // Reveal controls on user activity (mouse move, touch)
  const handleActivity = useCallback(() => {
    setShowControls(true);
    resetAutoHideTimer();
  }, [resetAutoHideTimer]);

  // Carousel slide synchronization
  useEffect(() => {
    if (!videoRef.current) return;

    if (!isActive) {
      videoRef.current.muted = true;
      setIsMuted(true);
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(false);
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    } else {
      setShowControls(true);
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    }
  }, [isActive]);

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Clicking anywhere on the video background toggles play / pause
  const handleVideoClick = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setShowControls(true);
      }).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  // Toggle Play / Pause from controls
  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleVideoClick();
  };

  // Toggle Mute / Unmute
  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    handleActivity();

    if (isMuted) {
      videoRef.current.muted = false;
      const targetVolume = volume > 0 ? volume : 0.85;
      videoRef.current.volume = targetVolume;
      setVolume(targetVolume);
      setIsMuted(false);
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  }, [isMuted, volume, handleActivity]);

  // Handle Volume Change
  const handleVolumeChange = useCallback((newVol: number, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    handleActivity();

    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    if (clamped === 0) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else {
      videoRef.current.muted = false;
      videoRef.current.volume = clamped;
      setIsMuted(false);
    }
  }, [handleActivity]);

  // Handle Seeking
  const handleSeek = (newTime: number, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    handleActivity();
  };

  // Fullscreen Toggle
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleVideoClick}
      onMouseMove={handleActivity}
      onTouchStart={handleActivity}
      className="relative w-full h-full cursor-pointer select-none overflow-hidden bg-black flex items-center justify-center group"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover object-center pointer-events-none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        onDurationChange={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
      />

      {/* Paused State Center Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 z-10 bg-black/30 flex items-center justify-center pointer-events-none transition-opacity duration-200">
          <div className="p-4 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-2xl">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>
      )}

      {/* Audio Playback Progress Bar, Timestamp & Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 z-20 pt-8 pb-3 px-3 sm:px-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex flex-col gap-2 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Playback Progress Bar (Scrubbable) */}
        <div className="relative w-full flex items-center group/scrubber cursor-pointer py-1">
          <div className="relative w-full h-1 group-hover/scrubber:h-2 bg-white/25 rounded-full overflow-hidden transition-all">
            <div
              className="h-full bg-[#3b66b0] rounded-full transition-all duration-75"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value), e)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Seek playback progress"
          />
        </div>

        {/* Controls Row: Play/Pause, Audio Mute/Unmute, Volume Slider, Timestamp, Fullscreen */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              onClick={togglePlayPause}
              className="p-1.5 rounded-lg hover:bg-white/20 active:scale-95 text-white transition-colors"
              aria-label={isPlaying ? "Pause video" : "Play video"}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Audio Mute / Unmute Button (starts with muted icon) */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-lg hover:bg-white/20 active:scale-95 text-white transition-colors"
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-amber-300" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Inline Volume Slider */}
            {!isMuted && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value), e)}
                className="w-16 sm:w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white transition-opacity"
                title={`Volume: ${Math.round(volume * 100)}%`}
              />
            )}

            {/* Timestamp (e.g. 0:14 / 1:23) */}
            <div className="font-mono text-[11px] sm:text-xs text-slate-200 select-none pl-1 flex items-center gap-1">
              <span className="font-semibold text-white">{formatTime(currentTime)}</span>
              <span className="text-slate-400">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg hover:bg-white/20 active:scale-95 text-white transition-colors"
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
