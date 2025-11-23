import React, { useEffect, useState } from 'react';
import { UpOutlined } from '@ant-design/icons';
import styles from './styles.module.css';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // 监听滚动事件，决定按钮何时显示
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // 组件卸载时移除事件监听
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // 返回顶部功能
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button 
          onClick={scrollToTop} 
          className={`${styles.backToTopButton} ${isVisible ? styles.backToTopButtonVisible : ''}`}
          aria-label="返回顶部"
          title="返回顶部"
        >
          <UpOutlined />
        </button>
      )}
    </>
  );
}