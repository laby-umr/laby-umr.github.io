import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import {useLocation} from '@docusaurus/router';
import Comments from '@site/src/components/Comments';
import ShareButtons from '@site/src/components/ShareButtons';
import styles from './styles.module.css';

export default function BlogPostItemWrapper(props) {
  const location = useLocation();
  
  // 检查当前路径是否是博客文章页面（而不是博客列表页面）
  const isBlogPostPage = location.pathname.includes('/blog/') && !location.pathname.match(/^\/blog\/?$/);
  
  // 获取文章标题和描述
  const {metadata} = props.content || {};
  const {title, description} = metadata || {};
  
  return (
    <>
      <BlogPostItem {...props} />
      
      {isBlogPostPage && (
        <div className={styles.blogFooter}>
          <ShareButtons title={title} description={description} />
          <div className={styles.commentsSection}>
            <Comments />
          </div>
        </div>
      )}
    </>
  );
} 