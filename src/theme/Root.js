import React, { useEffect } from 'react';
import BackToTop from '../components/BackToTop';
import ParticleBackground from '../components/ParticleBackground';
import EnhancedTable from '../components/EnhancedTable';

export default function Root({children}) {
  useEffect(() => {
    // 设置默认为暗色主题
    const setDarkTheme = () => {
      // 仅在客户端执行
      if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    };

    // 首次加载时执行
    setDarkTheme();
  }, []);

  return <>{children}</>;
} 