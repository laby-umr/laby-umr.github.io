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
import TargetCursor from '@site/src/components/TargetCursor';
import GlitchText from '@site/src/components/GlitchText';
import JellyTextAnimation from '@site/src/components/JellyTextAnimation';

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

      {/* 装饰光晕 */}
      <div className={styles.decorativeBlob1}></div>
      <div className={styles.decorativeBlob2}></div>

      <div className="container">
        <div className={styles.blogHeaderContent}>
          {/* 徽章 */}
          <div className={styles.badgeWrapper}>
            <div className={styles.badge}>
              {translate({
                id: 'blog.badge',
                message: '技术博客'
              })}
            </div>
            <div className={styles.badgeBorder1}></div>
            <div className={styles.badgeBorder2}></div>
          </div>

          <h1 className={styles.blogTitle}>
            <span className={styles.gradientText}>
              <GlitchText speed={1} enableShadows={true} enableOnHover={false}>
                <JellyTextAnimation delay={0}>{blogTitle}</JellyTextAnimation>
              </GlitchText>
            </span>
          </h1>
          <p className={styles.blogDescription}>{blogDescription}</p>

          {/* 装饰线条 */}
          <div className={styles.decorativeLine}></div>
        </div>
      </div>
      <div className={styles.headerGrid}></div>
    </div>
  );
}

function TagCloud({ tags, activeTag, onTagClick }) {
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
        className={clsx(styles.tagItem, activeTag === 'all' && styles.tagActive, 'cursor-target')}
        onClick={() => onTagClick('all')}
      >
        {translate({
          id: 'blog.tag.all',
          message: '全部'
        })}
      </div>
      {sortedTags.map((tag, idx) => (
        <div
          key={idx}
          className={clsx(styles.tagItem, activeTag === tag.label && styles.tagActive, 'cursor-target')}
          onClick={() => onTagClick(tag.label)}
        >
          {tag.label} <span className={styles.tagCount}>{tag.count}</span>
        </div>
      ))}
    </div>
  );
}

// 获取图片
function extractImageFromPost(post) {
  const { content: { metadata, frontMatter }, content } = post;

  // 首选项：frontMatter 中的 image
  if (frontMatter && frontMatter.image) {
    return frontMatter.image;
  }

  // 使用默认图片（日本街景 - 东京/京都/大阪）
  // 根据标题 hash 分配，确保不同文章使用不同图片
  const defaultImages = [
    '/img/blog/blog-1.jpg',   // 东京夜景
    '/img/blog/blog-2.jpg',   // 东京塔
    '/img/blog/blog-3.jpg',   // 涩谷
    '/img/blog/blog-4.jpg',   // 东京都市
    '/img/blog/blog-5.jpg',   // 霓虹灯
    '/img/blog/blog-8.jpg',   // 京都神社
    '/img/blog/blog-9.jpg',   // 樱花
    '/img/blog/blog-13.jpg',  // 竹林
    '/img/blog/blog-14.jpg',  // 富士山
    '/img/blog/blog-15.jpg',  // 大阪道顿堀
    '/img/blog/blog-16.jpg',  // 大阪夜景
    '/img/blog/blog-17.jpg',  // 大阪城市
    '/img/blog/blog-21.jpg',  // 传统建筑
    '/img/blog/blog-22.jpg',  // 灯笼街
    '/img/blog/blog-23.jpg',  // 现代建筑
    '/img/blog/blog-24.jpg',  // 地铁站
    '/img/blog/blog-26.jpg',  // 日本城市
    '/img/blog/blog-30.jpg'   // 日本建筑
  ];

  // 根据文章标题生成一个稳定的索引，确保相同标题总是得到相同图片
  const titleHash = metadata.title.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  const index = Math.abs(titleHash) % defaultImages.length;
  return defaultImages[index];
}

function BlogPostItem({ post, isAnimated = false }) {
  const { content: { metadata } } = post;
  const { permalink, title, description, date, formattedDate, tags, readingTime } = metadata;

  // 从文章中提取图片URL
  const imageUrl = extractImageFromPost(post);

  return (
    <article
      className={clsx(styles.blogPost, isAnimated && styles.animatedPost)}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className={styles.blogPostOverlay}></div>
      <div className={styles.blogPostContentWrapper}>
        {/* 上半部分 - 左对齐 */}
        <div className={styles.blogPostTopContent}>
          <h2 className={styles.blogPostTitle}>{title}</h2>
          <div className={styles.blogPostTags}>
            {readingTime && (
              <span className={`${styles.blogPostTag} cursor-target`}>
                {Math.ceil(readingTime)}{translate({ id: 'blog.readingTime.minutes', message: '分钟' })}
              </span>
            )}
            {tags?.slice(0, 2).map((tag, i) => (
              <span key={i} className={`${styles.blogPostTag} cursor-target`}>
                {tag.label}
              </span>
            ))}
          </div>
          <p className={styles.blogPostDescription}>{description}</p>
        </div>

        {/* 右下角按钮 */}
        <Link to={permalink} className={`${styles.blogReadButton} cursor-target`}>
          <span>
            {translate({
              id: 'blog.readArticle',
              message: '阅读文章'
            })}
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

function FeaturedPost({ post }) {
  const { content: { metadata } } = post;
  const { permalink, title, description, date, formattedDate, tags, readingTime } = metadata;

  // 从文章中提取图片URL
  const imageUrl = extractImageFromPost(post);

  // 提取年份
  const year = new Date(date).getFullYear();

  return (
    <article
      className={styles.featuredPost}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className={styles.featuredOverlay}></div>
      <div className={styles.featuredContent}>
        {/* 内容 - 中间偏下左对齐 */}
        <div className={styles.featuredTopContent}>
          <h2 className={styles.featuredTitle}>{title}</h2>
          <div className={styles.featuredTags}>
            <span className={`${styles.featuredTag} cursor-target`}>{year}</span>
            {tags?.slice(0, 3).map((tag, i) => (
              <span key={i} className={`${styles.featuredTag} cursor-target`}>
                {tag.label}
              </span>
            ))}
          </div>
          <p className={styles.featuredDescription}>{description}</p>
        </div>

        {/* 右下角按钮 */}
        <Link to={permalink} className={`${styles.featuredButton} cursor-target`}>
          <span>
            {translate({
              id: 'blog.readFullArticle',
              message: '阅读全文'
            })}
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

function BlogListPageContent(props) {
  const { metadata, items } = props;
  const [visiblePosts, setVisiblePosts] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState('all');

  // 提取所有标签
  const allTags = [];
  items.forEach(({ content }) => {
    if (content.metadata.tags) {
      content.metadata.tags.forEach(tag => allTags.push(tag));
    }
  });

  // 提取所有分类
  const allCategories = new Set();
  items.forEach(({ content }) => {
    if (content.metadata.tags && content.metadata.tags.length > 0) {
      allCategories.add(content.metadata.tags[0].label);
    }
  });

  // 过滤文章
  const filteredItems = items.filter(({ content }) => {
    const matchesSearch = searchTerm === '' ||
      content.metadata.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.metadata.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === 'all' ||
      (content.metadata.tags && content.metadata.tags.some(tag => tag.label === activeCategory));

    const matchesTag = activeTag === 'all' ||
      (content.metadata.tags && content.metadata.tags.some(tag => tag.label === activeTag));

    return matchesSearch && matchesCategory && matchesTag;
  });

  // 加载更多文章的函数
  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisiblePosts(prevCount => Math.min(prevCount + 4, filteredItems.length));
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="container">
      {items.length > 0 && <FeaturedPost post={items[0]} />}

      {/* 主要内容区域 - 三栏布局 */}
      <div className={styles.mainContent}>
        {/* 左侧：文章列表 */}
        <div className={styles.postsColumn}>
          {/* 搜索和筛选 */}
          <div className={styles.filterSection}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder={translate({
                  id: 'blog.searchPlaceholder',
                  message: '搜索文章...'
                })}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <svg className={styles.searchIcon} viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <TagCloud
              tags={allTags}
              activeTag={activeTag}
              onTagClick={(tag) => {
                setActiveTag(tag);
                setVisiblePosts(4); // 重置显示数量
              }}
            />
          </div>

          {/* 筛选结果提示 */}
          {(searchTerm || activeTag !== 'all' || activeCategory !== 'all') && (
            <div className={styles.filterInfo}>
              {translate({
                id: 'blog.filterResults',
                message: '找到'
              })} <strong>{filteredItems.length - 1}</strong> {translate({
                id: 'blog.articles',
                message: '篇文章'
              })}
              {(searchTerm || activeTag !== 'all' || activeCategory !== 'all') && (
                <button
                  className={styles.clearFilter}
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTag('all');
                    setActiveCategory('all');
                    setVisiblePosts(4);
                  }}
                >
                  {translate({
                    id: 'blog.clearFilter',
                    message: '清除筛选'
                  })}
                </button>
              )}
            </div>
          )}

          <div className={styles.blogGrid}>
            {filteredItems.slice(1, visiblePosts + 1).map((item, index) => (
              <BlogPostItem
                key={index}
                post={item}
                isAnimated={true}
              />
            ))}
          </div>

          {/* 无结果提示 */}
          {filteredItems.length <= 1 && (
            <div className={styles.noResults}>
              <svg className={styles.noResultsIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>{translate({
                id: 'blog.noResults',
                message: '没有找到匹配的文章'
              })}</h3>
              <p>{translate({
                id: 'blog.tryDifferent',
                message: '试试其他搜索词或标签'
              })}</p>
            </div>
          )}

          {visiblePosts < filteredItems.length && (
            <div className={styles.loadMoreContainer}>
              <button
                className={clsx(styles.loadMoreButton, isLoading && styles.loading, 'cursor-target')}
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

        {/* 右侧：侧边栏 */}
        <aside className={styles.sidebar}>
          {/* 作者信息 */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>
              {translate({
                id: 'blog.aboutAuthor',
                message: '关于作者'
              })}
            </h3>
            <div className={styles.authorInfo}>
              <img
                src="/img/user/header.jpg"
                alt="Author"
                className={styles.authorAvatar}
              />
              <div className={styles.authorDetails}>
                <h4 className={styles.authorName}>Laby</h4>
                <p className={styles.authorBio}>
                  {translate({
                    id: 'blog.authorBio',
                    message: '全栈开发工程师'
                  })}
                </p>
              </div>
            </div>
            <div className={styles.socialLinks}>
              <a href="#" className={`${styles.socialLink} cursor-target`} aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" className={`${styles.socialLink} cursor-target`} aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 分类 */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>
              {translate({
                id: 'blog.categories',
                message: '分类'
              })}
            </h3>
            <div className={styles.categoryList}>
              <button
                className={clsx(styles.categoryItem, activeCategory === 'all' && styles.categoryActive, 'cursor-target')}
                onClick={() => setActiveCategory('all')}
              >
                {translate({
                  id: 'blog.allCategories',
                  message: '全部'
                })}
              </button>
              {Array.from(allCategories).map((category, index) => (
                <button
                  key={index}
                  className={clsx(styles.categoryItem, activeCategory === category && styles.categoryActive, 'cursor-target')}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 热门标签 */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>
              {translate({
                id: 'blog.popularTags',
                message: '热门标签'
              })}
            </h3>
            <div className={styles.tagList}>
              {allTags.slice(0, 10).map((tag, index) => (
                <div
                  key={index}
                  className={clsx(styles.sidebarTag, activeTag === tag.label && styles.sidebarTagActive, 'cursor-target')}
                  onClick={() => {
                    setActiveTag(tag.label);
                    setVisiblePosts(4);
                  }}
                >
                  {tag.label}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
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
      <TargetCursor />
      <BlogListPageMetadata {...props} />
      <BlogLayout>
        <BlogListPageHeader {...props} />
        <BlogListPageContent {...props} />
      </BlogLayout>
    </HtmlClassNameProvider>
  );
} 