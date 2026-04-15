import React from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './projects.module.css';

export default function Projects() {
  const projects = [
    {
      titleKey: 'projects.project1.title',
      descriptionKey: 'projects.project1.description',
      image: '/img/projects/project.png',
      mode: 'PRODUCTION',
    },
    {
      titleKey: 'projects.project2.title',
      descriptionKey: 'projects.project2.description',
      image: '/img/projects/project2.png',
      mode: 'LIVE',
    },
    {
      titleKey: 'projects.project3.title',
      descriptionKey: 'projects.project3.description',
      image: '/img/projects/project3.png',
      mode: 'BETA',
    },
    {
      titleKey: 'projects.project4.title',
      descriptionKey: 'projects.project4.description',
      image: '/img/projects/project4.png',
      mode: 'PRODUCTION',
    },
    {
      titleKey: 'projects.project5.title',
      descriptionKey: 'projects.project5.description',
      image: '/img/projects/project5.png',
      mode: 'PRODUCTION',
    },
    {
      titleKey: 'projects.project6.title',
      descriptionKey: 'projects.project6.description',
      image: '/img/projects/project6.png',
      mode: 'LIVE',
    },
  ];

  return (
    <Layout
      title={translate({id: 'projects.title', message: '项目'})}
      description={translate({id: 'projects.description', message: '我的武器库 - 代码之刃'})}>
      <main className={styles.projectsMain}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            <Translate id="projects.header.badge">武器库</Translate>
          </div>
          <h1 className={styles.heroTitle}>
            <Translate id="projects.header.title">我的武器库</Translate>
          </h1>
          <p className={styles.heroDescription}>
            <Translate id="projects.header.subtitle">每个项目都是一把锻造的日轮刀</Translate>
          </p>
        </section>

        {/* Projects Grid */}
        <section className={styles.projectsSection}>
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <article key={index} className={`${styles.projectCard} ${styles[`float${index % 3}`]}`}>
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardControls}>
                    <div className={`${styles.control} ${styles.controlRed}`}></div>
                    <div className={`${styles.control} ${styles.controlYellow}`}></div>
                    <div className={`${styles.control} ${styles.controlGreen}`}></div>
                  </div>
                  <div className={styles.cardMode}>{project.mode}</div>
                </div>

                {/* Card Image */}
                <div className={styles.cardImage}>
                  <img 
                    src={project.image} 
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className={styles.pixelIcons}>
                    <span className="material-symbols-outlined">visibility</span>
                    <span className="material-symbols-outlined">code</span>
                  </div>
                  <div className={styles.scanline}></div>
                </div>

                {/* Card Content */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    <Translate id={project.titleKey}>{project.titleKey}</Translate>
                  </h3>
                  <p className={styles.cardDescription}>
                    <Translate id={project.descriptionKey}>{project.descriptionKey}</Translate>
                  </p>
                  <button className={styles.cardButton}>
                    <span><Translate id="projects.viewDetails">查看详情</Translate></span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Quote Section */}
        <section className={styles.quoteSection}>
          <div className={styles.quoteBackground}></div>
          <div className={styles.quoteContent}>
            <blockquote className={styles.quoteText}>
              <Translate id="projects.quote">代码不仅是工具，更是创造价值的艺术</Translate>
            </blockquote>
            <div className={styles.quoteTags}>
              <span className={styles.quoteTag}>
                <Translate id="projects.tag.innovation">创新</Translate>
              </span>
              <span className={styles.quoteTag}>
                <Translate id="projects.tag.quality">品质</Translate>
              </span>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
