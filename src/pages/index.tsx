import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './index.module.css';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout
      title={translate({
        id: 'homepage.title',
        message: 'DevManga - 代码的呼吸法',
        description: 'The homepage title'
      })}
      description={translate({
        id: 'homepage.description',
        message: 'Slicing through bugs with First Form: Water-Cooled Logic',
        description: 'The homepage description'
      })}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <Translate id="homepage.hero.badge">HASHIRA OF CODE</Translate>
            </div>
            
            <h1 className={styles.heroTitle}>
              <Translate id="homepage.hero.title.part1">Mastering the</Translate>{' '}
              <span className={styles.heroTitleAccent}>
                <Translate id="homepage.hero.title.part2">Dev-Breathing</Translate>
              </span>
            </h1>
            
            <p className={styles.heroDescription}>
              <Translate id="homepage.hero.description">
                Slicing through bugs with First Form: Water-Cooled Logic. 
                Merging ancient full-stack techniques with Neo-Tokyo speed.
              </Translate>
            </p>
            
            <div className={styles.heroActions}>
              <Link to="/blog" className={styles.heroPrimaryButton}>
                <span><Translate id="homepage.hero.button.blog">UNSHEATHE BLOG</Translate></span>
              </Link>
              <Link to="/projects" className={styles.heroSecondaryButton}>
                <span><Translate id="homepage.hero.button.projects">ARMORY</Translate></span>
              </Link>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.heroImageContainer}>
              <div className={styles.heroImageBorder}></div>
              <div className={styles.heroImage}>
                <img src="/img/user/home-hero.jpg" alt="Dev Hero" className={styles.heroImageReal} />
              </div>
            </div>
            <div className={styles.heroSticker}>
              <Translate id="homepage.hero.sticker">TOTAL CONCENTRATION*</Translate>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className={styles.techStack}>
        <div className={styles.techStackContainer}>
          <div className={styles.techStackHeader}>
            <div>
              <h2 className={styles.techStackTitle}>
                <Translate id="homepage.techStack.title">CURRENT ARSENAL</Translate>
              </h2>
              <p className={styles.techStackSubtitle}>
                <Translate id="homepage.techStack.subtitle">Breathing forms for high performance</Translate>
              </p>
            </div>
            <div className={styles.techStackBadge}>
              <Translate id="homepage.techStack.badge">LEVEL 99 TECH STACK</Translate>
            </div>
          </div>
          
          <div className={styles.techGrid}>
            {[
              { icon: 'data_object', name: 'TypeScript' },
              { icon: 'layers', name: 'React/Next' },
              { icon: 'database', name: 'PostgreSQL' },
              { icon: 'cloud_done', name: 'Cloudflare' },
              { icon: 'terminal', name: 'Rust-Lang' },
              { icon: 'shield_with_heart', name: 'Zod/Security' },
              { icon: 'code', name: 'Node.js' },
              { icon: 'api', name: 'REST API' },
              { icon: 'storage', name: 'Redis' },
              { icon: 'deployed_code', name: 'Docker' },
            ].map((tech, index) => (
              <div key={tech.name} className={`${styles.techCard} ${styles[`techCard${index % 3}`]}`}>
                <span className={`material-symbols-outlined ${styles.techIcon}`}>
                  {tech.icon}
                </span>
                <span className={styles.techName}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comic Panel Blog Section */}
      <section className={styles.comicPanelSection}>
        <div className={styles.comicContainer}>
          <h2 className={styles.comicTitle}>
            <Translate id="homepage.blog.title">LATEST CHAPTERS</Translate>
          </h2>
          
          <div className={styles.comicGrid}>
            {/* Large Panel */}
            <Link to="/blog" className={styles.comicPanelLarge}>
              <div className={styles.panelBadge}>
                <Translate id="homepage.blog.featured.badge">TUTORIAL</Translate>
              </div>
              <h3 className={styles.panelTitle}>
                <Translate id="homepage.blog.featured.title">
                  Thunder Breathing: Seventh Form - Honoikazuchi no Kami (The API God)
                </Translate>
              </h3>
              <div className={styles.panelImage}>
                <img src="/img/blog/blog-1.jpg" alt="Tutorial" className={styles.panelImageReal} />
              </div>
              <p className={styles.panelDescription}>
                <Translate id="homepage.blog.featured.description">
                  Learn how to execute lightning-fast queries that would make Zenitsu proud. We explore async optimization and reactive patterns for the modern web demon hunter...
                </Translate>
              </p>
              <div className={styles.panelReadMore}>
                <Translate id="homepage.blog.readMore">READ MORE</Translate> <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </Link>
            
            {/* Right Stack Panels */}
            <div className={styles.comicPanelStack}>
              <Link to="/blog" className={styles.comicPanelSmall1}>
                <div className={styles.panelBadgeSmall}>
                  <Translate id="homepage.blog.post1.badge">Opinion</Translate>
                </div>
                <h4 className={styles.panelTitleSmall}>
                  <Translate id="homepage.blog.post1.title">
                    Why CSS Grid is basically Constant Concentration
                  </Translate>
                </h4>
                <p className={styles.panelDescSmall}>
                  <Translate id="homepage.blog.post1.description">
                    Maintaining layout state is like maintaining your breathing while sleeping...
                  </Translate>
                </p>
                <div className={styles.panelLinkSmall}>
                  <Translate id="homepage.blog.readEpisode">Read Episode</Translate>
                </div>
              </Link>
              
              <Link to="/blog" className={styles.comicPanelSmall2}>
                <div className={styles.panelBadgeSmall}>
                  <Translate id="homepage.blog.post2.badge">Review</Translate>
                </div>
                <h4 className={styles.panelTitleSmall}>
                  <Translate id="homepage.blog.post2.title">
                    Nichirin Keyboards: Mechanical Switch Quest
                  </Translate>
                </h4>
                <p className={styles.panelDescSmall}>
                  <Translate id="homepage.blog.post2.description">
                    Forging the perfect typing experience with color-changing LEDs...
                  </Translate>
                </p>
                <div className={styles.panelLinkSmall}>
                  <Translate id="homepage.blog.readEpisode">Read Episode</Translate>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Bottom Comic Strip */}
          <div className={styles.comicStrip}>
            {[
              { 
                titleId: 'homepage.blog.strip1.title',
                title: 'Zero to Pillar: Rust Basics', 
                timeId: 'homepage.blog.strip1.time',
                time: '5 MIN READ', 
                img: '/img/blog/blog-2.jpg' 
              },
              { 
                titleId: 'homepage.blog.strip2.title',
                title: 'Recovery Training: Coffee Guide', 
                timeId: 'homepage.blog.strip2.time',
                time: '8 MIN READ', 
                img: '/img/blog/blog-3.jpg' 
              },
              { 
                titleId: 'homepage.blog.strip3.title',
                title: 'Visualizing Blood Demon Arts with D3', 
                timeId: 'homepage.blog.strip3.time',
                time: '12 MIN READ', 
                img: '/img/blog/blog-4.jpg' 
              },
            ].map((item, index) => (
              <Link key={index} to="/blog" className={styles.comicStripCard}>
                <div className={styles.stripImage}>
                  <img src={item.img} alt={item.title} className={styles.stripImageReal} />
                </div>
                <h4 className={styles.stripTitle}>
                  <Translate id={item.titleId}>{item.title}</Translate>
                </h4>
                <span className={styles.stripTime}>
                  <Translate id={item.timeId}>{item.time}</Translate>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAB for Newsletter */}
      <Link to="/contact" className={styles.fab}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          mail
        </span>
      </Link>
    </Layout>
  );
}
