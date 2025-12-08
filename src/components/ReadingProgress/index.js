import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import { useLocation } from '@docusaurus/router';
import clsx from 'clsx';

export default function ReadingProgress() {
  const [width, setWidth] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [particles, setParticles] = useState([]);
  const progressBarRef = useRef(null);
  const particlesContainerRef = useRef(null);
  const location = useLocation();
  const particleCount = 5; // 粒子数量（优化：减少粒子）
  
  // 重置进度条，当路由变化时
  useEffect(() => {
    setWidth(0);
    setShowProgress(false);
    setParticles([]);
  }, [location.pathname]);

  // 计算阅读进度
  useEffect(() => {
    let ticking = false;
    
    const calculateScrollProgress = () => {
      ticking = false;
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
        setShowProgress(false);
        return;
      }
      
      // 计算滚动百分比
      const scrolled = window.scrollY / windowHeight;
      const newWidth = Math.min(scrolled * 100, 100);
      setWidth(newWidth);
      
      // 显示进度条（当用户开始滚动时）
      if (window.scrollY > 100) {
        setShowProgress(true);
      } else {
        setShowProgress(false);
      }
      
      // 生成粒子（优化：降低生成频率）
      if (progressBarRef.current && particlesContainerRef.current && newWidth > 0) {
        if (Math.random() > 0.92 && particles.length < 15) {
          createParticle();
        }
      }
    };
    
    // 节流处理滚动事件
    const requestTick = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(calculateScrollProgress);
      }
    };

    // 创建粒子函数
    const createParticle = () => {
      if (!progressBarRef.current) return;
      
      const progressRect = progressBarRef.current.getBoundingClientRect();
      const progressWidth = progressRect.width;
      
      // 确保不在空白进度条上创建粒子
      if (progressWidth <= 10) return;
      
      // 随机粒子位置 (x坐标在进度条范围内，y为中心)
      const x = Math.random() * progressWidth * 0.9; // 在进度条长度内随机
      const size = Math.random() * 6 + 4; // 4px ~ 10px
      
      // 随机速度和寿命
      const vx = (Math.random() - 0.5) * 1; // 左右飘动
      const vy = (Math.random() - 0.5) * 3 - 1; // 向上飘动为主
      const life = Math.random() * 1 + 0.5; // 0.5s ~ 1.5s
      
      // 随机不透明度和颜色
      const opacity = Math.random() * 0.7 + 0.3; // 0.3 ~ 1.0
      const hue = Math.random() * 40 + 200; // 蓝色到紫色范围
      
      setParticles(prevParticles => [
        ...prevParticles,
        {
          id: Date.now() + Math.random(),
          x,
          y: 0,
          size,
          vx,
          vy,
          life,
          opacity,
          color: `hsl(${hue}, 80%, 60%)`,
          createdAt: Date.now()
        }
      ]);
    };
    
    // 更新粒子位置和状态
    const updateParticles = () => {
      setParticles(prevParticles => 
        prevParticles
          .map(particle => {
            const age = (Date.now() - particle.createdAt) / 1000; // 年龄(秒)
            if (age > particle.life) return null; // 移除过期粒子
            
            // 更新位置
            const lifeRatio = age / particle.life;
            const fadeFactor = 1 - lifeRatio; // 随时间渐隐
            
            return {
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              opacity: particle.opacity * fadeFactor
            };
          })
          .filter(Boolean) // 移除null值
      );
    };

    // 初始化计算
    calculateScrollProgress();
    
    // 创建动画循环（优化：降低更新频率）
    let animationFrameId;
    let lastUpdate = 0;
    const animate = (timestamp) => {
      if (timestamp - lastUpdate > 50) { // 限制为 20fps
        updateParticles();
        lastUpdate = timestamp;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate(0);
    
    // 监听滚动事件（优化：使用节流）
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', requestTick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [location.pathname, particles.length]);

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
    <div className={clsx(styles.progressContainer, showProgress && styles.visible)}>
      <div 
        ref={progressBarRef}
        className={styles.progressBar} 
        style={{ width: `${width}%` }}
      >
        <div className={styles.progressGlow}></div>
      </div>
      
      <div 
        ref={particlesContainerRef}
        className={styles.particlesContainer}
      >
        {particles.map(particle => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 1.5}px ${particle.color}`
            }}
          />
        ))}
      </div>
    </div>
  );
} 