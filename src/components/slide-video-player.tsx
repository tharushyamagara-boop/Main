'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, Maximize, Minimize } from 'lucide-react';

interface SlideVideoPlayerProps {
  src: string;
  isActive?: boolean;
  title?: string;
}

export function SlideVideoPlayer({ src, isActive = true, title }: SlideVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.85);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync muted and volume state with the actual video DOM element
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
    videoRef.current.volume = isMuted ? 0 : volume;
  }, [isMuted, volume]);

  // Handle active slide state (pause/mute when slide is swiped away)
  useEffect(() => {
    if (!videoRef.current) return;
    if (!isActive) {
      // Automatically mute and pause if this slide is no longer active in the carousel
      videoRef.current.muted = true;
      setIsMuted(true);
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(false);
    } else {
      // Resume playback when slide becomes active
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay with audio was blocked or interrupted
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    }
  }, [isActive]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Toggle Mute / Unmute
  const toggleMute = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.muted = false;
      const targetVolume = volume > 0 ? volume : 0.85;
      videoRef.current.volume = targetVolume;
      setVolume(targetVolume);
      setIsMuted(false);
      // Ensure it is playing
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Toggle Play / Pause
  const togglePlayPause = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Handle Volume Change
  const handleVolumeChange = useCallback((newVol: number, e?: React.ChangeEvent<HTMLInputElement>) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

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
  }, []);

  // Toggle Fullscreen
  const toggleFullscreen = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Tapping the container toggles the controls overlay
  const handleContainerTap = () => {
    setShowControls(prev => !prev);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerTap}
      className="relative w-full h-full cursor-pointer select-none group overflow-hidden bg-black flex items-center justify-center"
      aria-label="Video slide - tap to toggle audio and playback controls"
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
      />

      {/* Persistent Audio Badge (Shown when controls are hidden) */}
      {!showControls && (
        <div className="absolute bottom-3 left-3 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // Tapping this badge directly reveals controls and uninhibited toggle
              if (isMuted) {
                toggleMute();
                setShowControls(true);
              } else {
                setShowControls(prev => !prev);
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold shadow-lg border border-white/20 transition-all transform hover:scale-105 active:scale-95"
            title={isMuted ? "Tap to unmute video" : "Tap for audio controls"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="tracking-wide">Tap to Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="tracking-wide">Sound On</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Quick Tap Hint Indicator (top-left) */}
      {!showControls && (
        <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 sm:transition-opacity duration-200 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[11px] font-medium text-slate-200 border border-white/10">
            Tap video for controls
          </span>
        </div>
      )}

      {/* Interactive Controls Overlay (Revealed on Tap, Hidden on Tap Again) */}
      {showControls && (
        <div
          className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px] flex flex-col justify-between p-3 sm:p-5 transition-opacity duration-200"
          onClick={handleContainerTap}
        >
          {/* Top Bar: Status and Dismiss Tip */}
          <div className="flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                isMuted
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                  : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
              }`}>
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                {isMuted ? 'Muted' : `Volume: ${Math.round(volume * 100)}%`}
              </span>
            </div>

            <span className="px-3 py-1 rounded-full bg-black/60 border border-white/15 text-slate-300 text-[11px] font-medium shadow-sm">
              Tap video again to hide
            </span>
          </div>

          {/* Center Action: Big Unmute / Play Prompt if Muted */}
          {isMuted && (
            <div className="flex justify-center pointer-events-auto">
              <button
                type="button"
                onClick={toggleMute}
                className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-blue-600/90 hover:bg-blue-600 active:scale-95 text-white font-bold text-sm shadow-2xl border border-blue-400/50 backdrop-blur-md transition-all transform hover:scale-105"
              >
                <Volume2 className="w-5 h-5 text-amber-300" />
                <span>Tap Here to Unmute Audio</span>
              </button>
            </div>
          )}

          {/* Bottom Bar: Complete Audio & Playback Control Bar */}
          <div
            className="w-full max-w-xl mx-auto bg-slate-950/85 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex items-center justify-between gap-3 text-white pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Play / Pause Toggle */}
            <button
              type="button"
              onClick={togglePlayPause}
              className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-colors"
              title={isPlaying ? "Pause video" : "Play video"}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />}
            </button>

            {/* Mute / Unmute Toggle Button */}
            <button
              type="button"
              onClick={toggleMute}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                isMuted
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 hover:bg-amber-500/40'
                  : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 hover:bg-emerald-500/40'
              }`}
              title={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-300" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-300" />
                  <span>Mute</span>
                </>
              )}
            </button>

            {/* Volume Range Slider */}
            <div className="flex-1 flex items-center gap-2 min-w-[80px] max-w-[160px] sm:max-w-[200px]">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value), e)}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#3b66b0] focus:outline-none"
                title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
              />
              <span className="text-[11px] font-mono font-medium text-slate-300 w-8 text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
