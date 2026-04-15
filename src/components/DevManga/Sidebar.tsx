import React from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import styles from './Sidebar.module.css';

interface SidebarProps {
  tags?: Array<{ label: string; permalink: string; count?: number }>;
}

export default function Sidebar({ tags = [] }: SidebarProps): JSX.Element {
  const defaultTags = [
    { label: 'Development', permalink: '/blog/tags/development', color: 'primary' },
    { label: 'Design', permalink: '/blog/tags/design', color: 'secondary' },
    { label: 'Tutorials', permalink: '/blog/tags/tutorials', color: 'tertiary' },
    { label: 'Updates', permalink: '/blog/tags/updates', color: 'surface' },
    { label: 'Frontend', permalink: '/blog/tags/frontend', color: 'primary' },
    { label: 'Backend', permalink: '/blog/tags/backend', color: 'secondary' },
  ];

  const displayTags = tags.length > 0 ? tags : defaultTags;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.tagsSection}>
        <h2 className={styles.sidebarTitle}>
          <Translate id="sidebar.tags.title">Tags</Translate>
        </h2>
        <div className={styles.tagCloud}>
          {displayTags.map((tag, index) => (
            <Link
              key={tag.permalink}
              to={tag.permalink}
              className={styles.tag}
              style={{
                transform: `rotate(${(index % 3 - 1) * 2}deg)`,
              }}
            >
              {tag.label}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.newsletterCard}>
        <div className={styles.cardHeader}>
          <span className={styles.indicator}></span>
          <h3 className={styles.cardTitle}>
            <Translate id="sidebar.newsletter.title">Manga Newsletter</Translate>
          </h3>
        </div>
        <p className={styles.cardDescription}>
          <Translate id="sidebar.newsletter.description">
            Get the latest chapters of code delivered to your mailbox.
          </Translate>
        </p>
        <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder={translate({id: 'sidebar.newsletter.placeholder', message: 'email@devmanga.com'})}
            className={styles.emailInput}
            required
          />
          <button type="submit" className={styles.subscribeButton}>
            <span>
              <Translate id="sidebar.newsletter.subscribe">Subscribe</Translate>
            </span>
            <div className={styles.buttonShimmer}></div>
          </button>
        </form>
      </div>
    </aside>
  );
}
