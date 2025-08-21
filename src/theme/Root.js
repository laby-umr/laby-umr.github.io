import React, { useEffect } from 'react';
import BackToTop from '../components/BackToTop';
import ParticleBackground from '../components/ParticleBackground';
import EnhancedTable from '../components/EnhancedTable';

export default function Root({children}) {
  // 首次加载时设置暗色模式
  useEffect(() => {
    // 检查是否首次访问
    const isFirstVisit = !localStorage.getItem('theme-preference-set');
    
    if (isFirstVisit) {
      // 设置默认暗色主题
      const colorModeSwitch = document.querySelector('.clean-btn.navbar__item');
      const htmlEl = document.querySelector('html');
      
      // 如果当前不是暗色模式且存在切换按钮，则模拟点击
      if (htmlEl && !htmlEl.getAttribute('data-theme')?.includes('dark') && colorModeSwitch) {
        // 设置标记，避免每次都切换
        localStorage.setItem('theme-preference-set', 'true');
      }
    }
  }, []);

  return (
    <>
      <ParticleBackground />
      {children}
      <BackToTop />
      <EnhancedTable />
    </>
  );
} 