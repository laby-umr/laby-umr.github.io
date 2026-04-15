import React from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './BlogCard.module.css';

interface BlogCardProps {
  title: string;
  description: string;
  permalink: string;
  date: string;
  readingTime?: string;
  tags?: Array<{ label: string; permalink: string }>;
  image?: string;
  chapter?: string;
}

export default function BlogCard({
  title,
  description,
  permalink,
  date,
  readingTime,
  tags = [],
  image,
  chapter = 'CH. 01',
}: BlogCardProps): JSX.Element {
  return (
    <article className={styles.blogCard}>
      <Link to={permalink} className={styles.cardLink}>
        <div className={styles.thumbnailContainer}>
          {image && (
            <img
              src={image}
              alt={title}
              className={styles.thumbnail}
              loading="lazy"
            />
          )}
          <div className={styles.chapterBadge}>{chapter}</div>
          {readingTime && (
            <div className={styles.readTimeBadge}>{readingTime}</div>
          )}
        </div>
        
        <div className={styles.cardContent}>
          <h2 className={styles.cardTitle}>{title}</h2>
          <p className={styles.cardDescription}>{description}</p>
          
          <div className={styles.cardFooter}>
            <span className={styles.cardDate}>{date}</span>
            <div className={styles.readMore}>
              <span>
                <Translate id="blogCard.readMore">READ MORE</Translate>
              </span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>
        </div>
      </Link>
      
      {tags.length > 0 && (
        <div className={styles.cardTags}>
          {tags.slice(0, 3).map((tag) => (
            <Link
              key={tag.permalink}
              to={tag.permalink}
              className={styles.tag}
            >
              {tag.label}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
