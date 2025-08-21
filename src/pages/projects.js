import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './projects.module.css';
import Translate, {translate} from '@docusaurus/Translate';

export default function Projects() {
  // 所有技术标签
  const allTags = [
    translate({id: 'tech.microservices', message: '微服务'}), 
    translate({id: 'tech.react', message: 'React'}), 
    translate({id: 'tech.springboot', message: 'Spring Boot'}), 
    translate({id: 'tech.vue', message: 'Vue'}), 
    translate({id: 'tech.java', message: 'Java'}), 
    translate({id: 'tech.nodejs', message: 'Node.js'}), 
    translate({id: 'tech.typescript', message: 'TypeScript'}), 
    translate({id: 'tech.docker', message: 'Docker'}), 
    translate({id: 'tech.kubernetes', message: 'Kubernetes'}), 
    translate({id: 'tech.map', message: '地图'}), 
    translate({id: 'tech.vision', message: '视觉分析'}), 
    translate({id: 'tech.facial', message: '人脸识别'})
  ];
  
  // 状态管理
  const [activeTag, setActiveTag] = useState('all');
  const [isFiltering, setIsFiltering] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // 项目数据
  const projectsData = [
    {
      id: 1,
      title: translate({id: 'project1.title', message: '智慧城市安全监控系统'}),
      description: translate({id: 'project1.description', message: '基于微服务架构的城市安全监控系统，实现了视频监控、报警处理和AI识别分析等功能。'}),
      image: '/img/projects/project.png',
      tags: [
        translate({id: 'tech.microservices', message: '微服务'}),
        translate({id: 'tech.react', message: 'React'}),
        translate({id: 'tech.springboot', message: 'Spring Boot'}),
        translate({id: 'tech.vision', message: '视觉分析'})
      ],
      demoUrl: "http://120.48.86.168/screen/city",
      sourceUrl: "#",
      isFeatured: true,
      sourceAvailable: false
    },
    {
      id: 2,
      title: translate({id: 'project2.title', message: '智慧仓储大屏'}),
      description: translate({id: 'project2.description', message: '实时监控仓储状态的数据可视化系统，包含人员调度、车辆管理和任务分配功能。'}),
      image: '/img/projects/project2.png',
      tags: [
        translate({id: 'tech.vue', message: 'Vue'}),
        translate({id: 'tech.nodejs', message: 'Node.js'}),
        translate({id: 'tech.springboot', message: 'Spring Boot'}),
        translate({id: 'tech.docker', message: 'Docker'})
      ],
      demoUrl: "http://120.48.86.168/screen/city2",
      sourceUrl: "#",
      isFeatured: true,
      sourceAvailable: false
    },
    {
      id: 3,
      title: translate({id: 'project3.title', message: '光纤线路安防预警监测平台'}),
      description: translate({id: 'project3.description', message: '对光纤线路进行实时监测和预警，支持区域管理和异常情况快速响应。'}),
      image: '/img/projects/project3.png',
      tags: [
        translate({id: 'tech.java', message: 'Java'}),
        translate({id: 'tech.react', message: 'React'}),
        translate({id: 'tech.map', message: '地图'}),
        translate({id: 'tech.microservices', message: '微服务'})
      ],
      demoUrl: "http://120.48.86.168/screen/city3",
      sourceUrl: "#",
      isFeatured: false,
      sourceAvailable: false
    },
    {
      id: 4,
      title: translate({id: 'project4.title', message: '智慧营地管理系统'}),
      description: translate({id: 'project4.description', message: '营地人员、设备和资源的智能管理平台，提供实时状态监控和数据统计。'}),
      image: '/img/projects/project4.png',
      tags: [
        translate({id: 'tech.typescript', message: 'TypeScript'}),
        translate({id: 'tech.vue', message: 'Vue'}),
        translate({id: 'tech.springboot', message: 'Spring Boot'}),
        translate({id: 'tech.facial', message: '人脸识别'})
      ],
      demoUrl: "http://120.48.86.168/big-screen",
      sourceUrl: "#",
      isFeatured: false,
      sourceAvailable: false
    }
  ];
  
  // 根据标签筛选项目
  const filteredProjects = activeTag === 'all'
    ? projectsData
    : projectsData.filter(project => project.tags.includes(activeTag));
  
  // 技术标签组件
  const TechTag = ({ tag }) => (
    <span className={styles.techTag}>{tag}</span>
  );
  
  // 显示源码提示
  const handleSourceButtonClick = (e) => {
    e.preventDefault();
    setShowToast(true);
    
    // 2秒后自动隐藏提示
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };
  
  // 项目卡片组件
  const ProjectCard = ({ project }) => (
    <div className={styles.projectCard}>
      {project.isFeatured && (
        <div className={styles.featuredBadge}>
          <Translate>projects.featured</Translate>
        </div>
      )}
      <div className={styles.projectImageContainer}>
        <img src={project.image} alt={project.title} className={styles.projectImage} />
      </div>
      <div className={styles.projectContent}>
        <h3 className={styles.projectTitle}>{project.title}</h3>
        <p className={styles.projectDescription}>{project.description}</p>
        
        <div className={styles.techStackContainer}>
          {project.tags.map((tag, index) => (
            <TechTag key={index} tag={tag} />
          ))}
        </div>
        
        <div className={styles.projectFooter}>
          <Link
            className={clsx(styles.projectButton, styles.demoButton)}
            to={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span><Translate>projects.viewDemo</Translate></span>
            <svg className={styles.buttonIcon} viewBox="0 0 24 24">
              <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
            </svg>
          </Link>
          
          <button
            className={clsx(styles.projectButton, styles.sourceButton)}
            onClick={handleSourceButtonClick}
          >
            <span><Translate>projects.sourceCode</Translate></span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout
      title={translate({id: 'projects.meta.title', message: '项目作品'})}
      description={translate({id: 'projects.meta.description', message: '全栈开发工程师的项目作品展示，包括Web应用、移动应用和DevOps工具等'})}
    >
      {/* 炫酷标题区域 - 垂直排列 */}
      <header className={styles.projectsHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.projectsTitle}>项目作品</h1>
          <p className={styles.projectsDescription}>
            <Translate>projects.description</Translate>
          </p>
        </div>
      </header>
      
      <main className="container">
        {/* 筛选标签栏 */}
        <div className={styles.filterContainer}>
          <button 
            className={clsx(styles.filterTag, activeTag === 'all' && styles.active)}
            onClick={() => {
              setActiveTag('all');
              setIsFiltering(false);
            }}
          >
            <Translate>projects.showAll</Translate>
          </button>
          
          {allTags.map((tag, index) => (
            <button 
              key={index}
              className={clsx(styles.filterTag, activeTag === tag && styles.active)}
              onClick={() => {
                setActiveTag(tag);
                setIsFiltering(true);
              }}
            >
              {tag}
            </button>
          ))}
          
          {isFiltering && (
            <button 
              className={styles.clearFilter}
              onClick={() => {
                setActiveTag('all');
                setIsFiltering(false);
              }}
              aria-label={translate({id: 'projects.clearFilter', message: '清除筛选'})}
            >
              <span>✕</span>
            </button>
          )}
        </div>
        
        {/* 精选项目区域 */}
        <section>
          <h2 className={styles.sectionTitle}>
            <Translate>projects.featuredProjects</Translate>
          </h2>
          
          <div className={styles.projectsGrid}>
            {filteredProjects
              .filter(project => project.isFeatured)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              
            {filteredProjects.filter(project => project.isFeatured).length === 0 && (
              <div className={styles.noResults}>
                <h3><Translate>projects.noResults</Translate></h3>
                <p><Translate>projects.tryDifferent</Translate></p>
              </div>
            )}
          </div>
        </section>
        
        {/* 更多项目区域 */}
        <section>
          <h2 className={styles.sectionTitle}>
            <Translate>projects.moreProjects</Translate>
          </h2>
          
          <div className={styles.projectsGrid}>
            {filteredProjects
              .filter(project => !project.isFeatured)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              
            {filteredProjects.filter(project => !project.isFeatured).length === 0 && (
              <div className={styles.noResults}>
                <h3><Translate>projects.noResults</Translate></h3>
                <p><Translate>projects.tryDifferent</Translate></p>
              </div>
            )}
          </div>
        </section>
        
        {/* 联系区域 */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2><Translate>projects.haveIdea</Translate></h2>
            <p><Translate>projects.collaboration</Translate></p>
            <Link to="/about" className={clsx("button", "button--lg", styles.contactButton)}>
              <Translate>projects.contactMe</Translate>
            </Link>
          </div>
        </section>

        {/* 简洁的黑色透明提示框 */}
        {showToast && (
          <div className={styles.toast}>
            <Translate>projects.sourceCode.comingSoon</Translate>
          </div>
        )}
      </main>
    </Layout>
  );
} 