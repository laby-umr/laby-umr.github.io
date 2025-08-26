import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';

function EnhancedParticleBackground() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 8), 150);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          color: `rgba(${Math.random() * 50 + 50}, ${Math.random() * 100 + 150}, ${Math.random() * 100 + 200}, ${Math.random() * 0.3 + 0.2})`,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          shape: Math.random() > 0.7 ? 'circle' : Math.random() > 0.5 ? 'triangle' : 'square'
        });
      }
    };
    
    const drawShape = (particle) => {
      const { x, y, radius, rotation, shape } = particle;
      
      switch (shape) {
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(x + radius * Math.cos(rotation), y + radius * Math.sin(rotation));
          ctx.lineTo(x + radius * Math.cos(rotation + Math.PI * 2/3), y + radius * Math.sin(rotation + Math.PI * 2/3));
          ctx.lineTo(x + radius * Math.cos(rotation + Math.PI * 4/3), y + radius * Math.sin(rotation + Math.PI * 4/3));
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'square':
          ctx.beginPath();
          ctx.rect(x - radius/2, y - radius/2, radius, radius);
          ctx.fill();
          break;
          
        default: // circle
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
      }
    };
    
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制网格背景
      ctx.fillStyle = 'rgba(99, 179, 237, 0.02)';
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.fillRect(x, y, 1, 1);
        }
      }
      
      particles.forEach((particle, i) => {
        // 更新位置和旋转
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;
        
        // 边界检查
        if (particle.x < -particle.radius || particle.x > canvas.width + particle.radius) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y < -particle.radius || particle.y > canvas.height + particle.radius) {
          particle.speedY = -particle.speedY;
        }
        
        // 绘制粒子
        ctx.fillStyle = particle.color;
        drawShape(particle);
        
        // 连接附近的粒子
        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = particle.x - p2.x;
          const dy = particle.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 179, 237, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawParticles();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className={styles.enhancedParticleCanvas} />;
}

export default EnhancedParticleBackground;