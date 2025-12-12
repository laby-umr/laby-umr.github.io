import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import { useVisitorTracking } from '@site/src/utils/blogApi';
import { rafThrottle } from '@site/src/utils/throttle';
import styles from './about.module.css';
import GlitchText from '../components/GlitchText';
import JellyTextAnimation, { TranslatedJellyText } from '../components/JellyTextAnimation';

// 技能专长组件 - 带花朵绽放效果
function SkillsSection({ skills }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`${styles.skillsGrid} ${isExpanded ? styles.skillsGridExpanded : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {skills.map((skillGroup, index) => (
        <div key={index} className={`${styles.skillCard} ${styles[`skillCard${skillGroup.color}`]}`}>
          <div className={styles.skillHeader}>
            <div className={`${styles.skillIcon} ${styles[`skillIcon${skillGroup.color}`]}`}>{skillGroup.icon}</div>
            <h3 className={styles.skillTitle}>{skillGroup.category}</h3>
          </div>

          <div className={styles.skillProgress}>
            <div className={styles.progressLabel}>
              <span><Translate id="about.proficiency">熟练度</Translate></span>
              <span>{skillGroup.level}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${styles[`progressFill${skillGroup.color}`]}`}
                style={{ width: `${skillGroup.level}%` }}
              ></div>
            </div>
          </div>

          <div className={styles.skillTags}>
            {skillGroup.items.map((skill, i) => (
              <span key={i} className={`${styles.skillTag} ${styles[`skillTag${skillGroup.color}`]} cursor-target`}>{skill}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 技能数据
const skills = [
  {
    category: translate({ id: 'about.skill.frontend', message: '前端开发' }),
    icon: "🌐",
    color: "primary",
    level: 90,
    items: ["Vue3", "React", "Angular", "Element UI", "Ant Design", "TailwindCSS"]
  },
  {
    category: translate({ id: 'about.skill.backend', message: '后端开发' }),
    icon: "🖥️",
    color: "secondary",
    level: 95,
    items: ["Spring Boot", "Spring Cloud", "MyBatis-Plus", "Spring Security", "Dubbo", "Kafka"]
  },
  {
    category: translate({ id: 'about.skill.database', message: '数据库' }),
    icon: "💾",
    color: "accent",
    level: 85,
    items: ["MySQL", "PostgreSQL", "Redis", "MongoDB", "Oracle", "Hive"]
  },
  {
    category: translate({ id: 'about.skill.devops', message: 'DevOps' }),
    icon: "⚙️",
    color: "info",
    level: 80,
    items: ["Docker Compose", "Jenkins", "GitLab CI/CD", "Nginx", "Xshell"]
  },
  {
    category: translate({ id: 'about.skill.aiTools', message: 'AI编程工具' }),
    icon: "🤖",
    color: "success",
    level: 88,
    items: ["Cursor", "Windsurf", "DeepSeek", "Dify", "Coze", "GitHub Copilot"]
  },
  {
    category: translate({ id: 'about.skill.projectManagement', message: '项目管理' }),
    icon: "📋",
    color: "primary",
    level: 82,
    items: ["Git", "GitHub", "GitLab", "Jira", "禅道", "Code Review"]
  },
];

// 工作经历
const experiences = [
  {
    period: translate({ id: 'experience.1.period', message: '2025.01 - 至今' }),
    title: translate({ id: 'experience.1.title', message: '全栈工程师' }),
    company: translate({ id: 'experience.1.company', message: '中联智航（北京）科技有限公司' }),
    logo: "🚀",
    color: "primary",
    description: translate({ id: 'experience.1.description', message: '负责智慧营地/智慧完工项目的全栈开发与架构设计' }),
    achievements: [
      translate({ id: 'experience.1.achievement.1', message: '独立完成若依架构升级，实现多租户多营地功能，引入Redis分布式锁' }),
      translate({ id: 'experience.1.achievement.2', message: '完成智慧仓储系统开发，入库效率提升50%，库存周转周期缩短22%' }),
      translate({ id: 'experience.1.achievement.3', message: '成功集成DeepSeek AI分析引擎，实现智能决策' }),
      translate({ id: 'experience.1.achievement.4', message: '统一国际化、前端样式和后端代码风格，提高代码质量' })
    ],
    projects: [
      {
        name: translate({ id: 'experience.1.project.1.name', message: '智慧营地/智慧完工' }),
        role: translate({ id: 'experience.1.project.1.role', message: '全栈开发' }),
        tech: translate({ id: 'experience.1.project.1.tech', message: '若依3.8.9 + Redis + Vue3 + Element-UI Plus + DeepSeek' }),
        description: translate({ id: 'experience.1.project.1.description', message: '智慧仓储系统，集成仓库管理、库位管理、物料管理、供应商管理等核心业务' }),
        highlights: [
          translate({ id: 'experience.1.project.1.highlight.1', message: '实现多租户多营地架构，支持企业级应用' }),
          translate({ id: 'experience.1.project.1.highlight.2', message: '通过RFID自动识别（准确率99.6%）与数字孪生技术' }),
          translate({ id: 'experience.1.project.1.highlight.3', message: '入库效率提升50%，库存周转周期缩短22%' }),
          translate({ id: 'experience.1.project.1.highlight.4', message: '集成DeepSeek AI实现智能决策和报表分析' })
        ]
      }
    ]
  },
  {
    period: translate({ id: 'experience.2.period', message: '2023.07 - 2024.12' }),
    title: translate({ id: 'experience.2.title', message: 'Java开发工程师' }),
    company: translate({ id: 'experience.2.company', message: '北京君周科技有限公司' }),
    logo: "💼",
    color: "secondary",
    description: translate({ id: 'experience.2.description', message: '负责工业大数据平台的开发与数据治理' }),
    achievements: [
      translate({ id: 'experience.2.achievement.1', message: '负责数据指标、数据质量、数据建模、数据可视化模块开发设计' }),
      translate({ id: 'experience.2.achievement.2', message: '根据华为、阿里数据指标做出相应的产品设计' }),
      translate({ id: 'experience.2.achievement.3', message: '使用开源BI技术作为产品代替方案，为公司节省40万研发成本' }),
      translate({ id: 'experience.2.achievement.4', message: '独立完成指标、建模、质量文档编写（详设、概设、用户使用手册）' })
    ],
    projects: [
      {
        name: translate({ id: 'experience.2.project.1.name', message: '工业大数据平台' }),
        role: translate({ id: 'experience.2.project.1.role', message: '软件开发工程师' }),
        tech: translate({ id: 'experience.2.project.1.tech', message: 'SpringCloud Alibaba + MyBatis-Plus + Hive + Kafka + Vue + ElementUI' }),
        description: translate({ id: 'experience.2.project.1.description', message: '数据全生命周期一站式开发运营平台，提供数据集成、数据开发、数据治理、数据服务等功能' }),
        highlights: [
          translate({ id: 'experience.2.project.1.highlight.1', message: '负责数据指标、数据质量、数据建模、数据可视化模块开发' }),
          translate({ id: 'experience.2.project.1.highlight.2', message: '参考华为、阿里数据指标体系进行产品设计' }),
          translate({ id: 'experience.2.project.1.highlight.3', message: '使用开源BI技术替代商业方案，节省40万研发成本' }),
          translate({ id: 'experience.2.project.1.highlight.4', message: '完成详设、概设、用户使用手册等完整文档' })
        ]
      }
    ]
  },
  {
    period: translate({ id: 'experience.3.period', message: '2023.03 - 2023.07' }),
    title: translate({ id: 'experience.3.title', message: 'Java开发工程师' }),
    company: translate({ id: 'experience.3.company', message: '北京企慕科技有限公司' }),
    logo: "🔒",
    color: "info",
    description: translate({ id: 'experience.3.description', message: '负责国家电网思极安全接入网关系统开发' }),
    achievements: [
      translate({ id: 'experience.3.achievement.1', message: '独立完成项目架构设计（采用若依脚手架）' }),
      translate({ id: 'experience.3.achievement.2', message: '独立完成项目看板页面开发设计和ETL数据对接' }),
      translate({ id: 'experience.3.achievement.3', message: '独立完成分布式任务调度平台构建' }),
      translate({ id: 'experience.3.achievement.4', message: '实现安全访问控制、用户身份认证、安全审计能力' })
    ],
    projects: [
      {
        name: translate({ id: 'experience.3.project.1.name', message: '国家电网思极安全接入网关' }),
        role: translate({ id: 'experience.3.project.1.role', message: '全栈开发' }),
        tech: translate({ id: 'experience.3.project.1.tech', message: 'SpringBoot + MyBatis-Plus + LayUI + ECharts + Nginx' }),
        description: translate({ id: 'experience.3.project.1.description', message: '国家电网思极网安独立研发的安全接入网关系统，提供安全访问控制、用户身份认证、安全审计能力' }),
        highlights: [
          translate({ id: 'experience.3.project.1.highlight.1', message: '独立完成项目架构设计，采用若依脚手架' }),
          translate({ id: 'experience.3.project.1.highlight.2', message: '开发看板页面，实现数据可视化展示' }),
          translate({ id: 'experience.3.project.1.highlight.3', message: '完成ETL数据对接和分布式任务调度平台构建' }),
          translate({ id: 'experience.3.project.1.highlight.4', message: '实现IP地址、存储资源、用户黑白名单等安全控制功能' })
        ]
      }
    ]
  },
  {
    period: translate({ id: 'experience.4.period', message: '2020.01 - 2023.03' }),
    title: translate({ id: 'experience.4.title', message: 'Java开发工程师' }),
    company: translate({ id: 'experience.4.company', message: '北京科锐国际人力资源股份有限公司' }),
    logo: "🌐",
    color: "success",
    description: translate({ id: 'experience.4.description', message: '负责服务供应链系统和质量管理平台开发' }),
    achievements: [
      translate({ id: 'experience.4.achievement.1', message: '独立完成SSC-LVR Portal项目设计和服务模块构建' }),
      translate({ id: 'experience.4.achievement.2', message: '负责SCI Quality Portal多系统融合集成' }),
      translate({ id: 'experience.4.achievement.3', message: '对接DQM、CQAS、Olympia等多个平台数据接口' }),
      translate({ id: 'experience.4.achievement.4', message: '实现统一单点登录方案和数据可视化' })
    ],
    projects: [
      {
        name: translate({ id: 'experience.4.project.1.name', message: '服务供应链(SSC) - LVR Portal' }),
        role: translate({ id: 'experience.4.project.1.role', message: '小组组长' }),
        tech: translate({ id: 'experience.4.project.1.tech', message: 'SpringCloud + MyBatis-Plus + xxl-job + Vue + ElementUI' }),
        description: translate({ id: 'experience.4.project.1.description', message: '提供LVR的独立服务，包括订单管理、人员管理、物流跟踪、费用结算等功能' }),
        highlights: [
          translate({ id: 'experience.4.project.1.highlight.1', message: '独立完成项目设计和服务模块构建' }),
          translate({ id: 'experience.4.project.1.highlight.2', message: '实现订单全生命周期管理' }),
          translate({ id: 'experience.4.project.1.highlight.3', message: '集成邮件提醒和物流同步功能' }),
          translate({ id: 'experience.4.project.1.highlight.4', message: '负责项目整体进度把控和团队协调' })
        ]
      },
      {
        name: translate({ id: 'experience.4.project.2.name', message: 'SCI Quality Portal' }),
        role: translate({ id: 'experience.4.project.2.role', message: 'Java顾问' }),
        tech: translate({ id: 'experience.4.project.2.tech', message: 'SpringBoot + JPA + SAP Hana + Angular + Ant Design' }),
        description: translate({ id: 'experience.4.project.2.description', message: '多系统融合的质量之星平台，导DQM、CQAS、Olympia等部门实现集成' }),
        highlights: [
          translate({ id: 'experience.4.project.2.highlight.1', message: '对接多个平台数据接口并提供文档' }),
          translate({ id: 'experience.4.project.2.highlight.2', message: '实现统一单点登录方案' }),
          translate({ id: 'experience.4.project.2.highlight.3', message: '开发Portal页面和PCG/MBG看板' }),
          translate({ id: 'experience.4.project.2.highlight.4', message: '实现各部门KPI数据可视化' })
        ]
      }
    ]
  }
];

// 教育背景
const education = [
  {
    period: translate({ id: 'education.1.period', message: '2015 - 2017' }),
    degree: translate({ id: 'education.1.degree', message: '本科 · 软件工程' }),
    school: translate({ id: 'education.1.school', message: '天津工业大学' }),
    logo: "🎓",
    color: "info",
    description: translate({ id: 'education.1.description', message: '系统学习软件工程理论与实践，掌握扎实的计算机基础知识' })
  }
];

function About() {
  const [activeTab, setActiveTab] = useState('skills');
  const [scrollY, setScrollY] = useState(0);
  const [expandedExp, setExpandedExp] = useState(null);

  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      setScrollY(window.scrollY);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout
      title={translate({ id: 'about.meta.title', message: 'About Me' })}
      description={translate({ id: 'about.meta.description', message: 'Laby - Full Stack Developer' })}
    >
      <div className={styles.aboutContainer}>
        {/* 浮动装饰球 */}
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div
            className={styles.heroBackground}
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          />

          <div className="container">
            <div className={styles.heroContent}>
              {/* 徽章 */}
              <div className={styles.heroBadge}>
                <span className={styles.badgeText}>
                  <Translate id="about.badge">关于我</Translate>
                </span>
                <div className={styles.badgeRing}></div>
                <div className={styles.badgeRing2}></div>
              </div>

              {/* 标题 */}
              <h1 className={styles.heroTitle}>
                <span className={styles.gradientText}>
                  <GlitchText speed={1} enableShadows={true} enableOnHover={false}>
                    <JellyTextAnimation delay={0}>Laby</JellyTextAnimation>
                  </GlitchText>
                </span>
                <div className={styles.titleUnderline}></div>
              </h1>

              {/* 标签 */}
              <div className={styles.heroBadges}>
                <span className={`${styles.badge} cursor-target`}>
                  <Translate id="about.badge.fullstack">全栈工程师</Translate>
                </span>
                <span className={`${styles.badge} cursor-target`}>
                  <Translate id="about.badge.architect">系统架构师</Translate>
                </span>
                <span className={`${styles.badge} cursor-target`}>
                  <Translate id="about.badge.ai">AI技术专家</Translate>
                </span>
              </div>

              {/* 头像和简介 */}
              <div className={styles.heroMain}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatarGlow}></div>
                  <div className={styles.avatarRing}></div>
                  <div className={styles.avatarDot1}></div>
                  <div className={styles.avatarDot2}></div>
                  <img
                    src="/img/head.jpg"
                    alt="Profile"
                    className={styles.avatar}
                  />
                </div>

                <div className={styles.heroIntro}>
                  <p className={styles.introText}>
                    <Translate id="about.intro">
                      我是一名拥有8年工作经验的全栈工程师，精通Spring全家桶、Vue/React/Angular等主流技术栈。
                      擅长企业级应用架构设计、数据治理和AI技术集成，具有丰富的大型项目开发经验。
                    </Translate>
                  </p>

                  <div className={styles.socialLinks}>
                    <a href="#" className={`${styles.socialLink} cursor-target`}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                    <a href="#" className={`${styles.socialLink} cursor-target`}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 选项卡导航 */}
        <div className="container">
          <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'skills' ? styles.tabActive : ''} cursor-target`}
                onClick={() => setActiveTab('skills')}
              >
                <Translate id="about.tab.skills">技能专长</Translate>
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'experience' ? styles.tabActive : ''} cursor-target`}
                onClick={() => setActiveTab('experience')}
              >
                <Translate id="about.tab.experience">工作经历</Translate>
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'education' ? styles.tabActive : ''} cursor-target`}
                onClick={() => setActiveTab('education')}
              >
                <Translate id="about.tab.education">教育背景</Translate>
              </button>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="container">
          {/* 技能部分 */}
          {activeTab === 'skills' && (
            <SkillsSection skills={skills} />
          )}

          {/* 工作经历部分 */}
          {activeTab === 'experience' && (
            <div className={styles.experienceList}>
              {experiences.map((exp, index) => (
                <div key={index} className={styles.experienceCard}>
                    <div className={`${styles.expLeftBar} ${styles[`expLeftBar${exp.color}`]}`}></div>

                    <div className={styles.expHeader} onClick={() => setExpandedExp(expandedExp === index ? null : index)} style={{ cursor: 'pointer' }}>
                      <div className={`${styles.expLogo} ${styles[`expLogo${exp.color}`]}`}>{exp.logo}</div>
                      <div className={styles.expInfo}>
                        <div className={styles.expTitleRow}>
                          <h3 className={styles.expTitle}>{exp.title}</h3>
                          <span className={`${styles.expPeriod} ${styles[`expPeriod${exp.color}`]}`}>{exp.period}</span>
                        </div>
                        <p className={styles.expCompany}>{exp.company}</p>
                      </div>
                      <div className={styles.expandIcon}>
                        <svg
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          style={{
                            transform: expandedExp === index ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                          }}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>

                    <p className={styles.expDescription}>{exp.description}</p>

                    <div className={styles.expAchievements}>
                      <p className={styles.achievementsTitle}><Translate id="about.mainAchievements">主要成就：</Translate></p>
                      <ul className={styles.achievementsList}>
                        {exp.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 项目详情 - 可展开 */}
                    {expandedExp === index && exp.projects && (
                      <div className={styles.projectsSection}>
                        <h4 className={styles.projectsTitle}><Translate id="about.participatedProjects">参与项目</Translate></h4>
                        {exp.projects.map((project, pIndex) => (
                          <div key={pIndex} className={styles.projectCard}>
                            <div className={styles.projectHeader}>
                              <h5 className={styles.projectName}>{project.name}</h5>
                              <span className={styles.projectRole}>{project.role}</span>
                            </div>
                            <div className={styles.projectTech}>
                              <strong><Translate id="about.techStack">技术栈：</Translate></strong>{project.tech}
                            </div>
                            <p className={styles.projectDesc}>{project.description}</p>
                            <div className={styles.projectHighlights}>
                              <strong><Translate id="about.projectHighlights">项目亮点：</Translate></strong>
                              <ul>
                                {project.highlights.map((highlight, hIndex) => (
                                  <li key={hIndex}>{highlight}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
              ))}
            </div>
          )}

          {/* 教育背景部分 */}
          {activeTab === 'education' && (
            <div className={styles.educationList}>
              {education.map((edu, index) => (
                <div key={index} className={styles.educationCard}>
                    <div className={styles.eduLogo}>{edu.logo}</div>
                    <div className={styles.eduContent}>
                      <div className={styles.eduHeader}>
                        <h3 className={styles.eduDegree}>{edu.degree}</h3>
                        <span className={styles.eduPeriod}>{edu.period}</span>
                      </div>
                      <p className={styles.eduSchool}>{edu.school}</p>
                      <p className={styles.eduDescription}>{edu.description}</p>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>

        {/* 下载简历区域 */}
        <div className="container">
          <div className={styles.downloadSection}>
              <h2 className={styles.downloadTitle}>
                <GlitchText speed={1} enableShadows={true} enableOnHover={false}>
                  <TranslatedJellyText id="about.downloadTitle" defaultMessage="想了解更多？" delay={0} disableHover={true} />
                </GlitchText>
              </h2>
              <p className={styles.downloadDesc}>
                <Translate id="about.downloadDesc2">获取完整的个人简历PDF版本</Translate>
              </p>
              <a href="/file/刘佳兴-全栈-简历.pdf" download="刘佳兴-全栈-简历.pdf" className={`${styles.downloadButton} cursor-target`}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <Translate id="about.downloadButton">下载简历</Translate>
              </a>
            </div>
        </div>
      </div>
    </Layout>
  );
}

export default About;
