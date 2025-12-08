import React from 'react';
import Layout from '@theme-original/Layout';
import {useLocation} from '@docusaurus/router';
import TargetCursor from '@site/src/components/TargetCursor';
import ParticleBackground from '@site/src/components/ParticleBackground';
import ReadingProgress from '@site/src/components/ReadingProgress';

export default function LayoutWrapper(props) {
  return (
    <>
      {/* 全局粒子背景 */}
      <ParticleBackground />
      
      {/* 全局阅读进度条 */}
      <ReadingProgress />
      
      {/* 全局鼠标跟随光标 */}
      <TargetCursor 
        targetSelector=".cursor-target"
        spinDuration={2}
        hoverDuration={0.2}
        hideDefaultCursor={true}
        parallaxOn={true}
      />
      
      <Layout {...props} />
    </>
  );
}