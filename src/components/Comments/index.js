import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import Giscus from '@giscus/react';
import styles from './styles.module.css';

export default function Comments() {
  const { colorMode } = useColorMode();

  return (
    <div className={styles.commentsWrapper}>
      <div className={styles.commentsHeader}>
        <span className="material-symbols-outlined">forum</span>
        <h3 className={styles.commentsTitle}>评论区 / Comments</h3>
      </div>
      <div className={styles.commentsContainer}>
        <Giscus
          repo="laby-umr/laby-umr.github.io"
          repoId="R_kgDOQkvCIQ"
          category="Announcements"
          categoryId="DIC_kwDOQkvCIc4Czr7V"
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="1"
          inputPosition="bottom"
          theme={colorMode === 'dark' ? 'dark' : 'light'}
          lang="zh-CN"
          loading="lazy"
        />
      </div>
    </div>
  );
}
