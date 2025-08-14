import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import Translate, {translate} from '@docusaurus/Translate';
// 导入react-icons图标
import { FaReact, FaServer, FaDatabase, FaMobile, FaTools, FaCode } from 'react-icons/fa';
import { SiSpringboot, SiDocker, SiKubernetes } from 'react-icons/si';
import { MdOutlineRocketLaunch, MdOutlineArchitecture } from 'react-icons/md';
import { BsLightningChargeFill, BsCheckCircleFill } from 'react-icons/bs';
import { IoSpeedometerOutline } from 'react-icons/io5';
import { AiOutlineTeam } from 'react-icons/ai';

// 图标组件
function Icon({icon, className}) {
  const icons = {
    'rocket': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8.566 17.842c-.945.144-1.89.288-2.59-.144-1.296-.792-1.488-1.908-1.734-3.324-.246-1.416-.61-3.06-2.354-4.476C.532 8.91.316 8.061.53 7.271c.214-.792.808-1.404 1.69-1.728 1.126-.414 1.926-1.066 2.458-1.944.534-.878.836-1.908 1.264-2.736C6.37 0.033 7.25-.323 8.242.27c.99.594 1.94 1.728 2.87 2.736.93 1.01 1.808 1.908 2.87 2.43 1.06.526 2.294.684 3.462.9 1.168.216 2.276.492 3.038 1.188.762.698 1.168 1.818.726 2.907-.444 1.092-1.738 2.046-2.64 2.736-.9.686-1.43 1.122-1.774 1.688-.346.566-.508 1.26-.656 1.962-.148.7-.282 1.416-.798 1.98-.516.564-1.416.973-2.276.972-.858 0-1.678-.408-2.498-.83-.82-.418-1.642-.85-2.88-.85-1.196-.002-2.064.226-3.01.37zm2.87-16.486c-.152.476-.304.952-.457 1.428.457-.156.913-.312 1.37-.468-.273-.318-.547-.634-.913-.96zm-1.37 20.644c.456-.16.913-.32 1.37-.48-.153.48-.305.96-.458 1.44.305-.304.61-.608.915-.912-.457.16-.913.32-1.37.48.153-.48.305-.96.457-1.44-.304.304-.61.608-.914.912z"></path></svg>,
    'tools': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21.315 6.95L15.05.685a2.342 2.342 0 0 0-3.312 0L9.366 3.058l-.295-.295a1 1 0 0 0-1.414 0L6.364 4.057a1 1 0 0 0 0 1.414l.295.295-2.93 2.929a5.06 5.06 0 0 0-1.457 4.14c.1 1.018.548 1.889 1.187 2.528L.293 18.535a1 1 0 1 0 1.414 1.414l3.172-3.172c.683.683 1.624 1.138 2.643 1.228 1.103.097 2.17-.287 3-.83a1 1 0 0 0 .274-.274l3.496-3.496a1 1 0 0 0-1.414-1.414L9.457 15.4a2.546 2.546 0 0 1-2.929-.203 2.834 2.834 0 0 1-.731-1.25 3.06 3.06 0 0 1 .851-2.503l2.93-2.929 5.658 5.657a2.343 2.343 0 0 0 3.312 0l3.312-3.312a2.342 2.342 0 0 0-.545-3.91zM19.9 8.777l-1.898 1.898-5.657-5.657 1.898-1.898a.343.343 0 0 1 .485 0L19.9 8.293a.343.343 0 0 1 0 .484z"></path></svg>,
    'code': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M16.95 8.464l1.414-1.414 4.243 4.242-4.243 4.243-1.414-1.414L19.364 12l-2.414-2.414zm-9.9 0L4.636 12l2.414 2.414-1.414 1.414L1.393 11.57l4.243-4.242 1.414 1.414z"></path><path d="M14.293 2.293l1.414 1.414-7.071 7.071-1.414-1.414 7.071-7.071z"></path></svg>,
    'pie': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-5-8h2a3 3 0 0 0 6 0h2a5 5 0 0 1-10 0z"></path></svg>,
    'lightning': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M13 9h9l-6 12-3-6h-9l6-12 3 6z"></path></svg>,
    'pin': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18 3v2h-1v6l2 3v2h-6v7h-2v-7H5v-2l2-3V5H6V3h12zM9 5v6.606L7.404 14h9.192L15 11.606V5H9z"></path></svg>,
    'frontend': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 8H4v8h16v-8zm0-2V5H4v4h16z"></path></svg>,
    'backend': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M5 11.1l2-2 5.5 5.5 3.5-3.5 3 3V5H5v6.1zm0 2.829V19h3.1l2.986-2.985L7 11.929l-2 2zM10.929 19H19v-2.071l-3-3L10.929 19zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"></path></svg>,
    'database': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11 7v13H9V7h2zm2 13V7h2v13h-2zM21 5v16.993c0 .556-.449 1.007-1.007 1.007H4.007A1.006 1.006 0 0 1 3 21.993V5h18zm-2 2H5v14h14V7zM8 3h8v2H8V3z"></path></svg>,
    'mobile': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7 4v16h10V4H7zM6 2h12a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm6 15a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path></svg>,
    'devops': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M5.33 3.271a3.5 3.5 0 0 1 4.472 4.474L20.647 18.59l-2.122 2.121L7.68 9.867a3.5 3.5 0 0 1-4.472-4.474L5.444 7.63a1.5 1.5 0 1 0 2.121-2.121L5.329 3.27zm10.367 1.884l3.182-1.768 1.414 1.414-1.768 3.182-1.768.354-2.12 2.121-1.415-1.414 2.121-2.121.354-1.768zm-7.071 7.778l2.121 2.122-4.95 4.95A1.5 1.5 0 0 1 3.58 17.99l.097-.107 4.95-4.95z"></path></svg>,
    'quality': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path></svg>
  };
  
  return (
    <div className={className}>
      {icons[icon]}
    </div>
  );
}

// Tech Badge component
function TechBadge({name}) {
  return <span className="tech-badge">{name}</span>;
}

// Hero section with animated gradient
function HeroHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={clsx('row', styles.heroRow)}>
          <div className={clsx('col col--7', styles.heroContent)}>
            <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              <Heading as="h1" className="hero__title">
                <Translate id="hero.title">Laby的博客</Translate>
              </Heading>
              <p className="hero__subtitle">
                <Translate id="hero.tagline">探索现代Web开发的全部领域</Translate>
              </p>
              <div className={styles.heroBadges}>
                <TechBadge name={translate({id: "hero.badge.frontend", message: '前端'})} />
                <TechBadge name={translate({id: "hero.badge.backend", message: '后端'})} />
                <TechBadge name="DevOps" />
                <TechBadge name={translate({id: "hero.badge.architecture", message: '架构'})} />
                <TechBadge name={translate({id: "hero.badge.mobile", message: '移动开发'})} />
              </div>
              <div className={styles.buttons}>
                <Link
                  className={clsx('button button--primary button--lg', styles.heroButton)}
                  to="/blog">
                  <Translate id="hero.button.readBlog">阅读博客</Translate>
                </Link>
                <Link
                  className={clsx('button button--outline button--lg', styles.heroButton)}
                  to="/projects">
                  <Translate id="hero.button.viewProjects">查看项目</Translate>
                </Link>
              </div>
            </div>
          </div>
          <div className={clsx('col col--5', styles.heroVisual)}>
            <div className={styles.codeSnippet}>
              <div className={styles.codeHeader}>
                <span className={styles.codeDot}></span>
                <span className={styles.codeDot}></span>
                <span className={styles.codeDot}></span>
                <span className={styles.codeTitle}>HelloWorld.js</span>
              </div>
              <pre className={styles.codeBlock}>
                <code>
                  <span className={styles.keyword}>const</span> <span className={styles.variable}>developer</span> = {'{'}
                  <br />
                  {'  '}<span className={styles.property}>name</span>: <span className={styles.string}>'<Translate id="code.developer.name">全栈开发者</Translate>'</span>,
                  <br />
                  {'  '}<span className={styles.property}>skills</span>: [<span className={styles.string}>'React'</span>, <span className={styles.string}>'Node.js'</span>, <span className={styles.string}>'DevOps'</span>],
                  <br />
                  {'  '}<span className={styles.method}>code</span>(){' {'}<br />
                  {'    '}<span className={styles.keyword}>return</span> <span className={styles.string}>'<Translate id="code.developer.return">构建出色的Web体验</Translate>'</span>;
                  <br />
                  {'  }'}<br />
                  {'};'}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Feature cards
function FeatureCard({icon, title, description, link}) {
  return (
    <Link to={link || '#'} className={styles.cardLink}>
      <div className={clsx('card', styles.card)}>
        <div className={styles.cardIcon}>
          {icon}
        </div>
        <div className="card__header">
          <Heading as="h3">{title}</Heading>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
      </div>
    </Link>
  );
}

// Blog preview section
function BlogPreview() {
  // This would typically fetch the actual blog posts
  const blogPosts = [
    {
      title: translate({
        id: "blog.post1.title",
        message: '构建现代Web应用'
      }),
      date: translate({
        id: "blog.post1.date",
        message: '2023年8月25日'
      }),
      excerpt: translate({
        id: "blog.post1.excerpt",
        message: '探索使用React创建高性能Web应用的最新技术和最佳实践。'
      }),
      url: '/blog/modern-react-patterns',
    },
    {
      title: translate({
        id: "blog.post2.title",
        message: '可扩展的后端架构'
      }),
      date: translate({
        id: "blog.post2.date",
        message: '2023年7月12日'
      }),
      excerpt: translate({
        id: "blog.post2.excerpt",
        message: '如何使用微服务设计能够高效处理增长和扩展的后端系统。'
      }),
      url: '/blog/long-blog-post',
    },
  ];

  return (
    <section className={styles.blogSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            <Translate id="section.latestArticles">最新文章</Translate>
          </Heading>
          <Link to="/blog" className={styles.sectionLink}>
            <Translate id="section.viewAll">查看全部</Translate>
          </Link>
        </div>
        <div className="row">
          {blogPosts.map((post, idx) => (
            <div key={idx} className="col col--6">
              <div className={styles.blogCard}>
                <Heading as="h3" className={styles.blogTitle}>
                  <Link to={post.url}>{post.title}</Link>
                </Heading>
                <p className={styles.blogDate}>{post.date}</p>
                <p className={styles.blogExcerpt}>{post.excerpt}</p>
                <Link to={post.url} className={styles.blogReadMore}>
                  <Translate id="blog.readMore">阅读更多</Translate> →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main features section
function Features() {
  const features = [
    {
      title: translate({id: "feature.frontend.title", message: '前端开发'}),
      icon: <FaReact size={32} />,
      description: translate({
        id: "feature.frontend.desc",
        message: '使用现代框架和库构建响应式、交互式的用户界面。'
      }),
      link: '/docs/frontend/frontend-intro',
    },
    {
      title: translate({id: "feature.backend.title", message: '后端解决方案'}),
      icon: <SiSpringboot size={32} />,
      description: translate({
        id: "feature.backend.desc",
        message: '创建健壮的服务器端应用程序、API和微服务，满足可扩展应用需求。'
      }),
      link: '/docs/backend/backend-intro',
    },
    {
      title: translate({id: "feature.database.title", message: '数据库设计'}),
      icon: <FaDatabase size={32} />,
      description: translate({
        id: "feature.database.desc",
        message: '设计高效的数据库架构和查询优化，提升应用性能。'
      }),
      link: '/docs/backend/database-orm/database-intro',
    },
    {
      title: translate({id: "feature.mobile.title", message: '移动应用开发'}),
      icon: <FaMobile size={32} />,
      description: translate({
        id: "feature.mobile.desc",
        message: '开发跨平台移动应用，在iOS和Android上无缝运行。'
      }),
      link: '/docs/frontend/mobile-dev/mobile-intro',
    },
    {
      title: translate({id: "feature.devops.title", message: 'DevOps实践'}),
      icon: <SiDocker size={32} />,
      description: translate({
        id: "feature.devops.desc",
        message: '实现CI/CD流程、容器化和基础设施即代码，实现平滑部署。'
      }),
      link: '/docs/backend/system-design/devops-intro',
    },
    {
      title: translate({id: "feature.code.title", message: '代码质量'}),
      icon: <BsCheckCircleFill size={32} />,
      description: translate({
        id: "feature.code.desc",
        message: '编写可维护、可测试的代码，遵循最佳实践和现代设计模式。'
      }),
      link: '/docs/backend/design-patterns/code-quality-intro',
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            <Translate id="section.myExpertise">我的专长</Translate>
          </Heading>
        </div>
        <div className="row" style={{margin: '0 -20px'}}>
          {features.map((feature, idx) => (
            <div key={idx} className="col col--4" style={{padding: '0 20px', marginBottom: '40px'}}>
              <FeatureCard 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                link={feature.link}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Newsletter section
function NewsletterSection() {
  return (
    <section className={styles.newsletter}>
      <div className="container">
        <div className={styles.newsletterInner}>
          <div className="row">
            <div className="col col--6">
              <Heading as="h2" className={styles.newsletterTitle}>
                <Translate id="newsletter.title">保持联系</Translate>
              </Heading>
              <p className={styles.newsletterDescription}>
                <Translate id="newsletter.description">
                订阅我的通讯，获取最新文章、教程和技术见解。
                </Translate>
              </p>
            </div>
            <div className="col col--6">
              <form className={styles.newsletterForm}>
                <input
                  type="email"
                  className={styles.newsletterInput}
                  placeholder={translate({
                    id: "newsletter.email.placeholder",
                    message: '您的邮箱地址'
                  })}
                />
                <button type="submit" className={styles.newsletterButton}>
                  <Translate id="newsletter.subscribe">订阅</Translate>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 波浪分隔符组件
function WaveDivider() {
  return (
    <div className="wave-divider">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path className="wave1" d="M0,32L48,37.3C96,43,192,53,288,80C384,107,480,149,576,149.3C672,149,768,107,864,90.7C960,75,1056,85,1152,90.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        <path className="wave2" d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,149.3C672,160,768,224,864,234.7C960,245,1056,203,1152,186.7C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  );
}

// 统计数字组件
function StatCards() {
  return (
    <div className="container">
      <div className="row">
        <div className="col col--4">
          <div className="stat-card">
            <div className="stat-number">150+</div>
            <div className="stat-label"><Translate id="stats.projects">完成的项目</Translate></div>
          </div>
        </div>
        <div className="col col--4">
          <div className="stat-card">
            <div className="stat-number">9+</div>
            <div className="stat-label"><Translate id="stats.experience">年行业经验</Translate></div>
          </div>
        </div>
        <div className="col col--4">
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label"><Translate id="stats.support">技术支持</Translate></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3D翻转卡片组件
function FlipCards() {
  return (
    <div className="container">
      <div className="row">
        <div className="col col--4">
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <div className={styles.cardIcon}>
                  <FaReact size={32} />
                </div>
                <h3><Translate id="flip.frontend.title">前端开发</Translate></h3>
                <p><Translate id="flip.frontend.subtitle">悬停查看详情</Translate></p>
              </div>
              <div className="flip-card-back">
                <h3><Translate id="flip.frontend.details.title">技术栈</Translate></h3>
                <p><Translate id="flip.frontend.details.content">React, Vue, Angular, Next.js, 响应式设计</Translate></p>
                <Link to="/docs/frontend/frontend-intro">
                  <button className="button-3d"><Translate id="flip.learn">了解更多</Translate></button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col col--4">
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <div className={styles.cardIcon}>
                  <FaServer size={32} />
                </div>
                <h3><Translate id="flip.backend.title">后端开发</Translate></h3>
                <p><Translate id="flip.backend.subtitle">悬停查看详情</Translate></p>
              </div>
              <div className="flip-card-back">
                <h3><Translate id="flip.backend.details.title">技术栈</Translate></h3>
                <p><Translate id="flip.backend.details.content">Node.js, Spring Boot, Express, 微服务架构</Translate></p>
                <Link to="/docs/backend/backend-intro">
                  <button className="button-3d"><Translate id="flip.learn">了解更多</Translate></button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col col--4">
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <div className={styles.cardIcon}>
                  <SiKubernetes size={32} />
                </div>
                <h3><Translate id="flip.devops.title">DevOps</Translate></h3>
                <p><Translate id="flip.devops.subtitle">悬停查看详情</Translate></p>
              </div>
              <div className="flip-card-back">
                <h3><Translate id="flip.devops.details.title">技术栈</Translate></h3>
                <p><Translate id="flip.devops.details.content">Docker, Kubernetes, CI/CD, AWS, Azure</Translate></p>
                <Link to="/docs/backend/system-design/devops-intro">
                  <button className="button-3d"><Translate id="flip.learn">了解更多</Translate></button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 信息卡片组件
function InfoCard() {
  return (
    <div className="info-card">
      <h3 className="info-card-title"><Translate id="info.card.title">我的优势</Translate></h3>
      <div className="feature-list">
        <div className="feature-item">
          <FaCode className="feature-icon" />
          <Translate id="info.feature.1">9年全栈开发经验，精通前后端技术栈，能独立完成系统架构设计与开发</Translate>
        </div>
        <div className="feature-item">
          <MdOutlineArchitecture className="feature-icon" />
          <Translate id="info.feature.2">丰富的企业级应用开发经验，专注于高并发、高可用系统设计</Translate>
        </div>
        <div className="feature-item">
          <AiOutlineTeam className="feature-icon" />
          <Translate id="info.feature.3">优秀的项目管理能力，主导过多个大型项目，确保高质量交付</Translate>
        </div>
        <div className="feature-item">
          <BsLightningChargeFill className="feature-icon" />
          <Translate id="info.feature.4">持续学习AI、云原生等前沿技术，将创新方案应用到实际项目中</Translate>
        </div>
      </div>
    </div>
  );
}

// 时间线组件
function Timeline() {
  return (
    <div className="timeline">
      <div className="timeline-item">
        <div className="timeline-content">
          <div className="timeline-date">2020 - <Translate id="timeline.present">至今</Translate></div>
          <h3><Translate id="timeline.title.1">全栈开发</Translate></h3>
          <p><Translate id="timeline.content.1">负责企业级Web应用的前后端开发，专注于微服务架构和现代化前端框架。</Translate></p>
        </div>
      </div>
      <div className="timeline-item">
        <div className="timeline-content">
          <div className="timeline-date">2018 - 2020</div>
          <h3><Translate id="timeline.title.2">前端开发</Translate></h3>
          <p><Translate id="timeline.content.2">专注于响应式UI设计和前端性能优化，使用React和Vue框架开发复杂应用。</Translate></p>
        </div>
      </div>
      <div className="timeline-item">
        <div className="timeline-content">
          <div className="timeline-date">2015 - 2018</div>
          <h3><Translate id="timeline.title.3">后端开发</Translate></h3>
          <p><Translate id="timeline.content.3">开发和维护服务器端应用，设计数据库结构，构建RESTful API。</Translate></p>
        </div>
      </div>
    </div>
  );
}

// 添加发光文本
function GlowText() {
  return (
    <div className="container text-center" style={{padding: '3rem 0'}}>
      <h2 className="glow-text"><Translate id="glow.text">探索、创新、实现</Translate></h2>
    </div>
  );
}

// 首页组件
export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={translate({
        id: "meta.title", 
        message: "欢迎来到Laby的博客",
        description: "Homepage meta title"
      })}
      description={translate({
        id: "meta.description", 
        message: "全栈开发工程师的博客，分享Web开发见解、教程和最佳实践",
        description: "Homepage meta description"
      })}
    >
      <HeroHeader />
      <main>
        <GlowText />
        
        {/* 移除重复的"我的专长"标题和内容，保留Features组件 */}
        <Features />
        
        <WaveDivider />
        
        <section style={{padding: '3rem 0'}}>
          <div className="container">
            <div className="text-center margin-bottom--lg">
              <Heading as="h2" className={styles.sectionTitle}>
                <Translate id="section.stats">关键数据</Translate>
              </Heading>
            </div>
            <StatCards />
          </div>
        </section>
        
        <section style={{padding: '3rem 0', background: 'rgba(74, 108, 247, 0.03)'}}>
          <div className="container">
            <div className="text-center margin-bottom--lg">
              <Heading as="h2" className={styles.sectionTitle}>
                <Translate id="section.services">我们的服务</Translate>
              </Heading>
            </div>
            <FlipCards />
          </div>
        </section>
        
        <section style={{padding: '3rem 0'}}>
          <div className="container">
            <InfoCard />
          </div>
        </section>
        
        <section style={{padding: '3rem 0'}}>
          <div className="container">
            <div className="text-center margin-bottom--lg">
              <Heading as="h2" className={styles.sectionTitle}>
                <Translate id="section.experience">职业经历</Translate>
              </Heading>
            </div>
            <Timeline />
          </div>
        </section>
        
        {/* 移除重复的"最新文章"标题，保留BlogPreview组件 */}
        <BlogPreview />
      </main>
    </Layout>
  );
}
