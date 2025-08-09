import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

export default function LazyImage({ src, alt, className, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px 0px', // 预加载区域
        threshold: 0.01 // 只需要很小一部分可见就开始加载
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      className={`${styles.lazyImageContainer} ${className || ''}`} 
      ref={imgRef}
      {...props}
    >
      {isInView && (
        <>
          <img
            src={src}
            alt={alt}
            className={`${styles.lazyImage} ${isLoaded ? styles.loaded : ''}`}
            onLoad={handleLoad}
          />
          {!isLoaded && (
            <div className={styles.placeholder}>
              <div className={styles.spinner}></div>
            </div>
          )}
        </>
      )}
      {!isInView && (
        <div className={styles.placeholder}>
          <div className={styles.shimmer}></div>
        </div>
      )}
    </div>
  );
} 