import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

/**
 * 可缩放的Mermaid图表组件
 * 提供放大、缩小、全屏查看功能
 */
export default function ZoomableMermaid({ children, title }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  // 放大
  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3));
  };

  // 缩小
  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  // 重置
  const resetZoom = () => {
    setScale(1);
  };

  // 全屏切换
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setScale(1); // 进入全屏时重置缩放
    }
  };

  // ESC键退出全屏
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  return (
    <>
      <div className={`zoomable-mermaid-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
        {/* 工具栏 */}
        <div className="zoom-toolbar">
          {title && <span className="diagram-title">{title}</span>}
          <div className="zoom-controls">
            <button onClick={zoomOut} title="缩小 (Ctrl + -)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <span className="zoom-level">{Math.round(scale * 100)}%</span>
            <button onClick={zoomIn} title="放大 (Ctrl + +)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button onClick={resetZoom} title="重置 (Ctrl + 0)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 1a5 5 0 110 10A5 5 0 018 3z"/>
                <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button onClick={toggleFullscreen} title={isFullscreen ? "退出全屏 (ESC)" : "全屏查看 (F)"}>
              {isFullscreen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5.5 0a.5.5 0 01.5.5v4A1.5 1.5 0 014.5 6h-4a.5.5 0 010-1h4a.5.5 0 00.5-.5v-4a.5.5 0 01.5-.5zM10 .5a.5.5 0 01.5-.5h.5a.5.5 0 01.5.5v4a.5.5 0 00.5.5h4a.5.5 0 010 1h-4A1.5 1.5 0 0110 4.5v-4zM.5 10a.5.5 0 01.5.5v4a.5.5 0 00.5.5h4a.5.5 0 010 1h-4A1.5 1.5 0 010 14.5v-4a.5.5 0 01.5-.5zm15 0a.5.5 0 01.5.5v4a1.5 1.5 0 01-1.5 1.5h-4a.5.5 0 010-1h4a.5.5 0 00.5-.5v-4a.5.5 0 01.5-.5z"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1.5 1a.5.5 0 00-.5.5v4a.5.5 0 01-1 0v-4A1.5 1.5 0 011.5 0h4a.5.5 0 010 1h-4zM10 .5a.5.5 0 01.5-.5h4A1.5 1.5 0 0116 1.5v4a.5.5 0 01-1 0v-4a.5.5 0 00-.5-.5h-4a.5.5 0 01-.5-.5zM.5 10a.5.5 0 01.5.5v4a.5.5 0 00.5.5h4a.5.5 0 010 1h-4A1.5 1.5 0 010 14.5v-4a.5.5 0 01.5-.5zm15 0a.5.5 0 01.5.5v4a1.5 1.5 0 01-1.5 1.5h-4a.5.5 0 010-1h4a.5.5 0 00.5-.5v-4a.5.5 0 01.5-.5z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* 图表内容区域 */}
        <div 
          ref={containerRef}
          className="mermaid-container"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center'
          }}
        >
          {children}
        </div>
      </div>

      {/* 全屏遮罩 */}
      {isFullscreen && <div className="fullscreen-overlay" onClick={toggleFullscreen} />}
    </>
  );
}

