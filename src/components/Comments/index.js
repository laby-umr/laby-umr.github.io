import React, { useEffect, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';
import { translate } from '@docusaurus/Translate';

export default function Comments() {
  const { colorMode } = useColorMode();
  const containerRef = useRef(null);
  const location = useLocation();
  
  useEffect(() => {
    // 清除旧的评论组件
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    
    const theme = colorMode === 'dark' ? 'dark_dimmed' : 'preferred_color_scheme';
    
    // 创建 script 元素
    const script = document.createElement('script');
    
    // 设置 giscus 属性
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'MasterLiu93/web-blog');
    script.setAttribute('data-repo-id', 'R_kgDOPZrqqQ');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDOPZrqqc4Ct73X');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', '');
    
    // 将 script 添加到容器中
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }
    
    return () => {
      // 清理函数
      if (containerRef.current) {
        const giscusFrame = containerRef.current.querySelector('iframe.giscus-frame');
        if (giscusFrame) {
          giscusFrame.remove();
        }
      }
    };
  }, [colorMode, location.pathname]); // 当颜色模式或路径变化时重新加载评论
  
  return (
    <div className={styles.commentsContainer}>
      <h2 className={styles.commentsTitle}>
        {translate({
          id: 'theme.Comments.title',
          message: '评论',
          description: 'Title for the comments section'
        })}
      </h2>
      <div ref={containerRef} className={styles.commentsWrapper} />
    </div>
  );
} 