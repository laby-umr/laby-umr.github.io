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
    window.addEventListener('resize', resizeCanvas);
    
    // 粒子配置
    const particlesArray = [];
    const numberOfParticles = 50;
    
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
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.maxSize = Math.random() * 5 + 5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // 边界检查
        if (this.x > canvas.width || this.x < 0) {
          this.speedX *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY *= -1;
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
    
    // 动画循环
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      // 添加连线效果
      connectParticles();
      
      requestAnimationFrame(animate);
    }
    
    // 粒子之间的连线
    function connectParticles() {
      const maxDistance = 150;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = `${getParticleColor()}${opacity * 0.5})`;
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
      className="particles-js"
    />
  );
} 