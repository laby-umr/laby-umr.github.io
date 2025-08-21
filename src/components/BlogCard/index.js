import React, { useState, useRef, useEffect } from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';
import clsx from 'clsx';

export default function BlogCard({ 
  title, 
  description, 
  date, 
  readingTime, 
  tags = [], 
  imageUrl, 
  authors = [], 
  link 
}) {
  const { colorMode } = useColorMode();
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [leaving, setLeaving] = useState(false);
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 计算鼠标与卡片中心的相对位置
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);
    
    // 限制旋转角度到较小的范围
    const maxRotation = 6;
    setRotation({
      x: -relativeY * maxRotation, // 上下移动影响 X 轴旋转
      y: relativeX * maxRotation   // 左右移动影响 Y 轴旋转
    });
  };
  
  const handleMouseEnter = () => {
    setHovering(true);
    setLeaving(false);
  };
  
  const handleMouseLeave = () => {
    setLeaving(true);
    setTimeout(() => {
      setHovering(false);
      setLeaving(false);
      setRotation({ x: 0, y: 0 });
    }, 300);
  };
  
  // 确保组件卸载时清除动画帧
  useEffect(() => {
    return () => {
      setHovering(false);
      setRotation({ x: 0, y: 0 });
    };
  }, []);

  return (
    <Link 
      to={link} 
      className={styles.cardLink}
      onMouseEnter={handleMouseEnter}
      onMouseMove={hovering ? handleMouseMove : null}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={cardRef}
        className={clsx(
          styles.blogCard, 
          colorMode === 'dark' ? styles.dark : styles.light,
          hovering && styles.hovering,
          leaving && styles.leaving
        )}
        style={{
          transform: hovering 
            ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)` 
            : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
        }}
      >
        {imageUrl && (
          <div 
            className={styles.cardImage}
            style={{ 
              backgroundImage: `url(${imageUrl})`,
              transform: hovering ? `translateZ(20px)` : 'translateZ(0)'
            }}
          />
        )}
        
        <div className={styles.cardContent} style={{ 
          transform: hovering ? `translateZ(30px)` : 'translateZ(0)' 
        }}>
          <div className={styles.cardMeta}>
            {date && <span className={styles.cardDate}>{date}</span>}
            {readingTime && <span className={styles.readingTime}>{readingTime} min read</span>}
          </div>
          
          <h2 className={styles.cardTitle} style={{ 
            transform: hovering ? `translateZ(40px)` : 'translateZ(0)' 
          }}>
            {title}
          </h2>
          
          {description && (
            <p className={styles.cardDescription} style={{ 
              transform: hovering ? `translateZ(30px)` : 'translateZ(0)' 
            }}>
              {description}
            </p>
          )}
          
          {tags.length > 0 && (
            <div className={styles.cardTags} style={{ 
              transform: hovering ? `translateZ(40px)` : 'translateZ(0)' 
            }}>
              {tags.map((tag, index) => (
                <span key={index} className={styles.cardTag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {authors.length > 0 && (
            <div className={styles.cardAuthors} style={{ 
              transform: hovering ? `translateZ(50px)` : 'translateZ(0)' 
            }}>
              {authors.map((author, index) => (
                <div key={index} className={styles.author}>
                  {author.imageUrl && <img src={author.imageUrl} alt={author.name} className={styles.authorAvatar} />}
                  <span className={styles.authorName}>{author.name}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className={styles.cardOverlay} style={{
            opacity: hovering ? 0.15 : 0
          }}/>
          
          <div className={styles.cardShine} style={{
            opacity: hovering ? 1 : 0,
            transform: hovering 
              ? `translateX(${rotation.y * 10}px) translateY(${rotation.x * 10}px)` 
              : 'translateX(0) translateY(0)'
          }}/>
        </div>
      </div>
    </Link>
  );
} 