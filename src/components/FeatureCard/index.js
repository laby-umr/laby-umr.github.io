import React from 'react';
import styles from './styles.module.css';

/**
 * 特性卡片组件
 * 用于展示技术特性、功能亮点等
 */
export default function FeatureCard({ 
  icon, 
  title, 
  description, 
  features = [], 
  className = '',
  variant = 'default' // default, primary, success, warning, danger
}) {
  return (
    <div className={`${styles.featureCard} ${styles[variant]} ${className}`}>
      {icon && (
        <div className={styles.iconContainer}>
          {typeof icon === 'string' ? (
            <span className={styles.iconEmoji}>{icon}</span>
          ) : (
            icon
          )}
        </div>
      )}
      
      <div className={styles.content}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {description && <p className={styles.description}>{description}</p>}
        
        {features.length > 0 && (
          <ul className={styles.featureList}>
            {features.map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                <span className={styles.featureBullet}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/**
 * 特性卡片网格容器
 */
export function FeatureGrid({ children, columns = 3 }) {
  return (
    <div 
      className={styles.featureGrid} 
      style={{ '--columns': columns }}
    >
      {children}
    </div>
  );
}