import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import Translate, {translate} from '@docusaurus/Translate';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogListPage';
import BlogCard from '@site/src/components/DevManga/BlogCard';
import Sidebar from '@site/src/components/DevManga/Sidebar';
import styles from './styles.module.css';

function BlogListPageMetadata(props: Props): JSX.Element {
  const {metadata} = props;
  return (
    <>
      <PageMetadata title={metadata.blogTitle} description={metadata.blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogListPageContent(props: Props): JSX.Element {
  const {metadata, items} = props;
  
  return (
    <BlogLayout>
      <div className={styles.blogListContainer}>
        <header className={styles.blogHeader}>
          <div className={styles.headerBadge}>
            <Translate id="blogList.header.badge">Phase 04: Transmission</Translate>
          </div>
          <h1 className={styles.blogTitle}>
            <Translate id="blogList.header.title">Latest Chapters</Translate>
          </h1>
          <p className={styles.blogDescription}>
            <Translate id="blogList.header.description">
              Dive into the technical chronicles of a dev who watches too much shonen.
            </Translate>
          </p>
        </header>
        
        <div className={styles.blogContent}>
          <main className={styles.blogMain}>
            <div className={styles.blogGrid}>
              {items.map(({content: BlogPostContent}, index) => {
                const {metadata: postMetadata, frontMatter} = BlogPostContent;
                return (
                  <BlogCard
                    key={postMetadata.permalink}
                    title={postMetadata.title}
                    description={postMetadata.description || frontMatter.description || ''}
                    permalink={postMetadata.permalink}
                    date={new Date(postMetadata.date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                    readingTime={`${Math.ceil(postMetadata.readingTime || 5)} ${translate({id: 'blogList.minRead', message: 'MIN READ'})}`}
                    tags={postMetadata.tags}
                    image={frontMatter.image}
                    chapter={`CH. ${String(items.length - index).padStart(2, '0')}`}
                  />
                );
              })}
            </div>
            
            <div className={styles.paginationWrapper}>
              <BlogListPaginator metadata={metadata} />
            </div>
          </main>
          
          <aside className={styles.blogSidebar}>
            <Sidebar tags={metadata.tags} />
          </aside>
        </div>
      </div>
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
