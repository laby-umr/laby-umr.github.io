import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';

function ImageLightbox({ src, alt, onClose }) {
  const [loaded, setLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);
  
  // 处理图片点击放大/缩小
  const handleImageClick = (e) => {
    if (!zoomed) {
      setZoomed(true);
    } else {
      // 重置缩放
      setZoomed(false);
      setPosition({ x: 0, y: 0 });
    }
  };
  
  // 处理鼠标移动
  const handleMouseMove = (e) => {
    if (zoomed && imgRef.current) {
      const { width, height } = imgRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      
      // 获取图片相对于视口的位置
      const rect = imgRef.current.getBoundingClientRect();
      const imgX = rect.left;
      const imgY = rect.top;
      
      // 计算鼠标在图片上的相对位置（0-1）
      const relX = (clientX - imgX) / width;
      const relY = (clientY - imgY) / height;
      
      // 转换为图片位移（鼠标所在位置变为中心）
      const transformX = (0.5 - relX) * 100;
      const transformY = (0.5 - relY) * 100;
      
      setPosition({ x: transformX, y: transformY });
    }
  };

  return (
    <div 
      className={styles.lightboxOverlay}
      onClick={onClose}
    >
      <button 
        className={styles.lightboxCloseButton}
        onClick={onClose}
        aria-label="关闭预览"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <div 
        className={styles.lightboxContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className={clsx(styles.lightboxImageWrapper, zoomed && styles.zoomed)}
          onMouseMove={zoomed ? handleMouseMove : null}
        >
          <img 
            ref={imgRef}
            src={src} 
            alt={alt} 
            className={clsx(
              styles.lightboxImage,
              loaded && styles.loaded
            )} 
            style={zoomed ? {
              transform: `scale(2) translate(${position.x}px, ${position.y}px)`
            } : undefined}
            onClick={handleImageClick}
            onLoad={() => setLoaded(true)}
          />
        </div>
        
        <div className={styles.lightboxCaption}>
          <p>{alt}</p>
          <span className={styles.zoomHint}>
            {zoomed ? '点击缩小' : '点击放大'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LazyImage({ src, alt, caption, className }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imgRef = useRef(null);
  
  useEffect(() => {
    // 创建交叉观察器实例，检测图片是否进入视口
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      });
    }, {
      rootMargin: '200px', // 图片距离视口200px时就开始加载
    });
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // 处理点击打开灯箱
  const handleImageClick = () => {
    setIsLightboxOpen(true);
  };
  
  return (
    <figure className={clsx(styles.imageContainer, className, isLoaded && styles.loaded)}>
      <div 
        className={styles.imageWrapper}
        onClick={handleImageClick}
      >
        <div 
          className={styles.imagePlaceholder}
          style={{
            paddingBottom: 'min(75%, 600px)',
            background: `linear-gradient(120deg, #e5e7eb 0%, #f3f4f6 100%)`
          }}
        />
        
        {isInView && (
          <img 
            ref={imgRef}
            src={src} 
            alt={alt || ''} 
            className={styles.image}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />
        )}
        
        <div className={styles.imageOverlay}>
          <div className={styles.zoomIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3H21M21 3V9M21 3L14 10M9 21H3M3 21V15M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      {caption && (
        <figcaption className={styles.caption}>{caption}</figcaption>
      )}
      
      {isLightboxOpen && (
        <ImageLightbox
          src={src}
          alt={caption || alt || ''}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </figure>
  );
} 