import React, { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function HeroSection() {
  const {siteConfig} = useDocusaurusContext();
  const canvasRef = useRef(null);
  
  // 添加交互效果和3D背景
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // 设置canvas大小为窗口大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 定义粒子类
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
        
        // 为主题色粒子添加特殊大小和颜色
        if (Math.random() > 0.95) {
          this.size = Math.random() * 2.5 + 1;
          this.color = `rgba(74, 108, 247, ${Math.random() * 0.5})`;
        } else if (Math.random() > 0.9) {
          this.size = Math.random() * 2 + 0.8;
          this.color = `rgba(14, 165, 234, ${Math.random() * 0.4})`;
        }
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
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
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }
    
    // 添加连线效果
    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.2;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    // 创建粒子
    function init() {
      const particleCount = Math.min(Math.floor(window.innerWidth / 20), 100);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    
    // 动画循环
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      drawLines();
      requestAnimationFrame(animate);
    }
    
    init();
    animate();
    
    // 鼠标交互
    let mouseX = 0;
    let mouseY = 0;
    
    canvas.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY - canvas.getBoundingClientRect().top;
      
      // 添加鼠标影响
      particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) * 0.02;
          particle.speedX += dx / distance * force;
          particle.speedY += dy / distance * force;
          
          // 限制最大速度
          const maxSpeed = 2;
          const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
          
          if (currentSpeed > maxSpeed) {
            particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
            particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
          }
        }
      });
    });
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <header className={styles.hero}>
      <canvas ref={canvasRef} className={styles.heroCanvas} />
      
      <div className={clsx('container', styles.heroContainer)}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {siteConfig.title}
          </h1>
          
          <p className={styles.heroSubtitle}>
            {siteConfig.tagline}
          </p>
          
          <div className={styles.techTags}>
            <span className={styles.techBadge}>前端开发</span>
            <span className={styles.techBadge}>后端架构</span>
            <span className={styles.techBadge}>系统设计</span>
            <span className={styles.techBadge}>数据库</span>
            <span className={styles.techBadge}>DevOps</span>
          </div>
          
          <div className={styles.heroButtons}>
            <Link
              className={clsx('button button--primary', styles.heroButton)}
              to="/docs/intro">
              开始浏览
            </Link>
            <Link
              className={clsx('button button--outline button--secondary', styles.heroButton)}
              to="/blog">
              博客文章
            </Link>
          </div>
        </div>
        
        <div className={styles.heroGraphic}>
          <div className={styles.floatingCode}>
            <pre className={styles.codeSnippet}>
              <code>
                <span className={styles.keyword}>const</span> <span className={styles.variable}>blog</span> = {'{'}
                <br />
                {'  '}<span className={styles.property}>title</span>: <span className={styles.string}>"Laby的博客"</span>,
                <br />
                {'  '}<span className={styles.property}>description</span>: <span className={styles.string}>"技术分享与学习"</span>,
                <br />
                {'  '}<span className={styles.method}>start</span>() {'{'}
                <br />
                {'    '}<span className={styles.comment}>// 开始探索</span>
                <br />
                {'    '}<span className={styles.keyword}>return</span> <span className={styles.string}>"欢迎访问!"</span>;
                <br />
                {'  }{'}
                <br />
                {'}'};
              </code>
            </pre>
          </div>
          
          <div className={styles.floatingCard}>
            <div className={styles.cardHeader}>最新文章</div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>探索最新技术趋势</div>
              <div className={styles.cardTags}>
                <span>#前端</span>
                <span>#后端</span>
              </div>
            </div>
          </div>
          
          <div className={styles.circle1}></div>
          <div className={styles.circle2}></div>
          <div className={styles.circle3}></div>
        </div>
      </div>
      
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollArrow}></div>
      </div>
    </header>
  );
} 