import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';
import GlitchText from '../GlitchText';

const JellyTextAnimation = React.memo(({ children, delay = 0, text: textProp, disableHover = false }) => {
  const controls = useAnimation();
  const [isAnimated, setIsAnimated] = useState(false);
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  
  // 获取文本：优先使用 text prop，否则使用 children（必须是字符串）
  const displayText = textProp || (typeof children === 'string' ? children : String(children || ''));
  
  // 将文字分割成单个字符
  const characters = displayText.split('');
  
  // 使用 IntersectionObserver 只在可见时播放动画
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isInView]);
  
  useEffect(() => {
    if (!isInView) return;
    
    const timer = setTimeout(() => {
      setIsAnimated(true);
      controls.start('visible');
    }, delay);
    
    return () => clearTimeout(timer);
  }, [controls, delay, isInView]);
  
  // 容器动画变体
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };
  
  // 字符动画变体 - 从左侧滚动进入
  const charVariants = {
    hidden: {
      x: -200,
      opacity: 0,
      rotate: -360,
      scale: 0.5
    },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        delay: i * 0.05,
        duration: 0.8
      }
    })
  };
  
  // 果冻碰撞效果
  const jellyVariants = {
    initial: { scale: 1 },
    bounce: {
      scale: [1, 1.3, 0.8, 1.1, 0.95, 1.02, 1],
      transition: {
        duration: 0.6,
        times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <motion.span
      ref={containerRef}
      className={styles.jellyContainer}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          custom={index}
          variants={charVariants}
          className={styles.jellyChar}
          style={{ scale: 1 }}
          onAnimationComplete={index === characters.length - 1 ? () => {
            // 优化：只在最后一个字符触发，且缓存元素引用
            if (!containerRef.current) return;
            setTimeout(() => {
              // 再次检查，防止组件已卸载
              if (!containerRef.current) return;
              const chars = containerRef.current.querySelectorAll(`.${styles.jellyChar}`);
              chars.forEach((char, i) => {
                setTimeout(() => {
                  if (char && char.classList) {
                    char.classList.add(styles.jellyBounce);
                    setTimeout(() => {
                      if (char && char.classList) {
                        char.classList.remove(styles.jellyBounce);
                      }
                    }, 600);
                  }
                }, i * 30);
              });
            }, 100);
          } : undefined}
          whileHover={disableHover ? undefined : {
            scale: 1.1,
            transition: { 
              duration: 0.2,
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }}
          animate={{ scale: 1 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
});

// 主标题组件 - 包含三行文字的动画
export const AnimatedHeroTitle = () => {
  const [showCollision, setShowCollision] = useState(false);
  
  // 获取翻译后的文本
  const line1 = translate({ id: 'hero.title.build', message: '构建' });
  const line2 = translate({ id: 'hero.title.amazing', message: '令人惊艳的' });
  const line3 = translate({ id: 'hero.title.solutions', message: '技术解决方案' });
  
  useEffect(() => {
    // 在所有文字滚动完成后显示碰撞效果
    const timer = setTimeout(() => {
      setShowCollision(true);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={styles.heroTitleWrapper}>
      {showCollision && <div className={styles.collisionEffect} />}
      
      <motion.div 
        className={styles.titleLine}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GlitchText speed={1} enableShadows={true} enableOnHover={false}>
          <JellyTextAnimation delay={0} text={line1} />
        </GlitchText>
      </motion.div>
      
      <motion.div 
        className={`${styles.titleLine} ${styles.gradientLine}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <GlitchText speed={1} enableShadows={true} enableOnHover={false}>
          <JellyTextAnimation delay={300} text={line2} />
        </GlitchText>
      </motion.div>
      
      <motion.div 
        className={styles.titleLine}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <GlitchText speed={1} enableShadows={true} enableOnHover={false}>
          <JellyTextAnimation delay={600} text={line3} />
        </GlitchText>
      </motion.div>
      
      {/* 碰撞粒子效果 */}
      {showCollision && (
        <div className={styles.particlesContainer}>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.particle}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 1,
                scale: 0
              }}
              animate={{ 
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
                opacity: 0,
                scale: [0, 1.5, 0],
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: 1,
                delay: i * 0.02,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 包装组件：自动处理翻译
export const TranslatedJellyText = ({ id, defaultMessage, delay = 0, disableHover = false }) => {
  const text = translate({ id, message: defaultMessage });
  return <JellyTextAnimation delay={delay} text={text} disableHover={disableHover} />;
};

// 高性能版本：仅文字，无动画
export const SimpleText = ({ id, defaultMessage, className }) => {
  const text = translate({ id, message: defaultMessage });
  return <span className={className}>{text}</span>;
};

export default JellyTextAnimation;
