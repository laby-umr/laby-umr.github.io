import React, { useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';
import { translate } from '@docusaurus/Translate';

export default function Comments() {
  const containerRef = useRef(null);
  const location = useLocation();
  
  useEffect(() => {
    // 检测当前主题
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const theme = isDarkTheme ? 'dark_dimmed' : 'preferred_color_scheme';
    
    // 清除旧的评论组件
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    
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
    script.setAttribute('data-reactions-enabled', '1'); // 启用反应（点赞等）
    script.setAttribute('data-emit-metadata', '1'); // 启用元数据，以便显示更多信息
    script.setAttribute('data-input-position', 'bottom'); // 将评论框放在底部，评论列表在上方
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', '');
    // 启用评论计数
    script.setAttribute('data-count', 'true');
    // 启用懒加载
    script.setAttribute('data-loading', 'lazy');
    // 启用讨论链接
    script.setAttribute('data-discussion-link', 'true');
    // 启用表情选择器
    script.setAttribute('data-enable-reactions', 'true');
    
    // 将 script 添加到容器中
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }
    
    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newIsDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
          const newTheme = newIsDarkTheme ? 'dark_dimmed' : 'preferred_color_scheme';
          
          // 更新评论主题
          const giscusFrame = document.querySelector('iframe.giscus-frame');
          if (giscusFrame) {
            giscusFrame.contentWindow.postMessage(
              { giscus: { setConfig: { theme: newTheme } } },
              'https://giscus.app'
            );
          }
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      // 清理函数
      observer.disconnect();
      if (containerRef.current) {
        const giscusFrame = containerRef.current.querySelector('iframe.giscus-frame');
        if (giscusFrame) {
          giscusFrame.remove();
        }
      }
    };
  }, [location.pathname]); // 当路径变化时重新加载评论
  
  return (
    <div className={styles.commentsContainer}>
      <h2 className={styles.commentsTitle}>
        {translate({
          id: 'theme.Comments.title',
          message: '参与讨论',
          description: 'Title for the comments section'
        })}
      </h2>
      <div ref={containerRef} className={styles.commentsWrapper} />
    </div>
  );
} 