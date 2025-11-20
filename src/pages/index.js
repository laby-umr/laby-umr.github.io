import React, { useEffect, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import styles from './index.module.css';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';
import TechStackGlobe from '@site/src/components/TechStackGlobe';
import CounterSection from '@site/src/components/CounterSection';
import TestimonialsCarousel from '@site/src/components/TestimonialsCarousel';
import { useVisitorTracking } from '@site/src/utils/blogApi';

// 3D网格动画背景组件
function AnimatedGridBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    // 生成星星
    const generatedStars = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5
    }));
    setStars(generatedStars);
    
    // 鼠标移动监听
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const x = (clientX - centerX) / centerX;
      const y = (clientY - centerY) / centerY;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className={styles.gridBackground}>
      {/* 主网格层 */}
      <div 
        className={styles.gridLayer1}
        style={{
          transform: `rotateX(${mousePosition.y * 15}deg) rotateY(${-mousePosition.x * 15}deg)`,
        }}
      />
      
      {/* 次网格层 */}
      <div 
        className={styles.gridLayer2}
        style={{
          transform: `rotateX(${mousePosition.y * 10}deg) rotateY(${-mousePosition.x * 10}deg)`,
        }}
      />
      
      {/* 动态交叉线 */}
      <div className={styles.crossLines}>
        <div className={styles.horizontalLine1} />
        <div className={styles.horizontalLine2} />
        <div className={styles.verticalLine1} />
        <div className={styles.verticalLine2} />
      </div>
      
      {/* 星星效果 */}
      <div className={styles.starsContainer}>
        {stars.map((star, index) => (
          <div
            key={index}
            className={styles.star}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
      
      {/* 发光球体 */}
      <div 
        className={styles.glowOrb1}
        style={{
          transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
        }}
      />
      <div 
        className={styles.glowOrb2}
        style={{
          transform: `translate(${-mousePosition.x * 15}px, ${-mousePosition.y * 15}px)`,
        }}
      />
      <div className={styles.glowOrb3} />
    </div>
  );
}

// 粒子背景组件（保留原有实现）
function ParticleBackground() {
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
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: `rgba(99, 179, 237, ${Math.random() * 0.5 + 0.2})`,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
        });
      }
    };
    
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, i) => {
        // 更新位置
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // 边界检查
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
        
        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // 连接附近的粒子
        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = particle.x - p2.x;
          const dy = particle.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 179, 237, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
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
  
  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
}

function HeroSection() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <header className={styles.hero}>
      <AnimatedGridBackground />
      <div className="container">
        <div className={styles.heroGrid}>
          {/* 左侧内容 */}
          <div className={styles.heroLeft}>
            {/* 顶部标签 */}
            <div className={styles.heroTag}>
              <span className={styles.sparkle}>✨</span>
              <Translate id="hero.tag">全栈开发者的技术博客</Translate>
            </div>
            
            {/* 主标题 - 超大字体 */}
            <h1 className={styles.heroTitle}>
              <span className={styles.titleLine1}>
                <Translate id="hero.title.build">构建</Translate>
              </span>
              <span className={styles.titleLine2}>
                <span className={styles.gradientText}>
                  <Translate id="hero.title.amazing">令人惊艳的</Translate>
                </span>
              </span>
              <span className={styles.titleLine3}>
                <Translate id="hero.title.solutions">技术解决方案</Translate>
              </span>
            </h1>
            
            {/* 副标题 */}
            <p className={styles.heroDescription}>
              <Translate id="hero.description">
                从前端到后端，从架构到实践。探索现代Web开发的无限可能，打造高性能、可扩展的应用程序。
              </Translate>
            </p>
            
            {/* 按钮组 */}
            <div className={styles.heroActions}>
              <Link className={styles.btnHero} to="/docs/intro">
                <Translate id="hero.btn.start">开始探索</Translate>
                <svg className={styles.arrowIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <Link className={styles.btnOutline} to="/blog">
                <svg className={styles.btnIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <Translate id="hero.btn.blog">阅读博客</Translate>
              </Link>
            </div>
            
            {/* 技术栈 */}
            <div className={styles.techBadges}>
              <span className={styles.techLabel}><Translate id="hero.tech.label">技术栈：</Translate></span>
              <div className={styles.badgeGroup}>
                <span className={styles.techBadge}>React</span>
                <span className={styles.techBadge}>Spring Boot</span>
                <span className={styles.techBadge}>TypeScript</span>
                <span className={styles.techBadge}>Docker</span>
                <span className={styles.techBadge}>Kubernetes</span>
              </div>
            </div>
          </div>
          
          {/* 右侧展示区 - 炫酷的组件演示 */}
          <div className={styles.heroRight}>
            <div className={styles.mockupWindow}>
              <div className={styles.mockupHeader}>
                <div className={styles.mockupDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className={styles.mockupTitle}>Component Preview</div>
              </div>
              <div className={styles.mockupContent}>
                {/* 模拟代码块 - 逐字打字机效果 */}
                <div className={styles.codeBlock}>
                  <div className={styles.codeLine}>
                    <span className={styles.typingText}>
                      <span className={styles.codeKeyword}>console</span>
                      <span className={styles.codeParen}>.</span>
                      <span className={styles.codeVar}>log</span>
                      <span className={styles.codeParen}>(</span>
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.typingText} style={{animationDelay: '1.2s'}}>
                      <span className={styles.codeIndent}>  </span>
                      <span className={styles.codeString}>"Welcome to Laby's Blog"</span>
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.typingText} style={{animationDelay: '3s'}}>
                      <span className={styles.codeParen}>)</span>
                    </span>
                  </div>
                </div>
                
                {/* 组件预览卡片 */}
                <div className={styles.previewCards}>
                  <div className={styles.miniCard}>
                    <div className={styles.miniCardHeader}></div>
                    <div className={styles.miniCardBody}>
                      <div className={styles.miniLine}></div>
                      <div className={styles.miniLine} style={{width: '80%'}}></div>
                    </div>
                  </div>
                  <div className={styles.miniCard} style={{animationDelay: '0.2s'}}>
                    <div className={styles.miniCardHeader}></div>
                    <div className={styles.miniCardBody}>
                      <div className={styles.miniLine}></div>
                      <div className={styles.miniLine} style={{width: '60%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部统计数据 - 使用 CounterSection */}
        <div className={styles.heroStats}>
          <CounterSection
            items={[
              {
                value: 8,
                label: translate({id: 'hero.stats.experience', message: '年开发经验'}),
                suffix: '+',
                color: 'hsl(var(--ifm-color-primary-hue), 70%, 50%)',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.statIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                value: 50,
                label: translate({id: 'hero.stats.projects', message: '已完成项目'}),
                suffix: '+',
                color: 'hsl(var(--ifm-color-primary-hue), 70%, 50%)',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.statIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )
              },
              {
                value: 99,
                label: translate({id: 'hero.stats.satisfaction', message: '客户满意度'}),
                suffix: '%',
                color: 'hsl(var(--ifm-color-primary-hue), 70%, 50%)',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.statIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                )
              },
              {
                value: 20,
                label: translate({id: 'hero.stats.clients', message: '服务客户'}),
                suffix: '+',
                color: 'hsl(var(--ifm-color-primary-hue), 70%, 50%)',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.statIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              }
            ]}
            columns={4}
            animationDuration={2}
          />
        </div>
      </div>
    </header>
  );
}

function TechStackSection() {
  const techStack = [
    { name: "React", color: "hsl(193, 95%, 68%)" },
    { name: "Vue", color: "hsl(153, 47%, 49%)" },
    { name: "TypeScript", color: "hsl(217, 91%, 60%)" },
    { name: "JavaScript", color: "hsl(51, 100%, 50%)" },
    { name: "Node.js", color: "hsl(142, 76%, 36%)" },
    { name: "GraphQL", color: "hsl(300, 85%, 60%)" },
    { name: "Next.js", color: "hsl(0, 0%, 20%)" },
    { name: "Redux", color: "hsl(280, 67%, 45%)" },
    { name: "MongoDB", color: "hsl(120, 67%, 35%)" },
    { name: "Express", color: "hsl(204, 67%, 45%)" },
    { name: "Tailwind CSS", color: "hsl(199, 89%, 48%)" },
    { name: "Framer Motion", color: "hsl(341, 100%, 67%)" },
    { name: "Three.js", color: "hsl(0, 0%, 0%)" },
    { name: "WebGL", color: "hsl(186, 100%, 41%)" },
    { name: "Firebase", color: "hsl(36, 100%, 50%)" },
    { name: "REST API", color: "hsl(200, 100%, 50%)" },
    { name: "CI/CD", color: "hsl(344, 78%, 48%)" },
    { name: "Git", color: "hsl(11, 100%, 50%)" },
    { name: "Docker", color: "hsl(201, 100%, 40%)" },
    { name: "Jest", color: "hsl(336, 91%, 54%)" }
  ];

  return (
    <section className={styles.techStack}>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          <span className={styles.gradientText}>
            <Translate id="section.techStack">技术栈</Translate>
          </span>
        </h2>
        <p className={styles.sectionSubtitle}>
          <Translate id="homepage.techStackDescription">
            我使用现代化的技术栈构建大型可扩展的应用
          </Translate>
        </p>
        
        <TechStackGlobe 
          items={techStack}
          radius={230}
          speed={0.7}
          opacity={0.9}
          interactive={true}
          height="600px"
        />
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className={styles.featureIcon}>
          <path d="M12 18.178l-4.62-1.256-.328-3.544h2.27l.158 1.844 2.52.667 2.52-.667.26-2.866H6.96l-.635-6.678h11.35l-.227 2.21H8.822l.204 2.256h8.217l-.624 6.778L12 18.178zM3 2h18l-1.623 18L12 22l-7.377-2L3 2zm2.188 2L6.49 18.434 12 19.928l5.51-1.494L18.812 4H5.188z"/>
        </svg>
      ),
      title: <Translate id="feature.frontend.title">前端开发</Translate>,
      description: <Translate id="feature.frontend.desc">从HTML/CSS基础到React、Vue、Angular等现代框架，以及性能优化最佳实践</Translate>,
      gradient: 'linear-gradient(135deg, #3182CE 0%, #D53F8C 100%)',
      link: '/docs/frontend/frontend-intro'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className={styles.featureIcon}>
          <path d="M22 18.055c0 .96-.785 1.744-1.745 1.745a1.746 1.746 0 0 1-1.745-1.745c0-.96.785-1.745 1.745-1.745.149 0 .292.02.431.055V9.73a.87.87 0 0 0-.435-.052 1.744 1.744 0 1 1 1.749 0V18.055zm-9.781-1.442c-.226-.14-.482-.215-.749-.22a1.748 1.748 0 0 0-1.745 1.747c0 .965.788 1.746 1.745 1.746.964 0 1.745-.782 1.745-1.746 0-.261-.063-.508-.167-.726l4.15-7.153c.219.119.459.199.717.199a1.745 1.745 0 0 0 0-3.49c-.258 0-.5.081-.717.199L12.219 0 7.535 8.159c-.216-.118-.459-.199-.717-.199a1.745 1.745 0 0 0 0 3.49c.258 0 .498-.08.717-.199l4.047 6.977-4.363 7.5zm-.376 1.228a1.764 1.764 0 0 1-.104.635l-7.468-12.907a1.74 1.74 0 0 1 .286-2.03 1.742 1.742 0 0 1 2.462 0c.31.307.492.727.508 1.161h9.986a1.748 1.748 0 0 1 .511-1.161 1.743 1.743 0 0 1 2.462 0c.604.602.686 1.518.29 2.029L13.58 17.841z"/>
        </svg>
      ),
      title: <Translate id="feature.backend.title">后端开发</Translate>,
      description: <Translate id="feature.backend.desc">Java核心技术、Spring Boot、微服务架构、分布式系统和高性能开发</Translate>,
      gradient: 'linear-gradient(135deg, #805AD5 0%, #3182CE 100%)',
      link: '/docs/backend/backend-intro'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className={styles.featureIcon}>
          <path d="M12 3c-4.21 0-8 1.37-8 3v2c0 1.63 3.79 3 8 3s8-1.37 8-3V6c0-1.63-3.79-3-8-3zM4 9v2c0 1.63 3.79 3 8 3s8-1.37 8-3V9c0 1.63-3.79 3-8 3s-8-1.37-8-3zm0 5v2c0 1.63 3.79 3 8 3s8-1.37 8-3v-2c0 1.63-3.79 3-8 3s-8-1.37-8-3z"/>
        </svg>
      ),
      title: <Translate id="feature.database.title">数据库与存储</Translate>,
      description: <Translate id="feature.database.desc">关系型数据库设计、优化、NoSQL解决方案和大数据处理技术</Translate>,
      gradient: 'linear-gradient(135deg, #38B2AC 0%, #805AD5 100%)',
      link: '/docs/backend/database-orm/database-intro'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className={styles.featureIcon}>
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>
      ),
      title: <Translate id="feature.devops.title">系统架构</Translate>,
      description: <Translate id="feature.devops.desc">高可用、高性能系统设计、微服务架构、云原生应用和DevOps实践</Translate>,
      gradient: 'linear-gradient(135deg, #0BC5EA 0%, #D53F8C 100%)',
      link: '/docs/backend/system-design/devops-intro'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className={styles.featureIcon}>
          <path d="M17 16a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm0-18a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM7 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm8.6-1.8L12.3 8l-3.3 1.2 2.1-4.5 4.5 4.5zm-9.9 9.6l3.3-1.2 3.3-1.2-4.5 4.5-2.1-2.1z M19.4 19l-2.1-2.1.3-.3M6.3 7.2l-.3-.3 2.1-2.1"/>
          <path d="M3 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9-8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM3 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>
      ),
      title: <Translate id="feature.distributed.title">分布式系统</Translate>,
      description: <Translate id="feature.distributed.desc">关键技术的设计与实现，包括分布式理论、缓存、事务、搜索和锁</Translate>,
      gradient: 'linear-gradient(135deg, #ED8936 0%, #38B2AC 100%)',
      link: '/docs/backend/distributed-systems/distributed-theory'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className={styles.featureIcon}>
          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      ),
      title: <Translate id="feature.microservices.title">微服务架构</Translate>,
      description: <Translate id="feature.microservices.desc">微服务核心组件，如服务发现、API网关、配置中心、熔断器和分布式追踪</Translate>,
      gradient: 'linear-gradient(135deg, #9F7AEA 0%, #4299E1 100%)',
      link: '/docs/backend/microservices/api-gateway'
    }
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          <span className={styles.gradientText}>
            <Translate id="section.myExpertise">核心技术领域</Translate>
          </span>
        </h2>
        <p className={styles.sectionSubtitle}>
          <Translate id="homepage.exploreStackDescription">
            探索全栈开发的各个方面，提升您的技术能力
          </Translate>
        </p>
        
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <Link 
              key={idx} 
              to={feature.link}
              className={styles.featureCard}
              style={{
                background: `radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 70%), ${feature.gradient}`
              }}
            >
              <div className={styles.featureIconWrapper}>
                {feature.icon}
            </div>
              <h3 className={styles.featureTitle}>
                {feature.title}
              </h3>
              <p className={styles.featureDescription}>
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentPosts() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const posts = [
    {
      title: <Translate id='blog.post1.title'>数字孪生技术基础与企业应用场景</Translate>,
      description: <Translate id='blog.post1.excerpt'>探索数字孪生技术的基础概念、核心架构和在企业场景中的实施...</Translate>,
      date: <Translate id='blog.post1.date'>2024年12月24日</Translate>,
      image: '/img/blog/blog-1.jpg',
      link: '/blog/digital-twin-fundamentals',
      alt: '数字孪生技术基础与企业应用场景'
    },
    {
      title: <Translate id='blog.post2.title'>企业AI系统实施策略与最佳实践</Translate>,
      description: <Translate id='blog.post2.excerpt'>从需求分析到部署和维护，全面指导企业环境中AI系统的实施...</Translate>,
      date: <Translate id='blog.post2.date'>2025年08月18日</Translate>,
      image: '/img/blog/blog-2.jpg',
      link: '/blog/enterprise-ai-implementation',
      alt: '企业AI系统实施策略与最佳实践'
    },
    {
      title: <Translate id='blog.post3.title'>AI大模型投资回报分析与价值评估</Translate>,
      description: <Translate id='blog.post3.excerpt'>如何评估AI项目的ROI，量化AI的商业价值，以及常见的评估误区...</Translate>,
      date: <Translate id='blog.post3.date'>2025年08月21日</Translate>,
      image: '/img/blog/blog-3.jpg',
      link: '/blog/ai-roi-value',
      alt: 'AI大模型投资回报分析与价值评估'
    }
  ];
  
  return (
    <section className={styles.recentPosts}>
      <div className={styles.postsBg} />
      <div className="container">
        <h2 className={styles.sectionTitle}>
          <span className={styles.gradientText}>
            <Translate id="section.latestArticles">最新文章</Translate>
          </span>
        </h2>
        <p className={styles.sectionSubtitle}>
          <Translate id="homepage.technicalShare">技术分享与实践经验</Translate>
        </p>
        
        <div 
          className={`${styles.postsGrid} ${isExpanded ? styles.postsGridExpanded : ''}`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {posts.map((post, idx) => (
            <Link key={idx} to={post.link} className={styles.postCard}>
              <div className={styles.postImageContainer}>
                <img 
                  src={post.image} 
                  alt={post.alt}
                  className={styles.postImage} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/img/logo.svg';
                  }}
                />
                <div className={styles.postImageOverlay} />
              </div>
              <div className={styles.postContent}>
                <p className={styles.postDate}>
                  {post.date}
                </p>
                <h3 className={styles.postTitle}>
                  {post.title}
                </h3>
                <p className={styles.postDescription}>
                  {post.description}
                </p>
                <button className={styles.postReadMore}>
                  <Translate id="blog.readMore">阅读更多</Translate>
                  <svg className={styles.readMoreIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
            </div>
            </Link>
          ))}
          </div>
        
        <div className={styles.postsAction}>
          <Link to="/blog" className={styles.viewAllButton}>
            <Translate id="section.viewAll">查看全部</Translate>
            <svg className={styles.buttonIcon} viewBox="0 0 24 24">
              <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// 客户评价部分
function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: translate({id: 'testimonial.client1.name', message: '张女士'}),
      role: translate({id: 'testimonial.client1.role', message: 'CEO'}),
      company: translate({id: 'testimonial.client1.company', message: '科技创新公司'}),
      content: translate({id: 'testimonial.client1.content', message: '非常满意Laby的工作，他不仅技术水平高，而且能够深入理解我们的业务需求。提供全面的解决方案，帮助我们团队提升了项目进度和质量。'}),
      rating: 5,
      image: require('@site/static/img/user/header.jpg').default
    },
    {
      id: 2,
      name: translate({id: 'testimonial.client2.name', message: '王先生'}),
      role: translate({id: 'testimonial.client2.role', message: '产品经理'}),
      company: translate({id: 'testimonial.client2.company', message: '数字营销公司'}),
      content: translate({id: 'testimonial.client2.content', message: '与Laby合作非常愉快，他的专业素养和工作态度令人印象深刻。项目交付及时，质量超出预期。'}),
      rating: 5,
      image: require('@site/static/img/user/header.jpg').default
    },
    {
      id: 3,
      name: translate({id: 'testimonial.client3.name', message: '李先生'}),
      role: translate({id: 'testimonial.client3.role', message: 'CTO'}),
      company: translate({id: 'testimonial.client3.company', message: '智能科技公司'}),
      content: translate({id: 'testimonial.client3.content', message: 'Laby是一位出色的全栈开发者，技术全面，沟通顺畅。他为我们提供了创新的解决方案，大大提升了产品的用户体验。'}),
      rating: 5,
      image: require('@site/static/img/user/header.jpg').default
    }
  ];

  return (
    <section className={styles.testimonials}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.gradientText}>
              <Translate id="section.testimonials">客户评价</Translate>
            </span>
          </h2>
          <p className={styles.sectionSubtitle}>
            <Translate id="homepage.testimonialsDescription">
              来自合作伙伴的真实评价和反馈
            </Translate>
          </p>
        </div>
        
        <TestimonialsCarousel 
          testimonials={testimonials}
          autoplay={true}
          interval={7000}
        />
      </div>
    </section>
  );
}

// CTA 部分
function CallToAction() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.ctaContent}>
          <div className={styles.ctaBadge}>
            <Translate id="cta.collaborate">与我合作</Translate>
          </div>
          <h2 className={styles.ctaTitle}>
            <span className={styles.gradientText}>
              <Translate id="homepage.readyToStart">准备好开始您的项目了吗？</Translate>
            </span>
          </h2>
          <p className={styles.ctaDescription}>
            <Translate id="homepage.contactDescription">
              让我们一起讨论您的项目需求，将您的想法变为现实
            </Translate>
          </p>
          <Link to="/contact" className={styles.ctaButton}>
            <span className={styles.ctaButtonText}>
              <Translate id="cta.contactMe">联系我</Translate>
            </span>
            <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  
  // 访客追踪
  useEffect(() => {
    const cleanup = useVisitorTracking();
    return cleanup;
  }, []);
  
  // 首先获取纯文本的翻译，之后手动替换变量
  const metaTitle = translate({
    id: 'homepage.meta.title',
    message: '欢迎来到Laby的博客',
    description: '首页标题'
  });
  
  return (
    <Layout
      // 如果需要动态替换，可以在获取翻译后进行
      title={metaTitle}
      description={translate({
        id: 'homepage.meta.description',
        message: '全栈开发工程师的博客，分享Web开发见解、教程和最佳实践',
        description: '首页元描述'
      })}
    >
      <ParticleBackground />
      <HeroSection />
      <main className={styles.main}>
        <TechStackSection />
        <RecentPosts />
        <TestimonialsSection />
        <CallToAction />
      </main>
    </Layout>
  );
}
