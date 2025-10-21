import React from 'react';
import BackToTop from '../components/BackToTop';
import ParticleBackground from '../components/ParticleBackground';
import EnhancedTable from '../components/EnhancedTable';

export default function Root({children}) {
  // 移除强制主题设置，使用 docusaurus.config.js 中的配置
  return <>{children}</>;
} 