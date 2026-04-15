import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './about.module.css';

export default function About(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'work' | 'projects' | 'education'>('work');

  return (
    <Layout
      title={translate({id: 'about.title', message: '关于我'})}
      description={translate({id: 'about.description', message: '猎鬼人档案 - 我的故事'})}>
      <main className={styles.aboutMain}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContainer}>
            <div className={styles.heroLeft}>
              <div className={styles.heroBadge}>
                <Translate id="about.hero.badge">全栈工程师</Translate>
              </div>
              
              <h1 className={styles.heroName}>
                <Translate id="about.hero.name">刘佳兴</Translate>
              </h1>
              
              <p className={styles.heroIntro}>
                <Translate id="about.hero.intro">
                  9年全栈开发经验，精通前后端技术栈。擅长从0到1搭建系统架构，
                  熟练使用Spring Cloud微服务、Vue3/React前端框架，
                  有丰富的大数据平台、CRM系统、智慧仓储等项目经验。
                </Translate>
              </p>
              
              <div className={styles.heroButtons}>
                <a href="/contact" className={styles.heroPrimaryBtn}>
                  <Translate id="about.hero.contactBtn">联系我</Translate>
                  <span className={styles.btnBadge}>
                    <Translate id="about.hero.contactBadge">可远程</Translate>
                  </span>
                </a>
                <a 
                  href="/file/刘佳兴-Vibe Coding开发.pdf" 
                  download="刘佳兴-简历.pdf"
                  className={styles.heroDownloadBtn}
                >
                  <span className="material-symbols-outlined">download</span>
                  <Translate id="about.hero.downloadBtn">下载简历</Translate>
                </a>
              </div>
            </div>
            
            <div className={styles.heroRight}>
              <div className={styles.heroImageWrapper}>
                <img 
                  src="/img/user/about-hero.jpg" 
                  alt={translate({id: 'about.hero.name', message: '刘佳兴'})}
                  className={styles.heroImage} 
                />
              </div>
              <div className={styles.heroSticker}>
                <Translate id="about.hero.sticker">9年经验 · 全栈开发</Translate>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>
                <Translate id="about.stats.experience">9年+</Translate>
              </h3>
              <p className={styles.statLabel}>
                <Translate id="about.stats.experienceLabel">工作经验</Translate>
              </p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>
                <Translate id="about.stats.projects">10+</Translate>
              </h3>
              <p className={styles.statLabel}>
                <Translate id="about.stats.projectsLabel">核心项目</Translate>
              </p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>
                <Translate id="about.stats.skills">20+</Translate>
              </h3>
              <p className={styles.statLabel}>
                <Translate id="about.stats.skillsLabel">技术栈</Translate>
              </p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>
                <Translate id="about.stats.companies">5家</Translate>
              </h3>
              <p className={styles.statLabel}>
                <Translate id="about.stats.companiesLabel">知名企业</Translate>
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className={styles.contactSection}>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <span className="material-symbols-outlined">phone</span>
              <div>
                <p className={styles.contactLabel}>
                  <Translate id="about.contact.phone">电话</Translate>
                </p>
                <p className={styles.contactValue}>
                  <Translate id="about.contact.phoneValue">13261915710</Translate>
                </p>
              </div>
            </div>
            <div className={styles.contactCard}>
              <span className="material-symbols-outlined">email</span>
              <div>
                <p className={styles.contactLabel}>
                  <Translate id="about.contact.email">邮箱</Translate>
                </p>
                <p className={styles.contactValue}>
                  <Translate id="about.contact.emailValue">1521170425@qq.com</Translate>
                </p>
              </div>
            </div>
            <div className={styles.contactCard}>
              <span className="material-symbols-outlined">location_on</span>
              <div>
                <p className={styles.contactLabel}>
                  <Translate id="about.contact.location">位置</Translate>
                </p>
                <p className={styles.contactValue}>
                  <Translate id="about.contact.locationValue">北京 · 32岁</Translate>
                </p>
              </div>
            </div>
            <div className={styles.contactCard}>
              <span className="material-symbols-outlined">payments</span>
              <div>
                <p className={styles.contactLabel}>
                  <Translate id="about.contact.salary">期望薪资</Translate>
                </p>
                <p className={styles.contactValue}>
                  <Translate id="about.contact.salaryValue">20-25K</Translate>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className={styles.skillsSection}>
          <h2 className={styles.sectionTitle}>
            <Translate id="about.skills.title">技术栈</Translate>
          </h2>
          
          <div className={styles.skillCategories}>
            <div className={styles.skillCategory}>
              <h3 className={styles.categoryTitle}>
                <span className="material-symbols-outlined">code</span>
                <Translate id="about.skills.backend">后端技术</Translate>
              </h3>
              <div className={styles.skillTags}>
                <span>Spring Boot</span>
                <span>Spring Cloud</span>
                <span>MyBatis Plus</span>
                <span>Spring Data JPA</span>
              </div>
            </div>

            <div className={styles.skillCategory}>
              <h3 className={styles.categoryTitle}>
                <span className="material-symbols-outlined">web</span>
                <Translate id="about.skills.frontend">前端技术</Translate>
              </h3>
              <div className={styles.skillTags}>
                <span>Vue3</span>
                <span>React</span>
                <span>Angular</span>
                <span>TypeScript</span>
                <span>Element UI</span>
                <span>Ant Design</span>
                <span>Arco Design</span>
                <span>TailwindCSS</span>
              </div>
            </div>

            <div className={styles.skillCategory}>
              <h3 className={styles.categoryTitle}>
                <span className="material-symbols-outlined">storage</span>
                <Translate id="about.skills.database">数据存储</Translate>
              </h3>
              <div className={styles.skillTags}>
                <span>MySQL</span>
                <span>PostgreSQL</span>
                <span>Oracle</span>
                <span>Redis</span>
                <span>MongoDB</span>
              </div>
            </div>

            <div className={styles.skillCategory}>
              <h3 className={styles.categoryTitle}>
                <span className="material-symbols-outlined">smart_toy</span>
                <Translate id="about.skills.ai">AI编程</Translate>
              </h3>
              <div className={styles.skillTags}>
                <span>Cursor</span>
                <span>Windsurf</span>
                <span>GitHub Copilot</span>
                <span>Claude</span>
                <span>Kiro</span>
                <span>chat2DB</span>
              </div>
            </div>

            <div className={styles.skillCategory}>
              <h3 className={styles.categoryTitle}>
                <span className="material-symbols-outlined">deployed_code</span>
                <Translate id="about.skills.devops">DevOps</Translate>
              </h3>
              <div className={styles.skillTags}>
                <span>Docker</span>
                <span>Nginx</span>
                <span>Jenkins</span>
                <span>GitLab CI/CD</span>
                <span>Git</span>
                <span>GitHub</span>
              </div>
            </div>

            <div className={styles.skillCategory}>
              <h3 className={styles.categoryTitle}>
                <span className="material-symbols-outlined">architecture</span>
                <Translate id="about.skills.framework">开源框架</Translate>
              </h3>
              <div className={styles.skillTags}>
                <span>若依</span>
                <span>若依-plus</span>
                <span>若依-pro</span>
                <span>mall</span>
                <span>Smart Admin</span>
                <span>NaiveAdmin</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className={styles.tabsSection}>
          <h2 className={styles.sectionTitle}>
            <Translate id="about.tabs.title">职业历程</Translate>
          </h2>
          
          {/* Tab Navigation */}
          <div className={styles.tabNav}>
            <button
              className={`${styles.tabButton} ${activeTab === 'work' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('work')}
            >
              <span className="material-symbols-outlined">work</span>
              <Translate id="about.tabs.work">工作经历</Translate>
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'projects' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              <Translate id="about.tabs.projects">项目经历</Translate>
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'education' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('education')}
            >
              <span className="material-symbols-outlined">school</span>
              <Translate id="about.tabs.education">教育经历</Translate>
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {/* Work Experience */}
            {activeTab === 'work' && (
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <div>
                        <h3>北京祈安注册安全工程师事务所有限公司</h3>
                        <p className={styles.position}>全栈工程师</p>
                      </div>
                      <span className={styles.period}>2025.11 - 至今</span>
                    </div>
                    <ul className={styles.duties}>
                      <li>负责祈安CRM系统全栈开发，实现客户管理、商机跟踪、合同签订等核心功能</li>
                      <li>使用Vue3 + Spring Boot 3搭建系统架构，集成Flowable工作流引擎</li>
                      <li>优化业务项目架构，将12张表简化为1张表+JSON扩展，代码量减少70%</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <div>
                        <h3>北京君周科技有限公司</h3>
                        <p className={styles.position}>Java开发工程师</p>
                      </div>
                      <span className={styles.period}>2023.07 - 2024.12</span>
                    </div>
                    <ul className={styles.duties}>
                      <li>负责智慧仓储系统开发，实现RFID自动识别，入库效率提升50%</li>
                      <li>完成若依框架多租户改造，支撑3+营地独立运营</li>
                      <li>集成DeepSeek大模型，实现智能报表分析功能</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <div>
                        <h3>北京科锐国际人力资源股份有限公司</h3>
                        <p className={styles.position}>Java开发工程师</p>
                      </div>
                      <span className={styles.period}>2020.01 - 2023.03</span>
                    </div>
                    <ul className={styles.duties}>
                      <li>负责SSC供应链订单管理平台开发，订单处理效率提升40%</li>
                      <li>开发联想供应商质量管理门户，质量追溯功能实现100%产品可追溯</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <div>
                        <h3>河南元博软件有限公司</h3>
                        <p className={styles.position}>Java开发工程师</p>
                      </div>
                      <span className={styles.period}>2017.07 - 2020.01</span>
                    </div>
                    <ul className={styles.duties}>
                      <li>负责智能制造大数据实训平台开发，接入100+台设备</li>
                      <li>开发HC大数据可视化平台，支撑20+业务部门数据分析需求</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Project Experience */}
            {activeTab === 'projects' && (
              <div className={styles.projectsGrid}>
                <div className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3>祈安CRM系统</h3>
                    <span className={styles.projectTag}>2025.11 - 至今</span>
                  </div>
                  <p className={styles.projectDesc}>
                    面向消防安全服务行业的客户关系管理系统，覆盖客户管理、商机跟踪、合同签订、立项审批、业务项目执行等全流程。
                  </p>
                  <div className={styles.projectTech}>
                    <span>Vue3</span>
                    <span>TypeScript</span>
                    <span>Spring Boot 3</span>
                    <span>Flowable</span>
                    <span>MinIO</span>
                  </div>
                  <div className={styles.projectAchievements}>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>90%</span>
                      <span className={styles.achievementLabel}>查询效率提升</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>70%</span>
                      <span className={styles.achievementLabel}>代码量减少</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>80%</span>
                      <span className={styles.achievementLabel}>发布效率提升</span>
                    </div>
                  </div>
                </div>

                <div className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3>智慧仓储系统</h3>
                    <span className={styles.projectTag}>2025.01 - 2025.11</span>
                  </div>
                  <p className={styles.projectDesc}>
                    以物联网三维建模与AI决策为核心的企业级WMS解决方案，集成RFID自动识别与数字孪生技术。
                  </p>
                  <div className={styles.projectTech}>
                    <span>若依</span>
                    <span>Vue3</span>
                    <span>Redis</span>
                    <span>Redisson</span>
                    <span>DeepSeek AI</span>
                  </div>
                  <div className={styles.projectAchievements}>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>99.6%</span>
                      <span className={styles.achievementLabel}>识别准确率</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>50%</span>
                      <span className={styles.achievementLabel}>入库效率提升</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>500+</span>
                      <span className={styles.achievementLabel}>高峰TPS</span>
                    </div>
                  </div>
                </div>

                <div className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3>工业大数据平台</h3>
                    <span className={styles.projectTag}>2023.09 - 2024.12</span>
                  </div>
                  <p className={styles.projectDesc}>
                    数据全生命周期一站式开发运营平台，提供数据集成、数据开发、数据治理、数据服务等功能。
                  </p>
                  <div className={styles.projectTech}>
                    <span>Spring Cloud</span>
                    <span>Hive</span>
                    <span>Vue</span>
                    <span>Element UI</span>
                  </div>
                  <div className={styles.projectAchievements}>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>40万+</span>
                      <span className={styles.achievementLabel}>节省成本</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>60%</span>
                      <span className={styles.achievementLabel}>问题发现率提升</span>
                    </div>
                  </div>
                </div>

                <div className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3>国家电网思极安全接入网关</h3>
                    <span className={styles.projectTag}>2023.03 - 2023.07</span>
                  </div>
                  <p className={styles.projectDesc}>
                    国家电网思极网安自主研发的安全接入网关系统，实现对安全控制网关的统一配置管理，提供安全访问控制、用户身份认证、安全审计及透明存储加解密能力。
                  </p>
                  <div className={styles.projectTech}>
                    <span>Spring Boot</span>
                    <span>MyBatis Plus</span>
                    <span>LayUI</span>
                    <span>JNI</span>
                    <span>MySQL</span>
                  </div>
                  <div className={styles.projectAchievements}>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>30%</span>
                      <span className={styles.achievementLabel}>项目周期缩短</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>1分钟</span>
                      <span className={styles.achievementLabel}>安全事件响应</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>50万+</span>
                      <span className={styles.achievementLabel}>日均处理日志</span>
                    </div>
                  </div>
                </div>

                <div className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3>SSC LVR Portal</h3>
                    <span className={styles.projectTag}>2021.11 - 2023.03</span>
                  </div>
                  <p className={styles.projectDesc}>
                    惠普全球共享服务中心的供应链订单管理平台，为国外业务部门提供订单全生命周期管理服务，包括订单生成、订单查询、订单跟进、订单维护、物流同步、订单延期、费用结算等核心功能。
                  </p>
                  <div className={styles.projectTech}>
                    <span>Spring Cloud</span>
                    <span>JDK11</span>
                    <span>MyBatis Plus</span>
                    <span>Vue</span>
                    <span>Redis</span>
                  </div>
                  <div className={styles.projectAchievements}>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>40%</span>
                      <span className={styles.achievementLabel}>订单处理效率提升</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>50%</span>
                      <span className={styles.achievementLabel}>人工工作量减少</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>100%</span>
                      <span className={styles.achievementLabel}>结算准确率</span>
                    </div>
                  </div>
                </div>

                <div className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3>SCI Quality Portal</h3>
                    <span className={styles.projectTag}>2020.12 - 2021.11</span>
                  </div>
                  <p className={styles.projectDesc}>
                    联想供应链质量管理门户，实现供应商质量评估、来料检验、质量追溯等全流程质量管控。
                  </p>
                  <div className={styles.projectTech}>
                    <span>Spring Boot</span>
                    <span>JPA</span>
                    <span>SAP HANA</span>
                    <span>Angular</span>
                    <span>Ant Design</span>
                  </div>
                  <div className={styles.projectAchievements}>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>3天</span>
                      <span className={styles.achievementLabel}>评估周期缩短</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>100%</span>
                      <span className={styles.achievementLabel}>产品可追溯</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>80%</span>
                      <span className={styles.achievementLabel}>定位效率提升</span>
                    </div>
                  </div>
                </div>

                <div className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3>智能制造大数据实训平台</h3>
                    <span className={styles.projectTag}>2020.02 - 2020.12</span>
                  </div>
                  <p className={styles.projectDesc}>
                    面向制造企业的工业互联网平台，实现设备联网、数据采集、生产监控、智能分析，推动工厂数字化转型。
                  </p>
                  <div className={styles.projectTech}>
                    <span>Spring Cloud</span>
                    <span>Spring Boot</span>
                    <span>MyBatis Plus</span>
                    <span>Vue</span>
                    <span>Element UI</span>
                  </div>
                  <div className={styles.projectAchievements}>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>100+</span>
                      <span className={styles.achievementLabel}>设备接入</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>99%+</span>
                      <span className={styles.achievementLabel}>数据完整率</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>15%</span>
                      <span className={styles.achievementLabel}>产能提升</span>
                    </div>
                  </div>
                </div>

                <div className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3>HC大数据可视化平台</h3>
                    <span className={styles.projectTag}>2019.02 - 2020.01</span>
                  </div>
                  <p className={styles.projectDesc}>
                    企业级大数据可视化分析平台，提供拖拽式报表设计、多数据源接入、实时数据大屏等能力，赋能业务数据分析。
                  </p>
                  <div className={styles.projectTech}>
                    <span>Spring Boot</span>
                    <span>MyBatis Plus</span>
                    <span>Vue</span>
                    <span>Element UI</span>
                    <span>ECharts</span>
                  </div>
                  <div className={styles.projectAchievements}>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>20+</span>
                      <span className={styles.achievementLabel}>业务部门支撑</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>500+</span>
                      <span className={styles.achievementLabel}>月均生成报表</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>70%</span>
                      <span className={styles.achievementLabel}>制作效率提升</span>
                    </div>
                  </div>
                </div>

                <div className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3>CRM后台管理系统</h3>
                    <span className={styles.projectTag}>2018.03 - 2019.02</span>
                  </div>
                  <p className={styles.projectDesc}>
                    广告行业CRM系统，管理客户资源、广告排期、合同执行、财务对账等业务，实现广告业务全流程数字化。
                  </p>
                  <div className={styles.projectTech}>
                    <span>Spring Boot</span>
                    <span>MyBatis</span>
                    <span>SqlServer</span>
                    <span>React</span>
                    <span>Ant Design</span>
                  </div>
                  <div className={styles.projectAchievements}>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>50%</span>
                      <span className={styles.achievementLabel}>录入效率提升</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>60%</span>
                      <span className={styles.achievementLabel}>遗漏率下降</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>15分钟</span>
                      <span className={styles.achievementLabel}>排期耗时</span>
                    </div>
                  </div>
                </div>

                <div className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3>煤矿安全监控系统</h3>
                    <span className={styles.projectTag}>2017.07 - 2018.03</span>
                  </div>
                  <p className={styles.projectDesc}>
                    煤矿安全生产综合监控平台，融合人员定位、环境监测、视频监控等多子系统，实现井下安全态势一张图管控。
                  </p>
                  <div className={styles.projectTech}>
                    <span>Spring MVC</span>
                    <span>MongoDB</span>
                    <span>Vue</span>
                    <span>Redis</span>
                    <span>Socket.io</span>
                  </div>
                  <div className={styles.projectAchievements}>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>5套</span>
                      <span className={styles.achievementLabel}>子系统整合</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>米级</span>
                      <span className={styles.achievementLabel}>定位精度</span>
                    </div>
                    <div className={styles.achievement}>
                      <span className={styles.achievementNumber}>30秒</span>
                      <span className={styles.achievementLabel}>告警响应时间</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Education */}
            {activeTab === 'education' && (
              <div className={styles.educationGrid}>
                <div className={styles.educationCard}>
                  <div className={styles.educationIcon}>
                    <span className="material-symbols-outlined">school</span>
                  </div>
                  <div className={styles.educationContent}>
                    <h3>天津工业大学</h3>
                    <p className={styles.educationDegree}>本科 · 软件工程</p>
                    <p className={styles.educationPeriod}>2015 - 2017</p>
                    <div className={styles.educationHighlights}>
                      <span>软件开发</span>
                      <span>数据结构</span>
                      <span>算法设计</span>
                      <span>数据库原理</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2><Translate id="about.cta.title">让我们一起创造价值</Translate></h2>
          <p><Translate id="about.cta.description">如果您正在寻找一位经验丰富的全栈工程师，欢迎与我联系</Translate></p>
          <div className={styles.ctaButtons}>
            <a href="/contact" className={styles.ctaButton}>
              <span className="material-symbols-outlined">send</span>
              <Translate id="about.cta.contact">联系我</Translate>
            </a>
            <a href="/projects" className={styles.ctaButtonSecondary}>
              <span className="material-symbols-outlined">work</span>
              <Translate id="about.cta.projects">查看更多项目</Translate>
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
