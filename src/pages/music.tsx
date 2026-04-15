import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './music.module.css';
import { getPlaylistSongs, MY_PLAYLIST_ID, PLAYLIST_LIMIT, getCurrentApiEndpoint, switchApi } from '@site/src/utils/neteaseApi';
import type { Song } from '@site/src/utils/neteaseApi';

export default function Music(): JSX.Element {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [loading, setLoading] = useState(true);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  
  const ITEMS_PER_PAGE = 8;

  // 加载歌单
  useEffect(() => {
    loadPlaylist();
  }, []);

  const loadPlaylist = async (customId: string | null = null) => {
    try {
      setLoading(true);
      setUrlError('');
      const playlistId = customId || MY_PLAYLIST_ID;
      console.log('Loading playlist:', playlistId); // 调试日志
      console.log('Using API:', getCurrentApiEndpoint()); // 显示当前API
      
      const songs = await getPlaylistSongs(playlistId, PLAYLIST_LIMIT);
      console.log('Loaded songs:', songs); // 调试日志
      
      if (songs.length === 0) {
        setUrlError('无法加载歌单，请检查ID是否正确或点击"切换API"按钮尝试其他服务器');
        return;
      }
      setPlaylist(songs);
      if (songs.length > 0) {
        setCurrentTrack(songs[0]);
        setCurrentIndex(0);
        // 不要自动播放，让用户手动点击播放
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('加载歌单失败:', error);
      setUrlError(`加载歌单失败: ${error.message}。请点击"切换API"按钮尝试其他服务器`);
    } finally {
      setLoading(false);
    }
  };

  // 切换API并重新加载
  const handleSwitchApi = () => {
    const newApi = switchApi();
    console.log('Switched to API:', newApi);
    loadPlaylist();
  };

  // 从URL提取歌单ID
  const extractPlaylistId = (url: string): string | null => {
    // 支持多种格式：
    // https://music.163.com/#/playlist?id=123456789
    // https://music.163.com/playlist?id=123456789
    // 123456789
    const match = url.match(/id=(\d+)/);
    if (match) {
      return match[1];
    }
    // 如果直接输入数字
    if (/^\d+$/.test(url.trim())) {
      return url.trim();
    }
    return null;
  };

  // 加载自定义歌单
  const handleLoadPlaylist = () => {
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
      setUrlError('无效的歌单URL或ID，请输入正确的网易云歌单链接');
      return;
    }
    loadPlaylist(playlistId);
  };

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 播放/暂停
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 上一首
  const playPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
    setCurrentIndex(newIndex);
    setCurrentTrack(playlist[newIndex]);
    // 只有当前正在播放时才自动播放下一首
    if (isPlaying) {
      setIsPlaying(true);
    }
  };

  // 下一首
  const playNext = () => {
    const newIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setCurrentTrack(playlist[newIndex]);
    // 只有当前正在播放时才自动播放下一首
    if (isPlaying) {
      setIsPlaying(true);
    }
  };

  // 选择歌曲
  const selectTrack = (index: number) => {
    setCurrentIndex(index);
    setCurrentTrack(playlist[index]);
    setIsPlaying(true);
  };

  // 更新进度和歌词
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const current = audio.currentTime;
      const total = audio.duration;
      if (total) {
        setProgress((current / total) * 100);
        setCurrentTime(formatTime(current));
        setDuration(formatTime(total));
        
        // 更新歌词索引
        if (currentTrack?.lyrics && currentTrack.lyrics.length > 0) {
          const index = currentTrack.lyrics.findIndex((lyric, i) => {
            const nextLyric = currentTrack.lyrics[i + 1];
            return current >= lyric.time && (!nextLyric || current < nextLyric.time);
          });
          setCurrentLyricIndex(index);
        }
      }
    };

    const handleEnded = () => {
      playNext();
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
      // 不要自动跳到下一首，让用户手动选择
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('error', handleError);
    };
  }, [currentIndex, playlist, currentTrack]);

  // 自动播放
  useEffect(() => {
    if (currentTrack && currentTrack.src && audioRef.current && isPlaying) {
      console.log('Attempting to play:', currentTrack.name, 'URL:', currentTrack.src); // 调试日志
      
      // 重置音频元素
      audioRef.current.load();
      
      audioRef.current.play().catch((err: Error) => {
        console.error('播放失败:', err);
        console.error('Current track:', currentTrack);
        setIsPlaying(false);
        // 不要自动跳到下一首，让用户手动选择或点击下一首按钮
      });
    }
  }, [currentTrack]);

  // 歌词自动滚动
  useEffect(() => {
    if (lyricsContainerRef.current && currentLyricIndex >= 0) {
      const container = lyricsContainerRef.current;
      const activeLyric = container.querySelector(`.${styles.lyricLineActive}`) as HTMLElement;
      
      if (activeLyric) {
        const containerHeight = container.clientHeight;
        const lyricTop = activeLyric.offsetTop;
        const lyricHeight = activeLyric.clientHeight;
        
        // 将当前歌词滚动到容器中间位置
        const scrollTo = lyricTop - (containerHeight / 2) + (lyricHeight / 2);
        
        container.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        });
      }
    }
  }, [currentLyricIndex]);

  const tags = ['#DEMON_SLAYER', '#BREATH_STYLE', '#WISTERIA_VIBES', '#MUZAN_BEATS'];
  
  // 分页逻辑
  const totalPages = Math.ceil(playlist.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageItems = playlist.slice(startIndex, endIndex);
  
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <Layout 
        title={translate({id: 'music.title', message: '音乐'})}
        description={translate({id: 'music.description', message: '音之呼吸 - 全集中训练'})}>
        <main className={styles.musicMain}>
          <div className={styles.musicContainer}>
            <div className={styles.loading}>
              <Translate id="music.loading">加载歌单中...</Translate>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout
      title={translate({id: 'music.title', message: '音乐'})}
      description={translate({id: 'music.description', message: '音之呼吸 - 全集中训练'})}>
      <main className={styles.musicMain}>
        <div className={styles.cloudBg}>
          <div className={styles.cloud1}></div>
          <div className={styles.cloud2}></div>
          <div className={styles.cloud3}></div>
        </div>

        {/* Hidden Audio Element */}
        {currentTrack && currentTrack.src && (
          <audio ref={audioRef} src={currentTrack.src} preload="metadata" />
        )}

        {/* Custom Playlist Input - Top Section */}
        <div className={styles.topSection}>
          <div className={styles.playlistInputCard}>
            <div className={styles.playlistInputHeader}>
              <span className="material-symbols-outlined">library_music</span>
              <h3 className={styles.playlistInputTitle}>
                <Translate id="music.loadCustomPlaylist">加载自定义歌单</Translate>
              </h3>
            </div>
            <div className={styles.playlistInputGroup}>
              <input
                type="text"
                className={styles.playlistInput}
                placeholder={translate({id: 'music.playlistPlaceholder', message: '粘贴网易云歌单链接或ID...'})}
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleLoadPlaylist();
                  }
                }}
              />
              <button
                className={styles.playlistLoadButton}
                onClick={handleLoadPlaylist}
                disabled={!playlistUrl.trim()}
              >
                <span className="material-symbols-outlined">download</span>
                <Translate id="music.loadButton">加载</Translate>
              </button>
            </div>
            {urlError && (
              <div className={styles.playlistError}>
                <span className="material-symbols-outlined">error</span>
                {urlError}
                <button
                  className={styles.playlistRetryButton}
                  onClick={handleSwitchApi}
                  style={{ marginLeft: '10px' }}
                >
                  <span className="material-symbols-outlined">sync</span>
                  <Translate id="music.switchApi">切换API</Translate>
                </button>
              </div>
            )}
            <p className={styles.playlistInputHint}>
              <Translate id="music.playlistHint">示例: https://music.163.com/#/playlist?id=123456789</Translate>
            </p>
          </div>
        </div>

        <div className={styles.musicContainer}>
          {/* Cassette Player */}
          <div className={styles.playerSection}>
            <div className={styles.cassettePlayer}>
              <div className={styles.cassetteHeader}>
                NICHIRIN DECK // BREATH OF LO-FI
              </div>
              
              <div className={styles.cassetteBody}>
                {/* Playback Area */}
                <div className={styles.playbackArea}>
                  <div className={styles.reel}></div>
                  
                  <div className={styles.trackInfo}>
                    <h2 className={styles.trackTitle}>{currentTrack?.name || 'Loading...'}</h2>
                    <p className={styles.trackArtist}>{currentTrack?.artist || ''}</p>
                  </div>
                  
                  <div className={styles.reel}></div>
                </div>

                {/* Visualizer */}
                <div className={styles.visualizer}>
                  {[...Array(11)].map((_, i) => (
                    <div
                      key={i}
                      className={styles.visualizerBar}
                      style={{ 
                        animationDelay: `${i * 0.1}s`,
                        animationPlayState: isPlaying ? 'running' : 'paused'
                      }}
                    ></div>
                  ))}
                </div>

                {/* Controls */}
                <div className={styles.controls}>
                  <button className={styles.controlButton} onClick={playPrevious}>
                    <span className="material-symbols-outlined">skip_previous</span>
                  </button>
                  <button className={styles.controlButtonPlay} onClick={togglePlay}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>
                  <button className={styles.controlButton} onClick={playNext}>
                    <span className="material-symbols-outlined">skip_next</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className={styles.progressSection}>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                className={styles.progressBar}
                onChange={(e) => {
                  const newProgress = parseFloat(e.target.value);
                  if (audioRef.current && audioRef.current.duration) {
                    audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
                  }
                }}
              />
              <div className={styles.progressTime}>
                <span>{currentTime}</span>
                <span>{duration}</span>
              </div>
            </div>

            {/* Now Playing Info */}
            <div className={styles.nowPlayingCard}>
              <img
                src={currentTrack?.cover || '/img/logo.jpg'}
                alt="Album Art"
                className={styles.albumArt}
              />
              <div className={styles.nowPlayingInfo}>
                <div className={styles.breathingMode}>
                  <Translate id="music.breathingMode">水之呼吸模式</Translate>
                </div>
                <h3 className={styles.albumTitle}>{currentTrack?.album || 'Loading...'}</h3>
                <p className={styles.albumDesc}>
                  <Translate id="music.albumDesc">来自网易云音乐的精选歌单，享受音乐的美好时光。</Translate>
                </p>
                <div className={styles.volumeControl}>
                  <span className="material-symbols-outlined">volume_down</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue="70" 
                    className={styles.volumeSlider}
                    onChange={(e) => {
                      if (audioRef.current) {
                        audioRef.current.volume = parseFloat(e.target.value) / 100;
                      }
                    }}
                  />
                  <span className="material-symbols-outlined">volume_up</span>
                </div>
              </div>
            </div>

            {/* Lyrics Panel */}
            <div className={styles.lyricsCard}>
              <div className={styles.lyricsHeader}>
                <span className="material-symbols-outlined">lyrics</span>
                <h3 className={styles.lyricsTitle}>
                  <Translate id="music.lyricsTitle">呼吸卷轴</Translate>
                </h3>
                <div className={styles.lyricsBadge}>
                  <Translate id="music.lyricsSynced">已同步</Translate>
                </div>
              </div>
              
              <div className={styles.lyricsContent} ref={lyricsContainerRef}>
                {currentTrack?.lyrics && currentTrack.lyrics.length > 0 ? (
                  <div className={styles.lyricsLines}>
                    {currentTrack.lyrics.map((lyric, index) => (
                      <div
                        key={index}
                        className={`${styles.lyricLine} ${index === currentLyricIndex ? styles.lyricLineActive : ''} ${index < currentLyricIndex ? styles.lyricLinePassed : ''}`}
                      >
                        {lyric.text}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.lyricsEmpty}>
                    <span className="material-symbols-outlined">music_note</span>
                    <p><Translate id="music.noLyrics">此曲目无歌词</Translate></p>
                    <p className={styles.lyricsEmptyHint}>
                      <Translate id="music.noLyricsHint">享受纯粹的呼吸技巧之声</Translate>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Playlist */}
          <div className={styles.playlistSection}>
            <div className={styles.playlistHeader}>
              <h2 className={styles.playlistTitle}>
                <Translate id="music.queueTitle">队列：最终选拔</Translate>
              </h2>
              <p className={styles.playlistSubtitle}>
                <Translate id="music.queueSubtitle">掌握节拍的呼吸。</Translate>
              </p>
            </div>

            <div className={styles.playlistItems}>
              {currentPageItems.map((track, pageIndex) => {
                const index = startIndex + pageIndex;
                return (
                <div
                  key={track.id}
                  className={`${styles.playlistItem} ${index === currentIndex ? styles.playlistItemActive : ''}`}
                  onClick={() => selectTrack(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.trackNumber}>
                    {index === currentIndex && isPlaying ? (
                      <span className="material-symbols-outlined">equalizer</span>
                    ) : (
                      String(index + 1).padStart(2, '0')
                    )}
                  </div>
                  <div className={styles.trackDetails}>
                    <h4 className={styles.trackName}>{track.name}</h4>
                    <p className={styles.trackMeta}>{track.artist} - {formatTime(track.duration)}</p>
                  </div>
                  <span 
                    className="material-symbols-outlined" 
                    style={{ fontVariationSettings: index === currentIndex ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </div>
              );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.paginationButton}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                
                <div className={styles.paginationPages}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`${styles.paginationPage} ${page === currentPage ? styles.paginationPageActive : ''}`}
                      onClick={() => goToPage(page)}
                    >
                      {String(page).padStart(2, '0')}
                    </button>
                  ))}
                </div>
                
                <button
                  className={styles.paginationButton}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}

            {/* Tags */}
            <div className={styles.tags}>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className={styles.tag}
                  style={{ transform: `rotate(${(i % 2 ? 1 : -1) * (i + 1) * 3}deg)` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FAB */}
        <button className={styles.fab}>
          <span className="material-symbols-outlined">add_to_photos</span>
        </button>
      </main>
    </Layout>
  );
}
