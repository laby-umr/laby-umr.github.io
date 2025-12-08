import React, { useEffect, useRef, useState } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 初始化当前主题
    const updateTheme = () => {
      const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(isDarkTheme ? 'dark' : 'light');
    };
    
    // 首次运行检测当前主题
    updateTheme();
    
    // 监听主题变化
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    
    // 设置canvas尺寸为窗口尺寸
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    
    // 粒子配置（优化：减少数量）
    const particlesArray = [];
    const numberOfParticles = Math.min(Math.floor(window.innerWidth / 20), 50);
    
    // 粒子颜色
    const getParticleColor = () => {
      if (theme === 'dark') {
        return 'rgba(99, 179, 237, '; // 深色主题粒子颜色
      } else {
        return 'rgba(49, 130, 206, '; // 浅色主题粒子颜色
      }
    };
    
    // 粒子类
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 0.5; // 调整粒子大小范围
        this.speedX = Math.random() * 1.5 - 0.75; // 调整粒子水平速度
        this.speedY = Math.random() * 1.5 - 0.75; // 调整粒子垂直速度
        this.maxSize = Math.random() * 4 + 3; // 调整粒子最大尺寸
        this.opacity = Math.random() * 0.5 + 0.1; // 保持不变
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // 边界检查 - 使用回绕方式处理边界
        if (this.x > canvas.width) {
          this.x = 0;
        } else if (this.x < 0) {
          this.x = canvas.width;
        }
        
        if (this.y > canvas.height) {
          this.y = 0;
        } else if (this.y < 0) {
          this.y = canvas.height;
        }
        
        // 微小浮动
        this.size += Math.random() * 0.2 - 0.1;
        if (this.size < 0.1) this.size = 0.1;
        if (this.size > this.maxSize) this.size = this.maxSize;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${getParticleColor()}${this.opacity})`;
        ctx.fill();
        
        // 添加发光效果
        ctx.shadowBlur = 15;
        ctx.shadowColor = `${getParticleColor()}1)`;
        
        // 重置阴影，防止影响其他绘制
        ctx.shadowBlur = 0;
      }
    }
    
    // 初始化粒子
    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    
    // 动画循环（优化：限制帧率）
    let lastFrame = 0;
    const fps = 30;
    const frameInterval = 1000 / fps;
    
    function animate(timestamp) {
      const elapsed = timestamp - lastFrame;
      if (elapsed < frameInterval) {
        requestAnimationFrame(animate);
        return;
      }
      lastFrame = timestamp - (elapsed % frameInterval);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      // 添加连线效果
      connectParticles();
      
      requestAnimationFrame(animate);
    }
    
    // 粒子之间的连线（优化：减少距离和计算）
    function connectParticles() {
      const maxDistance = 100;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = `${getParticleColor()}${opacity * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }
    
    init();
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, [theme]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}