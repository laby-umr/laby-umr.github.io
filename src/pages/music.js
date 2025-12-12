import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '@theme/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './music.module.css';
import Translate, { translate } from '@docusaurus/Translate';
import { rafThrottle } from '@site/src/utils/throttle';
import GlitchText from '../components/GlitchText';
import { TranslatedJellyText } from '../components/JellyTextAnimation';
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  MusicalNoteIcon,
  QueueListIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';

// ============================================
// 🎵 网易云歌单配置
// ============================================
const NETEASE_PLAYLIST_ID = '2318463841';
const METING_API = 'https://api.injahow.cn/meting/';

// 背景图片列表
const BLOG_IMAGES = [
  '/img/blog/blog-1.jpg', '/img/blog/blog-2.jpg', '/img/blog/blog-3.jpg',
  '/img/blog/blog-4.jpg', '/img/blog/blog-5.jpg', '/img/blog/blog-8.jpg',
  '/img/blog/blog-9.jpg', '/img/blog/blog-13.jpg', '/img/blog/blog-14.jpg',
  '/img/blog/blog-15.jpg', '/img/blog/blog-16.jpg', '/img/blog/blog-17.jpg',
  '/img/blog/blog-21.jpg', '/img/blog/blog-22.jpg', '/img/blog/blog-23.jpg',
  '/img/blog/blog-24.jpg', '/img/blog/blog-26.jpg', '/img/blog/blog-30.jpg',
];

// 随机获取两张不同的图片
const getRandomImages = () => {
  const shuffled = [...BLOG_IMAGES].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
};

// 默认音乐列表
const defaultMusicList = [
  {
    id: 1,
    name: '加载中...',
    artist: '请稍候',
    cover: 'https://picsum.photos/seed/music1/300/300',
    src: '',
    duration: 0,
    lyrics: [{ time: 0, text: '正在加载歌曲...' }],
  },
];

// 格式化时间
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 解析歌词
const parseLyric = (lrcStr) => {
  if (!lrcStr) return [{ time: 0, text: '暂无歌词' }];
  const lines = lrcStr.split('\n');
  const lyrics = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

  lines.forEach(line => {
    const timeMatches = [...line.matchAll(timeRegex)];
    const text = line.replace(timeRegex, '').trim();
    
    if (text && timeMatches.length > 0) {
      timeMatches.forEach(match => {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const milliseconds = parseInt(match[3].padEnd(3, '0'));
        const time = minutes * 60 + seconds + milliseconds / 1000;
        lyrics.push({ time, text });
      });
    }
  });

  return lyrics.length > 0 ? lyrics.sort((a, b) => a.time - b.time) : [{ time: 0, text: '暂无歌词' }];
};

export default function Music() {
  // 访客统计已迁移到 Google Analytics 4

  const [musicList, setMusicList] = useState(defaultMusicList);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const SONGS_PER_PAGE = 8;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState('list');
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [bgImages] = useState(() => getRandomImages());
  const [playlistInput, setPlaylistInput] = useState('');
  const [playlistId, setPlaylistId] = useState(NETEASE_PLAYLIST_ID);

  const audioRef = useRef(null);
  const lyricContainerRef = useRef(null);
  const progressRef = useRef(null);

  const currentSong = musicList[currentTrack] || defaultMusicList[0];

  // 解析歌单ID（支持URL或纯ID）
  const parsePlaylistId = (input) => {
    if (!input) return null;
    // 匹配URL中的id参数
    const urlMatch = input.match(/[?&]id=(\d+)/);
    if (urlMatch) return urlMatch[1];
    // 匹配纯数字ID
    const idMatch = input.match(/^(\d+)$/);
    if (idMatch) return idMatch[1];
    return null;
  };

  // 加载歌单
  const handleLoadPlaylist = () => {
    const id = parsePlaylistId(playlistInput);
    if (id) {
      setPlaylistId(id);
      setPlaylistInput('');
      setCurrentTrack(0);
      setCurrentPage(1);
    }
  };

  // 加载网易云歌单
  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${METING_API}?type=playlist&id=${playlistId}&server=netease`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const songs = data.map((song, index) => ({
            id: song.id || index,
            name: song.name || song.title || '未知歌曲',
            artist: song.artist || song.author || '未知歌手',
            cover: song.pic || song.cover || `https://picsum.photos/seed/music${index}/300/300`,
            src: song.url,
            lrc: song.lrc,
            duration: 0,
            lyrics: [{ time: 0, text: '加载歌词中...' }],
          }));
          setMusicList(songs);
        }
      } catch (error) {
        console.error('加载歌单失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPlaylist();
  }, [playlistId]);

  // 加载当前歌曲歌词
  useEffect(() => {
    const loadLyrics = async () => {
      if (!currentSong.lrc) return;
      try {
        const response = await fetch(currentSong.lrc);
        const lrcText = await response.text();
        const lyrics = parseLyric(lrcText);
        setMusicList(prev => prev.map((song, idx) => 
          idx === currentTrack ? { ...song, lyrics } : song
        ));
      } catch (error) {
        console.error('加载歌词失败:', error);
      }
    };
    loadLyrics();
  }, [currentTrack, currentSong.lrc]);

  useEffect(() => {
    const handleScroll = rafThrottle(() => setScrollY(window.scrollY));
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong.src) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  }, [isPlaying, currentSong.src]);

  const handlePrev = useCallback(() => {
    if (playMode === 'shuffle') {
      setCurrentTrack(Math.floor(Math.random() * musicList.length));
    } else {
      setCurrentTrack((prev) => (prev - 1 + musicList.length) % musicList.length);
    }
  }, [playMode, musicList.length]);

  const handleNext = useCallback(() => {
    if (playMode === 'shuffle') {
      setCurrentTrack(Math.floor(Math.random() * musicList.length));
    } else {
      setCurrentTrack((prev) => (prev + 1) % musicList.length);
    }
  }, [playMode, musicList.length]);

  const handleEnded = useCallback(() => {
    if (playMode === 'repeat') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      handleNext();
    }
  }, [playMode, handleNext]);

  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    const lyrics = currentSong.lyrics || [];
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (audioRef.current.currentTime >= lyrics[i].time) {
        setActiveLyricIndex(i);
        break;
      }
    }
  }, [currentSong.lyrics]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  }, []);

  const handleProgressClick = useCallback((e) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  }, [duration]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.7;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  const togglePlayMode = useCallback(() => {
    const modes = ['list', 'shuffle', 'repeat'];
    setPlayMode(modes[(modes.indexOf(playMode) + 1) % modes.length]);
  }, [playMode]);

  const handleSelectTrack = useCallback((index) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (audioRef.current && isPlaying && currentSong.src) {
      audioRef.current.play().catch(console.error);
    }
    setActiveLyricIndex(0);
  }, [currentTrack]);

  useEffect(() => {
    if (lyricContainerRef.current) {
      const activeLine = lyricContainerRef.current.querySelector(`.${styles.lyricActive}`);
      if (activeLine) {
        // 使用容器内滚动，避免页面跟随滚动
        const container = lyricContainerRef.current;
        const lineTop = activeLine.offsetTop;
        const lineHeight = activeLine.offsetHeight;
        const containerHeight = container.clientHeight;
        const scrollTo = lineTop - containerHeight / 2 + lineHeight / 2;
        container.scrollTo({ top: scrollTo, behavior: 'smooth' });
      }
    }
  }, [activeLyricIndex]);

  const getPlayModeInfo = () => {
    switch (playMode) {
      case 'shuffle': return { icon: ArrowsRightLeftIcon, tip: '随机播放' };
      case 'repeat': return { icon: ArrowPathRoundedSquareIcon, tip: '单曲循环' };
      default: return { icon: QueueListIcon, tip: '列表循环' };
    }
  };

  const PlayModeIcon = getPlayModeInfo().icon;

  // 分页计算
  const totalPages = Math.ceil(musicList.length / SONGS_PER_PAGE);
  const paginatedList = musicList.slice(
    (currentPage - 1) * SONGS_PER_PAGE,
    currentPage * SONGS_PER_PAGE
  );

  // 切换歌曲时自动跳转到对应页
  useEffect(() => {
    const targetPage = Math.floor(currentTrack / SONGS_PER_PAGE) + 1;
    if (targetPage !== currentPage) {
      setCurrentPage(targetPage);
    }
  }, [currentTrack]);

  return (
    <Layout
      title={translate({ id: 'music.meta.title', message: '音乐空间' })}
      description={translate({ id: 'music.meta.description', message: '聆听美妙音乐，享受音乐时光' })}
    >
      <div className={styles.musicContainer}>
        <div className={styles.backgroundEffects}>
          <div className={styles.gridPattern} style={{ transform: `translateY(${scrollY * 0.05}px)` }} />
          <div className={styles.blob1} style={{ transform: `translate(${scrollY * 0.02}px, ${-scrollY * 0.01}px)` }} />
          <div className={styles.blob2} style={{ transform: `translate(${-scrollY * 0.02}px, ${scrollY * 0.01}px)` }} />
        </div>

        <audio
          ref={audioRef}
          src={currentSong.src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <section className={styles.heroSection}>
          <motion.div className={styles.decorativeBlob1} animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className={styles.decorativeBlob2} animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, delay: 1, repeat: Infinity, ease: 'easeInOut' }} />

          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className={styles.heroContent}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.playerCard}>
                <div className={`${styles.audioVisualizer} ${isPlaying ? styles.playing : ''}`}>
                  {[...Array(40)].map((_, i) => (
                    <div key={i} className={styles.visualizerBar} style={{ animationDelay: `${i * 0.05}s`, left: `${i * 2.5}%` }} />
                  ))}
                </div>

                <div className={styles.cardHeader}>
                  <motion.div className={styles.badgeWrapper} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 20 }}>
                    <div className={styles.badge}>
                      <MusicalNoteIcon className={styles.badgeIcon} />
                      <Translate id="music.badge">音乐空间</Translate>
                    </div>
                  </motion.div>
                  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={styles.heroTitle}>
                    <span className={styles.gradientText}>
                      <GlitchText speed={1} enableShadows={true} enableOnHover={false}>
                        <TranslatedJellyText id="music.title" defaultMessage="Music Player" delay={0} disableHover={true} />
                      </GlitchText>
                    </span>
                  </motion.h1>

                  {/* 歌单搜索框 */}
                  <motion.div 
                    className={styles.playlistSearch}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="输入网易云歌单URL或ID..."
                      value={playlistInput}
                      onChange={(e) => setPlaylistInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLoadPlaylist()}
                    />
                    <button className={styles.searchBtn} onClick={handleLoadPlaylist}>
                      <MagnifyingGlassIcon className={styles.searchIcon} />
                    </button>
                  </motion.div>
                </div>

                <div className={styles.playerWrapper}>
                  <div className={styles.coverSection}>
                    <div className={styles.coverGlow} />
                    <motion.div
                      className={`${styles.coverContainer} ${isPlaying ? styles.rotating : ''}`}
                      animate={isPlaying ? { rotate: 360 } : {}}
                      transition={isPlaying ? { duration: 20, repeat: Infinity, ease: 'linear' } : {}}
                    >
                      <img src={currentSong.cover} alt={currentSong.name} className={styles.coverImage} />
                      <div className={styles.coverOverlay} />
                      <div className={styles.vinylCenter} />
                    </motion.div>
                  </div>

                  <div className={styles.playerInfo}>
                    <div className={styles.nowPlaying}>
                      <AnimatePresence mode="wait">
                        <motion.h2 key={currentSong.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={styles.songName}>
                          {currentSong.name}
                        </motion.h2>
                      </AnimatePresence>
                      <p className={styles.artistName}>{currentSong.artist}</p>
                    </div>

                    <div className={styles.progressWrapper}>
                      <div ref={progressRef} className={styles.progressBar} onClick={handleProgressClick}>
                        <div className={styles.progressFill} style={{ width: `${(currentTime / duration) * 100 || 0}%` }} />
                        <div className={styles.progressThumb} style={{ left: `${(currentTime / duration) * 100 || 0}%` }} />
                      </div>
                      <div className={styles.timeInfo}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    <div className={styles.controls}>
                      <motion.button className={`${styles.modeBtn} ${playMode !== 'list' ? styles.active : ''}`} onClick={togglePlayMode} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title={getPlayModeInfo().tip}>
                        <PlayModeIcon className={styles.controlIcon} />
                      </motion.button>
                      <motion.button className={styles.ctrlBtn} onClick={handlePrev} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <BackwardIcon className={styles.controlIcon} />
                      </motion.button>
                      <motion.button className={styles.playBtn} onClick={togglePlay} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        {isPlaying ? <PauseIcon className={styles.playIcon} /> : <PlayIcon className={styles.playIcon} />}
                      </motion.button>
                      <motion.button className={styles.ctrlBtn} onClick={handleNext} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <ForwardIcon className={styles.controlIcon} />
                      </motion.button>
                      <div className={styles.volumeControl}>
                        <motion.button className={styles.modeBtn} onClick={toggleMute} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          {isMuted ? <SpeakerXMarkIcon className={styles.controlIcon} /> : <SpeakerWaveIcon className={styles.controlIcon} />}
                        </motion.button>
                        <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className={styles.volumeSlider} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className={styles.mainContent}>
          <div className="container">
            <div className={styles.contentGrid}>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className={styles.playlistSection}>
                <div className={styles.sectionCard}>
                    <div className={styles.sectionBg} style={{ backgroundImage: `url(${bgImages[0]})` }} />
                    <div className={styles.sectionHeader}>
                      <h3><QueueListIcon className={styles.headerIcon} /><Translate id="music.playlist">播放列表</Translate></h3>
                      <span className={styles.trackCount}>{isLoading ? '加载中...' : `${musicList.length} 首`}</span>
                    </div>
                    <div className={styles.playlist}>
                      {isLoading ? (
                        <div className={styles.loadingState}><div className={styles.loadingSpinner} /><span>正在从网易云加载音乐...</span></div>
                      ) : paginatedList.map((track, index) => {
                        const realIndex = (currentPage - 1) * SONGS_PER_PAGE + index;
                        return (
                          <motion.div key={track.id} className={`${styles.trackItem} ${realIndex === currentTrack ? styles.active : ''}`} onClick={() => handleSelectTrack(realIndex)} whileHover={{ x: 5 }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * index }}>
                            <span className={styles.trackIndex}>
                              {realIndex === currentTrack && isPlaying ? (
                                <div className={styles.equalizer}><span></span><span></span><span></span></div>
                              ) : realIndex + 1}
                            </span>
                            <img src={track.cover} alt={track.name} className={styles.trackCover} />
                            <div className={styles.trackDetails}>
                              <span className={styles.trackTitle}>{track.name}</span>
                              <span className={styles.trackArtistName}>{track.artist}</span>
                            </div>
                            <span className={styles.trackDuration}>{formatTime(track.duration)}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                    {/* 分页控件 */}
                    {totalPages > 1 && (
                      <div className={styles.pagination}>
                        <button 
                          className={styles.pageBtn} 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          ‹
                        </button>
                        <div className={styles.pageNumbers}>
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i}
                              className={`${styles.pageNum} ${currentPage === i + 1 ? styles.activePage : ''}`}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button 
                          className={styles.pageBtn} 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className={styles.lyricSection}>
                <div className={styles.sectionCard}>
                    <div className={styles.sectionBg} style={{ backgroundImage: `url(${bgImages[1]})` }} />
                    <div className={styles.sectionHeader}>
                      <h3><MusicalNoteIcon className={styles.headerIcon} /><Translate id="music.lyrics">歌词</Translate></h3>
                      <span className={styles.currentSongBadge}>{currentSong.name}</span>
                    </div>
                    <div ref={lyricContainerRef} className={styles.lyricWrapper}>
                      {(currentSong.lyrics || []).map((line, index) => (
                        <motion.p key={index} className={`${styles.lyricLine} ${index === activeLyricIndex ? styles.lyricActive : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * index }}>
                          {line.text}
                        </motion.p>
                      ))}
                    </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
