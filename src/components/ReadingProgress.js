import React, { useState, useEffect } from 'react';
import styles from './ReadingProgress.module.css';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollTop / docHeight) * 100;
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div 
      className={styles.progressBar}
      style={{ 
        width: `${progress}%`,
        height: '3px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        transition: 'width 0.2s ease',
      }}
    />
  );
}
