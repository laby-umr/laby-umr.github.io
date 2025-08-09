import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import { useLocation } from '@docusaurus/router';
import { translate } from '@docusaurus/Translate';
import { FaList } from 'react-icons/fa';

export default function TableOfContents() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const tocRef = useRef(null);
  const location = useLocation();

  // 获取页面中的所有标题
  useEffect(() => {
    const getHeadings = () => {
      // 只获取h2和h3标题
      const elements = Array.from(document.querySelectorAll('article h2, article h3'));
      
      // 如果没有找到标题，尝试其他选择器
      if (elements.length === 0) {
        return Array.from(document.querySelectorAll('.markdown h2, .markdown h3, .theme-doc-markdown h2, .theme-doc-markdown h3'));
      }
      
      return elements;
    };

    const headingElements = getHeadings();
    
    // 如果页面中有标题，则显示TOC
    if (headingElements.length > 0) {
      setIsVisible(true);
      
      const headingsData = headingElements.map(heading => ({
        id: heading.id,
        text: heading.textContent,
        level: parseInt(heading.tagName.substring(1), 10)
      }));
      
      setHeadings(headingsData);
    } else {
      setIsVisible(false);
    }
  }, [location.pathname]);

  // 监听滚动，高亮当前可见的标题
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings.map(heading => 
        document.getElementById(heading.id)
      ).filter(Boolean);
      
      if (headingElements.length === 0) return;
      
      // 找到当前视口中的第一个标题
      const scrollPosition = window.scrollY + 100;
      
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const currentElement = headingElements[i];
        if (currentElement.offsetTop <= scrollPosition) {
          setActiveId(currentElement.id);
          return;
        }
      }
      
      // 如果没有找到，则默认选中第一个
      setActiveId(headingElements[0].id);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  // 点击目录项，滚动到对应位置
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setActiveId(id);
    }
  };

  // 切换折叠状态
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!isVisible || headings.length === 0) {
    return null;
  }

  return (
    <div 
      className={`${styles.tocContainer} ${isCollapsed ? styles.collapsed : ''}`}
      ref={tocRef}
    >
      <div className={styles.tocHeader} onClick={toggleCollapse}>
        <FaList className={styles.tocIcon} />
        <span className={styles.tocTitle}>
          {translate({
            id: 'theme.TableOfContents.title',
            message: '目录',
            description: 'The title of the table of contents'
          })}
        </span>
      </div>
      
      <nav className={styles.tocContent}>
        <ul className={styles.tocList}>
          {headings.map(heading => (
            <li 
              key={heading.id}
              className={`
                ${styles.tocItem} 
                ${styles[`tocLevel${heading.level}`]}
                ${activeId === heading.id ? styles.tocItemActive : ''}
              `}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(heading.id);
                }}
                className={styles.tocLink}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 