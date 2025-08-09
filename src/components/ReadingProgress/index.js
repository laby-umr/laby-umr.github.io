import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { useLocation } from '@docusaurus/router';

export default function ReadingProgress() {
  const [width, setWidth] = useState(0);
  const location = useLocation();
  
  // 重置进度条，当路由变化时
  useEffect(() => {
    setWidth(0);
  }, [location.pathname]);

  // 计算阅读进度
  useEffect(() => {
    const calculateScrollProgress = () => {
      // 获取内容元素
      const content = document.querySelector('article') || 
                     document.querySelector('.markdown') || 
                     document.querySelector('main');
      
      if (!content) return;
      
      // 计算内容总高度
      const contentHeight = content.scrollHeight - content.clientHeight;
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // 如果内容不需要滚动，直接返回
      if (contentHeight <= 0 || windowHeight <= 0) {
        setWidth(0);
        return;
      }
      
      // 计算滚动百分比
      const scrolled = window.scrollY / windowHeight;
      setWidth(Math.min(scrolled * 100, 100));
    };

    // 初始化计算
    calculateScrollProgress();
    
    // 监听滚动事件
    window.addEventListener('scroll', calculateScrollProgress);
    window.addEventListener('resize', calculateScrollProgress);
    
    return () => {
      window.removeEventListener('scroll', calculateScrollProgress);
      window.removeEventListener('resize', calculateScrollProgress);
    };
  }, [location.pathname]);

  // 只在文章页面显示进度条
  const shouldShowProgress = () => {
    // 检查是否是文档或博客页面
    return location.pathname.includes('/docs/') || 
           location.pathname.includes('/blog/');
  };

  if (!shouldShowProgress()) {
    return null;
  }

  return (
    <div className={styles.progressContainer}>
      <div 
        className={styles.progressBar} 
        style={{ width: `${width}%` }}
      />
    </div>
  );
} 