import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import Comments from '@site/src/components/Comments';
import ShareButtons from '@site/src/components/ShareButtons';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

/**
 Title can be declared inside md content or declared through
 front matter and added manually. To make both cases consistent,
 the added title is added under the same div.markdown block
 See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120

 We render a "synthetic title" if:
 - user doesn't ask to hide it with front matter
 - the markdown content does not already contain a top-level h1 heading
*/
function useSyntheticTitle() {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

export default function DocItemContent({children}) {
  const syntheticTitle = useSyntheticTitle();
  const { metadata } = useDoc();
  const { siteConfig } = useDocusaurusContext();
  const [pageInfo, setPageInfo] = React.useState({ title: '', description: '' });

  React.useEffect(() => {
    // 客户端渲染时获取标题和描述
    const title = metadata?.title || document.title.replace(` | ${siteConfig.title}`, '');
    const description = metadata?.description || document.querySelector('meta[name="description"]')?.content || '';
    setPageInfo({ title, description });
  }, [metadata, siteConfig.title]);

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
        </header>
      )}
      <MDXContent>{children}</MDXContent>

      {/* 在文档内容后添加分享和评论功能 */}
      <div className={styles.docFooter}>
        <ShareButtons title={pageInfo.title} description={pageInfo.description} />
        <div className={styles.commentsSection}>
          <Comments />
        </div>
      </div>
    </div>
  );
}
