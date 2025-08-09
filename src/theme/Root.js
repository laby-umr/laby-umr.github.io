import React from 'react';
import BackToTop from '../components/BackToTop';
import ReadingProgress from '../components/ReadingProgress';

// 默认实现，直接渲染children
export default function Root({children}) {
  return (
    <>
      <ReadingProgress />
      {children}
      <BackToTop />
    </>
  );
} 