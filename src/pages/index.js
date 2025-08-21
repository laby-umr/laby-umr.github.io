import React, { useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import styles from './index.module.css';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';

// 粒子背景组件
function ParticleBackground() {
  // 保持原有实现不变
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
      <div className={styles.heroOverlay} />
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.gradientText}>
              <Translate id="hero.title">Laby的博客</Translate>
            </span>
          </h1>
          <p className={styles.heroSubtitle}>
            <Translate id="hero.tagline">探索现代Web开发的全部领域</Translate>
          </p>
          
          <div className={styles.heroButtons}>
            <Link className={clsx('button button--primary', styles.heroButton)} to="/docs/intro">
              <span><Translate id="homepage.exploreDocumentation">开始探索文档</Translate></span>
              <svg className={styles.buttonIcon} viewBox="0 0 24 24">
                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
              </svg>
                </Link>
            <Link className={clsx('button', styles.heroButtonOutline)} to="/blog">
              <span><Translate id="homepage.browseBlog">浏览博客</Translate></span>
                </Link>
          </div>
          
          <div className={styles.techStack}>
            <div className={styles.techBadge}><span><Translate id="hero.badge.frontend">前端</Translate></span></div>
            <div className={styles.techBadge}><span><Translate id="hero.badge.backend">后端</Translate></span></div>
            <div className={styles.techBadge}><span><Translate id="hero.badge.architecture">架构</Translate></span></div>
            <div className={styles.techBadge}><span><Translate id="hero.badge.mobile">移动开发</Translate></span></div>
          </div>
        </div>
      </div>
      
      <div className={styles.scrollIndicator}>
        <div className={styles.chevron}></div>
        <div className={styles.chevron}></div>
        <div className={styles.chevron}></div>
      </div>
    </header>
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
  const posts = [
    {
      title: <Translate id='blog.post1.title'>数字孪生技术基础与企业应用场景</Translate>,
      description: <Translate id='blog.post1.excerpt'>探索数字孪生技术的基础概念、核心架构和在企业场景中的实施...</Translate>,
      date: <Translate id='blog.post1.date'>2024年12月24日</Translate>,
      image: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=1470&auto=format&fit=crop',
      link: '/blog/digital-twin-fundamentals',
      alt: '数字孪生技术基础与企业应用场景'
    },
    {
      title: <Translate id='blog.post2.title'>企业AI系统实施策略与最佳实践</Translate>,
      description: <Translate id='blog.post2.excerpt'>从需求分析到部署和维护，全面指导企业环境中AI系统的实施...</Translate>,
      date: <Translate id='blog.post2.date'>2025年08月18日</Translate>,
      image: 'https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?q=80&w=1470&auto=format&fit=crop',
      link: '/blog/enterprise-ai-implementation',
      alt: '企业AI系统实施策略与最佳实践'
    },
    {
      title: <Translate id='blog.post3.title'>AI大模型投资回报分析与价值评估</Translate>,
      description: <Translate id='blog.post3.excerpt'>如何评估AI项目的ROI，量化AI的商业价值，以及常见的评估误区...</Translate>,
      date: <Translate id='blog.post3.date'>2025年08月21日</Translate>,
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop',
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
        
        <div className={styles.postsGrid}>
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
                <span className={styles.postReadMore}>
                  <Translate id="blog.readMore">阅读更多</Translate>
                  <svg className={styles.readMoreIcon} viewBox="0 0 24 24">
                    <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                  </svg>
                </span>
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

function CallToAction() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.ctaInner}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              <Translate id="homepage.readyToLearn">准备好开始学习了吗？</Translate>
            </h2>
            <p className={styles.ctaDescription}>
              <Translate id="homepage.visitDocs">
                访问文档库，提升您的开发技能，构建更好的应用程序
              </Translate>
            </p>
            <Link to="/docs/intro" className={clsx('button button--primary', styles.ctaButton)}>
              <Translate id="homepage.browseDocs">浏览文档库</Translate>
              <svg className={styles.buttonIcon} viewBox="0 0 24 24">
                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
      </svg>
            </Link>
          </div>
          
          <div className={styles.ctaDecoration}>
            <div className={styles.ctaSphere1}></div>
            <div className={styles.ctaSphere2}></div>
            <div className={styles.ctaSphere3}></div>
            <div className={styles.ctaGrid}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  
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
        <FeaturesSection />
        <RecentPosts />
        <CallToAction />
      </main>
    </Layout>
  );
}
