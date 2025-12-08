import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

const MusicPlayer = ({ audioList = [] }) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef(null);

  const currentSong = audioList[currentTrack] || {};

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentTrack((prev) => (prev + 1) % audioList.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentTrack((prev) => (prev - 1 + audioList.length) % audioList.length);
  };

  const handleEnded = () => {
    setCurrentTrack((prev) => (prev + 1) % audioList.length);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  }, [currentTrack]);

  if (audioList.length === 0) return null;

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={currentSong.musicSrc}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* 迷你播放器 */}
      <div className="mini-player-wrapper">
        <button className="nav-btn prev" onClick={handlePrev}>&#9664;</button>
        
        <div 
          className={`mini-player ${isPlaying ? 'playing' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="mini-cover">
            <img src={currentSong.cover} alt={currentSong.name} />
          </div>
        </div>
        
        <button className="nav-btn next" onClick={handleNext}>&#9654;</button>
      </div>
      
      {/* 播放/暂停按钮 */}
      <button className="play-pause-btn" onClick={togglePlay}>
        {isPlaying ? '❚❚' : '▶'}
      </button>

      {/* 展开面板 - 播放列表 */}
      {isExpanded && (
        <div className="player-panel">
          <div className="panel-header">
            <span className="now-playing">正在播放</span>
            <span className="song-title">{currentSong.name}</span>
          </div>
          <div className="playlist">
            {audioList.map((track, index) => (
              <div
                key={index}
                className={`track ${index === currentTrack ? 'active' : ''}`}
                onClick={() => setCurrentTrack(index)}
              >
                <img src={track.cover} alt={track.name} className="track-cover" />
                <div className="track-info">
                  <span className="track-name">{track.name}</span>
                  <span className="track-artist">{track.singer}</span>
                </div>
                {index === currentTrack && isPlaying && (
                  <span className="eq">♪</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
