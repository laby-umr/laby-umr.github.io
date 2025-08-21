import React, { useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';
import clsx from 'clsx';

function BlogListPageMetadata(props) {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const title = blogTitle ?? siteTitle;
  return (
    <PageMetadata title={title} description={blogDescription} permalink={permalink} />
  );
}

function BlogListPageHeader(props) {
  const { metadata } = props;
  const { blogTitle, blogDescription } = metadata;

  // 粒子效果
  const ParticlesHeader = () => {
    return (
      <div className={styles.particleContainer}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>
    );
  };

  return (
    <div className={styles.blogHeader}>
      <ParticlesHeader />
      <div className="container">
        <div className={styles.blogHeaderContent}>
          <h1 className={styles.blogTitle}>
            <span className={styles.gradientText}>{blogTitle}</span>
          </h1>
          <p className={styles.blogDescription}>{blogDescription}</p>
        </div>
      </div>
      <div className={styles.headerGrid}></div>
    </div>
  );
}

function TagCloud({tags}) {
  const [activeTag, setActiveTag] = useState('all');
  
  // 构建唯一标签列表
  const uniqueTags = {};
  tags.forEach(tag => {
    if (!uniqueTags[tag.label]) {
      uniqueTags[tag.label] = {
        label: tag.label,
        permalink: tag.permalink,
        count: 1
      };
    } else {
      uniqueTags[tag.label].count++;
    }
  });
  
  // 转换为数组并按出现次数排序
  const sortedTags = Object.values(uniqueTags)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // 只显示前10个最常用的标签
  
  return (
    <div className={styles.tagCloud}>
      <div 
        className={clsx(styles.tagItem, activeTag === 'all' && styles.tagActive)}
        onClick={() => setActiveTag('all')}
      >
        {translate({
          id: 'blog.tag.all',
          message: '全部'
        })}
      </div>
      {sortedTags.map((tag, idx) => (
        <Link 
          key={idx} 
          className={clsx(styles.tagItem, activeTag === tag.label && styles.tagActive)}
          onClick={() => setActiveTag(tag.label)}
          to={tag.permalink}
        >
          {tag.label} <span className={styles.tagCount}>{tag.count}</span>
        </Link>
      ))}
    </div>
  );
}

// 获取图片
function extractImageFromPost(post) {
  const {content: {metadata, frontMatter}, content} = post;
  
  // 首选项：frontMatter 中的 image
  if (frontMatter && frontMatter.image) {
    return frontMatter.image;
  }
  
  // 其次：检查文章内容中的第一个图片链接
  const contentStr = content.toString();
  const imgRegex = /!\[.*?\]\((.*?)\)/;
  const imgMatch = contentStr.match(imgRegex);
  
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }
  
  // 最后：使用默认图片
  const defaultImages = [
    'https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1561736778-92e52a7769ef?q=80&w=1470&auto=format&fit=crop'
  ];
  
  // 根据文章标题生成一个稳定的索引，确保相同标题总是得到相同图片
  const titleHash = metadata.title.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(titleHash) % defaultImages.length;
  return defaultImages[index];
}

function BlogPostItem({post, isAnimated = false}) {
  const {content: {metadata}} = post;
  const {permalink, title, description, date, formattedDate, tags, readingTime} = metadata;
  
  // 从文章中提取图片URL
  const imageUrl = extractImageFromPost(post);
  
  return (
    <article className={clsx(styles.blogPost, isAnimated && styles.animatedPost)}>
      <Link to={permalink} className={styles.blogPostLink}>
        <div className={styles.blogPostImageContainer}>
          <img 
            src={imageUrl} 
            alt={title} 
            className={styles.blogPostImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/logo.jpg'; // 图片加载失败时的备用图片
            }}
          />
          <div className={styles.blogPostOverlay}></div>
        </div>
        <div className={styles.blogPostContent}>
          <div className={styles.blogPostMeta}>
            <time className={styles.blogPostDate}>{formattedDate}</time>
            {readingTime && (
              <span className={styles.blogPostReadingTime}>
                {Math.ceil(readingTime)} {translate({
                  id: 'blog.readingTime',
                  message: '分钟阅读'
                })}
              </span>
            )}
          </div>
          
          <h2 className={styles.blogPostTitle}>{title}</h2>
          <p className={styles.blogPostDescription}>{description}</p>
          
          {tags?.length > 0 && (
            <div className={styles.blogPostTags}>
              {tags.slice(0, 3).map((tag, i) => (
                <span key={i} className={styles.blogPostTag}>
                  {tag.label}
                </span>
              ))}
            </div>
          )}
          
          <div className={styles.blogPostReadMore}>
            {translate({
              id: 'blog.readArticle',
              message: '阅读文章'
            })}
            <svg className={styles.readMoreIcon} viewBox="0 0 24 24">
              <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}

function FeaturedPost({post}) {
  const {content: {metadata}} = post;
  const {permalink, title, description, date, formattedDate, tags, readingTime} = metadata;
  
  // 从文章中提取图片URL
  const imageUrl = extractImageFromPost(post);
  
  return (
    <section className={styles.featuredPost}>
      <div className={styles.featuredInner}>
        <div className={styles.featuredContent}>
          <span className={styles.featuredLabel}>
            {translate({
              id: 'blog.featuredPost',
              message: '精选文章'
            })}
          </span>
          
          <h2 className={styles.featuredTitle}>
            <Link to={permalink}>{title}</Link>
          </h2>
          
          <div className={styles.featuredMeta}>
            <span className={styles.featuredDate}>{formattedDate}</span>
            {readingTime && (
              <span className={styles.featuredReadingTime}>
                {Math.ceil(readingTime)} {translate({
                  id: 'blog.readingTime',
                  message: '分钟阅读'
                })}
              </span>
            )}
          </div>
          
          <p className={styles.featuredDescription}>{description}</p>
          
          {tags?.length > 0 && (
            <div className={styles.featuredTags}>
              {tags.slice(0, 4).map((tag, i) => (
                <Link key={i} className={styles.featuredTag} to={tag.permalink}>
                  {tag.label}
                </Link>
              ))}
            </div>
          )}
          
          <Link to={permalink} className={styles.featuredLink}>
            {translate({
              id: 'blog.readFullArticle',
              message: '阅读全文'
            })}
            <svg className={styles.readMoreIcon} viewBox="0 0 24 24">
              <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
            </svg>
          </Link>
        </div>
        
        <div className={styles.featuredImageContainer}>
          <img 
            src={imageUrl} 
            alt={title} 
            className={styles.featuredImage} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/logo.jpg'; // 图片加载失败时的备用图片
            }}
          />
          <div className={styles.featuredImageOverlay}></div>
          <div className={styles.featuredImageGradient}></div>
        </div>
      </div>
    </section>
  );
}

function BlogListPageContent(props) {
  const { metadata, items } = props;
  const [visiblePosts, setVisiblePosts] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  
  // 提取所有标签
  const allTags = [];
  items.forEach(({content}) => {
    if (content.metadata.tags) {
      content.metadata.tags.forEach(tag => allTags.push(tag));
    }
  });
  
  // 加载更多文章的函数
  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisiblePosts(prevCount => Math.min(prevCount + 4, items.length));
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="container">
      {items.length > 0 && <FeaturedPost post={items[0]} />}
      
      <div className={styles.blogSearch}>
        <TagCloud tags={allTags} />
      </div>
      
      <div className={styles.blogGrid}>
        {items.slice(1, visiblePosts + 1).map((item, index) => (
          <BlogPostItem 
            key={index} 
            post={item} 
            isAnimated={true} 
          />
        ))}
      </div>

      {visiblePosts < items.length && (
        <div className={styles.loadMoreContainer}>
          <button 
            className={clsx(styles.loadMoreButton, isLoading && styles.loading)}
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loadingSpinner}></span>
            ) : (
              translate({
                id: 'blog.loadMore',
                message: '加载更多文章'
              })
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function BlogListPage(props) {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <BlogListPageMetadata {...props} />
      <BlogLayout>
        <BlogListPageHeader {...props} />
        <BlogListPageContent {...props} />
      </BlogLayout>
    </HtmlClassNameProvider>
  );
} 