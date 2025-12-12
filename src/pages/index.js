import React, { useEffect, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './index.module.css';
import clsx from 'clsx';
import Translate, { translate } from '@docusaurus/Translate';
import TechStackGlobe from '@site/src/components/TechStackGlobe';
import CounterSection from '@site/src/components/CounterSection';
import TestimonialsCarousel from '@site/src/components/TestimonialsCarousel';
import { AnimatedHeroTitle } from '@site/src/components/JellyTextAnimation';
import { TranslatedJellyText } from '@site/src/components/JellyTextAnimation';
import DOSTerminal from '@site/src/components/DOSTerminal';
import GlitchText from '@site/src/components/GlitchText';
import { useVisitorTracking } from '@site/src/utils/blogApi';
import { rafThrottle } from '@site/src/utils/throttle';

// 3D网格动画背景组件
function AnimatedGridBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // 生成星星（优化：添加唯一 ID）
    const generatedStars = Array.from({ length: 50 }).map((_, index) => ({
      id: `star-${index}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5
    }));
    setStars(generatedStars);

    // 鼠标移动监听（优化：添加 RAF 节流）
    const handleMouseMove = rafThrottle((e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const x = (clientX - centerX) / centerX;
      const y = (clientY - centerY) / centerY;
      setMousePosition({ x, y });
    });

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
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

function HeroSection() {
  const { siteConfig } = useDocusaurusContext();

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

            {/* 主标题 - 果冻碰撞动画效果 */}
            <AnimatedHeroTitle />

            {/* 副标题 */}
            <p className={styles.heroDescription}>
              <Translate id="hero.description">
                从前端到后端，从架构到实践。探索现代Web开发的无限可能，打造高性能、可扩展的应用程序。
              </Translate>
            </p>

            {/* 按钮组 */}
            <div className={styles.heroActions}>
              <Link className={`${styles.btnHero} cursor-target`} to="/docs/intro">
                <Translate id="hero.btn.start">开始探索</Translate>
                <svg className={styles.arrowIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>

              <Link className={`${styles.btnOutline} cursor-target`} to="/blog">
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
                <span className={`${styles.techBadge} cursor-target`}>React</span>
                <span className={`${styles.techBadge} cursor-target`}>Spring Boot</span>
                <span className={`${styles.techBadge} cursor-target`}>TypeScript</span>
                <span className={`${styles.techBadge} cursor-target`}>Docker</span>
                <span className={`${styles.techBadge} cursor-target`}>Kubernetes</span>
              </div>
            </div>
          </div>

          {/* 右侧展示区 - DOS终端展示 */}
          <div className={styles.heroRight}>
            <DOSTerminal />
          </div>
        </div>

        {/* 底部统计数据 - 使用 CounterSection */}
        <div className={styles.heroStats}>
          <CounterSection
            items={[
              {
                value: 8,
                label: translate({ id: 'hero.stats.experience', message: '年开发经验' }),
                suffix: '+',
                color: '#7df9ff',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.statIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                value: 50,
                label: translate({ id: 'hero.stats.projects', message: '已完成项目' }),
                suffix: '+',
                color: '#ff6b9d',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.statIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )
              },
              {
                value: 99,
                label: translate({ id: 'hero.stats.satisfaction', message: '客户满意度' }),
                suffix: '%',
                color: '#c77dff',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.statIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                )
              },
              {
                value: 20,
                label: translate({ id: 'hero.stats.clients', message: '服务客户' }),
                suffix: '+',
                color: '#00ff88',
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
            <GlitchText speed={1} enableShadows={true} enableOnHover={false}>
              <TranslatedJellyText id="section.techStack" defaultMessage="技术栈" delay={0} disableHover={true} />
            </GlitchText>
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
  const history = useHistory();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className={styles.featureIcon}>
          <path d="M12 18.178l-4.62-1.256-.328-3.544h2.27l.158 1.844 2.52.667 2.52-.667.26-2.866H6.96l-.635-6.678h11.35l-.227 2.21H8.822l.204 2.256h8.217l-.624 6.778L12 18.178zM3 2h18l-1.623 18L12 22l-7.377-2L3 2zm2.188 2L6.49 18.434 12 19.928l5.51-1.494L18.812 4H5.188z" />
        </svg>
      ),
      title: <Translate id="feature.frontend.title">前端开发</Translate>,
      description: <Translate id="feature.frontend.desc">从HTML/CSS基础到React、Vue、Angular等现代框架，以及性能优化最佳实践</Translate>,
      gradient: 'linear-gradient(135deg, #3182CE 0%, #D53F8C 100%)',
      link: '/docs/frontend/frontend-intro',
      image: '/img/blog/blog-1.jpg',
      tags: ['React', 'Vue', 'Angular']
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className={styles.featureIcon}>
          <path d="M22 18.055c0 .96-.785 1.744-1.745 1.745a1.746 1.746 0 0 1-1.745-1.745c0-.96.785-1.745 1.745-1.745.149 0 .292.02.431.055V9.73a.87.87 0 0 0-.435-.052 1.744 1.744 0 1 1 1.749 0V18.055zm-9.781-1.442c-.226-.14-.482-.215-.749-.22a1.748 1.748 0 0 0-1.745 1.747c0 .965.788 1.746 1.745 1.746.964 0 1.745-.782 1.745-1.746 0-.261-.063-.508-.167-.726l4.15-7.153c.219.119.459.199.717.199a1.745 1.745 0 0 0 0-3.49c-.258 0-.5.081-.717.199L12.219 0 7.535 8.159c-.216-.118-.459-.199-.717-.199a1.745 1.745 0 0 0 0 3.49c.258 0 .498-.08.717-.199l4.047 6.977-4.363 7.5zm-.376 1.228a1.764 1.764 0 0 1-.104.635l-7.468-12.907a1.74 1.74 0 0 1 .286-2.03 1.742 1.742 0 0 1 2.462 0c.31.307.492.727.508 1.161h9.986a1.748 1.748 0 0 1 .511-1.161 1.743 1.743 0 0 1 2.462 0c.604.602.686 1.518.29 2.029L13.58 17.841z" />
        </svg>
      ),
      title: <Translate id="feature.backend.title">后端开发</Translate>,
      description: <Translate id="feature.backend.desc">Java核心技术、Spring Boot、微服务架构、分布式系统和高性能开发</Translate>,
      gradient: 'linear-gradient(135deg, #805AD5 0%, #3182CE 100%)',
      link: '/docs/backend/backend-intro',
      image: '/img/blog/blog-2.jpg',
      tags: ['Java', 'Spring Boot', 'MyBatis']
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className={styles.featureIcon}>
          <path d="M12 3c-4.21 0-8 1.37-8 3v2c0 1.63 3.79 3 8 3s8-1.37 8-3V6c0-1.63-3.79-3-8-3zM4 9v2c0 1.63 3.79 3 8 3s8-1.37 8-3V9c0 1.63-3.79 3-8 3s-8-1.37-8-3zm0 5v2c0 1.63 3.79 3 8 3s8-1.37 8-3v-2c0 1.63-3.79 3-8 3s-8-1.37-8-3z" />
        </svg>
      ),
      title: <Translate id="feature.database.title">数据库与存储</Translate>,
      description: <Translate id="feature.database.desc">关系型数据库设计、优化、NoSQL解决方案和大数据处理技术</Translate>,
      gradient: 'linear-gradient(135deg, #38B2AC 0%, #805AD5 100%)',
      link: '/docs/backend/database-orm/database-intro',
      image: '/img/blog/blog-3.jpg',
      tags: ['MySQL', 'Redis', 'MongoDB']
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className={styles.featureIcon}>
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
        </svg>
      ),
      title: <Translate id="feature.devops.title">系统架构</Translate>,
      description: <Translate id="feature.devops.desc">高可用、高性能系统设计、微服务架构、云原生应用和DevOps实践</Translate>,
      gradient: 'linear-gradient(135deg, #0BC5EA 0%, #D53F8C 100%)',
      link: '/docs/backend/system-design/devops-intro',
      image: '/img/blog/blog-4.jpg',
      tags: ['feature.tag.architecture', 'feature.tag.devops', 'feature.tag.docker']
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className={styles.featureIcon}>
          <path d="M17 16a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm0-18a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM7 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm8.6-1.8L12.3 8l-3.3 1.2 2.1-4.5 4.5 4.5zm-9.9 9.6l3.3-1.2 3.3-1.2-4.5 4.5-2.1-2.1z M19.4 19l-2.1-2.1.3-.3M6.3 7.2l-.3-.3 2.1-2.1" />
          <path d="M3 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9-8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM3 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
      ),
      title: <Translate id="feature.distributed.title">分布式系统</Translate>,
      description: <Translate id="feature.distributed.desc">关键技术的设计与实现，包括分布式理论、缓存、事务、搜索和锁</Translate>,
      gradient: 'linear-gradient(135deg, #ED8936 0%, #38B2AC 100%)',
      link: '/docs/backend/distributed-systems/distributed-theory',
      image: '/img/blog/blog-5.jpg',
      tags: ['feature.tag.distributed', 'feature.tag.cap', 'feature.tag.raft']
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className={styles.featureIcon}>
          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      ),
      title: <Translate id="feature.microservices.title">微服务架构</Translate>,
      description: <Translate id="feature.microservices.desc">微服务核心组件，如服务发现、API网关、配置中心、熔断器和分布式追踪</Translate>,
      gradient: 'linear-gradient(135deg, #9F7AEA 0%, #4299E1 100%)',
      link: '/docs/backend/microservices/api-gateway',
      image: '/img/blog/blog-13.jpg',
      tags: ['feature.tag.microservices', 'feature.tag.apigateway', 'feature.tag.dubbo']
    }
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          <span className={styles.gradientText}>
            <GlitchText speed={1} enableShadows={true} enableOnHover={false}>
              <TranslatedJellyText id="section.myExpertise" defaultMessage="核心技术领域" delay={0} disableHover={true} />
            </GlitchText>
          </span>
        </h2>
        <p className={styles.sectionSubtitle}>
          <Translate id="homepage.exploreStackDescription">
            探索全栈开发的各个方面，提升您的技术能力
          </Translate>
        </p>

        <div 
          className={`${styles.featuresGrid} ${isExpanded ? styles.featuresGridExpanded : ''}`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={styles.featureCard}
              style={{ 
                cursor: 'pointer',
                backgroundImage: `url(${feature.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
     {/*         <ElectricBorder
                color={['#7df9ff', '#ff6b9d', '#c77dff', '#00ff88', '#ffd700', '#00d4ff'][index % 6]}
                speed={0.8}
                chaos={0.4}
                thickness={2}
                style={{ borderRadius: 16, height: '100%', position: 'absolute', inset: 0, pointerEvents: 'none' }}
              />*/}
              <div className={styles.featureCardOverlay} />
              <div className={styles.featureCardContent}>
                {/* 上半部分 - 左对齐 */}
                <div className={styles.featureTopContent}>
                  <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                  <div className={styles.featureTags}>
                    {feature.tags && feature.tags.map((tag, i) => (
                      <span key={i} className={`${styles.featureTag} cursor-target`}>
                        <Translate id={tag}>{tag}</Translate>
                      </span>
                    ))}
                  </div>
                  <p className={styles.featureCardDescription}>{feature.description}</p>
                </div>
                
                {/* 右下角按钮 */}
                <button 
                  className={`${styles.featureReadButton} cursor-target`}
                  onClick={() => history.push(feature.link)}
                >
                  <span><Translate id="homepage.viewDetails">查看详情</Translate></span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentPosts() {
  const history = useHistory();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
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
    },
    {
      title: '微服务架构设计与实践',
      description: '深入探讨微服务架构的设计原则、实施策略和最佳实践...',
      date: '2025年07月15日',
      image: '/img/blog/blog-4.jpg',
      link: '/docs/backend/microservices/api-gateway',
      alt: '微服务架构设计与实践'
    },
    {
      title: '分布式系统设计模式',
      description: '介绍常见的分布式系统设计模式和架构方案...',
      date: '2025年06月20日',
      image: '/img/blog/blog-5.jpg',
      link: '/docs/backend/distributed/cap',
      alt: '分布式系统设计模式'
    },
    {
      title: '数据库性能优化实战',
      description: '从索引优化到查询优化，全面提升数据库性能...',
      date: '2025年05月10日',
      image: '/img/blog/blog-14.jpg',
      link: '/docs/database/mysql/index-optimization',
      alt: '数据库性能优化实战'
    },
    {
      title: 'React 高级开发技巧',
      description: 'React Hooks、性能优化和最佳实践...',
      date: '2025年04月05日',
      image: '/img/blog/blog-15.jpg',
      link: '/docs/frontend/react/component-design',
      alt: 'React 高级开发技巧'
    },
    {
      title: 'Node.js 后端开发指南',
      description: '构建高性能、可扩展的 Node.js 后端应用...',
      date: '2025年03月12日',
      image: '/img/blog/blog-8.jpg',
      link: '/docs/backend/nodejs/koa-middleware',
      alt: 'Node.js 后端开发指南'
    },
    {
      title: '系统架构设计原则',
      description: '高可用、高并发系统架构的设计与实现...',
      date: '2025年02月28日',
      image: '/img/blog/blog-9.jpg',
      link: '/docs/architecture/design-patterns/singleton',
      alt: '系统架构设计原则'
    }
  ];

  return (
    <section className={styles.recentPosts}>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          <span className={styles.gradientText}>
            <GlitchText speed={1} enableShadows={true} enableOnHover={false}>
              <TranslatedJellyText id="section.latestArticles" defaultMessage="最新文章" delay={0} disableHover={true} />
            </GlitchText>
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
          {posts.slice(0, 3).map((post, index) => (
            <div 
              key={index} 
              className={styles.postCard}
              style={{ 
                cursor: 'pointer',
                backgroundImage: `url(${post.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
{/*              <ElectricBorder
                color={['#7df9ff', '#ff6b9d', '#c77dff'][index % 3]}
                speed={0.8}
                chaos={0.4}
                thickness={2}
                style={{ borderRadius: 16, height: '100%', position: 'absolute', inset: 0, pointerEvents: 'none' }}
              />*/}
              <div className={styles.postCardOverlay} />
              <div className={styles.postCardContent}>
                {/* 上半部分 - 左对齐 */}
                <div className={styles.postTopContent}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <div className={styles.postTags}>
                    <span className={`${styles.postTag} cursor-target`}>
                      {typeof post.date === 'string' ? post.date : '2024'}
                    </span>
                    <span className={`${styles.postTag} cursor-target`}>
                      <Translate id="homepage.techArticle">技术文章</Translate>
                    </span>
                  </div>
                  <p className={styles.postDescription}>{post.description}</p>
                </div>
                
                {/* 右下角按钮 */}
                <button 
                  className={`${styles.postReadButton} cursor-target`}
                  onClick={() => history.push(post.link)}
                >
                  <span><Translate id="homepage.readArticle">阅读文章</Translate></span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.postsAction}>
          <Link to="/blog" className={`${styles.viewAllButton} cursor-target`}>
            <Translate id="section.viewAll">查看全部</Translate>
            <svg className={styles.buttonIcon} viewBox="0 0 24 24">
              <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
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
      name: translate({ id: 'testimonial.client1.name', message: '张女士' }),
      role: translate({ id: 'testimonial.client1.role', message: 'CEO' }),
      company: translate({ id: 'testimonial.client1.company', message: '科技创新公司' }),
      content: translate({ id: 'testimonial.client1.content', message: '非常满意Laby的工作，他不仅技术水平高，而且能够深入理解我们的业务需求。提供全面的解决方案，帮助我们团队提升了项目进度和质量。' }),
      rating: 5,
      image: require('@site/static/img/user/header.jpg').default
    },
    {
      id: 2,
      name: translate({ id: 'testimonial.client2.name', message: '王先生' }),
      role: translate({ id: 'testimonial.client2.role', message: '产品经理' }),
      company: translate({ id: 'testimonial.client2.company', message: '数字营销公司' }),
      content: translate({ id: 'testimonial.client2.content', message: '与Laby合作非常愉快，他的专业素养和工作态度令人印象深刻。项目交付及时，质量超出预期。' }),
      rating: 5,
      image: require('@site/static/img/user/header.jpg').default
    },
    {
      id: 3,
      name: translate({ id: 'testimonial.client3.name', message: '李先生' }),
      role: translate({ id: 'testimonial.client3.role', message: 'CTO' }),
      company: translate({ id: 'testimonial.client3.company', message: '智能科技公司' }),
      content: translate({ id: 'testimonial.client3.content', message: 'Laby是一位出色的全栈开发者，技术全面，沟通顺畅。他为我们提供了创新的解决方案，大大提升了产品的用户体验。' }),
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
              <GlitchText speed={1} enableShadows={true} enableOnHover={false}>
                <TranslatedJellyText id="section.testimonials" defaultMessage="客户评价" delay={0} disableHover={true} />
              </GlitchText>
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
              <GlitchText speed={1} enableShadows={true} enableOnHover={false}>
                <TranslatedJellyText id="homepage.readyToStart" defaultMessage="准备好开始您的项目了吗？" delay={0} disableHover={true} />
              </GlitchText>
            </span>
          </h2>
          <p className={styles.ctaDescription}>
            <Translate id="homepage.contactDescription">
              让我们一起讨论您的项目需求，将您的想法变为现实
            </Translate>
          </p>
          <Link to="/contact" className={`${styles.ctaButton} cursor-target`}>
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
  const { siteConfig } = useDocusaurusContext();

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
      <HeroSection />
      <main className={styles.main}>
        <FeaturesSection />
        <TechStackSection />
        <RecentPosts />
        <TestimonialsSection />
        <CallToAction />
      </main>
    </Layout>
  );
}
