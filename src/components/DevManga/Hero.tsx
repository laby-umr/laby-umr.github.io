import React from 'react';
import Link from '@docusaurus/Link';
import styles from './Hero.module.css';

export default function Hero(): JSX.Element {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.energyGlow}></div>
      </div>
      
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            HASHIRA OF CODE
          </div>
          
          <h1 className={styles.heroTitle}>
            Mastering the <span className={styles.heroTitleAccent}>Dev-Breathing</span>
          </h1>
          
          <p className={styles.heroDescription}>
            Slicing through bugs with First Form: Water-Cooled Logic. 
            Merging ancient full-stack techniques with Neo-Tokyo speed.
          </p>
          
          <div className={styles.heroActions}>
            <Link to="/blog" className={styles.heroPrimaryButton}>
              <span>UNSHEATHE BLOG</span>
            </Link>
            <Link to="/docs" className={styles.heroSecondaryButton}>
              <span>ARMORY</span>
            </Link>
          </div>
        </div>
        
        <div className={styles.heroVisual}>
          <div className={styles.heroImageContainer}>
            <div className={styles.heroImageBorder}></div>
            <div className={styles.heroImage}>
              {/* Placeholder for hero image */}
              <div className={styles.heroImagePlaceholder}>
                <span className="material-symbols-outlined">code</span>
              </div>
            </div>
          </div>
          <div className={styles.heroSticker}>
            TOTAL CONCENTRATION*
          </div>
        </div>
      </div>
    </section>
  );
}
