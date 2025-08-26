import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Highlight } from 'prism-react-renderer';
import copy from 'copy-text-to-clipboard';
import { useThemeConfig, usePrismTheme } from '@docusaurus/theme-common';
import styles from './styles.module.css';

function getLanguageIcon(language) {
  const iconMap = {
    javascript: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={styles.langIcon}>
        <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM243.8 381.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"></path>
      </svg>
    ),
    jsx: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={styles.langIcon}>
        <path fill="currentColor" d="M418.2 177.2c-5.4-1.8-10.8-3.5-16.2-5.1.9-3.7 1.7-7.4 2.5-11.1 12.3-59.6 4.2-107.5-23.1-123.3-26.3-15.1-69.2.6-112.6 38.4-4.3 3.7-8.5 7.6-12.5 11.5-2.7-2.6-5.5-5.2-8.3-7.7-45.5-40.4-91.1-57.4-118.4-41.5-26.2 15.2-34 60.3-23 116.7 1.1 5.6 2.3 11.1 3.7 16.7-6.4 1.8-12.7 3.8-18.6 5.9C38.3 196.2 0 225.4 0 255.6c0 31.2 40.8 62.5 96.3 81.5 4.5 1.5 9 3 13.6 4.3-1.5 6-2.8 11.9-4 18-10.5 55.5-2.3 99.5 23.9 114.6 27 15.6 72.4-.4 116.6-39.1 3.5-3.1 7-6.3 10.5-9.7 4.4 4.3 9 8.4 13.6 12.4 42.8 36.8 85.1 51.7 111.2 36.6 27-15.6 35.8-62.9 24.4-120.5-.9-4.4-1.9-8.9-3-13.5 3.2-.9 6.3-1.9 9.4-2.9 57.7-19.1 99.5-50 99.5-81.7 0-30.3-39.4-59.7-93.8-78.4zM282.9 92.3c37.2-32.4 71.9-45.1 87.7-36 16.9 9.7 23.4 48.9 12.8 100.4-.7 3.4-1.4 6.7-2.3 10-22.2-5-44.7-8.6-67.3-10.6-13-18.6-27.2-36.4-42.6-53.1 3.9-3.7 7.7-7.2 11.7-10.7zM167.2 307.5c5.1 8.7 10.3 17.4 15.8 25.9-15.6-1.7-31.1-4.2-46.4-7.5 4.4-14.4 9.9-29.3 16.3-44.5 4.6 8.8 9.3 17.5 14.3 26.1zm-30.3-120.3c14.4-3.2 29.7-5.8 45.6-7.8-5.3 8.3-10.5 16.8-15.4 25.4-4.9 8.5-9.7 17.2-14.2 26-6.3-14.9-11.6-29.5-16-43.6zm27.4 68.9c6.6-13.8 13.8-27.3 21.4-40.6s15.8-26.2 24.4-38.9c15-1.1 30.3-1.7 45.9-1.7s31 .6 45.9 1.7c8.5 12.6 16.6 25.5 24.3 38.7s14.9 26.7 21.7 40.4c-6.7 13.8-13.9 27.4-21.6 40.8-7.6 13.3-15.7 26.2-24.2 39-14.9 1.1-30.4 1.6-46.1 1.6s-30.9-.5-45.6-1.4c-8.7-12.7-16.9-25.7-24.6-39s-14.8-26.8-21.5-40.6zm180.6 51.2c5.1-8.8 9.9-17.7 14.6-26.7 6.4 14.5 12 29.2 16.9 44.3-15.5 3.5-31.2 6.2-47 8 5.4-8.4 10.5-17 15.5-25.6zm14.4-76.5c-4.7-8.8-9.5-17.6-14.5-26.2-4.9-8.5-10-16.9-15.3-25.2 16.1 2 31.5 4.7 45.9 8-4.6 14.8-10 29.2-16.1 43.4zM256.2 118.3c10.5 11.4 20.4 23.4 29.6 35.8-19.8-.9-39.7-.9-59.5 0 9.8-12.9 19.9-24.9 29.9-35.8zM140.2 57c16.8-9.8 54.1 4.2 93.4 39 2.5 2.2 5 4.6 7.6 7-15.5 16.7-29.8 34.5-42.9 53.1-22.6 2-45 5.5-67.2 10.4-1.3-5.1-2.4-10.3-3.5-15.5-9.4-48.4-3.2-84.9 12.6-94zm-24.5 263.6c-4.2-1.2-8.3-2.5-12.4-3.9-21.3-6.7-45.5-17.3-63-31.2-10.1-7-16.9-17.8-18.8-29.9 0-18.3 31.6-41.7 77.2-57.6 5.7-2 11.5-3.8 17.3-5.5 6.8 21.7 15 43 24.5 63.6-9.6 20.9-17.9 42.5-24.8 64.5zm116.6 98c-16.5 15.1-35.6 27.1-56.4 35.3-11.1 5.3-23.9 5.8-35.3 1.3-15.9-9.2-22.5-44.5-13.5-92 1.1-5.6 2.3-11.2 3.7-16.7 22.4 4.8 45 8.1 67.9 9.8 13.2 18.7 27.7 36.6 43.2 53.4-3.2 3.1-6.4 6.1-9.6 8.9zm24.5-24.3c-10.2-11-20.4-23.2-30.3-36.3 9.6.4 19.5.6 29.5.6 10.3 0 20.4-.2 30.4-.7-9.2 12.7-19.1 24.8-29.6 36.4zm130.7 30c-.9 12.2-6.9 23.6-16.5 31.3-15.9 9.2-49.8-2.8-86.4-34.2-4.2-3.6-8.4-7.5-12.7-11.5 15.3-16.9 29.4-34.8 42.2-53.6 22.9-1.9 45.7-5.4 68.2-10.5 1 4.1 1.9 8.2 2.7 12.2 4.9 21.6 5.7 44.1 2.5 66.3zm18.2-107.5c-2.8.9-5.6 1.8-8.5 2.6-7-21.8-15.6-43.1-25.5-63.8 9.6-20.4 17.7-41.4 24.5-62.9 5.2 1.5 10.2 3.1 15 4.7 46.6 16 79.3 39.8 79.3 58 0 19.6-34.9 44.9-84.8 61.4zm-149.7-15c25.3 0 45.8-20.5 45.8-45.8s-20.5-45.8-45.8-45.8c-25.3 0-45.8 20.5-45.8 45.8s20.5 45.8 45.8 45.8z"></path>
      </svg>
    ),
    typescript: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={styles.langIcon}>
        <path fill="currentColor" d="M233.277 177.622h-82.44v156.756h32.967v-58.743h49.472c39.168 0 71.15-26.284 71.15-49.006.001-22.729-31.981-49.007-71.15-49.007zm-3.533 66.293H183.71v-33.496h46.034c17.392 0 31.407 7.41 31.407 16.747.001 9.341-14.014 16.75-31.407 16.75zm212.408-66.293v32.965h-33.403v123.79h-32.973v-123.79h-33.405v-32.966h99.781z"></path><path fill="currentColor" d="M512 256.001c0 141.395-114.606 255.996-255.996 255.996C114.606 511.997 0 397.396 0 256.001 0 114.606 114.606 0 256.004 0 397.394 0 512 114.606 512 256.001z" opacity=".1"></path>
      </svg>
    ),
    css: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className={styles.langIcon}>
        <path fill="currentColor" d="M0 32l34.9 395.8L192 480l157.1-52.2L384 32H0zm313.1 80l-4.8 47.3L193 208.6l-.3.1h111.5l-12.8 146.6-98.2 28.7-98.8-29.2-6.4-73.9h48.9l3.2 38.3 52.6 13.3 54.7-15.4 3.7-61.6-166.3-.5v-.1l-.2.1-3.6-46.3L193.1 162l6.5-2.7H76.7L70.9 112h242.2z"></path>
      </svg>
    ),
    html: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className={styles.langIcon}>
        <path fill="currentColor" d="M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z"></path>
      </svg>
    ),
    java: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className={styles.langIcon}>
        <path fill="currentColor" d="M277.74 312.9c9.8-6.7 23.4-12.5 23.4-12.5s-38.7 7-77.2 10.2c-47.1 3.9-97.7 4.7-123.1 1.3-60.1-8 33-30.1 33-30.1s-36.1-2.4-80.6 19c-52.5 25.4 130 37 224.5 12.1zm-85.4-32.1c-19-42.7-83.1-80.2 0-145.8C296 45.2 242.8 8.1 242.8 8.1s12.7 50.9-23.5 79.4c-60.3 47.5-78.2-12.6-78.2-12.6-117.2 68.1 38.4 69.6 51.3 93.4 22.9 41.5-40.2 104.8-80.4 93.7-9-2.5 5.2 9.6 19.5 19.4 20.8 14.3 76.1 20.5 116.2-2.8 31.3-18.1-11.7-53.8-23.5-70.7zM381 261.1c-15.6-5.9-37.8-6.6-37.8-6.6s9.4-28.4-37.3-42.3c-94.4-28.3-189 11.5-189 11.5s52.9 47.3 138.2 35c16.6-2.4 51-13.1 51-13.1s-23.8 6.1-32.7 12.1c-223.1 62.2-75.6-7.5-75.6-7.5s19 10.7 50.9 12.8c116.2 8.1 117.1-35.9 132.3-2.9zM239 64.7c-56.6 19.6-49.4 42.6-49.4 42.6 49.3-32 121.4-22.3 121.4-22.3s-23.1-10.1-72 -20.3zm-99.6 23.6c27.8-15.7 49.9-8 49.9-8s-28.6-15.9-60.4-7.6c-21.1 5.6-14.8 23.7-14.8 23.7s5-9.4 25.3-8.1zm146.4 44.6c-39.4 13-43.6 61.5-43.6 61.5s75-36.4 43.6-61.5z"></path>
      </svg>
    ),
    python: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={styles.langIcon}>
        <path fill="currentColor" d="M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2h-40.1v47.4c0 36.8-31.2 67.8-66.8 67.8H172.7c-29.2 0-53.4 25-53.4 54.3v101.8c0 29 25.2 46 53.4 54.3 33.8 9.9 66.3 11.7 106.8 0 26.9-7.8 53.4-23.5 53.4-54.3v-40.7H226.2v-13.6h160.2c31.1 0 42.6-21.7 53.4-54.2 11.2-33.5 10.7-65.7 0-108.6zM286.2 404c11.1 0 20.1 9.1 20.1 20.3 0 11.3-9 20.4-20.1 20.4-11 0-20.1-9.2-20.1-20.4.1-11.3 9.1-20.3 20.1-20.3zM167.8 248.1h106.8c29.7 0 53.4-24.5 53.4-54.3V91.9c0-29-24.4-50.7-53.4-55.6-35.8-5.9-74.7-5.6-106.8.1-45.2 8-53.4 24.7-53.4 55.6v40.7h106.9v13.6h-147c-31.1 0-58.3 18.7-66.8 54.2-9.8 40.7-10.2 66.1 0 108.6 7.6 31.6 25.7 54.2 56.8 54.2H101v-48.8c0-35.3 30.5-66.4 66.8-66.4zm-6.7-142.6c-11.1 0-20.1-9.1-20.1-20.3.1-11.3 9-20.4 20.1-20.4 11 0 20.1 9.2 20.1 20.4s-9 20.3-20.1 20.3z"></path>
      </svg>
    ),
    bash: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={styles.langIcon}>
        <path fill="currentColor" d="M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2h-40.1v47.4c0 36.8-31.2 67.8-66.8 67.8H172.7c-29.2 0-53.4 25-53.4 54.3v101.8c0 29 25.2 46 53.4 54.3 33.8 9.9 66.3 11.7 106.8 0 26.9-7.8 53.4-23.5 53.4-54.3v-40.7H226.2v-13.6h160.2c31.1 0 42.6-21.7 53.4-54.2 11.2-33.5 10.7-65.7 0-108.6zM286.2 404c11.1 0 20.1 9.1 20.1 20.3 0 11.3-9 20.4-20.1 20.4-11 0-20.1-9.2-20.1-20.4.1-11.3 9.1-20.3 20.1-20.3zM167.8 248.1h106.8c29.7 0 53.4-24.5 53.4-54.3V91.9c0-29-24.4-50.7-53.4-55.6-35.8-5.9-74.7-5.6-106.8.1-45.2 8-53.4 24.7-53.4 55.6v40.7h106.9v13.6h-147c-31.1 0-58.3 18.7-66.8 54.2-9.8 40.7-10.2 66.1 0 108.6 7.6 31.6 25.7 54.2 56.8 54.2H101v-48.8c0-35.3 30.5-66.4 66.8-66.4zm-6.7-142.6c-11.1 0-20.1-9.1-20.1-20.3.1-11.3 9-20.4 20.1-20.4 11 0 20.1 9.2 20.1 20.4s-9 20.3-20.1 20.3z"></path>
      </svg>
    ),
    json: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className={styles.langIcon}>
        <path fill="currentColor" d="M0 32l34.9 395.8L192 480l157.1-52.2L384 32H0zm313.1 80l-4.8 47.3L193 208.6l-.3.1h111.5l-12.8 146.6-98.2 28.7-98.8-29.2-6.4-73.9h48.9l3.2 38.3 52.6 13.3 54.7-15.4 3.7-61.6-166.3-.5v-.1l-.2.1-3.6-46.3L193.1 162l6.5-2.7H76.7L70.9 112h242.2z"></path>
      </svg>
    ),
    yaml: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className={styles.langIcon}>
        <path fill="currentColor" d="M0 32l34.9 395.8L192 480l157.1-52.2L384 32H0zm313.1 80l-4.8 47.3L193 208.6l-.3.1h111.5l-12.8 146.6-98.2 28.7-98.8-29.2-6.4-73.9h48.9l3.2 38.3 52.6 13.3 54.7-15.4 3.7-61.6-166.3-.5v-.1l-.2.1-3.6-46.3L193.1 162l6.5-2.7H76.7L70.9 112h242.2z"></path>
      </svg>
    ),
    markdown: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 208 128" className={styles.langIcon}>
        <rect width="198" height="118" x="5" y="5" ry="10" stroke="currentColor" strokeWidth="10" fill="none"/>
        <path d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z" fill="currentColor"/>
      </svg>
    ),
    sql: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={styles.langIcon}>
        <path fill="currentColor" d="M448 73.143v45.714C448 159.143 347.667 192 224 192S0 159.143 0 118.857V73.143C0 32.857 100.333 0 224 0s224 32.857 224 73.143zM448 176v102.857C448 319.143 347.667 352 224 352S0 319.143 0 278.857V176c48.125 33.143 136.208 48.572 224 48.572S399.874 209.143 448 176zm0 160v102.857C448 479.143 347.667 512 224 512S0 479.143 0 438.857V336c48.125 33.143 136.208 48.572 224 48.572S399.874 369.143 448 336z"></path>
      </svg>
    )
  };
  
  // 默认图标
  const defaultIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className={styles.langIcon}>
      <path fill="currentColor" d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"></path>
    </svg>
  );
  
  // 添加严格的类型检查，确保language存在且为字符串时才调用toLowerCase
  const normalizedLang = typeof language === 'string' && language ? language.toLowerCase() : '';
  return iconMap[normalizedLang] || defaultIcon;
}

function CodeBlock({
  children,
  className: languageClassName,
  metastring,
  title
}) {
  const [showCopied, setShowCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const button = useRef(null);
  const codeBlockRef = useRef(null);
  const contentRef = useRef(null);
  
  const {prism} = useThemeConfig();
  
  const prismTheme = usePrismTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // 矩阵背景效果
  useEffect(() => {
    if (!contentRef.current) return;
    
    const canvas = document.createElement('canvas');
    const matrixContainer = document.createElement('div');
    matrixContainer.className = styles.matrixContainer;
    matrixContainer.appendChild(canvas);
    
    // 插入到内容区域
    contentRef.current.prepend(matrixContainer);
    
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    const updateCanvasSize = () => {
      const rect = contentRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // 检测主题
    const isDarkTheme = () => document.documentElement.getAttribute('data-theme') === 'dark';
    
    // 矩阵效果参数
    const getFontSize = () => isDarkTheme() ? 15 : 15; // 调整字体大小为15px
    const updateFontSize = () => {
      const fontSize = getFontSize();
      const columns = Math.floor(canvas.width / fontSize);
      return { fontSize, columns };
    };
    
    let { fontSize, columns } = updateFontSize();
    const drops = [];
    
    // 初始化雨滴位置
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }
    
    // 显示的字符 - 使用英文字符和数字，以及laby的名字
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789labylabylaby';
    
    // 绘制函数
    const draw = () => {
      // 更新字体大小和列数
      const oldColumns = columns;
      ({ fontSize, columns } = updateFontSize());
      
      // 如果列数变化，重新初始化drops
      if (columns !== oldColumns) {
        for (let i = 0; i < columns; i++) {
          if (i < oldColumns) {
            // 保留现有的
            continue;
          }
          drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
        }
      }
      
      // 背景色根据主题调整
      if (isDarkTheme()) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 文字颜色根据主题调整
      if (isDarkTheme()) {
        ctx.fillStyle = '#0F0'; // 深色主题绿色
      } else {
        ctx.fillStyle = 'rgba(0, 80, 0, 0.8)'; // 亮色主题下使用深绿色
      }
      ctx.font = `${fontSize}px 'Courier New', monospace`;
      ctx.textBaseline = 'top'; // 确保文本对齐方式一致
      
      // 处理每一列雨滴
      for (let i = 0; i < drops.length; i++) {
        // 随机字符
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // 绘制字符
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // 到达底部或随机重置
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // 移动雨滴（放慢速度）
        if (Math.random() > 0.6) { // 40%的概率移动，使动画更流畅
          drops[i]++;
        }
      }
    };
    
    // 动画循环
    let animationId;
    const animate = () => {
      draw();
      animationId = setTimeout(() => requestAnimationFrame(animate), 70); // 调整动画速度
    };
    
    // 开始动画
    animate();
    
    // 主题变化监听
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          // 清除画布，重新绘制
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
    });
    
    // 观察文档根元素的主题变化
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateCanvasSize);
      clearTimeout(animationId);
      cancelAnimationFrame(animationId);
    };
  }, [mounted]);

  // 提取语言
  const language =
    languageClassName &&
    (/language-(\w+)/.exec(languageClassName) || ['', 'text'])[1];
    
  // 代码块标题
  const finalTitle = title || (metastring && metastring.match(/title="([^"]+)"/))?.[1] || '';
  
  // 处理复制功能
  const handleCopyCode = () => {
    if (codeBlockRef.current) {
      const code = codeBlockRef.current.textContent;
      copy(code);
      setShowCopied(true);

      setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    }
  };

  return (
    <div 
      className={clsx(
        styles.codeBlockContainer,
        language && `language-${language}`
      )}
      ref={codeBlockRef}
    >
      {/* 代码块头部区域 */}
      <div className={styles.codeBlockHeader}>
        <div className={styles.codeBlockControls}>
          <span className={clsx(styles.codeDot, styles.codeDotRed)}></span>
          <span className={clsx(styles.codeDot, styles.codeDotYellow)}></span>
          <span className={clsx(styles.codeDot, styles.codeDotGreen)}></span>
        </div>
        
        {finalTitle && (
          <div className={styles.codeBlockTitle}>
            {finalTitle}
          </div>
        )}
        
        <div className={styles.codeBlockMeta}>
          {language && (
            <div className={styles.codeBlockLanguage}>
              {getLanguageIcon(language)}
              <span>{language}</span>
            </div>
          )}
          
          <button
            ref={button}
            type="button"
            aria-label="复制代码"
            className={styles.copyButton}
            onClick={handleCopyCode}
          >
            {showCopied ? (
              <>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className={styles.copyButtonIcon}
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                </svg>
                <span>已复制</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className={styles.copyButtonIcon}
                >
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path>
                </svg>
                <span>复制</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* 代码块内容 */}
      <div className={styles.codeBlockContent} ref={contentRef}>
        <Highlight
          code={children.trim()}
          language={language || 'text'}
          theme={prismTheme}
        >
          {({className, style, tokens, getLineProps, getTokenProps}) => (
            <pre className={clsx(className, styles.codeBlock)} style={style}>
              <code className={styles.codeBlockLines}>
                {tokens.map((line, i) => {
                  if (line.length === 1 && line[0].content === '\n') {
                    line[0].content = '';
                  }
                  
                  const lineProps = getLineProps({line, key: i});
                  // 移除key，单独处理，避免通过扩展运算符传递
                  const { key: lineKey, ...linePropsWithoutKey } = lineProps;
                  
                  return (
                    <div key={lineKey || i} {...linePropsWithoutKey} className={clsx(linePropsWithoutKey.className, styles.codeLine)}>
                      <span className={styles.codeLineNumber}>{i + 1}</span>
                      <span className={styles.codeLineContent}>
                        {line.map((token, key) => {
                          const tokenProps = getTokenProps({token, key});
                          // 移除key，单独处理，避免通过扩展运算符传递
                          const { key: tokenKey, ...tokenPropsWithoutKey } = tokenProps;
                          return <span key={tokenKey || key} {...tokenPropsWithoutKey} />;
                        })}
                      </span>
                    </div>
                  );
                })}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

export default CodeBlock; 