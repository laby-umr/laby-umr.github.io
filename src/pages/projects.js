import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './projects.module.css';
import Translate, { translate } from '@docusaurus/Translate';
import { useVisitorTracking } from '@site/src/utils/blogApi';

export default function Projects() {
  // 项目数据（移到最前面，避免依赖问题）
  const projects = [
    {
      id: 1,
      title: translate({id: 'project1.title', message: '智慧城市安全监控系统'}),
      subtitle: translate({id: 'project1.subtitle', message: '城市级安全监控平台'}),
      description: translate({id: 'project1.description', message: '基于微服务架构的城市安全监控系统，实现了视频监控、报警处理和AI识别分析等功能。集成多个智能模块，支持大规模并发访问。'}),
      longDescription: translate({id: 'project1.longDescription', message: '该系统采用Spring Cloud微服务架构，集成了视频监控、智能分析、报警处理、数据统计等多个模块。前端使用React + TypeScript构建，实现了实时数据展示、地图可视化、报警推送等功能。系统支持大规模并发访问，具备高可用性和可扩展性，可接入数千路视频流进行实时分析。采用AI视觉识别技术，能够自动识别异常行为、人脸识别、车牌识别等，大大提升了城市安全管理效率。'}),
      image: '/img/projects/project.png',
      techStack: ['Spring Cloud', 'React', 'TypeScript', 'Redis', 'MySQL', 'WebSocket', 'AI视觉分析', 'Docker'],
      demoUrl: 'http://120.48.86.168/screen/city',
      repoUrl: '#',
      categories: ['web', 'ai', 'iot'],
      features: [
        translate({id: 'project1.feature.1', message: '实时视频监控与AI分析'}),
        translate({id: 'project1.feature.2', message: '智能报警与事件处理'}),
        translate({id: 'project1.feature.3', message: '地图可视化与轨迹追踪'}),
        translate({id: 'project1.feature.4', message: '人脸识别与车牌识别'}),
        translate({id: 'project1.feature.5', message: '数据统计与报表生成'}),
        translate({id: 'project1.feature.6', message: '多级权限管理'})
      ]
    },
    {
      id: 2,
      title: translate({id: 'project2.title', message: '智慧仓储大屏'}),
      subtitle: translate({id: 'project2.subtitle', message: '仓储数据可视化系统'}),
      description: translate({id: 'project2.description', message: '实时监控仓储状态的数据可视化系统，包含人员调度、车辆管理和任务分配功能。采用大屏展示，数据实时更新。'}),
      longDescription: translate({id: 'project2.longDescription', message: '该系统为大型仓储物流企业打造的数据可视化平台，采用Vue3 + ECharts构建，提供实时的仓储数据可视化展示。系统集成了人员调度、车辆管理、任务分配、库存监控等核心功能，通过WebSocket实现数据实时推送。大屏展示采用响应式设计，支持多种分辨率适配。后端使用Spring Boot + MyBatis Plus，配合Redis缓存提升性能。系统帮助管理者快速了解仓储运营状况，优化资源配置，提高运营效率。'}),
      image: '/img/projects/project2.png',
      techStack: ['Vue3', 'ECharts', 'Spring Boot', 'MyBatis Plus', 'Redis', 'WebSocket', 'Docker', 'Nginx'],
      demoUrl: 'http://120.48.86.168/screen/city2',
      repoUrl: '#',
      categories: ['web'],
      features: [
        translate({id: 'project2.feature.1', message: '实时数据大屏展示'}),
        translate({id: 'project2.feature.2', message: '人员调度与考勤管理'}),
        translate({id: 'project2.feature.3', message: '车辆进出与路线管理'}),
        translate({id: 'project2.feature.4', message: '任务分配与进度跟踪'}),
        translate({id: 'project2.feature.5', message: '库存监控与预警'}),
        translate({id: 'project2.feature.6', message: '数据统计与分析报表'})
      ]
    },
    {
      id: 3,
      title: translate({id: 'project3.title', message: '光纤线路安防预警监测平台'}),
      subtitle: translate({id: 'project3.subtitle', message: '光纤监测预警系统'}),
      description: translate({id: 'project3.description', message: '对光纤线路进行实时监测和预警，支持区域管理和异常情况快速响应。集成GIS地图，实现可视化管理。'}),
      longDescription: translate({id: 'project3.longDescription', message: '该平台为电信运营商开发的光纤线路监测系统，采用React + Leaflet地图实现可视化管理。系统能够实时监测光纤线路状态，通过传感器数据分析，及时发现线路异常、断点、衰减等问题并发出预警。支持区域管理、巡检任务分配、工单处理等功能。后端采用微服务架构，使用Spring Cloud全家桶，配合Kafka进行消息队列处理。系统大大提升了光纤线路的维护效率，减少了故障响应时间。'}),
      image: '/img/projects/project3.png',
      techStack: ['React', 'Leaflet', 'Spring Cloud', 'Kafka', 'PostgreSQL', 'Redis', 'Kubernetes', 'Prometheus'],
      demoUrl: 'http://120.48.86.168/screen/city3',
      repoUrl: '#',
      categories: ['web', 'iot'],
      features: [
        translate({id: 'project3.feature.1', message: '实时光纤线路监测'}),
        translate({id: 'project3.feature.2', message: 'GIS地图可视化'}),
        translate({id: 'project3.feature.3', message: '智能预警与告警'}),
        translate({id: 'project3.feature.4', message: '区域管理与巡检'}),
        translate({id: 'project3.feature.5', message: '工单处理与派发'}),
        translate({id: 'project3.feature.6', message: '历史数据分析'})
      ]
    },
    {
      id: 4,
      title: translate({id: 'project4.title', message: '智慧营地管理系统'}),
      subtitle: translate({id: 'project4.subtitle', message: '营地智能管理平台'}),
      description: translate({id: 'project4.description', message: '营地人员、设备和资源的智能管理平台，提供实时状态监控和数据统计。集成人脸识别，实现智能化管理。'}),
      longDescription: translate({id: 'project4.longDescription', message: '该系统为大型营地管理打造的智能化平台，采用Vue3 + TypeScript构建前端，集成了人脸识别、设备管理、资源调度、门禁控制等功能。系统通过人脸识别实现人员进出管理，支持访客登记、考勤打卡等功能。设备管理模块可实时监控设备状态，进行维护保养提醒。资源调度模块支持会议室预订、车辆调度、物资管理等。后端使用Spring Boot + Spring Security，确保系统安全性。为营地管理提供全方位的智能化解决方案。'}),
      image: '/img/projects/project4.png',
      techStack: ['Vue3', 'TypeScript', 'Spring Boot', 'Spring Security', 'MySQL', 'Redis', '人脸识别SDK', 'Docker'],
      demoUrl: 'http://120.48.86.168/big-screen',
      repoUrl: '#',
      categories: ['web', 'ai'],
      features: [
        translate({id: 'project4.feature.1', message: '人脸识别门禁管理'}),
        translate({id: 'project4.feature.2', message: '人员考勤与访客登记'}),
        translate({id: 'project4.feature.3', message: '设备状态监控'}),
        translate({id: 'project4.feature.4', message: '资源调度管理'}),
        translate({id: 'project4.feature.5', message: '会议室管理'}),
        translate({id: 'project4.feature.6', message: '数据统计与报表'})
      ]
    },
    {
      id: 5,
      title: translate({id: 'project5.title', message: 'WMS仓储管理系统'}),
      subtitle: translate({id: 'project5.subtitle', message: '智慧仓储管理平台'}),
      description: translate({id: 'project5.description', message: '基于RuoYi-Pro框架的仓储管理系统，集成仓库管理、库位管理、物料管理、供应商管理等核心业务功能。'}),
      longDescription: translate({id: 'project5.longDescription', message: '该系统是一套完整的仓储管理解决方案，基于RuoYi-Pro框架开发，采用Vue3 + Element-UI Plus构建前端界面，后端使用Spring Boot + MyBatis Plus。系统实现了仓库管理、库位管理、物料管理、供应商管理、入库出库、库存盘点等核心功能。支持多仓库、多库位管理，提供实时库存查询和预警功能。集成了条码扫描、RFID识别等技术，实现智能化仓储管理。系统采用Redis缓存提升性能，支持高并发访问。为企业提供高效、准确的仓储管理解决方案。'}),
      image: '/img/projects/project5.png',
      techStack: ['RuoYi-Pro', 'Vue3', 'Element-UI Plus', 'Spring Boot', 'MyBatis Plus', 'Redis', 'MySQL', 'Docker'],
      demoUrl: '#',
      repoUrl: '#',
      categories: ['web'],
      features: [
        translate({id: 'project5.feature.1', message: '仓库与库位管理'}),
        translate({id: 'project5.feature.2', message: '物料信息管理'}),
        translate({id: 'project5.feature.3', message: '供应商管理'}),
        translate({id: 'project5.feature.4', message: '入库出库管理'}),
        translate({id: 'project5.feature.5', message: '库存盘点与预警'}),
        translate({id: 'project5.feature.6', message: '条码/RFID识别'})
      ]
    },
    {
      id: 6,
      title: translate({id: 'project6.title', message: '考勤打卡管理系统'}),
      subtitle: translate({id: 'project6.subtitle', message: '智能考勤管理平台'}),
      description: translate({id: 'project6.description', message: '企业级考勤打卡管理系统，支持多种打卡方式、排班管理、请假审批、考勤统计等功能。'}),
      longDescription: translate({id: 'project6.longDescription', message: '该系统为企业打造的智能考勤管理平台，采用Vue3 + Element-UI Plus构建前端界面，提供直观的日历视图和数据统计。系统支持多种打卡方式（GPS定位、WiFi、人脸识别），实现灵活的排班管理和班次设置。集成了请假审批、加班申请、外勤管理等功能，支持多级审批流程。考勤统计模块提供详细的出勤报表、异常统计和数据分析。后端使用Spring Boot + MyBatis Plus，配合Redis缓存提升性能。系统帮助企业实现考勤管理的数字化和智能化，提高人力资源管理效率。'}),
      image: '/img/projects/project6.png',
      techStack: ['Vue3', 'Element-UI Plus', 'Spring Boot', 'MyBatis Plus', 'Redis', 'MySQL', 'GPS定位', 'Docker'],
      demoUrl: '#',
      repoUrl: '#',
      categories: ['web'],
      features: [
        translate({id: 'project6.feature.1', message: '多种打卡方式（GPS/WiFi/人脸）'}),
        translate({id: 'project6.feature.2', message: '灵活排班与班次管理'}),
        translate({id: 'project6.feature.3', message: '请假加班审批流程'}),
        translate({id: 'project6.feature.4', message: '考勤统计与报表'}),
        translate({id: 'project6.feature.5', message: '外勤管理'}),
        translate({id: 'project6.feature.6', message: '异常考勤处理'})
      ]
    }
  ];

  // 访客追踪
  useEffect(() => {
    const cleanup = useVisitorTracking();
    return cleanup;
  }, []);

  // 状态管理
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  // 分类选项
  const categories = [
    { id: 'all', name: translate({ id: 'projects.filter.all', message: '全部' }), icon: '🌟' },
    { id: 'web', name: translate({ id: 'projects.filter.web', message: 'Web应用' }), icon: '🌐' },
    { id: 'mobile', name: translate({ id: 'projects.filter.mobile', message: '移动应用' }), icon: '📱' },
    { id: 'ai', name: translate({ id: 'projects.filter.ai', message: 'AI/ML' }), icon: '🧠' },
    { id: 'iot', name: translate({ id: 'projects.filter.iot', message: '物联网' }), icon: '📡' },
  ];

  // 滚动效果
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 过滤项目
  useEffect(() => {
    let filtered = projects;

    // 按分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((project) => 
        project.categories.includes(selectedCategory)
      );
    }

    // 按搜索词筛选
    if (searchTerm) {
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, selectedCategory, projects]);

  return (
    <Layout
      title={translate({ id: 'projects.meta.title', message: '项目作品' })}
      description={translate({ id: 'projects.meta.description', message: '全栈开发工程师的项目作品展示' })}
    >
      <div className={styles.projectsPage}>
        {/* 背景效果 */}
        <div className={styles.backgroundEffects}>
          <div 
            className={styles.gridPattern}
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          />
          <div 
            className={styles.blob1}
            style={{ transform: `translate(${scrollY * 0.02}px, ${-scrollY * 0.01}px)` }}
          />
          <div 
            className={styles.blob2}
            style={{ transform: `translate(${-scrollY * 0.02}px, ${scrollY * 0.01}px)` }}
          />
        </div>

        {/* Hero区域 */}
        <section className={styles.hero}>
          <motion.div
            className={styles.decorativeBlob1}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={styles.decorativeBlob2}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, delay: 1, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={styles.heroContent}
            >
              <motion.div
                className={styles.badgeWrapper}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className={styles.badge}>
                  <Translate id="projects.badge">精选项目</Translate>
                </div>
                <div className={styles.badgeBorder1}></div>
                <div className={styles.badgeBorder2}></div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={styles.heroTitle}
              >
                <span className={styles.gradientText}>
                  <Translate id="projects.title">项目作品</Translate>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className={styles.heroSubtitle}
              >
                <Translate id="projects.subtitle">
                  探索我的技术作品集，涵盖Web应用、移动应用和智能系统等多个领域
                </Translate>
              </motion.p>

              <motion.div
                className={styles.decorativeLine}
                animate={{
                  width: ['8rem', '12rem', '8rem'],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </section>

        {/* 筛选和搜索 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className={styles.filterSection}
        >
          <div className="container">
            <div className={styles.filterCard}>
              <div className={styles.categoryTabs}>
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    className={`${styles.categoryTab} ${selectedCategory === category.id ? styles.active : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={styles.categoryIcon}>{category.icon}</span>
                    <span>{category.name}</span>
                  </motion.button>
                ))}
              </div>

              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder={translate({ id: 'projects.searchPlaceholder', message: '搜索项目...' })}
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className={styles.clearButton}
                    onClick={() => setSearchTerm('')}
                  >
                    ×
                  </button>
                )}
                <button className={styles.searchButton}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 项目网格 */}
        <section className={styles.projectsSection}>
          <div className="container">
            {filteredProjects.length > 0 ? (
              <motion.div
                className={styles.projectsGrid}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className={styles.projectCard}
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: {
                        y: 0,
                        opacity: 1,
                        transition: { type: "spring", stiffness: 100, damping: 12 }
                      }
                    }}
                    whileHover={{
                      y: -8,
                      boxShadow: "0 25px 50px -12px rgba(102, 126, 234, 0.25)"
                    }}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className={styles.projectImageWrapper}>
                      <img src={project.image} alt={project.title} className={styles.projectImage} />
                      <div className={styles.imageOverlay} />
                      <div className={styles.hoverOverlay} />
                      <div className={styles.decorativeBorder} />
                    </div>

                    <div className={styles.projectBadge}>
                      {project.techStack[0]}
                    </div>

                    <div className={styles.projectInfo}>
                      <h3 className={styles.projectTitle}>
                        {project.title}
                        <span className={styles.categoryBadge}>{project.categories[0]}</span>
                      </h3>
                      <p className={styles.projectSubtitle}>{project.subtitle}</p>
                      <p className={styles.projectDescription}>{project.description}</p>

                      <div className={styles.techStack}>
                        {project.techStack.slice(0, 3).map((tech, i) => (
                          <span key={i} className={styles.techBadge}>{tech}</span>
                        ))}
                      </div>

                      <div className={styles.projectActions}>
                        <button className={styles.viewDetailsButton}>
                          <span className={styles.buttonShine} />
                          <span className={styles.buttonText}>
                            <Translate id="projects.viewDetails">查看详情</Translate>
                          </span>
                          <svg className={styles.buttonIcon} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.demoButton}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Translate id="projects.viewDemo">在线演示</Translate>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className={styles.noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <svg className={styles.noResultsIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3><Translate id="projects.noResults">未找到项目</Translate></h3>
                <p><Translate id="projects.tryDifferent">尝试其他搜索条件或分类</Translate></p>
                <button
                  className={styles.resetButton}
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchTerm('');
                  }}
                >
                  <Translate id="projects.resetFilters">重置筛选</Translate>
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA区域 */}
        <motion.section
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container">
            <div className={styles.ctaCard}>
              <motion.div
                className={styles.ctaBackground}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />

              <div className={styles.ctaContent}>
                <motion.h2
                  className={styles.ctaTitle}
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <span className={styles.gradientText}>
                    <Translate id="projects.cta.title">有项目想法？</Translate>
                  </span>
                </motion.h2>

                <motion.p
                  className={styles.ctaDescription}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Translate id="projects.cta.description">
                    让我们一起将您的想法变为现实，提供专业的技术解决方案
                  </Translate>
                </motion.p>

                <motion.div
                  className={styles.ctaButtons}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/contact" className={styles.ctaButton}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <Translate id="projects.cta.contact">联系我</Translate>
                  </Link>

                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.githubButton}
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                    <Translate id="projects.cta.github">查看 GitHub</Translate>
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 项目详情模态窗口 */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                className={styles.modalContent}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.modalClose}
                  onClick={() => setSelectedProject(null)}
                >
                  ✕
                </button>

                <div className={styles.modalImage}>
                  <img src={selectedProject.image} alt={selectedProject.title} />
                  <div className={styles.modalImageOverlay} />
                  <div className={styles.modalImageInfo}>
                    <span className={styles.modalBadge}>{selectedProject.categories[0]}</span>
                    <h2>{selectedProject.title}</h2>
                    <p>{selectedProject.subtitle}</p>
                  </div>
                </div>

                <div className={styles.modalBody}>
                  <p className={styles.modalDescription}>{selectedProject.longDescription}</p>

                  {selectedProject.features && (
                    <div className={styles.modalFeatures}>
                      <h3><Translate id="project1.features">核心功能</Translate></h3>
                      <div className={styles.featuresList}>
                        {selectedProject.features.map((feature, i) => (
                          <div key={i} className={styles.featureItem}>
                            <svg className={styles.featureIcon} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={styles.modalTechStack}>
                    <h3><Translate id="projects.techStack">技术栈</Translate></h3>
                    <div className={styles.modalTechList}>
                      {selectedProject.techStack.map((tech, i) => (
                        <span key={i} className={styles.modalTechBadge}>{tech}</span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.modalActions}>
                    {selectedProject.demoUrl && selectedProject.demoUrl !== '#' && (
                      <a
                        href={selectedProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.modalButton}
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <Translate id="projects.viewDemo">在线演示</Translate>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
