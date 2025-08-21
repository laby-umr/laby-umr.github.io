import React, { useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Translate, {translate} from '@docusaurus/Translate';
import styles from './about.module.css';

// 粒子背景组件
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

// 图标组件
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={styles.strengthIcon}>
    <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={styles.skillIcon}>
    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
  </svg>
);

function About() {
  return (
    <Layout
      title={translate({
        id: 'about.meta.title',
        message: 'About Me'
      })}
      description={translate({
        id: 'about.meta.description',
        message: 'Laby - Full Stack Developer profile with skills, experience and contact information'
      })}
    >
      <ParticleBackground />
      <div className={styles.aboutContainer}>        
        <div className={styles.contentContainer}>
          {/* 英雄部分 */}
          <section className={styles.heroSection}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroName}>Laby</h1>
              <p className={styles.heroTitle}>
                <Translate id="about.title">Full Stack Developer</Translate>
              </p>
              <p className={styles.heroBio}>
                <Translate id="about.heroBio">
                  I am a passionate full-stack developer with 8+ years of experience building high-quality web applications.
                  My expertise spans from frontend UI/UX to backend architecture, database optimization, and DevOps.
                </Translate>
              </p>
              
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>8+</span>
                  <span className={styles.statLabel}>
                    <Translate id="about.stats.experience">Years of Experience</Translate>
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>20+</span>
                  <span className={styles.statLabel}>
                    <Translate id="about.stats.projects">Projects</Translate>
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>30+</span>
                  <span className={styles.statLabel}>
                    <Translate id="about.stats.skills">Skills</Translate>
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.avatarContainer}>
              <div className={styles.avatarGlow}></div>
              <img 
                src="/img/head.jpg" 
                alt={translate({
                  id: 'about.avatar.alt',
                  message: 'Profile Photo'
                })} 
                className={styles.avatar} 
              />
            </div>
          </section>

          {/* 关于我部分 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Translate id="about.aboutMe">About Me</Translate>
            </h2>
            
            <div className={styles.aboutContent}>
              <p>
                <Translate id="about.introduction.1">
                  I am a full-stack developer with 8 years of experience, focused on building high-quality web applications and solving complex technical challenges. I have comprehensive skills from front-end to back-end and DevOps, and am passionate about learning new technologies and best practices.
                </Translate>
              </p>
              <p>
                <Translate id="about.introduction.2">
                  Throughout my career I have been involved in developing various types of projects, including enterprise applications, e-commerce platforms, data analysis tools, and real-time communication systems. I particularly excel in building responsive user interfaces, designing scalable backend architectures, and optimizing development and deployment processes.
                </Translate>
              </p>
              </div>

            <div className={styles.strengthsContainer}>
              <h3 className={styles.strengthsTitle}>
                <Translate id="about.personalStrengths">Personal Strengths</Translate>
              </h3>
              <ul className={styles.strengthsList}>
                <li className={styles.strengthItem}>
                  <StarIcon />
                  <Translate id="about.strength.1">Proficient in multiple backend frameworks and tools, including Spring, MyBatis-Plus, SpringBoot, SpringCloud</Translate>
                </li>
                <li className={styles.strengthItem}>
                  <StarIcon />
                  <Translate id="about.strength.2">Experience with Dify + Ollama + DeepSeek local deployment, AI agent development, and knowledge base construction</Translate>
                </li>
                <li className={styles.strengthItem}>
                  <StarIcon />
                  <Translate id="about.strength.3">Experience with Coze AI agent workflow design and implementation</Translate>
                </li>
                </ul>
            </div>
          </section>

          {/* 工作经验部分 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Translate id="about.workExperience">Work Experience</Translate>
            </h2>
            
            <div className={styles.timeline}>
              {/* 工作经历 1 */}
              <div className={styles.timelineItem}>
                <span className={styles.timelinePeriod}>
                  <Translate id="exp1.period">2025.01 - Present</Translate>
                </span>
                <h3 className={styles.timelineTitle}>
                  <Translate id="exp1.title">Smart Camp/Smart Completion Full Stack Developer</Translate>
                </h3>
                <p className={styles.timelineCompany}>
                  <Translate id="exp1.company">Tech Company</Translate>
                </p>
                
                <div className={styles.timelineContent}>
                  <div className={styles.projectDetails}>
                    <h4><Translate id="exp1.project">Smart Camp (Warehouse Management)</Translate></h4>
                    <ul>
                      <li><Translate id="exp1.responsibility.1">Led development and maintenance of Smart Camp (warehouse) and Smart Completion (reporting) projects</Translate></li>
                      <li><Translate id="exp1.responsibility.2">Independently completed RuoYi architecture upgrades for multi-tenant and multi-camp functionality, implemented Redis distributed locks to optimize concurrent performance</Translate></li>
                      <li><Translate id="exp1.responsibility.3">Improved frontend styling and internationalization systems</Translate></li>
                      <li><Translate id="exp1.responsibility.4">Standardized backend code style to improve readability and scalability</Translate></li>
                      <li><Translate id="exp1.responsibility.5">Successfully integrated DeepSeek analytics engine for Smart Completion project</Translate></li>
                    </ul>
                  </div>
                  <div className={styles.techStack}>
                    <strong>{translate({id: 'about.technologies', message: 'Technologies:'})}</strong>{' '}
                    {translate({id: 'exp1.tech', message: 'RuoYi 3.8.9, Redission, Vue3, Element-UI Plus, ECharts, DeepSeek'})}
                  </div>
                </div>
              </div>
              
              {/* 工作经历 2 */}
              <div className={styles.timelineItem}>
                <span className={styles.timelinePeriod}>
                  <Translate id="exp2.period">2023.03 - 2023.07</Translate>
                </span>
                <h3 className={styles.timelineTitle}>
                  <Translate id="exp2.title">State Grid Siji Security Access Gateway Full Stack Developer</Translate>
                </h3>
                <p className={styles.timelineCompany}>
                  <Translate id="exp2.company">Beijing Kerui International Human Resources Co., Ltd.</Translate>
                </p>
                
                <div className={styles.timelineContent}>
                  <p>
                    <Translate id="exp2.description">
                      Responsible for technology selection, overall architecture design, dashboard page development, and data integration. Independently built the project architecture based on RuoYi scaffold, developed efficient dashboard pages and data visualization systems, designed and implemented ETL data integration modules, and set up a distributed task scheduling platform to ensure high availability and real-time data synchronization.
                    </Translate>
                  </p>
                  <div className={styles.techStack}>
                    <strong>{translate({id: 'about.technologies', message: 'Technologies:'})}</strong>{' '}
                    {translate({id: 'exp2.tech', message: 'SpringBoot, MyBatis-Plus, JNI, MySQL, EasyPoi, Swagger, Maven, LayUI, ECharts, Nginx'})}
                  </div>
                </div>
              </div>
              
              {/* 工作经历 3 */}
              <div className={styles.timelineItem}>
                <span className={styles.timelinePeriod}>
                  <Translate id="exp3.period">2021.11 - 2023.03</Translate>
                </span>
                <h3 className={styles.timelineTitle}>
                  <Translate id="exp3.title">Service Supply Chain (SSC) - LVR Portal Team Leader</Translate>
                </h3>
                <p className={styles.timelineCompany}>
                  <Translate id="exp3.company">Beijing Kerui International Human Resources Co., Ltd.</Translate>
                </p>
                
                <div className={styles.timelineContent}>
                  <p>
                    <Translate id="exp3.description">
                      Served as team leader with full responsibility for project progress management and quality control. Analyzed and designed solutions for international business requirements, developed technical solutions, and participated in core code development. Independently completed the overall project design, including service module construction, system configuration optimization, and frontend page interaction design, ensuring the project met global business requirements.
                    </Translate>
                  </p>
                  <div className={styles.techStack}>
                    <strong>{translate({id: 'about.technologies', message: 'Technologies:'})}</strong>{' '}
                    {translate({id: 'exp3.tech', message: 'SpringCloud, JDK11, Gradle, MyBatis-Plus, MySQL, Swagger, xxl-job, Redis, Vue, ElementUI'})}
                  </div>
                </div>
              </div>

              {/* 工作经历 4 */}
              <div className={styles.timelineItem}>
                <span className={styles.timelinePeriod}>
                  <Translate id="exp4.period">2017.07 - 2020.01</Translate>
                </span>
                <h3 className={styles.timelineTitle}>
                  <Translate id="exp4.title">HC Big Data Visualization Platform Project Manager</Translate>
                </h3>
                <p className={styles.timelineCompany}>
                  <Translate id="exp4.company">Henan Yuanbo Software Co., Ltd.</Translate>
                </p>
                
                <div className={styles.timelineContent}>
                  <p>
                    <Translate id="exp4.description">
                      As project manager, responsible for technology selection, system architecture design, and development environment setup. Led the development of visualization modules and operational platform data integration, independently completed front-end and back-end integrated architecture design (display end + management end). Built enterprise-level distributed task scheduling system, Zentao code management platform, and Jenkins continuous integration environment, achieved ETL data automated processing and SAP system real-time data integration, creating a comprehensive data visualization solution.
                    </Translate>
                  </p>
                  <div className={styles.techStack}>
                    <strong>{translate({id: 'about.technologies', message: 'Technologies:'})}</strong>{' '}
                    {translate({id: 'exp4.tech', message: 'SpringBoot, MyBatis-Plus, MySQL, Swagger, Maven, Vue, ElementUI, ECharts, Data V, Nginx'})}
                  </div>
                </div>
              </div>
              
              {/* 教育背景 */}
              <div className={styles.education}>
                <h3 className={styles.degree}>
                  <Translate id="education.degree">Bachelor's Degree in Software Engineering</Translate>
                </h3>
                <p className={styles.university}>
                  <Translate id="education.university">Tianjin Polytechnic University</Translate>
                </p>
                <p className={styles.period}>
                  <Translate id="education.period">2015-2017</Translate>
                </p>
              </div>
            </div>
          </section>

          {/* 技能部分 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Translate id="about.professionalSkills">Professional Skills</Translate>
            </h2>
            
            <div className={styles.skillsContainer}>
              <div className={styles.skillCategories}>
                {/* 前端开发 */}
                <div className={styles.skillCategory}>
                  <h3 className={styles.categoryTitle}>
                    <Translate id="about.frontendDevelopment">Frontend Development</Translate>
                  </h3>
                  <ul className={styles.skillList}>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.js">JavaScript/TypeScript</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.vue">Vue/Vue3</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.react">React</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.html">HTML5/CSS3</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.webpack">Webpack</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.element">Element UI</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.layui">LayUI</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.echarts">ECharts</Translate>
                    </li>
                  </ul>
                </div>
                
                {/* 后端开发 */}
                <div className={styles.skillCategory}>
                  <h3 className={styles.categoryTitle}>
                    <Translate id="about.backendDevelopment">Backend Development</Translate>
                  </h3>
                  <ul className={styles.skillList}>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.java">Java</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.spring">Spring Framework</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.springboot">SpringBoot</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.springcloud">SpringCloud</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.ruoyi">RuoYi Framework</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.nacos">Nacos</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.rocketmq">RocketMQ</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.redission">Redission</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.xxljob">xxl-job</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.etl">ETL Data Processing</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.gradle">Gradle/Maven</Translate>
                    </li>
                  </ul>
                </div>
                
                {/* 数据库 */}
                <div className={styles.skillCategory}>
                  <h3 className={styles.categoryTitle}>
                    <Translate id="about.databases">Databases</Translate>
                  </h3>
                  <ul className={styles.skillList}>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.mysql">MySQL</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.redis">Redis</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.mongodb">MongoDB</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.sqlserver">SQL Server</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.saphana">SAP Hana</Translate>
                    </li>
                  </ul>
                </div>
                
                {/* AI 工具 */}
                <div className={styles.skillCategory}>
                  <h3 className={styles.categoryTitle}>
                    <Translate id="about.aiTools">AI Tools</Translate>
                  </h3>
                  <ul className={styles.skillList}>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.dify">Dify</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.ollama">Ollama</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.deepseek">DeepSeek</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.cozeai">Coze AI</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.aiagent">AI Agent Development</Translate>
                    </li>
                    <li className={styles.skillItem}>
                      <CheckIcon />
                      <Translate id="skill.knowledgebase">Knowledge Base Construction</Translate>
                    </li>
                  </ul>
            </div>
            </div>
            </div>
          </section>

          {/* 技术专长 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Translate id="about.technicalExpertise">Technical Expertise</Translate>
            </h2>
            
            <div className={styles.techExpertiseGrid}>
              <div className={styles.expertiseCategory}>
                <h3 className={styles.expertiseTitle}>
                  <Translate id="about.frontendTech">Frontend</Translate>
                </h3>
                <div className={styles.tagCloud}>
                  <span className={styles.techTag}>Vue 3</span>
                  <span className={styles.techTag}>React</span>
                  <span className={styles.techTag}>TypeScript</span>
                  <span className={styles.techTag}>JavaScript</span>
                  <span className={styles.techTag}>HTML5</span>
                  <span className={styles.techTag}>CSS3</span>
                  <span className={styles.techTag}>Webpack</span>
                  <span className={styles.techTag}>ElementUI</span>
                  <span className={styles.techTag}>Ant Design</span>
                </div>
              </div>
              
              <div className={styles.expertiseCategory}>
                <h3 className={styles.expertiseTitle}>
                  <Translate id="about.backendTech">Backend</Translate>
                </h3>
                <div className={styles.tagCloud}>
                  <span className={styles.techTag}>SpringBoot</span>
                  <span className={styles.techTag}>SpringCloud</span>
                  <span className={styles.techTag}>Mybatis</span>
                  <span className={styles.techTag}>Mybatis-Plus</span>
                  <span className={styles.techTag}>Java</span>
                  <span className={styles.techTag}>Node.js</span>
                  <span className={styles.techTag}>RuoYi</span>
                  <span className={styles.techTag}>ElasticSearch</span>
                </div>
              </div>
              
              <div className={styles.expertiseCategory}>
                <h3 className={styles.expertiseTitle}>
                  <Translate id="about.devopsTech">DevOps</Translate>
                </h3>
                <div className={styles.tagCloud}>
                  <span className={styles.techTag}>Docker</span>
                  <span className={styles.techTag}>Jenkins</span>
                  <span className={styles.techTag}>Kubernetes</span>
                  <span className={styles.techTag}>Nginx</span>
                  <span className={styles.techTag}>Git</span>
                  <span className={styles.techTag}>CI/CD</span>
                </div>
              </div>
              
              <div className={styles.expertiseCategory}>
                <h3 className={styles.expertiseTitle}>
                  <Translate id="about.databaseTech">Databases</Translate>
                </h3>
                <div className={styles.tagCloud}>
                  <span className={styles.techTag}>MySQL</span>
                  <span className={styles.techTag}>Redis</span>
                  <span className={styles.techTag}>MongoDB</span>
                  <span className={styles.techTag}>SQL Server</span>
                  <span className={styles.techTag}>PostgreSQL</span>
                  <span className={styles.techTag}>Oracle</span>
                  <span className={styles.techTag}>SAP Hana</span>
                </div>
              </div>
              
              <div className={styles.expertiseCategory}>
                <h3 className={styles.expertiseTitle}>
                  <Translate id="about.aiTech">AI/ML</Translate>
                </h3>
                <div className={styles.tagCloud}>
                  <span className={styles.techTag}>Dify</span>
                  <span className={styles.techTag}>Ollama</span>
                  <span className={styles.techTag}>DeepSeek</span>
                  <span className={styles.techTag}>Coze AI</span>
                  <span className={styles.techTag}>LangChain</span>
                  <span className={styles.techTag}>Vector DB</span>
                </div>
              </div>
            </div>
          </section>

          {/* 联系方式 */}
          <section className={styles.contactSection}>
            <h2 className={styles.contactTitle}>
              <Translate id="about.contactInfo">Contact Information</Translate>
            </h2>
            <div className={styles.contactGrid}>
              <div className={styles.contactItem}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>
                  <Translate id="contact.email">1521170425@qq.com</Translate>
                </span>
              </div>
              <div className={styles.contactItem}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>
                  <Translate id="contact.phone">13261915710</Translate>
                </span>
              </div>
            </div>
            
            <div className={styles.footerText}>
              <p>© 2023 Laby. <Translate id="about.copyright">All rights reserved.</Translate></p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
} 

export default About; 