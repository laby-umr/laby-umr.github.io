import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';
import clsx from 'clsx';

function TOCItem({ heading, onClick, activeId, level }) {
  const isActive = activeId === heading.id;
  
  return (
    <li 
      className={clsx(
        styles.tocItem, 
        styles[`tocLevel${level}`],
        isActive && styles.tocItemActive
      )}
    >
      <a
        href={`#${heading.id}`}
        className={clsx(
          styles.tocLink,
          isActive && styles.tocLinkActive
        )}
        onClick={(e) => {
          e.preventDefault();
          onClick(heading.id);
        }}
      >
        <span className={styles.tocLinkContent}>
          {heading.value}
        </span>
        {isActive && <span className={styles.tocActiveIndicator} />}
      </a>
    </li>
  );
}

export default function TableOfContents({ toc = [], minHeadingLevel = 2, maxHeadingLevel = 4 }) {
  const [activeId, setActiveId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentRef = useRef(null);
  const location = useLocation();

  // 过滤适当级别的标题
  const filteredToc = toc.filter(
    (item) => item.level >= minHeadingLevel && item.level <= maxHeadingLevel,
  );

  // 滚动到标题
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    const offset = 90; // 考虑固定头部的偏移
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
    
    setActiveId(id);
  };
  
  // 检查是否为文章或文档页面
  useEffect(() => {
    const isDocOrBlogPage = location.pathname.includes('/docs/') || location.pathname.includes('/blog/');
    setIsVisible(isDocOrBlogPage && filteredToc.length > 0);
    
    // 重置激活状态
    setActiveId(null);
  }, [location.pathname, filteredToc]);
  
  // 监听滚动，更新当前活跃标题
  useEffect(() => {
    if (!isVisible) return;

    const headingElements = Array.from(filteredToc)
      .filter((item) => item.id)
      .map((item) => document.getElementById(item.id))
      .filter((el) => el !== null);

    const handleScroll = () => {
      // 找出当前在视口上方最近的标题
      const scrollPosition = window.scrollY + 100; // 添加偏移量

      // 获取每个标题的位置
      const headingPositions = headingElements.map(element => ({
        id: element.id,
        position: element.getBoundingClientRect().top + window.scrollY
      }));

      // 找出第一个在视口上方最近的标题
      const currentHeading = headingPositions
        .filter(heading => heading.position <= scrollPosition)
        .reduce((acc, curr) => {
          return !acc || curr.position > acc.position ? curr : acc;
        }, null);

      setActiveId(currentHeading?.id || null);
    };

    window.addEventListener('scroll', handleScroll);
    // 初始调用一次确保首次加载时也设置正确的活跃项
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [filteredToc, isVisible]);

  if (!isVisible || filteredToc.length === 0) {
    return null;
  }

  return (
    <div className={clsx(
      styles.tocContainer,
      isCollapsed && styles.collapsed
    )}>
      <div className={styles.tocHeader}>
        <h4 className={styles.tocTitle}>
          目录
        </h4>
        <button
          className={clsx(styles.collapseButton, isCollapsed && styles.expanded)}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "展开目录" : "收起目录"}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d={isCollapsed 
                ? "M5 8l5 5 5-5z" // 向下箭头
                : "M15 12l-5-5-5 5z" // 向上箭头
              }
            />
          </svg>
        </button>
      </div>
      
      <div 
        ref={contentRef}
        className={styles.tocContent}
        style={{ 
          maxHeight: isCollapsed ? '0' : '500px'
        }}
      >
        <ul className={styles.tocList}>
          {filteredToc.map((heading) => (
            <TOCItem
              key={heading.id}
              heading={heading}
              onClick={scrollToHeading}
              activeId={activeId}
              level={heading.level}
            />
          ))}
        </ul>
      </div>
    </div>
  );
} 